import Express from "express";
import { ErrorCodes } from "../const/errors";
import { sendErrorResponse, sendJSONResponse, isURL } from "../utils";
import dns from "node:dns";

import EmailCache from "../models/EmailCache";
import RateLimiter from "../models/RateLimiter";

const RATE_TIMEOUT = 5000;
const RATE_LIMITER = new RateLimiter(5, RATE_TIMEOUT); // Throttle the requests to prevent overload 

function validateEmailSyntax(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const maxDomainLength = 255;
  const maxLocalPartLength = 64;
  const maxEmailLength = maxLocalPartLength + 1 + maxDomainLength;
  if (email.length > maxEmailLength) {
    return false;
  }
  const [localPart, domain] = email.split("@");

  if (localPart?.length > maxLocalPartLength || domain?.length > maxDomainLength) {
    return false;
  }
  return regex.test(email);
}

function validateEmailDomain(email: string): Promise<boolean>  {
		if (!validateEmailSyntax(email)) return Promise.resolve(false);
		const [mail, tld] = email.split("@");
		if (!tld || !isURL(tld)) return Promise.resolve(false);

		return new Promise((resolve, reject) => {
				dns.resolve(tld, "MX", (err, addresses) => {
						if (err) resolve(false);
						resolve(addresses?.length > 0)
				})
    })
}

export default async function (req: Express.Request, res: Express.Response) {
		const queryEmail = req.query?.email;
		if (RATE_LIMITER.checkIfTimedOut(req)) {
				sendErrorResponse(res, {
						error: {
								code: ErrorCodes.TOO_MANY_REQUESTS,
								details: {
										retry_after: `${RATE_TIMEOUT} ms`

								},
								message: "Too many requests. Please try again later",
						},
						status: 429
				});
				RATE_LIMITER.resetRequest(req);
				return;
		}
		RATE_LIMITER.logRequest(req);

		if (!queryEmail || queryEmail?.length === 0) {
				sendErrorResponse(res, {
						error: {
								code: ErrorCodes.BAD_INPUT,
								message: "email is a required argument",
						},
						status: 400
				});
				return;
		}

		const cachedEmailData = await EmailCache.getEmail(queryEmail as string);

		let emailChecks;
		if (cachedEmailData?.length) {
				emailChecks = cachedEmailData;
		} else {
				emailChecks = [
						validateEmailSyntax(queryEmail as string),
						await validateEmailDomain(queryEmail as string)
				]
		}

		emailChecks = emailChecks as Array<boolean>;

		const response = {
				data: {
						email: queryEmail as string,
						valid: emailChecks.every(e => e),
						format_valid: emailChecks[0],
						domain_valid: emailChecks[1],
				},
				status: 200
		}

		if (!cachedEmailData?.length) {
				await EmailCache.pushEmail(queryEmail as string, emailChecks as Array<boolean>);
		}

		sendJSONResponse(res, response)
}

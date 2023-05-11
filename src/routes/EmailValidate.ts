import Express from "express";
import { ErrorCodes } from "../const/errors";
import { sendErrorResponse, sendJSONResponse } from "../utils";
import dns from "node:dns";

import EmailCache from "../models/EmailCache";

function validateEmailSyntax(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const maxDomainLength = 255;
  const maxLocalPartLength = 64;
  const maxEmailLength = maxLocalPartLength + 1 + maxDomainLength;
  if (email.length > maxEmailLength) {
    return false;
  }
  const [localPart, domain] = email.split("@");

  if (localPart.length > maxLocalPartLength || domain.length > maxDomainLength) {
    return false;
  }
  return regex.test(email);
}

function validateEmailDomain(email: string): Promise<Array<string> | null> {
    const [mail, tld] = email.split("@");

    return new Promise((resolve, reject) => {
	dns.resolve(tld, "MX", (err, addresses) => {
	    if (err) reject(null);
	    resolve(addresses?.map(e => e.exchange) ?? [])
	})
    })
}

export default async function (req: Express.Request, res: Express.Response) {
    const queryEmail = req.query?.email;

    if (!queryEmail) {
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
	console.log("found: ", queryEmail, cachedEmailData);
	emailChecks = cachedEmailData;
    } else {
	emailChecks = [
	    validateEmailSyntax(queryEmail as string),
	    await validateEmailDomain(queryEmail as string),
	]
    }


    emailChecks = emailChecks as Array<boolean>;
    const response = {
	data: {
	    email: queryEmail as string,
	    valid: emailChecks.every(e => e),
	    format_valid: emailChecks[0],
	    domain_valid: Boolean(emailChecks[1]),
	    dns_records: emailChecks[1] || [],
	},
	status: 200
    }

    if (!cachedEmailData?.length) {
	console.log("cached", queryEmail);
	await EmailCache.pushEmail(queryEmail as string, emailChecks as Array<boolean>);
    }
    sendJSONResponse(res, response)
}

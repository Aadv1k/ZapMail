import Express from "express";
import { ErrorCodes } from "../const/errors";
import { sendErrorResponse, sendJSONResponse, isURL } from "../utils";

import { MAIL_CONFIG } from "../const/vars";

import nodemailer from "nodemailer"
;

import mailSchema from "../const/mailSchema";
import { Mail } from "../const/email";

import RateLimiter from "../models/RateLimiter";

const RATE_TIMEOUT = 3000;
const RATE_LIMITER = new RateLimiter(1, RATE_TIMEOUT); // Throttle the requests to prevent overload 

import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });

ajv.addFormat('email', {
		type: 'string',
		validate: (value: string) => {
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				return emailRegex.test(value);
		},
});

const mailValidate = ajv.compile(mailSchema);

const transporter = nodemailer.createTransport({
  maxConnections: 2,
  pool: true,
  service: "hotmail",
  auth: {
	  user: MAIL_CONFIG.address,
    pass: MAIL_CONFIG.password
  }
});

function sendMail(blob: Mail): Promise<string> {
		const toEmails = blob.to.map(e => e.email);
		const fromEmail = blob.from;
		const body = `Forwarded via Daakia originally by ${fromEmail}\n` + blob.body.content;

		return new Promise((resolve, reject) => {
				transporter.sendMail({
						from: MAIL_CONFIG.address,
						to: toEmails,
						subject: blob.subject,
						html: body
				}, (error: any, info: any) => {
						if (error) reject(error);
						resolve(info.messageId);
				})
		})

}

export default async function (req: Express.Request, res: Express.Response) {
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

		let body: Mail;

		try {
				body = JSON.parse(req.body);
		} catch {
				sendErrorResponse(res, {
						error: {
								code: ErrorCodes.BAD_INPUT,
								message: "Invalid JSON data",
						},
						status: 400
				})
				return;
		}

		if (!mailValidate(body))  {
				sendErrorResponse(res, {
						error: {
								code: ErrorCodes.BAD_INPUT,
								message: "Bad input",
								details: ajv.errors,
						},
						status: 400
				})
				return;
		}

		try {
				const receivedMailId = await sendMail(body);
				sendJSONResponse(res, {
						data: {
								messageId: receivedMailId,
						},
						status: 200,
				}, 200)
		} catch (error) {
				sendErrorResponse(res, {
						error: {
								code: ErrorCodes.INTERNAL_ERROR,
								message: "Internall error while sending mail",
								details: error,
						},
						status: 500
				})
		}
}


import Express from "express";
import { ErrorCodes } from "../const/errors";
import { sendErrorResponse, sendJSONResponse, isURL } from "../utils";

import mailSchema from "../const/mailSchema";
import { Mail } from "../const/email";

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

export default async function (req: Express.Request, res: Express.Response) {
		let body;
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

}


import dotenv from "dotenv";
dotenv.config();

export const MAIL_CONFIG = {
		address: process.env.MAIL_ADDRESS,
		password: process.env.MAIL_PASSWORD,
}

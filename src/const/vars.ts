import dotenv from "dotenv";
dotenv.config();

export const MAIL_CONFIG = {
		address: process.env.MAIL_ADDRESS,
		password: process.env.MAIL_PASSWORD,
}

export const REDIS_CONFIG = {
	username: process.env.REDIS_USERNAME,
	password: process.env.REDIS_PASSWORD,
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
}
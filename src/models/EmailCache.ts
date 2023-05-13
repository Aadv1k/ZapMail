import { createClient } from "redis";
import { REDIS_CONFIG } from "../const/vars";

class EmailCache {
	client: any;

	constructor() {
		this.client = createClient({
			socket: {
				host: REDIS_CONFIG.host,
				port: REDIS_CONFIG.port,
			},
			username: REDIS_CONFIG.username,
			password: REDIS_CONFIG.password
			
		});
	}

	async init() {
		await this.client.connect();
	}

	async pushEmail(email: string, validity: Array<boolean>): Promise<string> {
		try {
			const resp = await this.client.set(email, JSON.stringify(validity));
			return email;
		} catch (err) {
			throw err;
		}
	}

	async getEmail(email: string): Promise<Array<boolean> | null> {
		try {
			const resp = await this.client.get(email)
			return JSON.parse(resp ?? "[]");
		} catch (err) {
			throw err;
		}
	}

	async close() {
		this.client.close();
	}
}

export default new EmailCache();


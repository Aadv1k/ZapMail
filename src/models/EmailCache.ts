import { createClient } from "redis";

class EmailCache {
	client: any;

	constructor() {
		this.client = createClient({
			socket: {
				host: "localhost",
				port: 6379,
			},
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


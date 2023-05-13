import Express from "express";

class RateLimiter {
		timeout: number;
		limit: number;
		timeOfLastRequestByIp: Map<string, number>;
		requestsSentByIp: Map<string, number>;

		constructor(limit: number, timeout: number) {
				this.timeOfLastRequestByIp = new Map();
				this.requestsSentByIp = new Map();
				this.limit = limit;
				this.timeout = timeout;
		}

		checkIfTimedOut(req: Express.Request): boolean {
				const { ip } = req;

				const reqCount = this.requestsSentByIp.get(ip) ?? 0;
				const timeOfLast = this.timeOfLastRequestByIp.get(ip) ?? 0;

				if (reqCount === this.limit && (Date.now() - timeOfLast) < this.timeout) {
						return true;
				}
				return false;
		}

		logRequest(req: Express.Request) {
				const { ip } = req;
				this.timeOfLastRequestByIp.set(ip, Date.now());
				const reqCount = this.requestsSentByIp.get(ip) ?? 0;
				this.requestsSentByIp.set(ip, reqCount + 1);
		}

		resetRequest(req: Express.Request) {
				const { ip } = req;
				setTimeout(() => {
						this.requestsSentByIp.set(ip, 0);
				}, this.timeout)
		}
}

export default RateLimiter;

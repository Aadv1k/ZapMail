class RateLimiter {
		timeout: number;
		limit: number;
		constructor(limit, timeout) {
				this.timeOfLastRequestByIp = new Map();
				this.requestsSentByIp = new Map();
				this.limit = limit;
				this.timeout = timeout;
		}


		checkIfTimedOut(ip: string) boolean {
				const reqCount = this.requestsSentByIp.get(ip);
				const timeOfLast = this.timeOfLastRequestByIp.get(ip);

				if (reqCount === this.limit && (Date.now() - timeOfLast) < this.timeout) {
						return true;
				}
				return false;
		}

		logRequest(ip: string) {
				this.timeOfLastRequestByIp.set(ip, Date.now());
				const reqCount = this.requestsSentByIp.get(ip) ?? 0;
				this.requestsSentByIp.set(ip, reqCount + 1);
		}

		resetRequest(ip: string) {
				setTimeout(() => {
						this.requestsSentByIp.set(ip, 0);
				}, this.timeout)
		}
}

export default RateLimiter;

export interface Mail {
		to: Array<{
				name: string,
				email: string,
		}>

		from: {
				email: string,
				name: string,
		}

		subject: string,

		body: {
				type: "text" | "html",
				content: string,
		}
}

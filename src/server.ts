import express from "express";
import routeEmailValidate from "./routes/EmailValidate"
import routeEmailSend from "./routes/EmailSend"

import EmailCache from "./models/EmailCache";

import { ErrorCodes } from "./const/errors";
import { sendErrorResponse } from "./utils" ;

import path from "node:path";

const app = express();

app.use(express.static('./public'))

app.use(express.json());
app.use((err: any, req: any, res: any, next) => {
    if (err instanceof SyntaxError) 
				sendErrorResponse(res as express.Response, {
						error: {
								code: ErrorCodes.BAD_INPUT,
								message: "Bad JSON input"
						},
						status: 400
				})
        return;
});

(async () => {
    await EmailCache.init();
		app.get("/", (req, res) => {
				console.log(path.join(__dirname, "./public/index.html"))
				res.sendFile(path.join(__dirname, "../
public/index.html"))
		})
    app.get("/api/v1/email/validate", routeEmailValidate)
		app.post("/api/v1/email/send", routeEmailSend)
})();

process.on("exit", async () => {
   await EmailCache.close();
})

export default app;



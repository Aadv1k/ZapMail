import express from "express";
import routeEmailValidate from "./routes/EmailValidate"
import EmailCache from "./models/EmailCache";

const app = express();



(async () => {
    await EmailCache.init();
    app.get("/api/v1/email/validate", routeEmailValidate)
})();


process.on("exit", async () => {
    await EmailCache.close();
})

export default app;



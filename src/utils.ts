import Express from "express";
import { ApiError } from "./const/errors";

export function sendErrorResponse(res: Express.Response, error: ApiError) {
    res.status(error.status);
    res.json(error)
}

export function sendJSONResponse(res: Express.Response, obj: any, status?: number) {
    res.status(obj.status ?? status ?? 200);
    res.json(obj)
}


export function isURL(u: string): boolean {
		try {
				new URL(u)
				return true;
		} catch { return false }

}

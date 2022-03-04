import User from "../models/user";

declare module "express-serve-static-core" {
    interface Request {
        user?: User;
        payload: any;
    }
    interface Response {
        payload: any;
    }
}
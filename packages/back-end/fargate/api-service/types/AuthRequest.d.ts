import { Request, Response as ExpressResponse } from "express";
import { UserInterface } from "../../../../types/User";

//enables us to add fields to the Express Request object
declare module "express-serve-static-core" {
  interface Request {
    user: UserInterface;
  }
}

// eslint-disable-next-line
export type AuthRequest<
  Body = unknown,
  Params = unknown,
  QueryParams = unknown
> = Request<Params, unknown, Body, QueryParams>;

export type Response<T = unknown> = ExpressResponse<
  (T & { status: 200 }) | { status: number; message: string }
>;

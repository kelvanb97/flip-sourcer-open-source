import { RequestHandler } from "express";
import { SafeParseError, Schema } from "zod";

function errorStringFromZodResult(
  safeParseResult: SafeParseError<unknown>
): string {
  return safeParseResult.error.issues
    .map((i) => "[" + i.path.join(".") + "] " + i.message)
    .join(", ");
}

type ValidationParams<
  ParamsSchema extends Schema,
  BodySchema extends Schema,
  QuerySchema extends Schema
> = {
  body?: BodySchema;
  query?: QuerySchema;
  params?: ParamsSchema;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export const validateRequestMiddleware =
  <
    ParamsSchema extends Schema,
    ResponseType,
    BodySchema extends Schema,
    QuerySchema extends Schema
  >({
    query: querySchema,
    body: bodySchema,
    params: paramsSchema,
  }: ValidationParams<ParamsSchema, BodySchema, QuerySchema>): RequestHandler<
    Record<string, any>,
    (ResponseType & { status: 200 }) | { status: number; message: string }
  > =>
  (req: any, res: any, next: any) => {
    /* eslint-enable @typescript-eslint/no-explicit-any */
    if (paramsSchema) {
      const result = paramsSchema.safeParse(req.params);
      if (!result.success) {
        console.log(errorStringFromZodResult(result));
        return res.json({
          status: 400,
          message: errorStringFromZodResult(result),
        });
      }
    }

    if (querySchema) {
      const result = querySchema.safeParse(req.query);
      if (!result.success) {
        console.log(errorStringFromZodResult(result));
        return res.json({
          status: 400,
          message: errorStringFromZodResult(result),
        });
      }
    }

    if (bodySchema) {
      const result = bodySchema.safeParse(req.body);
      if (!result.success) {
        console.log(errorStringFromZodResult(result));
        return res.json({
          status: 400,
          message: errorStringFromZodResult(result),
        });
      }
    }

    next();
  };

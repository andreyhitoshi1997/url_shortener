import { insertUrlService } from "../services/url-service";
import { MissingParamError, ValidationError, DatabaseError } from "../errors";
import { badRequest, created, serverError } from "../helpers/http-helpers";
import type { Context } from "elysia";

export const insertController = async (context: Context) => {
  try {
    const { body, query } = context;
    const { targetRef } = body as { targetRef?: string };
    const { shortRef: customShortRef } = (query as { shortRef?: string }) || {};

    const result = await insertUrlService({
      targetRef: targetRef!,
      customShortRef,
    });

    return created(context, result);
  } catch (error) {
    if (
      error instanceof MissingParamError ||
      error instanceof ValidationError
    ) {
      return badRequest(context, error);
    }

    if (error instanceof DatabaseError) {
      return serverError(context);
    }

    return serverError(context);
  }
};

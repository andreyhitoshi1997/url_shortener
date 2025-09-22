import { searchUrlService } from "../services/url-service";
import { MissingParamError, NotFoundError, DatabaseError } from "../errors";
import { badRequest, notFound, ok, serverError } from "../helpers/http-helpers";
import type { Context } from "elysia";

export const searchController = async (context: Context) => {
  try {
    const { query } = context;
    const { shortRef } = query as { shortRef?: string };

    const result = await searchUrlService(shortRef!);
    return ok(context, result);
  } catch (error) {
    if (error instanceof MissingParamError) {
      return badRequest(context, error);
    }

    if (error instanceof NotFoundError) {
      return notFound(context, error);
    }

    if (error instanceof DatabaseError) {
      return serverError(context);
    }

    return serverError(context);
  }
};

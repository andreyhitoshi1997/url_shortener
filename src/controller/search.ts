import { findTargetByShortRef } from "../usecases/find_short_ref";
import { closeDbConnection } from "../db/close_db";
import { MissingParamError, NotFoundError } from "../errors";
import { badRequest, notFound, ok, serverError } from "../helpers/http-helpers";
import type { Context } from "elysia";

export const searchController = async (context: Context) => {
  try {
    const { query } = context;
    const { shortRef } = query as { shortRef?: string };

    if (!shortRef) {
      throw new MissingParamError("shortRef");
    }

    const result = await findTargetByShortRef(shortRef);

    if (!result) {
      throw new NotFoundError("Short reference not found");
    }

    return ok(context, { targetRef: result });
  } catch (error) {
    if (error instanceof MissingParamError) {
      return badRequest(context, error);
    }

    if (error instanceof NotFoundError) {
      return notFound(context, error);
    }

    return serverError(context);
  } finally {
    await closeDbConnection();
  }
};

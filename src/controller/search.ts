import { findTargetByShortRef } from "../usecases/find_short_ref";
import { closeDbConnection } from "../db/close_db";
import { MissingParamError, NotFoundError } from "../errors";
import type { Context } from "elysia";

export const searchController = async ({ query, set }: Context) => {
  try {
    const { shortRef } = query as { shortRef?: string };

    if (!shortRef) {
      throw new MissingParamError("shortRef");
    }

    const result = await findTargetByShortRef(shortRef);

    if (!result) {
      throw new NotFoundError("Short reference not found");
    }

    set.status = 200;
    return { targetRef: result };
  } catch (error) {
    if (error instanceof MissingParamError) {
      set.status = 400;
      return { error: error.message };
    }

    if (error instanceof NotFoundError) {
      set.status = 404;
      return { error: error.message };
    }

    set.status = 500;
    return { error: "Internal server error" };
  } finally {
    await closeDbConnection();
  }
};

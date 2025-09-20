import { insertUser, shortRefExists } from "../usecases/insert_url_shortener";
import { closeDbConnection } from "../db/close_db";
import { MissingParamError, ValidationError, DatabaseError } from "../errors";
import {
  validateAndNormalizeUrl,
  generateShortRef,
} from "../helpers/url-helpers";
import type { Context } from "elysia";

export const insertController = async ({ body, query, set }: Context) => {
  try {
    const { targetRef } = body as { targetRef?: string };
    const { shortRef: customShortRef } = (query as { shortRef?: string }) || {};

    if (!targetRef) {
      throw new MissingParamError("targetRef");
    }

    const urlValidation = validateAndNormalizeUrl(targetRef);
    if (!urlValidation.isValid) {
      throw new ValidationError(`Invalid URL: ${urlValidation.error}`);
    }

    const normalizedTargetRef = urlValidation.normalizedUrl!;
    let finalShortRef: string;

    if (customShortRef) {
      const shortRefCheck = await shortRefExists(customShortRef);
      if (shortRefCheck.exists) {
        throw new ValidationError(
          `Short reference '${customShortRef}' already exists`
        );
      }
      finalShortRef = customShortRef;
    } else {
      finalShortRef = generateShortRef();
      let attempts = 0;
      while (attempts < 10) {
        const shortRefCheck = await shortRefExists(finalShortRef);
        if (!shortRefCheck.exists) {
          break;
        }
        finalShortRef = generateShortRef();
        attempts++;
      }

      if (attempts >= 10) {
        throw new DatabaseError("Unable to generate unique short reference");
      }
    }

    const inserted = await insertUser(finalShortRef, normalizedTargetRef);

    set.status = 201;
    return inserted[0];
  } catch (error) {
    if (error instanceof MissingParamError) {
      set.status = 400;
      return { error: error.message };
    }

    if (error instanceof ValidationError) {
      set.status = 400;
      return { error: error.message };
    }

    if (error instanceof DatabaseError) {
      set.status = 500;
      return { error: error.message };
    }

    set.status = 500;
    return { error: "Internal server error" };
  } finally {
    await closeDbConnection();
  }
};

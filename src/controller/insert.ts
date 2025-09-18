import {
  userAlreadyExists,
  insertUser,
  shortRefExists,
} from "../usecases/insert_url_shortener";
import { closeDbConnection } from "../db/close_db";
import type { HttpResponse, HttpRequest } from "../protocols/http";
import { badRequest, created } from "../helpers/http-helpers";
import { MissingParamError } from "../errors";
import type { Controller } from "../protocols/controller";
import {
  validateAndNormalizeUrl,
  generateShortUrl,
} from "../helpers/url-helpers";

export class InsertController implements Controller {
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { targetRef } = request.body;

    if (!targetRef) {
      await closeDbConnection();
      return badRequest(new MissingParamError("targetRef"));
    }

    const urlValidation = validateAndNormalizeUrl(targetRef);
    if (!urlValidation.isValid) {
      await closeDbConnection();
      return badRequest(new Error(`Invalid URL: ${urlValidation.error}`));
    }

    const normalizedTargetRef = urlValidation.normalizedUrl!;

    let finalShortRef = generateShortUrl();

    let attempts = 0;
    while (attempts < 10) {
      const shortRefCheck = await shortRefExists(finalShortRef);
      if (!shortRefCheck.exists) {
        break;
      }
      finalShortRef = generateShortUrl();
      attempts++;
    }

    if (attempts >= 10) {
      await closeDbConnection();
      return badRequest(new Error("Unable to generate unique short reference"));
    }

    const inserted = await insertUser(finalShortRef, normalizedTargetRef);
    await closeDbConnection();
    return created(inserted);
  }
}

export const insertUrl = new InsertController();

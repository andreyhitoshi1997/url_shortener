import {
  userAlreadyExists,
  insertUser,
} from "../usecases/insert_url_shortener";
import { closeDbConnection } from "../db/close_db";
import type { HttpResponse, HttpRequest } from "../protocols/http";
import { badRequest, created } from "../helpers/http-helpers";
import { MissingParamError } from "../errors";
import type { Controller } from "../protocols/controller";

export class InsertController implements Controller{
  async handle(request: HttpRequest): Promise<HttpResponse> {
    const { shortRef, targetRef } = request.body;
    for (const field of ["shortRef", "targetRef"]) {
      if (!request.body[field]) {
        await closeDbConnection();
        return badRequest(new MissingParamError(field));
      }
    }

    const exists = await userAlreadyExists(shortRef, targetRef);

    if (!exists.error) {
      await closeDbConnection();
      return badRequest(
        new Error("Combination of shortRef and targetRef already exists")
      );
    }

    const inserted = await insertUser(shortRef, targetRef);
    await closeDbConnection();
    return created(inserted);
  }
}

export const insertUrl = new InsertController();

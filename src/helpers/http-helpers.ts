import { ServerError } from "../errors";
import type { ErrorContext } from "elysia";

export const badRequest = (
  error: Error | { [key: string]: any }
): ErrorContext => ({
  statusCode: 400,
  body: error instanceof Error ? { error: error.message } : error,
});

export const notFound = (
  error: Error | { [key: string]: any }
): ErrorContext => ({
  statusCode: 404,
  body: error instanceof Error ? { error: error.message } : error,
});

export const serverError = (): ErrorContext => ({
  statusCode: 500,
  body: { error: ServerError },
});

export const ok = (data: any): ErrorContext => ({
  statusCode: 200,
  body: data,
});

export const created = (data: any): ErrorContext => ({
  statusCode: 201,
  body: data,
});

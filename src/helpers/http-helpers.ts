import type { Context } from "elysia";

export const badRequest = (
  context: Context,
  error: Error | { [key: string]: any }
) => {
  context.set.status = 400;
  return error instanceof Error ? { error: error.message } : error;
};

export const notFound = (
  context: Context,
  error: Error | { [key: string]: any }
) => {
  context.set.status = 404;
  return error instanceof Error ? { error: error.message } : error;
};

export const serverError = (context: Context) => {
  context.set.status = 500;
  return { error: "Internal server error" };
};

export const ok = (context: Context, data: any) => {
  context.set.status = 200;
  return data;
};

export const created = (context: Context, data: any) => {
  context.set.status = 201;
  return data;
};

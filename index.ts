import "dotenv/config";
import { Elysia } from "elysia";
import { insertController } from "./src/controller/insert";
import { searchController } from "./src/controller/search";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  MissingParamError,
} from "./src/errors";

const PORT = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION":
        set.status = 400;
        return { error: "Validation failed", details: error.message };

      case "NOT_FOUND":
        set.status = 404;
        return { error: "Route not found" };

      default:
        if (
          error instanceof MissingParamError ||
          error instanceof ValidationError
        ) {
          set.status = 400;
          return { error: error.message };
        }

        if (error instanceof NotFoundError) {
          set.status = 404;
          return { error: error.message };
        }

        if (error instanceof DatabaseError) {
          set.status = 500;
          return { error: error.message };
        }

        set.status = 500;
        return { error: "Internal server error" };
    }
  })
  .post("/api/shorten", insertController)
  .post("/api/insert", async (context) => {
    const { body } = context;
    const { originalUrl } = body as { originalUrl?: string };

    if (originalUrl) {
      context.body = { targetRef: originalUrl };
    }

    return insertController(context);
  })
  .get("/api/search", searchController)
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .listen(PORT);

console.log(`🚀 Server running on http://localhost:${PORT}`);

import "dotenv/config";
import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { urlShortener } from "./src/controller/elysia-controller";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  MissingParamError,
} from "./src/errors";

const PORT = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .use(
    swagger({
      documentation: {
        info: {
          title: "URL Shortener API",
          version: "1.0.0",
          description: "A simple and fast URL shortener service",
        },
        tags: [
          { name: "URL", description: "URL shortening operations" },
          { name: "Health", description: "Health check endpoint" },
        ],
      },
    })
  )
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
  .use(urlShortener)
  .get(
    "/health",
    () => ({
      status: "ok",
      timestamp: new Date().toISOString(),
    }),
    {
      detail: {
        tags: ["Health"],
        summary: "Health Check",
        description: "Check if the service is running and healthy.",
      },
    }
  )
  .listen(PORT);

console.log(`Server running on http://localhost:${PORT}`);

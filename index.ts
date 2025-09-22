import "dotenv/config";
import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { insertController } from "./src/controller/insert-controller";
import { searchController } from "./src/controller/search-controller";
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
  .post("/api/shorten", insertController, {
    body: t.Object({
      targetRef: t.String({
        description: "The URL to be shortened",
        example: "https://github.com",
      }),
    }),
    detail: {
      tags: ["URL"],
      summary: "Shorten a URL",
      description:
        "Create a short reference for a given URL. Optionally specify a custom short reference via query parameter.",
    },
  })
  .post(
    "/api/insert",
    async (context) => {
      const { body } = context;
      const { originalUrl } = body as { originalUrl?: string };

      if (originalUrl) {
        (context.body as any) = { targetRef: originalUrl };
      }

      return insertController(context);
    },
    {
      body: t.Object({
        originalUrl: t.String({
          description: "The original URL to be shortened (legacy endpoint)",
          example: "https://github.com",
        }),
      }),
      detail: {
        tags: ["URL"],
        summary: "Shorten a URL (Legacy)",
        description:
          "Legacy endpoint for URL shortening. Maps originalUrl to targetRef.",
      },
    }
  )
  .get("/api/search", searchController, {
    query: t.Object({
      shortRef: t.String({
        description: "The short reference to look up",
        example: "FNlELp",
      }),
    }),
    detail: {
      tags: ["URL"],
      summary: "Find original URL",
      description: "Retrieve the original URL from a short reference.",
    },
  })
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

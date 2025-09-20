import "dotenv/config";
import { insertController } from "./src/controller/insert";
import { searchController } from "./src/controller/search";
import { Elysia } from "elysia";
import {
  ValidationError,
  NotFoundError,
  DatabaseError,
  MissingParamError,
} from "./src/errors";

const app = new Elysia();
const SERVER_PORT = Number(process.env.PORT) || 3000;

app.onError(({ code, error, set }) => {
  switch (code) {
    case "VALIDATION":
      set.status = 400;
      return { error: "Validation failed", details: error.message };

    case "NOT_FOUND":
      set.status = 404;
      return { error: "Route not found" };

    default:
      if (error instanceof MissingParamError) {
        set.status = 400;
        return { error: error.message };
      }

      if (error instanceof ValidationError) {
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

      console.error("Unhandled error:", error);
      set.status = 500;
      return { error: "Internal server error" };
  }
});

app.post("/api/shorten", insertController);
app.get("/api/search", searchController);

app.get("/health", () => ({
  status: "ok",
  timestamp: new Date().toISOString(),
}));

app.listen(SERVER_PORT, () => {
  console.log(`🚀 Server running on http://localhost:${SERVER_PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST /api/shorten - Create short URL`);
  console.log(`   GET  /api/search  - Find original URL`);
  console.log(`   GET  /health     - Health check`);
});

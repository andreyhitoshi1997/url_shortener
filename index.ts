import "dotenv/config";
import { insertUrl } from "./src/controller/insert";
import { searchUrl } from "./src/controller/search";
import { Elysia as App } from "elysia";

const app = new App();
const port = process.env.PORT || 3000;

app.post("/api/shorten", async ({ body, set }) => {
  const response = await insertUrl.handle({
    query: { shortRef: undefined, targetRef: undefined },
    body,
  });
  set.status = response.statusCode;
  return response.body;
});

app.get("/api/search", async ({ query, set }) => {
  const { shortRef } = query as { shortRef: any };
  const response = await searchUrl.handle({
    query: { shortRef, targetRef: undefined },
  });
  set.status = response.statusCode;
  return response.body;
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

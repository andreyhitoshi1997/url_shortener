import { t } from "elysia";

export const UrlReferenceSchema = t.Object({
  id: t.String({ description: "Unique identifier for the URL reference" }),
  shortRef: t.String({ description: "The shortened URL" }),
  targetRef: t.String({ description: "The original URL" }),
});

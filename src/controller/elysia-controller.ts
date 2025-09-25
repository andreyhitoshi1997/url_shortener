import { Elysia, t } from "elysia";
import {
  GenerateShortenUrlService,
  RedirectToOriginalUrlService,
} from "../services/elysia-services";
import { UrlReferenceSchema } from "../schemas/elysia-schemas";

export const urlShortener = new Elysia({ prefix: "/shorten" })
  .post(
    "/",
    async ({ body }) => {
      const service = new GenerateShortenUrlService();
      const urlReference = await service.generate(body.originalUrl);

      return urlReference;
    },
    {
      body: t.Object({
        originalUrl: t.String({ format: "uri" }),
      }),
      response: UrlReferenceSchema,
    }
  )
  .get("/:hash", async ({ params: { hash }, redirect, set }) => {
    const service = new RedirectToOriginalUrlService();
    const redirectUrl = await service.getOriginalUrl(hash);

    if (!redirectUrl) {
      set.status = 404;
      return { error: "URL not found" };
    }

    return redirect(redirectUrl, 308);
  });

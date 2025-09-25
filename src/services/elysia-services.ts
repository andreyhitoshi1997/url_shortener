import { insertUrlService, searchUrlService } from "./url-service";

export class GenerateShortenUrlService {
  async generate(originalUrl: string) {
    return await insertUrlService({
      targetRef: originalUrl,
    });
  }
}

export class RedirectToOriginalUrlService {
  async getOriginalUrl(hash: string): Promise<string | null> {
    try {
      const result = await searchUrlService(hash);
      return result.targetRef;
    } catch (error) {
      return null;
    }
  }
}

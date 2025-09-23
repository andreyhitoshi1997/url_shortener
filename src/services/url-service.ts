import { UrlRepository } from "../db";
import { RequestValidator } from "../validators/request-validator";
import { UrlValidator } from "../validators/url-validator";
import { TargetRefValidator } from "../validators/target-ref-validator";
import { ShortRefGenerator } from "./short-ref-generator";
import { NotFoundError, ValidationError } from "../errors";

export interface ShortenUrlRequest {
  targetRef: string;
  customShortRef?: string;
}

export interface ShortenUrlResponse {
  id: string;
  shortRef: string;
  targetRef: string;
}

export interface FindUrlResponse {
  targetRef: string;
}

export async function insertUrlService(
  request: ShortenUrlRequest
): Promise<ShortenUrlResponse> {
  RequestValidator.validateTargetRef(request.targetRef);

  TargetRefValidator.validateProtocol(request.targetRef);

  const urlValidator = new UrlValidator(request.targetRef);
  const normalizedUrl = urlValidator.validate();

  const targetRefValidator = new TargetRefValidator(normalizedUrl);
  await targetRefValidator.validateUniqueness();

  const generator = new ShortRefGenerator();
  const shortRef = generator.generate(request.customShortRef);

  const repository = new UrlRepository();
  const created = await repository.create({
    shortRef,
    targetRef: normalizedUrl,
  });

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const shortUrl = `${baseUrl}/${created.shortRef}`;

  return {
    id: created.id,
    shortRef: shortUrl,
    targetRef: created.targetRef,
  };
}

export async function searchUrlService(
  shortRef: string
): Promise<FindUrlResponse> {
  RequestValidator.validateShortRef(shortRef);

  const repository = new UrlRepository();
  const found = await repository.findByShortRef(shortRef);

  if (!found) {
    throw new NotFoundError("Short reference not found");
  }

  return {
    targetRef: found.targetRef,
  };
}

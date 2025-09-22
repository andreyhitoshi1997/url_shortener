import { ValidationError } from "../errors";
import { validateAndNormalizeUrl } from "../helpers/url-helpers";

export class UrlValidator {
  private readonly url: string;

  constructor(url: string) {
    this.url = url;
  }

  validate(): string {
    const validation = validateAndNormalizeUrl(this.url);

    if (!validation.isValid) {
      throw new ValidationError(`Invalid URL: ${validation.error}`);
    }

    return validation.normalizedUrl!;
  }
}

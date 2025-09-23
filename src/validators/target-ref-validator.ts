import { ValidationError } from "../errors";
import { UrlRepository } from "../db";

export class TargetRefValidator {
  private readonly targetRef: string;
  private readonly repository: UrlRepository;

  constructor(targetRef: string) {
    this.targetRef = targetRef;
    this.repository = new UrlRepository();
  }

  async validateUniqueness(): Promise<void> {
    const existingUrl = await this.repository.findByTargetRef(this.targetRef);

    if (existingUrl) {
      throw new ValidationError(
        `URL '${this.targetRef}' is already registered with shortRef: ${existingUrl.shortRef}`
      );
    }
  }

  static validateProtocol(targetRef: string): void {
    if (!targetRef.startsWith("http://") && !targetRef.startsWith("https://")) {
      throw new ValidationError("URL must start with http:// or https://");
    }
  }
}

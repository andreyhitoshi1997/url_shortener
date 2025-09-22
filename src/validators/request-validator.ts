import { MissingParamError } from "../errors";

export class RequestValidator {
  static validateTargetRef(targetRef: string | undefined): void {
    if (!targetRef || targetRef.trim() === "") {
      throw new MissingParamError("targetRef");
    }
  }

  static validateShortRef(shortRef: string | undefined): void {
    if (!shortRef || shortRef.trim() === "") {
      throw new MissingParamError("shortRef");
    }
  }
}

import { generateShortRef } from "../generators/short-ref-generator";

export class ShortRefGenerator {
  generate(customShortRef?: string): string {
    return customShortRef || generateShortRef();
  }
}

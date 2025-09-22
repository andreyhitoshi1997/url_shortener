import { generateShortRef } from "../helpers/url-helpers";

export class ShortRefGenerator {
  generate(customShortRef?: string): string {
    return customShortRef || generateShortRef();
  }
}

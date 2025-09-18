export interface UrlValidationResult {
  isValid: boolean;
  normalizedUrl?: string;
  error?: string;
}

export function validateAndNormalizeUrl(url: string): UrlValidationResult {
  if (!url || typeof url !== "string") {
    return {
      isValid: false,
      error: "URL is required and must be a string",
    };
  }

  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return {
      isValid: false,
      error: "URL cannot be empty",
    };
  }

  const urlRegex =
    /^https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:#(?:[\w.])*)?)?$/;

  let normalizedUrl = trimmedUrl;
  if (
    !normalizedUrl.startsWith("http://") &&
    !normalizedUrl.startsWith("https://")
  ) {
    normalizedUrl = "https://" + normalizedUrl;
  }

  if (!urlRegex.test(normalizedUrl)) {
    return {
      isValid: false,
      error: "Invalid URL format. Must be a valid HTTP/HTTPS URL",
    };
  }

  try {
    const urlObject = new URL(normalizedUrl);

    if (!urlObject.hostname) {
      return {
        isValid: false,
        error: "Invalid hostname",
      };
    }

    if (urlObject.hostname.includes(",")) {
      return {
        isValid: false,
        error: "Hostname cannot contain commas",
      };
    }

    if (urlObject.hostname.length < 3) {
      return {
        isValid: false,
        error: "Hostname too short",
      };
    }

    if (!urlObject.hostname.includes(".")) {
      return {
        isValid: false,
        error: "Hostname must contain a valid domain (e.g., example.com)",
      };
    }

    if (urlObject.hostname === "localhost") {
      return {
        isValid: false,
        error: "Localhost is not allowed. Please use a valid domain name",
      };
    }

    const domainParts = urlObject.hostname.split(".");
    if (
      domainParts.length < 2 ||
      domainParts.some((part) => part.length === 0)
    ) {
      return {
        isValid: false,
        error:
          "Invalid domain name. Must have at least one dot (e.g., example.com)",
      };
    }

    if (!["http:", "https:"].includes(urlObject.protocol)) {
      return {
        isValid: false,
        error: "Only HTTP and HTTPS protocols are allowed",
      };
    }

    return {
      isValid: true,
      normalizedUrl: urlObject.toString(),
    };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid URL format: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export function generateShortRef(length: number = 6): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateShortUrl(
  baseUrl: string = "http://localhost:3000",
  length: number = 6
): string {
  const shortCode = generateShortRef(length);
  return `${baseUrl}/${shortCode}`;
}

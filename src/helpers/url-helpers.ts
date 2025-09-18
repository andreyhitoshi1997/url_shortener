export interface UrlValidationResult {
    isValid: boolean;
    normalizedUrl?: string;
    error?: string;
}

export function validateAndNormalizeUrl(url: string): UrlValidationResult {
    if (!url || typeof url !== 'string') {
        return {
            isValid: false,
            error: 'URL is required and must be a string'
        };
    }

    const trimmedUrl = url.trim();
    
    if (!trimmedUrl) {
        return {
            isValid: false,
            error: 'URL cannot be empty'
        };
    }

    let normalizedUrl = trimmedUrl;
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
    }

    try {
        const urlObject = new URL(normalizedUrl);
        
        if (!urlObject.hostname) {
            return {
                isValid: false,
                error: 'Invalid hostname'
            };
        }

        if (urlObject.hostname.includes(',')) {
            return {
                isValid: false,
                error: 'Hostname cannot contain commas'
            };
        }

        if (urlObject.hostname.length < 3) {
            return {
                isValid: false,
                error: 'Hostname too short'
            };
        }

        if (!['http:', 'https:'].includes(urlObject.protocol)) {
            return {
                isValid: false,
                error: 'Only HTTP and HTTPS protocols are allowed'
            };
        }

        return {
            isValid: true,
            normalizedUrl: urlObject.toString()
        };

    } catch (error) {
        return {
            isValid: false,
            error: `Invalid URL format: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
    }
}

export function generateShortRef(length: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
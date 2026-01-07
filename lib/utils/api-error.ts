export interface APIError {
    message: string;
    code?: string;
    details?: unknown;
}

/**
 * Type guard to check if an error is a Razorpay error object
 */
interface RazorpayError {
    error: {
        code: string;
        description: string;
        source: string;
        step: string;
        reason: string;
        metadata: unknown;
    };
}

function isRazorpayError(error: unknown): error is RazorpayError {
    return (
        typeof error === "object" &&
        error !== null &&
        "error" in error &&
        typeof (error as any).error === "object" &&
        "description" in (error as any).error
    );
}

/**
 * Safely parses an unknown error into a structured APIError
 */
export function parseAPIError(error: unknown): APIError {
    // 1. Handle Razorpay Specific Errors
    if (isRazorpayError(error)) {
        return {
            message: error.error.description || "Payment provider error",
            code: error.error.code || "RAZORPAY_ERROR",
            details: error.error,
        };
    }

    // 2. Handle Standard Error Objects
    if (error instanceof Error) {
        return {
            message: error.message,
            code: error.name,
        };
    }

    // 3. Handle String Errors
    if (typeof error === "string") {
        return {
            message: error,
            code: "UNKNOWN_ERROR",
        };
    }

    // 4. Fallback for unknown simple objects
    if (typeof error === "object" && error !== null) {
        try {
            // Attempt to extract a message if it exists
            const anyError = error as any;
            if (anyError.message && typeof anyError.message === 'string') {
                return {
                    message: anyError.message,
                    code: anyError.code || "UNKNOWN_OBJECT_ERROR"
                }
            }

            return {
                message: "An unexpected error occurred",
                details: JSON.stringify(error) // Be careful with circular refs here in prod, but basic objects are fine
            }
        } catch {
            // If strict mode or circular ref
            return {
                message: "An unparsable error occurred",
                code: "CIRCULAR_REF_ERROR"
            }
        }
    }

    return {
        message: "An unknown error occurred",
        code: "UNKNOWN_ERROR",
    };
}

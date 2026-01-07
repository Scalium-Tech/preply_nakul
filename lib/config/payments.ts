// Enums for strict typing and magic string removal
export enum BillingCycle {
    MONTHLY = "monthly",
    YEARLY = "yearly",
}

export enum SubscriptionStatus {
    ACTIVE = "active",
    EXPIRED = "expired",
    CANCELLED = "cancelled",
}

export const paymentConfig = {
    // Safe access to environment variables
    razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

    /**
     * Validates that required payment configuration is present.
     * Should be called at application startup or critical entry points.
     * @returns True if valid, throws if invalid (fail fast pattern for server startup)
     */
    validate: () => {
        const errors: string[] = [];
        // Check Server-Side Secrets
        if (typeof window === 'undefined') {
            if (!process.env.RAZORPAY_KEY_ID) errors.push("RAZORPAY_KEY_ID is missing");
            if (!process.env.RAZORPAY_KEY_SECRET) errors.push("RAZORPAY_KEY_SECRET is missing");
        }

        // Check Public Keys
        if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
            errors.push("NEXT_PUBLIC_RAZORPAY_KEY_ID is missing");
        }

        if (errors.length > 0) {
            throw new Error(`Payment Configuration Error:\n- ${errors.join('\n- ')}`);
        }
        return true;
    },

    currency: "INR",
    companyName: "Preply",

    // Single Source of Truth for Pricing
    plans: {
        [BillingCycle.MONTHLY]: {
            amount: 79900, // in paise
            displayAmount: "799",
            currency: "INR",
            minorUnitMultiplier: 100,
            id: "pro_monthly",
            label: "Monthly",
            durationMonths: 1,
            features: [
                "Everything in Free",
                "Unlimited interviews",
                "Unlimited report downloads",
                "Dashboard access",
                "Progress tracking",
                "Interview history"
            ]
        },
        [BillingCycle.YEARLY]: {
            amount: 729900, // in paise
            displayAmount: "7,299",
            currency: "INR",
            minorUnitMultiplier: 100,
            id: "pro_yearly",
            label: "Yearly",
            durationMonths: 12,
            features: [
                "Everything in Free",
                "Unlimited interviews",
                "Unlimited report downloads",
                "Dashboard access",
                "Progress tracking",
                "Interview history"
            ]
        }
    },

    freeFeatures: [
        "1 interview (lifetime)",
        "1 report download",
        "AI-powered feedback",
        "Dashboard access",
        "Progress tracking",
        "Interview history"
    ]
};

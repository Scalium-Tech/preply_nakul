import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { paymentConfig, BillingCycle, SubscriptionStatus } from "@/lib/config/payments";
import { verifyPaymentSchema } from "@/lib/validations/payments";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { parseAPIError } from "@/lib/utils/api-error";
import { logger } from "@/lib/utils/logger";

export async function POST(request: NextRequest) {
    try {
        // Check environment variables (already checked in admin.ts, but fail-fast for Razorpay secret here)
        // Check environment variables
        try {
            paymentConfig.validate();
        } catch (configError: unknown) {
            console.error("Configuration Error:", configError);
            return NextResponse.json(
                { error: "Payment service not configured" },
                { status: 503 }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const validation = verifyPaymentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: validation.error.format() },
                { status: 400 }
            );
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = validation.data;

        // Verify signature
        const signatureBody = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
            .update(signatureBody)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        // Fetch trusted order details from DB
        const { data: paymentRecord, error: paymentError } = await supabaseAdmin
            .from("payments")
            .select("billing_cycle, user_id")
            .eq("razorpay_order_id", razorpay_order_id)
            .single();

        if (paymentError || !paymentRecord) {
            console.error("Error fetching payment record:", paymentError);
            return NextResponse.json(
                { error: "Payment record not found" },
                { status: 404 }
            );
        }

        const billing_cycle = paymentRecord.billing_cycle as BillingCycle;
        const user_id = paymentRecord.user_id;

        // Single Source of Truth for Duration
        const planConfig = paymentConfig.plans[billing_cycle];

        // Strict Plan Validation (No Guesswork)
        if (!planConfig) {
            console.error(`Critical Data Integrity Error: Plan config missing for cycle ${billing_cycle}`);
            return NextResponse.json(
                { error: "Invalid plan configuration detected. Please contact support." },
                { status: 500 }
            );
        }

        const durationMonths = planConfig.durationMonths;

        // Fetch current subscription to handle extensions
        const { data: currentSubscription } = await supabaseAdmin
            .from("subscriptions")
            .select("expires_at, status")
            .eq("user_id", user_id)
            .single();

        // Consistent Timestamp
        const now = new Date();
        const nowISO = now.toISOString();

        // Calculate new expiry date using UTC to avoid timezone issues
        let baseDate = new Date(now); // Start from "now" by default

        // If user has an active subscription that expires in the future, extend from that date
        if (currentSubscription?.expires_at && new Date(currentSubscription.expires_at) > baseDate) {
            baseDate = new Date(currentSubscription.expires_at);
        }

        const expiresAt = new Date(baseDate);
        // UTC Safe Month Addition
        expiresAt.setUTCMonth(expiresAt.getUTCMonth() + durationMonths);

        // Update payment record
        await supabaseAdmin
            .from("payments")
            .update({
                razorpay_payment_id,
                razorpay_signature,
                status: "captured", // Could use an Enum here if PaymentStatus existed
            })
            .eq("razorpay_order_id", razorpay_order_id);

        // Upsert subscription
        const { error: subscriptionError } = await supabaseAdmin
            .from("subscriptions")
            .upsert(
                {
                    user_id: user_id,
                    plan: "pro",
                    billing_cycle: billing_cycle,
                    status: SubscriptionStatus.ACTIVE,
                    started_at: nowISO,
                    expires_at: expiresAt.toISOString(),
                    updated_at: nowISO,
                },
                {
                    onConflict: "user_id",
                }
            );

        if (subscriptionError) {
            console.error("Error updating subscription:", subscriptionError);
            return NextResponse.json(
                { error: "Failed to update subscription" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Payment verified and subscription activated",
            expiresAt: expiresAt.toISOString(),
        });
    } catch (error: unknown) {
        const safeError = parseAPIError(error);
        logger.error("Error verifying payment", safeError);
        return NextResponse.json(
            { error: "Failed to verify payment" },
            { status: 500 }
        );
    }
}

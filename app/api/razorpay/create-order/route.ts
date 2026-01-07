
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { paymentConfig, BillingCycle, SubscriptionStatus } from "@/lib/config/payments";
import { createOrderSchema } from "@/lib/validations/payments";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { parseAPIError } from "@/lib/utils/api-error";
import { logger } from "@/lib/utils/logger";

export async function POST(request: NextRequest) {
    try {
        // Fail Fast: Configuration Checks
        // Fail Fast: Configuration Checks
        try {
            paymentConfig.validate();
        } catch (configError: unknown) {
            console.error(configError); // TODO: use safe logger
            return NextResponse.json(
                { error: "Payment service not configured. Please contact support." },
                { status: 503 }
            );
        }

        let body;
        try {
            body = await request.json();
        } catch (e) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        // Runtime Validation with Zod
        const validation = createOrderSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: validation.error.format() },
                { status: 400 }
            );
        }

        const { billingCycle, userId } = validation.data;

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        // Supabase client is now imported as supabaseAdmin

        console.log("Creating order for:", { billingCycle, userId });

        // Validate billing cycle config existence (Double check)
        const selectedPlan = paymentConfig.plans[billingCycle];
        if (!selectedPlan) {
            return NextResponse.json(
                { error: "Plan configuration not found for this cycle" },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: "Please login to continue" },
                { status: 401 }
            );
        }

        // Idempotency & Upgrade Logic
        // Check if user has an active subscription
        const { data: existingSub } = await supabaseAdmin
            .from("subscriptions")
            .select("status, expires_at, billing_cycle")
            .eq("user_id", userId)
            .eq("status", SubscriptionStatus.ACTIVE)
            .single();

        if (existingSub) {
            // Robust Date Check
            const isActive = existingSub.expires_at && new Date(existingSub.expires_at) > new Date();

            if (isActive) {
                // Allow strict upgrade path: Monthly -> Yearly only
                const isMonthlyToYearlyUpgrade =
                    existingSub.billing_cycle === BillingCycle.MONTHLY &&
                    billingCycle === BillingCycle.YEARLY;

                if (!isMonthlyToYearlyUpgrade) {
                    return NextResponse.json(
                        { error: "You already have an active Pro subscription." },
                        { status: 409 }
                    );
                }
            }
        }

        console.log("Creating Razorpay order with amount:", selectedPlan.amount);

        let order;
        try {
            order = await razorpay.orders.create({
                amount: selectedPlan.amount,
                currency: paymentConfig.currency,
                receipt: `preply_${userId.substring(0, 8)}_${Date.now()}`,
                notes: {
                    userId,
                    billingCycle,
                    plan: "pro",
                },
            });
        } catch (razorpayError: unknown) {
            const safeError = parseAPIError(razorpayError);
            console.error("Razorpay order creation failed:", safeError);
            return NextResponse.json(
                { error: `Razorpay error: ${safeError.message}` },
                { status: 500 }
            );
        }

        console.log("Order created:", order.id);

        try {
            await supabaseAdmin.from("payments").insert({
                user_id: userId,
                plan: "pro",
                billing_cycle: billingCycle,
                amount: selectedPlan.amount,
                razorpay_order_id: order.id,
                status: "created",
            });
        } catch (dbError) {
            console.error("Failed to save payment record (non-critical):", dbError);
        }

        return NextResponse.json({
            orderId: order.id,
            amount: selectedPlan.amount,
            currency: paymentConfig.currency,
            keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (error: unknown) {
        const safeError = parseAPIError(error);
        logger.error("Error creating order", safeError);
        return NextResponse.json(
            { error: safeError.message || "Failed to create order" },
            { status: 500 }
        );
    }
}

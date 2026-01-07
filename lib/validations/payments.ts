import { z } from "zod";
import { BillingCycle } from "@/lib/config/payments";

export const createOrderSchema = z.object({
    billingCycle: z.nativeEnum(BillingCycle, {
        errorMap: () => ({ message: "Invalid billing cycle. Must be 'monthly' or 'yearly'." }),
    }),
    userId: z.string().min(1, "User ID is required"),
});

export const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().min(1, "Order ID is required"),
    razorpay_payment_id: z.string().min(1, "Payment ID is required"),
    razorpay_signature: z.string().min(1, "Signature is required"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

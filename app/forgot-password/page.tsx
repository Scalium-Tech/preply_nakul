"use client";

import Link from "next/link";
import { useState } from "react";
import { MoveLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { supabase } = await import("@/lib/supabase");
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (resetError) {
                setError(resetError.message);
                setLoading(false);
                return;
            }

            setSuccess(true);
            setLoading(false);
        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50/50 via-white to-white flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <div className="mb-6">
                    <Link
                        href="/login"
                        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        <MoveLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                        <p className="text-gray-600">Enter your email to receive a password reset link</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {success ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
                            <p className="text-gray-600 mb-6">
                                We&apos;ve sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
                            </p>
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-violet-600 font-medium hover:text-violet-700 transition-colors"
                            >
                                Resend email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 text-base font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
                            >
                                {loading ? "Sending Link..." : "Send Reset Link"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

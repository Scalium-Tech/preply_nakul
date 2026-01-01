"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { MoveLeft, CheckCircle, AlertCircle, Lock } from "lucide-react";
import Link from "next/link";

export default function UpdatePasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();

            if (error || !user) {
                // If no user, it means the link is invalid or expired
                // Redirecting to login after a short delay or showing error
                setError("Invalid or expired password reset link. Please try again.");
                setLoading(false);
                return;
            }

            setEmail(user.email || null);
            setLoading(false);
        };

        getUser();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setUpdating(true);

        try {
            const { error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) {
                setError(updateError.message);
                setUpdating(false);
                return;
            }

            setSuccess(true);
            setUpdating(false);

            // Optional: Redirect after a few seconds
            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (err) {
            setError("An unexpected error occurred. Please try again.");
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-violet-50/50 via-white to-white flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

                    {success ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
                            <p className="text-gray-600 mb-6">
                                Your password has been successfully updated. You will be redirected to login shortly.
                            </p>
                            <Link
                                href="/login"
                                className="inline-block w-full py-3 px-4 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-colors shadow-md"
                            >
                                Go to Login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="text-center mb-8">
                                <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <Lock className="w-6 h-6" />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Set New Password</h1>
                                <p className="text-gray-600">
                                    {email ? (
                                        <>for <span className="font-medium text-gray-900">{email}</span></>
                                    ) : (
                                        "Enter your new password below"
                                    )}
                                </p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-600 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter new password"
                                        required
                                        disabled={updating}
                                        minLength={6}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Confirm new password"
                                        required
                                        disabled={updating}
                                        minLength={6}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={updating}
                                    className="w-full py-3.5 text-base font-semibold text-white bg-violet-600 rounded-xl hover:bg-violet-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md"
                                >
                                    {updating ? "Updating Password..." : "Update Password"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

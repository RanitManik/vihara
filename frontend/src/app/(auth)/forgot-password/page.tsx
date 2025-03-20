"use client";

import { useForm } from "react-hook-form";
import Input from "@/components/input";
import Button from "@/components/button";
import CustomLink from "@/components/custom-link";

interface ForgotPasswordFormData {
    email: string;
}

function Page() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>();

    const onSubmit = (data: ForgotPasswordFormData) => {
        console.log("Reset password request sent for:", data.email);
    };

    return (
        <div className="flex min-h-svh items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                <div className="space-y-2">
                    <h1 className="text-center text-2xl font-bold">
                        Forgot your password?
                    </h1>
                    <p className="text-center text-sm text-gray-700">
                        We’ll send you a link to reset it. Enter your email
                        address used for Vihara.
                    </p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Your email address"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email format",
                            },
                        })}
                        error={errors.email?.message}
                    />
                    <Button
                        type="submit"
                        className="w-full text-center font-semibold"
                    >
                        Send Reset Link
                    </Button>
                </form>
                <div className="text-center text-sm">
                    <span>Don’t have an account? </span>
                    <CustomLink href="/sign-up">Register</CustomLink>
                </div>
            </div>
        </div>
    );
}

export default Page;

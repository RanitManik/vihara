"use client";

import { useForm } from "react-hook-form";
import Input from "@/components/input";
import Button from "@/components/button";
import CustomLink from "@/components/custom-link";
import PasswordInput from "@/app/auth/_components/password-input";

interface FormData {
    fName: string;
    lName: string;
    email: string;
    password: string;
}

function Page() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>();

    const onSubmit = (data: FormData) => {
        console.log("Form submitted:", data);
    };

    return (
        <div className="flex min-h-svh items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                <h1 className="text-center text-2xl font-bold">Sign up</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            label="First Name"
                            {...register("fName", {
                                required: "First name is required",
                            })}
                            error={errors.fName?.message}
                        />
                        <Input
                            label="Last Name"
                            {...register("lName", {
                                required: "Last name is required",
                            })}
                            error={errors.lName?.message}
                        />
                    </div>
                    <Input
                        label="Email address"
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
                    <PasswordInput
                        label="Password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message:
                                    "Password must be at least 8 characters long",
                            },
                            validate: {
                                isDifferentFromEmail: (value) =>
                                    value !== watch("email") ||
                                    "Email and password cannot be the same",
                                hasLetter: (value) =>
                                    /[a-zA-Z]/.test(value) ||
                                    "Password must contain at least one letter",
                                hasNumber: (value) =>
                                    /\d/.test(value) ||
                                    "Password must contain at least one number",
                                hasSymbol: (value) =>
                                    /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                    "Password must contain at least one symbol",
                            },
                        })}
                        error={errors.password?.message}
                    />
                    <p className="text-xs leading-none">
                        By creating an account, you agree with our{" "}
                        <CustomLink className="text-xs font-semibold" href="/">
                            Terms and Conditions
                        </CustomLink>{" "}
                        and{" "}
                        <CustomLink className="text-xs font-semibold" href="/">
                            Privacy Statement
                        </CustomLink>
                        .
                    </p>
                    <Button
                        type="submit"
                        className="w-full text-center font-semibold"
                    >
                        Continue with email
                    </Button>
                </form>
                <div className="text-center text-sm">
                    <span>Already have an account? </span>
                    <CustomLink href="/auth/sign-in">Sign in</CustomLink>
                </div>
            </div>
        </div>
    );
}

export default Page;

"use client";

import { Controller, useForm } from "react-hook-form";
import Input from "@/components/input";
import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import CustomLink from "@/components/custom-link";
import PasswordInput from "@/app/(auth)/_components/password-input";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "@/actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/toast-context";

export interface SignInFormData {
    email: string;
    password: string;
    keepSignedIn: boolean;
}

function Page() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { addToast } = useToast();
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: "",
            password: "",
            keepSignedIn: true,
        },
    });

    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async () => {
            addToast(
                "You signed in successfully",
                "success",
                "Welcome back! You have successfully logged into your account.",
            );
            await queryClient.invalidateQueries("validateToken");
            router.push("/");
        },
        onError: (error) => {
            addToast("Login failed", "error", error as string);
        },
    });

    const onSubmit = (data: SignInFormData) => {
        mutation.mutate(data);
    };

    return (
        <div className="flex min-h-svh items-center justify-center p-4 animate-in fade-in">
            <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                <h1 className="text-center text-2xl font-bold">Sign in</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                        disabled={mutation.isLoading}
                    />
                    <PasswordInput
                        label="Password"
                        {...register("password", {
                            required: "Password is required",
                        })}
                        error={errors.password?.message}
                        disabled={mutation.isLoading}
                    />
                    <div className="flex items-center justify-between">
                        <Controller
                            name="keepSignedIn"
                            control={control}
                            defaultValue={true}
                            render={({ field: { onChange, value } }) => (
                                <Checkbox
                                    onChange={onChange}
                                    checked={value}
                                    label="Keep me signed in"
                                    disabled={mutation.isLoading}
                                />
                            )}
                        />
                        <CustomLink href="/forgot-password">
                            Forgot password?
                        </CustomLink>
                    </div>
                    <Button
                        type="submit"
                        className="w-full text-center font-semibold"
                        isLoading={mutation.isLoading}
                    >
                        Continue with email
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

"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import Button from "@/components/button";
import { useMutation } from "react-query";
import * as apiClient from "@/actions";
import { useToast } from "@/context/toast-context";

function Page() {
    const { isAuthenticated, isCheckingAuth } = useAuth();
    const router = useRouter();
    const { addToast } = useToast();

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: () => {
            router.push("/auth/sign-in");
            addToast("Sign Out Successful");
        },
        onError: (e) => {
            addToast(e as string);
        },
    });

    const handleClick = () => {
        mutation.mutate();
    };

    if (isCheckingAuth) {
        return <Loader />;
    } else if (!isAuthenticated) {
        router.push("/auth/sign-in");
    } else
        return (
            <div>
                <span>YOU ARE SIGNED IN</span>
                <Button onClick={handleClick}>Sign Out</Button>
            </div>
        );
}

export default Page;

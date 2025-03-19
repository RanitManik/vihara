"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "@/actions";
import { useToast } from "@/context/toast-context";

function SignOutButton() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { addToast } = useToast();

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            addToast("Sign Out Successful");
            await queryClient.invalidateQueries("validateToken");
            router.push("/auth/sign-in");
        },
        onError: (e) => {
            addToast(e as string);
        },
    });

    const handleClick = () => {
        mutation.mutate();
    };

    return <Button onClick={handleClick}>Sign Out</Button>;
}

export default SignOutButton;

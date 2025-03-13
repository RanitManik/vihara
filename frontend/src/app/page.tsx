"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import SignOutButton from "@/app/auth/_components/sign-out-button";

function Page() {
    const { isAuthenticated, isCheckingAuth } = useAuth();
    const router = useRouter();

    if (isCheckingAuth) {
        return <Loader />;
    } else if (!isAuthenticated) {
        router.push("/auth/sign-in");
    } else
        return (
            <div>
                <span>YOU ARE SIGNED IN</span>
                <SignOutButton />
            </div>
        );
}

export default Page;

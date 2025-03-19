"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import SignOutButton from "@/app/_components/sign-out-button";
import Button from "@/components/button";

function Page() {
    const { isAuthenticated, isCheckingAuth } = useAuth();
    const router = useRouter();

    if (isCheckingAuth) {
        return <Loader />;
    } else if (!isAuthenticated) {
        return <Button onClick={() => router.push("/sign-in")}>Sign in</Button>;
    } else
        return (
            <div>
                <span>YOU ARE SIGNED IN</span>
                <SignOutButton />
            </div>
        );
}

export default Page;

"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import SignOutButton from "@/app/_components/sign-out-button";
import Button from "@/components/button";
import ServerBootNotice from "@/components/ServerBootNotice";
import Loader from "@/components/loader";

function Page() {
    const { isAuthenticated, isCheckingAuth } = useAuth();
    const router = useRouter();

    const [showServerNotice, setShowServerNotice] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowServerNotice(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    if (isCheckingAuth) {
        return (
            <main className="grid min-h-svh w-full place-content-center">
                {showServerNotice ? (
                    <ServerBootNotice />
                ) : (
                    <Loader label="Loading..." size="lg" />
                )}
            </main>
        );
    } else if (!isAuthenticated) {
        return (
            <main className="grid min-h-svh place-content-center">
                <h1>Welcome To vihara</h1>
                <Button onClick={() => router.push("/sign-in")}>Sign in</Button>
            </main>
        );
    } else
        return (
            <main className="grid min-h-svh place-content-center">
                <span>YOU ARE SIGNED IN</span>
                <SignOutButton />
            </main>
        );
}

export default Page;

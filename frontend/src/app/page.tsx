"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

function Page() {
    const { isAuthenticated, isCheckingAuth } = useAuth();
    const router = useRouter();

    if (isCheckingAuth) {
        return <Loader />;
    } else if (!isAuthenticated) {
        router.push("/auth/sign-in");
    } else return <div>YOU ARE SIGNED IN</div>;
}

export default Page;

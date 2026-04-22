"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGoogleOAuthExchange } from "@/hooks/use-auth";

type PageState = "loading" | "error";

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const oauthCode = searchParams.get("oauth_code");

  const [state, setState] = useState<PageState>(
    oauthCode ? "loading" : "error",
  );
  const [errorMessage, setErrorMessage] = useState(
    oauthCode ? "" : "Invalid sign-in link. Please try again.",
  );
  const { exchange } = useGoogleOAuthExchange();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    // Guard against double-invocation in React Strict Mode
    if (hasRun.current) return;
    if (!oauthCode) return;
    hasRun.current = true;

    exchange(oauthCode)
      .then(() => {
        toast.success("Signed in with Google!");
        router.push("/");
      })
      .catch((err: unknown) => {
        setState("error");
        setErrorMessage(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.",
        );
      });
  }, [exchange, oauthCode, router]);

  return (
    /* Card */
    <div className="surface-panel relative z-10 flex w-full max-w-sm flex-col items-center gap-8 px-8 py-10 text-center">
      {/* Brand mark */}
      <Link href="/" className="flex items-center gap-2.5">
        <div className="bg-primary/20 border-primary/30 flex h-10 w-10 items-center justify-center rounded-2xl border">
          <Image
            src="/logo/logo.svg"
            alt="Vihara logo"
            width={22}
            height={22}
            className="rounded-sm"
          />
        </div>
        <span className="font-heading text-2xl font-semibold">Vihara</span>
      </Link>

      {/* Loading state */}
      {state === "loading" && (
        <div className="flex flex-col items-center gap-5">
          <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
            <Spinner className="text-primary size-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="font-heading text-2xl font-semibold">
              Signing you in
            </h1>
            <p className="text-muted-foreground text-sm leading-6">
              Verifying with Google, just a moment&hellip;
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {state === "error" && (
        <div className="flex flex-col items-center gap-5">
          <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
            <AlertCircle className="text-destructive size-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="font-heading text-2xl font-semibold">
              Sign-in failed
            </h1>
            <p className="text-muted-foreground text-sm leading-6">
              {errorMessage}
            </p>
          </div>
          <Button asChild className="h-11 w-full rounded-full font-semibold">
            <Link href="/auth">Back to sign in</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#201612]">
      {/* Atmospheric background — matches auth page left panel */}
      <Image
        src="/hotels/hotel-image-03.jpg"
        alt=""
        fill
        priority
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(238,193,136,0.18),transparent_35%),linear-gradient(180deg,rgba(16,11,9,0.5),rgba(16,11,9,0.8))]" />

      <Suspense
        fallback={
          <div className="surface-panel relative z-10 flex w-full max-w-sm flex-col items-center gap-8 px-8 py-10 text-center">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
              <Spinner className="text-primary size-7" />
            </div>
          </div>
        }
      >
        <AuthCallbackContent />
      </Suspense>
    </main>
  );
}

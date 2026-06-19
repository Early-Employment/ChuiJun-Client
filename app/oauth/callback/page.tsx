"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOAuth } from "@themoment-team/datagsm-oauth-react";
import { instance } from "@/shared/api/instance";
import { Spinner } from "@/shared/ui/spinner";

function OAuthCallbackContent() {
  const { getCodeVerifier, clearVerifier } = useOAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestInitiated = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const verifier = getCodeVerifier();

    if (!code || !verifier) {
      router.replace("/signin");
      return;
    }

    if (requestInitiated.current) {
      return;
    }
    requestInitiated.current = true;

    instance
      .post("/auth/token", { code, codeVerifier: verifier })
      .then(() => {
        clearVerifier();
        router.replace("/");
      })
      .catch(() => {
        clearVerifier();
        router.replace("/signin");
      });
  }, [searchParams, getCodeVerifier, clearVerifier, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <Spinner />
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}

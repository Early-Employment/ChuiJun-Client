"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { instance } from "@/shared/api/instance";
import { setAccessToken } from "@/shared/api/access-token-store";
import { setMemberSession } from "@/shared/api/member-session-store";
import type { DgLoginResponse } from "@/shared/api/dg-login-response";
import { Spinner } from "@/shared/ui/spinner";

function OAuthCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const requestInitiated = useRef(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      router.replace("/signin");
      return;
    }

    if (requestInitiated.current) {
      return;
    }
    requestInitiated.current = true;

    const handleCallback = async () => {
      try {
        const { data } = await instance.get<DgLoginResponse>("/auth/dg/callback", {
          baseURL: "",
          params: { code, state },
        });
        setAccessToken(data.accessToken);
        setMemberSession(data.memberId, data.role);
        router.replace("/");
      } catch {
        router.replace("/signin");
      }
    };

    void handleCallback();
  }, [searchParams, router]);

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

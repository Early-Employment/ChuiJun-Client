import { createHash, randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

const DATAGSM_AUTHORIZE_URL = "https://oauth.authorization.datagsm.kr/v1/oauth/authorize";
const OAUTH_CALLBACK_PATH = "/oauth/callback";
const OAUTH_COOKIE_MAX_AGE_SECONDS = 60 * 5;

function createPkceCodeVerifier() {
  return randomBytes(64).toString("base64url");
}

function createPkceCodeChallenge(codeVerifier: string) {
  return createHash("sha256").update(codeVerifier).digest("base64url");
}

function createState() {
  return randomBytes(32).toString("base64url");
}

export async function GET(request: Request) {
  const clientId = process.env.NEXT_PUBLIC_DATAGSM_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { message: "NEXT_PUBLIC_DATAGSM_CLIENT_ID is not configured." },
      { status: 500 },
    );
  }

  const requestUrl = new URL(request.url);
  const redirectUri = new URL(OAUTH_CALLBACK_PATH, requestUrl.origin).toString();
  const state = createState();
  const codeVerifier = createPkceCodeVerifier();
  const codeChallenge = createPkceCodeChallenge(codeVerifier);

  const authorizeUrl = new URL(DATAGSM_AUTHORIZE_URL);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("state", state);
  authorizeUrl.searchParams.set("code_challenge", codeChallenge);
  authorizeUrl.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(authorizeUrl);

  response.cookies.set("dg_oauth_state", state, {
    httpOnly: true,
    maxAge: OAUTH_COOKIE_MAX_AGE_SECONDS,
    path: "/auth/dg",
    sameSite: "lax",
  });
  response.cookies.set("dg_oauth_code_verifier", codeVerifier, {
    httpOnly: true,
    maxAge: OAUTH_COOKIE_MAX_AGE_SECONDS,
    path: "/auth/dg",
    sameSite: "lax",
  });
  response.cookies.set("dg_oauth_redirect_uri", redirectUri, {
    httpOnly: true,
    maxAge: OAUTH_COOKIE_MAX_AGE_SECONDS,
    path: "/auth/dg",
    sameSite: "lax",
  });

  return response;
}

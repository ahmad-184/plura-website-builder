import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { googleAuth } from "@/lib/auth";
import { setSession } from "@/lib/session";
import { createAccount, createUser, getUserById } from "@/actions/user";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const codeVerifier = cookies().get("google_code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await googleAuth.validateAuthorizationCode(
      code,
      codeVerifier
    );
    const response = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const googleUser: GoogleUser = await response.json();

    const existing_user = await getUserById(googleUser.sub);

    if (existing_user) {
      await setSession(existing_user.id);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/agency",
        },
      });
    }

    const user = await createUser({
      name: googleUser.name,
      email: googleUser.email,
      avatarUrl: googleUser.picture,
      id: googleUser.sub,
    });

    if (!user)
      return new Response(null, {
        status: 500,
      });

    await createAccount({ type: "GOOGLE", userId: user.id, verified: true });

    await setSession(user?.id);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/agency",
      },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

export interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

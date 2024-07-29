import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { env } from "./env";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  let hostname = req.headers;

  const pathWidthSearchParams = `${url.pathname}${
    searchParams.length ? `?${searchParams}` : ""
  }`;

  // if subdomain exist
  const customSubdomain = hostname
    .get("host")
    ?.split(`${env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];

  if (customSubdomain)
    return NextResponse.rewrite(
      new URL(`/${customSubdomain}${pathWidthSearchParams}`, req.url)
    );

  if (url.pathname === "/sign-in" || url.pathname === "/sign-up")
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));

  if (
    url.pathname === "/" ||
    (url.pathname === "site" && url.host === env.NEXT_PUBLIC_DOMAIN)
  )
    return NextResponse.redirect(new URL("/site", req.url));

  if (
    url.pathname.startsWith("/agency") ||
    url.pathname.startsWith("/subaccount")
  )
    return NextResponse.rewrite(new URL(`${pathWidthSearchParams}`, req.url));
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

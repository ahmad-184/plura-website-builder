import { NextRequest, NextResponse } from "next/server";

export default function middlware(req: NextRequest) {
  const url = req.nextUrl;
  const searchParams = url.searchParams.toString();
  let hostname = req.headers;

  const pathWithSearchParams = `${url.pathname}${
    searchParams.length ? `?${searchParams}` : ""
  }`;

  // if subdomain exist
  const customSubdomain = hostname
    .get("host")
    ?.split(`${process.env.NEXT_PUBLIC_DOMAIN}`)
    .filter(Boolean)[0];

  if (customSubdomain)
    return NextResponse.rewrite(
      new URL(`/${customSubdomain}${pathWithSearchParams}`, req.url)
    );

  if (url.pathname === "/sign-in" || url.pathname === "/sign-up")
    return NextResponse.redirect(new URL(`/agency/sign-in`, req.url));

  if (
    url.pathname === "/" ||
    (url.pathname === "site" && url.host === process.env.NEXT_PUBLIC_DOMAIN)
  )
    return NextResponse.redirect(new URL("/site", req.url));

  if (
    url.pathname.startsWith("/agency") ||
    url.pathname.startsWith("/subaccount")
  )
    return NextResponse.rewrite(new URL(`${pathWithSearchParams}`, req.url));
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

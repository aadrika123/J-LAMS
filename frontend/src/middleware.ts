// import { NextResponse } from "next/server";
// import { NextRequest } from "next/server";
// // import data from "./json/protected_rroutes";

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   const tok3n = request.cookies.get("accesstoken")?.value;
//   // const user: any = request.cookies.get("loginData")
//   //   ? JSON.parse(request.cookies.get("loginData")?.value as any)
//   //   : {};

//   if (!tok3n) {
//     return NextResponse.redirect(new URL("/lams/auth/login", request.url));
//   }

//   if (
//     request.url === "http://localhost:5005/" ||
//     request.url === "http://localhost:5005/lams"
//   ) {
//     return NextResponse.redirect(new URL("/lams/auth/login", request.url));
//   }

//   // const paths = data.find(
//   //   (i: any) => i.user_type.toLowerCase() === user?.user_type?.toLowerCase()
//   // )?.paths;

//   // const u = paths?.find((i:any) => request.url.includes(i));

//   // if (!u) {
//   //   return NextResponse.redirect(new URL("/lams/404", request.url));
//   // }
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|johar.png|Juidco.png|Jhar_logo.png|favicon.ico|auth/login|404|employee/comingsoon|ems/comingsoon|supervisor/comingsoon).*)",
//     "/",
//     "/lams",
//   ],
// };









import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const tok3n = request.cookies.get("accesstoken")?.value;

  // Redirect to login if no access token
  if (!tok3n) {
    return NextResponse.redirect(new URL("/lams/auth/login", request.url));
  }

  // Redirect root and /lams to login
  if (
    request.url === "http://localhost:5005/" ||
    request.url === "http://localhost:5005/lams"
  ) {
    return NextResponse.redirect(new URL("/lams/auth/login", request.url));
  }

  // Generate CSP nonce
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64").slice(0, 16);

  // Set Content Security Policy header with nonce
  response.headers.set(
    "Content-Security-Policy",
    `
      default-src 'self';
      script-src 'self' 'nonce-${nonce}';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      connect-src *;
      font-src 'self';
      object-src 'none';
      base-uri 'self';
    `.replace(/\s{2,}/g, " ").trim()
  );

  // Pass nonce to client-side via custom header
  response.headers.set("x-nonce", nonce);

  return response;
}

// Matcher to protect most routes except static assets and auth/login
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|johar.png|Juidco.png|Jhar_logo.png|favicon.ico|auth/login|404|employee/comingsoon|ems/comingsoon|supervisor/comingsoon).*)",
    "/",
    "/lams",
  ],
};

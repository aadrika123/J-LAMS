import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import data from "./json/protected_rroutes";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const tok3n = request.cookies.get("accesstoken")?.value;
  const user: any = request.cookies.get("loginData")
    ? JSON.parse(request.cookies.get("loginData")?.value as any)
    : {};

  if (!tok3n) {
    return NextResponse.redirect(new URL("/lams/auth/login", request.url));
  }

  if (
    request.url === "http://localhost:5000/" ||
    request.url === "http://localhost:5000/lams"
  ) {
    return NextResponse.redirect(new URL("/lams/auth/login", request.url));
  }

  const paths = data.find(
    (i: any) => i.user_type.toLowerCase() === user?.user_type?.toLowerCase()
  )?.paths;

  const u = paths?.find((i:any) => request.url.includes(i));

  if (!u) {
    return NextResponse.redirect(new URL("/lams/404", request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|johar.png|Juidco.png|Jhar_logo.png|favicon.ico|auth/login|404|employee/comingsoon|ems/comingsoon|supervisor/comingsoon).*)",
    "/",
    "/lams",
  ],
};

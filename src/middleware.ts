import { auth } from "./auth";
import { NextResponse } from "next/server";
import { publicRoutes, roleBasedRoutes, type UserRole } from "./config/routes";

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!req.auth;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  const privateRoute = Object.keys(roleBasedRoutes).find((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (
    isLoggedIn &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (privateRoute) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
      );
    }

    const requiredRoles =
      roleBasedRoutes[privateRoute as keyof typeof roleBasedRoutes];
    const userRole = (session?.user?.role as UserRole) || "USER";

    if (!requiredRoles.includes(userRole)) {
      return NextResponse.redirect(new URL("/not-authorized", nextUrl));
    }
  }

  // If it's not a public route and not a defined private route, require authentication
  if (!isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

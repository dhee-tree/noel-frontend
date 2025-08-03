/**
 * Route configuration for the application
 * This file defines public routes and role-based access control
 */

export type UserRole = "USER" | "ADMIN" | "SUPPORT" | "MAINTAINER";

export const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/about",
  "/faq"
];

export const roleBasedRoutes: Record<string, UserRole[]> = {
  "/admin": ["ADMIN"],
  "/support": ["ADMIN", "SUPPORT"],
  "/maintenance": ["ADMIN", "MAINTAINER"],
  "/dashboard": ["USER", "ADMIN", "SUPPORT", "MAINTAINER"],
  "/groups": ["USER", "ADMIN", "SUPPORT", "MAINTAINER"],
};

export type RoutePermissions = typeof roleBasedRoutes;

/* eslint-disable @typescript-eslint/no-unused-vars */
// These imports are required for TypeScript module augmentation
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    isVerified?: boolean;
    user: {
      firstName?: string;
      lastName?: string;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    firstName?: string;
    lastName?: string;
    isVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    firstName?: string;
    lastName?: string;
    is_verified?: boolean;
    accessTokenExpires?: number;
    error?: string;
  }
}

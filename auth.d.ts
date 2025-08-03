import "next-auth";
import { DefaultSession } from "next-auth";

// Extend the built-in session, user, and JWT types
declare module "next-auth" {
  /**
   * The shape of the user object returned in the session.
   */
  interface Session {
    accessToken?: string;
    error?: string;
    user: {
      id?: string;
      role?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    } & Omit<DefaultSession["user"], "name">;
  }

  /**
   * The shape of the user object returned from the `authorize` callback.
   */
  export interface User {
    id?: string;
    role?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * The shape of the token that is dealt with inside the `callbacks`.
   */
  interface JWT {
    id?: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    accessToken?: string;
    refreshToken?: string;
    error?: string;
  }
}

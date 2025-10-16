import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { User as NextAuthUser } from "next-auth";

// Extend the User type to include is_verified
type User = NextAuthUser & {
  is_verified?: boolean;
};

/**
 * This function is for refreshing the access token when it expires.
 * @param token The expired token from the session.
 * @returns A new token with an updated access token.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/token/refresh/`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: token.refreshToken }),
    });

    // Check content type before parsing JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error(`Invalid content-type: ${contentType}`);
    }

    const refreshedTokens = await response.json();
    
    if (!response.ok) {
      // If token is blacklisted or invalid, user needs to re-login
      if (refreshedTokens.code === 'token_not_valid' || response.status === 401) {
        console.error("Refresh token invalid or blacklisted. User needs to re-authenticate.");
        return { ...token, error: "RefreshTokenExpired" };
      }
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access,
      accessTokenExpires: Date.now() + 15 * 60 * 1000,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const tokenResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/token/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!tokenResponse.ok) return null;
          const tokens = await tokenResponse.json();

          const userResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/me/`,
            {
              headers: { Authorization: `Bearer ${tokens.access}` },
            }
          );

          if (!userResponse.ok) return null;
          const user = await userResponse.json();

          return {
            ...user,
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
          };
        } catch (error) {
          console.error("Authorize Error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Handle session updates from client-side update() calls
      if (trigger === "update" && session) {
        // Merge updated session data into token
        if (session.user) {
          token.firstName = session.user.firstName ?? token.firstName;
          token.lastName = session.user.lastName ?? token.lastName;
          token.email = session.user.email ?? token.email;
          token.role = session.user.role ?? token.role;
        }
        if (session.isVerified !== undefined) {
          token.is_verified = session.isVerified;
        }
        return token;
      }

      if (account && user) {
        if (account.provider === "google") {
          try {
            const res = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google/`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_token: account.id_token }),
              }
            );
            if (!res.ok) throw new Error("Backend Google auth failed");

            const backendData = await res.json();

            token.accessToken = backendData.access;
            token.refreshToken = backendData.refresh;
            token.id = backendData.user.id;
            const nameParts = backendData.user.name.split(" ");
            token.firstName = nameParts[0];
            token.lastName = nameParts.slice(1).join(" ");
            token.email = backendData.user.email;
            token.role = backendData.user.role;
            token.is_verified = backendData.user.is_verified;
            token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
          } catch (error) {
            console.error("Google Sign-In Callback Error:", error);
            token.error = "GoogleSignInError";
          }
        }

        if (account.provider === "credentials") {
          token.accessToken = user.accessToken;
          token.refreshToken = user.refreshToken;
          token.id = user.id;
          token.firstName =
            (user as User).first_name || user.name?.split(" ")[0] || "";
          token.lastName =
            (user as User).last_name ||
            user.name?.split(" ").slice(1).join(" ") ||
            "";
          token.email = user.email;
          token.role = (user as User).role;
          token.is_verified = (user as User).is_verified;
          token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
        }
      }

      // Only attempt refresh if token is expired
      if (
        token.accessTokenExpires &&
        Date.now() < (token.accessTokenExpires as number)
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id ?? "",
          firstName: token.firstName,
          lastName: token.lastName,
          email: token.email ?? "",
          role: token.role,
          emailVerified: null,
        };
        session.isVerified = token.is_verified;
        session.accessToken = token.accessToken;
        session.error = token.error;
      }
      return session;
    },
  },
});

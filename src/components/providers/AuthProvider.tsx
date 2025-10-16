'use client';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import type { Session } from 'next-auth';

type Props = {
  children?: React.ReactNode;
  session?: Session | null;
};

function SessionErrorHandler({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  useEffect(() => {
    // If session has a refresh token error, force logout
    if (session?.error === "RefreshTokenExpired" || session?.error === "RefreshAccessTokenError") {
      console.warn("Session expired or token invalid. Redirecting to login...");
      signOut({ callbackUrl: '/login?error=session_expired' });
    }
  }, [session]);

  return <>{children}</>;
}

export const AuthProvider = ({ children, session }: Props) => {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={true}>
      <SessionErrorHandler>
        {children}
      </SessionErrorHandler>
    </SessionProvider>
  );
};

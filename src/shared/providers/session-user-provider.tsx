import React from "react";

import { verifySession } from "@/shared/lib/session";

import { UserContextProvider } from "../context/user-context";

type SessionUserProviderProps = {
  children: React.ReactNode;
};

export default async function SessionUserProvider({
  children,
}: SessionUserProviderProps) {
  const session = await verifySession();

  if (!session?.user) {
    throw new Error("SessionUserProvider requires authenticated session");
  }

  return (
    <UserContextProvider initialUser={session.user}>
      {children}
    </UserContextProvider>
  );
}



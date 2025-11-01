"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";

interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatarUrl?: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser, isLoaded: isUserLoaded } = useUser();
  const { isSignedIn } = useClerkAuth();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoaded) {
      setIsLoading(true);
      return;
    }

    if (isSignedIn && clerkUser) {
      // Fetch or create user in your database
      const syncUser = async () => {
        try {
          const response = await fetch("/api/users/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clerkId: clerkUser.id,
              email: clerkUser.primaryEmailAddress?.emailAddress,
              username:
                clerkUser.username ||
                clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0],
              fullName: clerkUser.fullName,
              avatarUrl: clerkUser.imageUrl,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to sync user");
          }

          const dbUserData = await response.json();
          setDbUser(dbUserData);
        } catch {
          setDbUser(null);
        } finally {
          setIsLoading(false);
        }
      };
      syncUser();
    } else {
      setDbUser(null);
      setIsLoading(false);
    }
  }, [clerkUser, isSignedIn, isUserLoaded]);

  const logout = async () => {
    // Clerk handles logout automatically with SignOutButton
    // This is mainly for the context API
    setDbUser(null);
  };

  const value: AuthContextType = {
    user: dbUser,
    token: clerkUser?.id || null,
    isLoading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

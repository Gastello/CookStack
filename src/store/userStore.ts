import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { signInUser, signOutUser, signUpNewUser } from "../auth/auth";
import { persist } from "zustand/middleware";

type UserState = {
  user: User | null;
  setUserData: (userData: Session | null) => void;
  signUpNewUser: (args: {
    email: string;
    password: string;
    username: string;
  }) => Promise<{
    success: boolean;
    data?: { user: User | null; session: Session | null };
    error?: string;
  }>;
  signInUser: (args: { email: string; password: string }) => Promise<{
    success: boolean;
    data?: { user: User | null; session: Session | null };
    error?: string;
  }>;
  signOutUser: () => Promise<{ success: boolean; error?: string }>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUserData: (userData) => set(() => ({ user: userData?.user })),
      signUpNewUser,
      signInUser,
      signOutUser,
    }),
    {
      name: "user-storage", // ключ у localStorage
    }
  )
);

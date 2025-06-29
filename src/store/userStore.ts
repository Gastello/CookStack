import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";
import { signInUser, signOutUser, signUpNewUser } from "../auth/auth";

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

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUserData: (userData) => set(() => ({ user: userData?.user })),
  signInUser: signInUser,
  signOutUser: signOutUser,
  signUpNewUser: signUpNewUser,
}));

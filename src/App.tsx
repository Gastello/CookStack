import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { createClient, type Session, type User } from "@supabase/supabase-js";
import { useEffect } from "react";
import { create } from "zustand";

type UserState = {
  user: Session | null;
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

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// SIGN UP
const signUpNewUser = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        display_name: username,
      },
    },
  });

  if (error) {
    console.error("User SignUp Error!", error);
    return { success: false, error: error.message };
  }
  return { success: true, data };
};

// SIGN IN
const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      console.error("User SignIn Error!", error);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (error: unknown) {
    console.error("User SignIn Error!", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// SIGN OUT
const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true };
};

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUserData: (userData) => set(() => ({ user: userData })),
  signInUser: signInUser,
  signOutUser: signOutUser,
  signUpNewUser: signUpNewUser,
}));

function App() {
  const { setUserData } = useUserStore();
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserData(session ?? null);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setUserData(session ?? null);
    });
  }, []);

  return <RouterProvider router={router} />;
}

export default App;

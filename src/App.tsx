import { RouterProvider } from "react-router-dom";
import router from "./routes/router";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { create } from "zustand";

type User = {
  name: string;
  mail: string;
};

type UserState = {
  user: User;
  setUserData: (userData: User) => void;
  signUpNewUser: (args: {
    email: string;
    password: string;
    username: string;
  }) => Promise<{ success: boolean; data?: any; error?: any }>;
  signInUser: (args: {
    email: string;
    password: string;
  }) => Promise<{ success: boolean; data?: any; error?: any }>;
  signOutUser: () => Promise<{ success: boolean; error?: any }>;
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

// SIGN OUT
const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true };
};

// SIGN IN
const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ success: boolean; data?: any; error?: any }> => {
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
  } catch (error: any) {
    console.error("User SignIn Error!", error);
    return { success: false, error: error?.message || "Unknown error" };
  }
};

export const useUserStore = create<UserState>((set) => ({
  user: { name: "", mail: "" },
  setUserData: (userData) => set(() => ({ user: userData })),
  signInUser: signInUser,
  signOutUser: signOutUser,
  signUpNewUser: signUpNewUser,
}));

function App() {
  const [session, setSession] = useState(undefined);
  
  useEffect(() => {
    console.log("session", session);
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return <RouterProvider router={router} />;
}

export default App;

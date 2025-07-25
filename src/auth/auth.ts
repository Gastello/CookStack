import { createClient } from "@supabase/supabase-js";
import { useUserStore } from "../store/userStore";
import { useEffect } from "react";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// SIGN UP
export const signUpNewUser = async ({
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
    return { success: false, error: error.message };
  }
  return { success: true, data };
};

// SIGN IN
export const signInUser = async ({
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
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// SIGN OUT
export const signOutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true };
};

export function useUserAuth() {
  const { setUserData } = useUserStore();

  useEffect(() => {
    // Ініціалізація сесії
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) console.error("getSession error:", error.message);
      setUserData(data?.session ?? null);
    };
    init();

    // Підписка на зміни сесії
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserData(session ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe(); // очищення
    };
  }, []);
}

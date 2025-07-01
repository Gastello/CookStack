import { create } from "zustand";
import { supabase } from "../auth/auth";

export type TagType = {
  id: string;
  text: string;
  color: string;
};

type TagsState = {
  tags: TagType[];
  loading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  addTag: (text: string, color: string) => Promise<void>;
  removeTag: (id: string) => Promise<void>;
  updateTag: (tag: TagType) => Promise<void>;
  getTagById: (id: string) => TagType | undefined;
};

export const useTagsStore = create<TagsState>((set, get) => ({
  tags: [],
  loading: false,
  error: null,

  fetchTags: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("tags")
        .select("id, text, color")
        .eq("user_id", user.id)
        .order("text", { ascending: true });

      if (error) throw error;

      set({ tags: data ?? [], loading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
    }
  },

  addTag: async (text, color) => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("tags")
        .insert([{ user_id: user.id, text, color }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ tags: [...state.tags, data], loading: false }));
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
    }
  },

  removeTag: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.from("tags").delete().eq("id", id);
      if (error) throw error;

      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
        loading: false,
      }));
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
    }
  },

  updateTag: async (tag) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from("tags")
        .update({ text: tag.text, color: tag.color })
        .eq("id", tag.id);

      if (error) throw error;

      set((state) => ({
        tags: state.tags.map((t) => (t.id === tag.id ? tag : t)),
        loading: false,
      }));
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : String(error),
        loading: false,
      });
    }
  },

  getTagById: (id: string) => {
    const { tags } = get();
    return tags.find((tag) => tag.id === id);
  },
}));

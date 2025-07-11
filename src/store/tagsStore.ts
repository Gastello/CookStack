import { create } from "zustand";
import { supabase } from "../auth/auth";
import { useDishesStore } from "./dishedStore";

export type TagType = {
  id: string;
  text: string;
  color: string;
};

type TagFromRPC = {
  id: string;
  text: string;
  color: string;
};

function isTagFromRPC(obj: unknown): obj is TagFromRPC {
  if (typeof obj !== "object" || obj === null) return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.text === "string" &&
    typeof o.color === "string"
  );
}

type TagsState = {
  tags: TagType[];
  loading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  addTag: (
    text: string,
    color: string
  ) => Promise<{ success: boolean; data: string | number }>;
  removeTag: (id: string) => Promise<void>;
  updateTag: (tag: TagType) => Promise<void>;
  getTagById: (id: string) => TagType | undefined;
  linkTagsToDish: (dishId: string, tagIds: string[]) => Promise<void>;
  deleteUnusedTags: () => Promise<void>;
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

      const { data, error } = await supabase.rpc("get_all_tags", {
        p_user_id: user.id,
      });

      if (error) throw error;
      if (!Array.isArray(data)) throw new Error("Invalid response format");

      const tags: TagType[] = data.filter(isTagFromRPC);

      set({ tags, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },

  addTag: async (
    text: string,
    color: string
  ): Promise<{ success: boolean; data: string | number }> => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("create_tag", {
        p_user_id: user.id,
        p_text: text,
        p_color: color,
      });

      if (error) throw error;

      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("Empty response from create_tag");
      }

      const firstTag = data[0];
      if (!isTagFromRPC(firstTag)) throw new Error("Invalid tag format");

      const newTag: TagType = {
        id: firstTag.id,
        text: firstTag.text,
        color: firstTag.color,
      };

      set((state) => ({
        tags: [...state.tags, newTag],
        loading: false,
      }));

      // Повертаємо успіх і id створеного тега
      return { success: true, data: newTag.id };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      set({
        error: errorMessage,
        loading: false,
      });

      // Повертаємо провал і текст помилки
      return { success: false, data: errorMessage };
    }
  },

  removeTag: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.rpc("delete_tag", {
        p_tag_id: id,
      });
      if (error) throw error;
      if (!data || data === 0) {
        throw new Error("Tag not found or not deleted");
      }

      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
        loading: false,
      }));
      await get().deleteUnusedTags();
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },

  updateTag: async (tag) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase.rpc("update_tag", {
        p_tag_id: tag.id,
        p_text: tag.text,
        p_color: tag.color,
      });

      if (error) throw error;
      if (!data || !Array.isArray(data) || data.length === 0) {
        throw new Error("Failed to update tag or empty response");
      }

      const updatedTag = data[0] as TagType;

      set((state) => ({
        tags: state.tags.map((t) => (t.id === updatedTag.id ? updatedTag : t)),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },

  getTagById: (id: string) => {
    const { tags } = get();
    return tags.find((tag) => tag.id === id);
  },

  linkTagsToDish: async (dishId: string, tagIds: string[]) => {
    const { tags } = get();
    const { dishes, updateDish } = useDishesStore.getState();

    const { data: existingLinks, error: fetchError } = await supabase
      .from("dish_tags")
      .select("tag_id")
      .eq("dish_id", dishId);
    if (fetchError) throw fetchError;

    const existingTagIds = new Set((existingLinks ?? []).map((r) => r.tag_id));

    const toInsert = tagIds
      .filter((id) => !existingTagIds.has(id))
      .map((id) => ({ dish_id: dishId, tag_id: id }));

    if (toInsert.length === 0) {
      console.log("✅ Nothing to insert");
      return;
    }

    const { error: insertError } = await supabase
      .from("dish_tags")
      .insert(toInsert);
    if (insertError) throw insertError;

    console.log(`✅ Inserted ${toInsert.length} tag(s) into dish_tags.`);

    const newTags: TagType[] = tagIds
      .filter((id) => !existingTagIds.has(id))
      .map((id) => tags.find((tag) => tag.id === id))
      .filter((t): t is TagType => !!t);

    const updatedDishes = dishes.map((dish) => {
      if (dish.id !== dishId) return dish;
      const existing = dish.tags ?? [];
      return { ...dish, tags: [...existing, ...newTags] };
    });

    useDishesStore.setState({ dishes: updatedDishes });

    const updated = updatedDishes.find((d) => d.id === dishId);
    if (updated) {
      await updateDish(updated);
    }

    console.log("✅ Tags updated in local state.");
  },
  deleteUnusedTags: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("delete_unused_tags", {
        p_user_id: user.id,
      });

      if (error) throw error;

      console.log(`✅ Deleted ${data} unused tags`);
      await get().fetchTags(); // оновити локальний список
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },
}));

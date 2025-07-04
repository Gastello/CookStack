import { create } from "zustand";
import { supabase } from "../auth/auth";
import { useDishesStore } from "./dishedStore";

export type TagType = {
  id: string;
  text: string;
  color: string;
};

// Сиро тип із RPC, який повертає Supabase
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
  addTag: (text: string, color: string) => Promise<void>;
  removeTag: (id: string) => Promise<void>;
  updateTag: (tag: TagType) => Promise<void>;
  getTagById: (id: string) => TagType | undefined;
  linkTagsToDish: (dishId: string, tagIds: string[]) => Promise<void>;
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

  addTag: async (text, color) => {
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
      if (!isTagFromRPC(data)) throw new Error("Invalid tag format");

      const newTag: TagType = {
        id: data.id,
        text: data.text,
        color: data.color,
      };

      set((state) => ({
        tags: [...state.tags, newTag],
        loading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },

  removeTag: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.rpc("delete_tag", { p_tag_id: id });
      if (error) throw error;

      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
        loading: false,
      }));
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

      // data повертає масив з одним оновленим тегом (через RETURNS TABLE)
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

    const newTags = tagIds
      .filter((id) => !existingTagIds.has(id))
      .map((id) => {
        const t = tags.find((tag) => tag.id === id);
        return t ? { tag_id: t.id, text: t.text, color: t.color } : null;
      })
      .filter((t): t is { tag_id: string; text: string; color: string } => !!t);

    const updatedDishes = dishes.map((dish) => {
      if (dish.id !== dishId) return dish;
      const existing = dish.tags ?? [];
      return { ...dish, tags: [...existing, ...newTags] };
    });

    useDishesStore.setState({ dishes: updatedDishes });

    const updated = updatedDishes.find((d) => d.id === dishId);
    if (updated) {
      updateDish(updated);
    }

    console.log("✅ Tags updated in local state.");
  },
}));

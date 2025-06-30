import { create } from "zustand";
import { supabase } from "../auth/auth";

export type TagType = {
  tag_id: string;
  text: string;
  color: string;
};

export type DishType = {
  id: string;
  name: string;
  time: number;
  calories: number;
  isFav: boolean;
  tags: TagType[];
  img?: string;
};

type DishesState = {
  dishes: DishType[];
  loading: boolean;
  error: string | null;
  fetchDishes: () => Promise<void>;
  addDish: (dish: Omit<DishType, "id">) => Promise<void>;
  removeDish: (id: string) => Promise<void>;
  updateDish: (dish: DishType) => Promise<void>;
  makeFav: (id: string) => Promise<void>;
};

export const useDishesStore = create<DishesState>((set, get) => ({
  dishes: [],
  loading: false,
  error: null,

  fetchDishes: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("dishes")
        .select(
          `
          id,
          name,
          time,
          calories,
          is_fav,
          img_url,
          dish_tags (
            tag_id,
            tags (
              text,
              color
            )
          )
        `
        )
        .eq("user_id", user.id);

      if (error) throw error;

      const mapped = mapSupabaseDataToDishType(data ?? []);
      set({ dishes: mapped, loading: false });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, loading: false });
    }
  },

  addDish: async (dish) => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // 1. Insert dish without tags first (tags треба додавати окремо)
      const { data: newDishData, error: insertError } = await supabase
        .from("dishes")
        .insert({
          user_id: user.id,
          name: dish.name,
          time: dish.time,
          calories: dish.calories,
          is_fav: dish.isFav,
          img_url: dish.img,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // 2. Вставка тегів у dish_tags
      if (dish.tags.length > 0) {
        const dishTagsRows = dish.tags.map((tag) => ({
          dish_id: newDishData.id,
          tag_id: tag.tag_id,
        }));
        const { error: tagInsertError } = await supabase
          .from("dish_tags")
          .insert(dishTagsRows);
        if (tagInsertError) throw tagInsertError;
      }

      // 3. Оновити локальний стан - додати нову страву з тегами
      const newDish: DishType = {
        id: newDishData.id,
        name: newDishData.name,
        time: newDishData.time,
        calories: newDishData.calories,
        isFav: newDishData.is_fav,
        img: newDishData.img_url ?? undefined,
        tags: dish.tags,
      };

      set((state) => ({ dishes: [...state.dishes, newDish], loading: false }));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, loading: false });
    }
  },

  removeDish: async (id) => {
    set({ loading: true, error: null });
    try {
      // Видаляємо блюдо - через ON DELETE CASCADE dish_tags видаляться автоматично
      const { error } = await supabase.from("dishes").delete().eq("id", id);
      if (error) throw error;

      // Оновлюємо локальний стан - прибираємо блюдо
      set((state) => ({
        dishes: state.dishes.filter((dish) => dish.id !== id),
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, loading: false });
    }
  },

  updateDish: async (dish) => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // 1. Оновлюємо поля страви (без тегів)
      const { error: updateError } = await supabase
        .from("dishes")
        .update({
          name: dish.name,
          time: dish.time,
          calories: dish.calories,
          is_fav: dish.isFav,
          img_url: dish.img,
        })
        .eq("id", dish.id)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // 2. Оновлюємо теги:
      // Видаляємо існуючі зв’язки
      const { error: deleteTagsError } = await supabase
        .from("dish_tags")
        .delete()
        .eq("dish_id", dish.id);

      if (deleteTagsError) throw deleteTagsError;

      // Додаємо нові зв’язки
      if (dish.tags.length > 0) {
        const dishTagsRows = dish.tags.map((tag) => ({
          dish_id: dish.id,
          tag_id: tag.tag_id,
        }));

        const { error: insertTagsError } = await supabase
          .from("dish_tags")
          .insert(dishTagsRows);

        if (insertTagsError) throw insertTagsError;
      }

      // 3. Оновлюємо локальний стан - замінюємо блюдо
      set((state) => ({
        dishes: state.dishes.map((d) => (d.id === dish.id ? dish : d)),
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, loading: false });
    }
  },

  makeFav: async (id) => {
    set({ loading: true, error: null });
    try {
      const dish = get().dishes.find((d) => d.id === id);
      if (!dish) throw new Error("Dish not found");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const newFav = !dish.isFav;

      const { error } = await supabase
        .from("dishes")
        .update({ is_fav: newFav })
        .eq("id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      set((state) => ({
        dishes: state.dishes.map((d) =>
          d.id === id ? { ...d, isFav: newFav } : d
        ),
        loading: false,
      }));
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      set({ error: errorMessage, loading: false });
    }
  },
}));

type SupabaseDishTag = {
  tag_id: string;
  tags: {
    text: string;
    color: string;
  }[];
};

type SupabaseDish = {
  id: string;
  name: string;
  time: number;
  calories: number;
  is_fav: boolean;
  img_url?: string;
  dish_tags: SupabaseDishTag[];
};

function mapSupabaseDataToDishType(supabaseDishes: SupabaseDish[]): DishType[] {
  return supabaseDishes.map((dish) => ({
    id: dish.id,
    name: dish.name,
    time: dish.time,
    calories: dish.calories,
    isFav: dish.is_fav,
    img: dish.img_url ?? undefined,
    tags: dish.dish_tags.map((dt) => ({
      tag_id: dt.tag_id,
      text: Array.isArray(dt.tags)
        ? dt.tags[0]?.text ?? ""
        : (dt.tags as { text?: string; color?: string })?.text ?? "",
      color: Array.isArray(dt.tags)
        ? dt.tags[0]?.color ?? ""
        : (dt.tags as { text?: string; color?: string })?.color ?? "",
    })),
  }));
}

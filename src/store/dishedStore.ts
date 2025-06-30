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
    // TODO: реалізуй додавання через supabase.insert()
  },

  removeDish: async (id) => {
    // TODO: реалізуй видалення через supabase.delete()
  },

  updateDish: async (dish) => {
    // TODO: реалізуй оновлення через supabase.update()
  },

  makeFav: async (id) => {
    // TODO: реалізуй оновлення через supabase.update()
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

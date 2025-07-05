import { create } from "zustand";
import { supabase } from "../auth/auth";
import type { TagType } from "./tagsStore";

export type DishType = {
  id: string;
  name: string;
  time: number;
  calories: number;
  isFav: boolean;
  description?: string;
  img?: string;
  tags: TagType[];
};

type DishesState = {
  dishes: DishType[];
  loading: boolean;
  error: string | null;

  fetchDishes: () => Promise<void>;
  addDish: () => Promise<void>;
  updateDish: (dish: DishType) => Promise<void>;
  removeDish: (id: string) => Promise<void>;
  makeFav: (id: string) => Promise<void>;

  getDishById: (id: string) => DishType | undefined;
};

type RPCDishCommon = {
  name: string;
  time: number;
  calories: number;
  is_fav: boolean;
  description: string | null;
  img_url: string | null;
  tags: Array<{
    tag_id: string;
    text: string;
    color: string;
  }>;
};

type RPCDishWithId = RPCDishCommon & { id: string };
type RPCDishWithDishId = RPCDishCommon & { dish_id: string };

function mapRPCDishesToDishType(
  data: Array<RPCDishWithId | RPCDishWithDishId>
): DishType[] {
  return data.map((dish) => ({
    id: "id" in dish ? dish.id : dish.dish_id,
    name: dish.name,
    time: dish.time,
    calories: dish.calories,
    isFav: dish.is_fav,
    description: dish.description ?? undefined,
    img: dish.img_url ?? undefined,
    tags: dish.tags.map(
      (t): TagType => ({
        id: t.tag_id,
        text: t.text,
        color: t.color,
      })
    ),
  }));
}

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

      const { data, error } = await supabase.rpc("get_all_dishes_with_tags", {
        p_user_id: user.id,
      });
      if (error) throw error;
      if (!data) throw new Error("No dishes returned");

      const dishes: DishType[] = mapRPCDishesToDishType(data);

      set({ dishes, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },

  addDish: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc(
        "create_or_update_dish_with_tags",
        {
          p_dish_id: null,
          p_user_id: user.id,
          p_name: "New dish",
          p_time: 0,
          p_calories: 0,
          p_is_fav: false,
          p_description: null,
          p_img_url: null,
          p_tag_ids: [],
        }
      );
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Failed to create dish");

      const newDish = mapRPCDishesToDishType(data)[0];

      set((state) => ({
        dishes: [...state.dishes, newDish],
        loading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },

  updateDish: async (dish) => {
    // Валідація required полів
    if (!dish.name.trim()) {
      throw new Error("Name cannot be empty");
    }
    if (!dish.time || isNaN(dish.time)) {
      throw new Error("Time must be a valid number greater than zero");
    }
    if (!dish.calories || isNaN(dish.calories)) {
      throw new Error("Calories must be a valid number greater than zero");
    }
    set({ loading: true, error: null });

    try {
      const currentDish = get().dishes.find((d) => d.id === dish.id);

      const rawImg = dish.img?.trim();
      const isValidImg = rawImg && isValidUrl(rawImg);
      const finalImg = isValidImg ? rawImg : currentDish?.img ?? null;

      if (currentDish) {
        const unchanged =
          currentDish.name === dish.name &&
          currentDish.time === dish.time &&
          currentDish.calories === dish.calories &&
          currentDish.isFav === dish.isFav &&
          currentDish.description === dish.description &&
          currentDish.img === finalImg &&
          JSON.stringify(currentDish.tags.map((t) => t.id).sort()) ===
            JSON.stringify(dish.tags.map((t) => t.id).sort());

        if (unchanged) {
          set({ loading: false });
          console.log("Dish already up to date");
          return;
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const tagIds = dish.tags.map((t) => t.id);

      const { data, error } = await supabase.rpc(
        "create_or_update_dish_with_tags",
        {
          p_dish_id: dish.id,
          p_user_id: user.id,
          p_name: dish.name,
          p_time: dish.time,
          p_calories: dish.calories,
          p_is_fav: dish.isFav,
          p_description: dish.description ?? null,
          p_img_url: finalImg,
          p_tag_ids: tagIds,
        }
      );

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Failed to update dish");

      const updatedDish = mapRPCDishesToDishType(data)[0];

      set((state) => ({
        dishes: state.dishes.map((d) =>
          d.id === updatedDish.id ? updatedDish : d
        ),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },

  removeDish: async (id) => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.rpc("delete_dish_with_tags", {
        p_dish_id: id,
        p_user_id: user.id,
      });
      if (error) throw error;

      set((state) => ({
        dishes: state.dishes.filter((d) => d.id !== id),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
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
      const tagIds = dish.tags.map((t) => t.id);

      const { data, error } = await supabase.rpc(
        "create_or_update_dish_with_tags",
        {
          p_dish_id: dish.id,
          p_user_id: user.id,
          p_name: dish.name,
          p_time: dish.time,
          p_calories: dish.calories,
          p_is_fav: newFav,
          p_description: dish.description ?? null,
          p_img_url: dish.img ?? null,
          p_tag_ids: tagIds,
        }
      );
      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Failed to toggle favorite");

      const updatedDish = mapRPCDishesToDishType(data)[0];

      set((state) => ({
        dishes: state.dishes
          .map((d) => (d.id === id ? updatedDish : d))
          .sort((a, b) => Number(b.isFav) - Number(a.isFav)),
        loading: false,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },

  getDishById: (id) => {
    const { dishes } = get();
    return dishes.find((d) => d.id === id);
  },
}));

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

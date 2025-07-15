import { create } from "zustand";
import { supabase } from "../auth/auth";
import type { TagType } from "./tagsStore";
import { useToastStore } from "./toastStore";

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

const addToast = useToastStore.getState().addToast;

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

type FilterState = {
  filter: {
    search?: string;
    time?: number | null;
    calories?: number | null;
    sortBy: "name" | "time" | "calories";
    sortOrder: "asc" | "desc";
  };
  setFilter: (newFilter: Partial<FilterState["filter"]>) => void;
  getFiltredDishes: () => DishType[];
};

export const useDishesStore = create<DishesState & FilterState>((set, get) => ({
  dishes: [],
  loading: false,
  error: null,

  fetchDishes: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        addToast(false, "User not authenticated");
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.rpc("get_all_dishes_with_tags", {
        p_user_id: user.id,
      });
      if (error) throw error;
      if (!data) throw new Error("No dishes returned");

      const dishes: DishType[] = mapRPCDishesToDishType(data).sort(
        (a, b) => Number(b.isFav) - Number(a.isFav)
      );

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

      if (!user) throw new Error("NOT_AUTHENTICATED");

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

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error("EMPTY_RESULT");

      const newDish = mapRPCDishesToDishType(data)[0];

      addToast(true, "New dish created!");
      set((state) => ({
        dishes: [...state.dishes, newDish],
        loading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      const toastMap: Record<string, string> = {
        NOT_AUTHENTICATED: "Please log in to continue.",
        EMPTY_RESULT: "Failed to create dish.",
      };

      addToast(false, toastMap[message] || "Something went wrong.");
      set({
        error: message,
        loading: false,
      });
    }
  },

  updateDish: async (dish) => {
    const validationErrors: Record<string, boolean> = {
      NAME_REQUIRED: !dish.name.trim(),
      TIME_INVALID: !dish.time || isNaN(dish.time),
      CALORIES_INVALID: !dish.calories || isNaN(dish.calories),
    };

    const firstError = Object.entries(validationErrors).find(
      ([, invalid]) => invalid
    );
    if (firstError) {
      const [code] = firstError;
      const toastMap: Record<string, string> = {
        NAME_REQUIRED: "Name cannot be empty.",
        TIME_INVALID: "Time must be a valid number greater than zero.",
        CALORIES_INVALID: "Calories must be a valid number greater than zero.",
      };
      addToast(false, toastMap[code]);
      throw new Error(code);
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
          addToast(false, "Dish already up to date!");
          return;
        }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("NOT_AUTHENTICATED");

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

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error("EMPTY_RESULT");

      const updatedDish = mapRPCDishesToDishType(data)[0];

      set((state) => ({
        dishes: state.dishes.map((d) =>
          d.id === updatedDish.id ? updatedDish : d
        ),
        loading: false,
      }));
      addToast(true, "Dish updated successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      const toastMap: Record<string, string> = {
        NOT_AUTHENTICATED: "Please log in to continue.",
        EMPTY_RESULT: "Failed to update dish.",
      };

      addToast(false, toastMap[message] || "Something went wrong.");
      set({ error: message, loading: false });
    }
  },

  removeDish: async (id) => {
    set({ loading: true, error: null });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("NOT_AUTHENTICATED");

      const { error } = await supabase.rpc("delete_dish_with_tags", {
        p_dish_id: id,
        p_user_id: user.id,
      });

      if (error) throw new Error(error.message);

      addToast(true, "Dish deleted successfully");

      set((state) => ({
        dishes: state.dishes.filter((d) => d.id !== id),
        loading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      const toastMap: Record<string, string> = {
        NOT_AUTHENTICATED: "Please log in to continue.",
      };

      addToast(false, toastMap[message] || "Failed to delete dish.");
      set({ error: message, loading: false });
    }
  },

  makeFav: async (id) => {
    set({ loading: true, error: null });

    try {
      const dish = get().dishes.find((d) => d.id === id);
      if (!dish) throw new Error("DISH_NOT_FOUND");

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("NOT_AUTHENTICATED");

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

      if (error) throw new Error(error.message);
      if (!data || data.length === 0) throw new Error("EMPTY_RESULT");

      const updatedDish = mapRPCDishesToDishType(data)[0];

      addToast(
        true,
        newFav
          ? "Yum! This dish is now in your favorites."
          : "Removed from favorites."
      );
      set((state) => ({
        dishes: state.dishes
          .map((d) => (d.id === id ? updatedDish : d))
          .sort((a, b) => Number(b.isFav) - Number(a.isFav)),
        loading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      const toastMap: Record<string, string> = {
        DISH_NOT_FOUND: "Dish not found.",
        NOT_AUTHENTICATED: "Please log in to continue.",
        EMPTY_RESULT: "Failed to toggle favorite.",
      };

      addToast(false, toastMap[message] || "Something went wrong.");
      set({
        error: message,
        loading: false,
      });
    }
  },

  getDishById: (id) => {
    const { dishes } = get();
    return dishes.find((d) => d.id === id);
  },

  filter: {
    search: "",
    time: null,
    calories: null,
    sortBy: "name",
    sortOrder: "asc",
  },

  setFilter: (newFilter) => {
    set((state) => {
      const merged = { ...state.filter, ...newFilter };

      // Автоматично очищаємо пусті значення
      if (merged.search?.trim() === "") delete merged.search;
      if (
        merged.time === 0 ||
        (typeof merged.time === "number" && isNaN(merged.time))
      )
        delete merged.time;

      if (
        merged.calories === 0 ||
        (typeof merged.calories === "number" && isNaN(merged.calories))
      )
        delete merged.calories;

      return { filter: merged };
    });
  },

  getFiltredDishes: () => {
    const { dishes, filter } = get();
    let result = [...dishes];

    const { search, time, calories, sortBy, sortOrder } = filter;

    // search
    if (search && search.trim() !== "") {
      result = result.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // time
    if (time != null) {
      result = result.filter((d) => d.time <= time);
    }

    // calories
    if (calories != null) {
      result = result.filter((d) => d.calories <= calories);
    }

    // sort
    result.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
      if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    // isFav виводити перші
    result.sort((a, b) => Number(b.isFav) - Number(a.isFav));

    return result;
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

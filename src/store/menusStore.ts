import { create } from "zustand";
import { supabase } from "../auth/auth";
import { useToastStore } from "./toastStore";

export type MenuItemType = {
  id: string;
  type: string;
  value: string;
  position: number;
};

export type MenuType = {
  menu_id: string;
  name: string;
  description: string | null;
  time: number;
  calories: number;
  is_fav: boolean;
  items: MenuItemType[];
};

type MenusState = {
  menus: MenuType[];
  loading: boolean;
  error: string | null;
  filter: {
    showOnlyFavs: boolean;
    maxCalories: number | null;
    maxTime: number | null;
    search: string;
  };

  fetchMenus: () => Promise<void>;
  addMenu: () => Promise<void>;
  updateMenu: (menu: MenuType) => Promise<void>;
  removeMenu: (menu_id: string) => Promise<void>;
  makeFav: (menu_id: string) => Promise<void>;
  getMenuById: (id: string) => MenuType | undefined;
  getFiltredMenus: () => MenuType[];
  setFilter: (partial: Partial<MenusState["filter"]>) => void;
};

const addToast = useToastStore.getState().addToast;

function mapRPCMenusToMenuType(data: any[]): MenuType[] {
  return data.map((m) => ({
    menu_id: m.out_menu_id ?? m.id,
    name: m.out_menu_name ?? m.name,
    description: m.out_menu_description ?? m.description,
    time: m.out_menu_time ?? m.time,
    calories: m.out_menu_calories ?? m.calories,
    is_fav: m.out_menu_is_fav ?? m.is_fav ?? false,
    items: (m.out_items ?? m.items ?? []).map((mi: any) => ({
      id: mi.id,
      type: mi.type,
      value: mi.value,
      position: mi.position,
    })),
  }));
}

export const useMenusStore = create<MenusState>((set, get) => ({
  menus: [],
  loading: false,
  error: null,

  filter: {
    showOnlyFavs: false,
    maxCalories: null,
    maxTime: null,
    search: "",
  },

  setFilter: (partial) => {
    set((state) => ({
      filter: { ...state.filter, ...partial },
    }));
  },

  getFiltredMenus: () => {
    const { menus, filter } = get();
    return menus.filter((menu) => {
      const matchFav = !filter.showOnlyFavs || menu.is_fav;
      const matchCalories =
        filter.maxCalories === null || menu.calories <= filter.maxCalories;
      const matchTime =
        filter.maxTime === null || menu.time <= filter.maxTime;
      const matchSearch =
        filter.search.trim() === "" ||
        menu.name.toLowerCase().includes(filter.search.trim().toLowerCase());

      return matchFav && matchCalories && matchTime && matchSearch;
    });
  },

  fetchMenus: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("NOT_AUTHENTICATED");

      const { data, error } = await supabase.rpc("get_all_menus_for_user", {
        p_user_id: user.id,
      });

      if (error) throw error;
      if (!data) throw new Error("NO_MENUS");

      const menus = mapRPCMenusToMenuType(data);
      set({ menus, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      addToast(false, message);
      set({ error: message, loading: false });
    }
  },

  addMenu: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("NOT_AUTHENTICATED");

      const { data, error } = await supabase.rpc("create_or_update_menu_with_items", {
        p_menu_id: null,
        p_user_id: user.id,
        p_menu_name: "New menu",
        p_menu_description: null,
        p_items: JSON.stringify([]),
      });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("EMPTY_RESULT");

      const newMenu = mapRPCMenusToMenuType(data)[0];
      addToast(true, "Menu created!");

      set((state) => ({
        menus: [...state.menus, newMenu],
        loading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      addToast(false, message);
      set({ error: message, loading: false });
    }
  },

  updateMenu: async (menu) => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("NOT_AUTHENTICATED");

      const itemsJson = JSON.stringify(
        menu.items.map((i) => ({
          type: i.type,
          value: i.value,
          position: i.position,
        }))
      );

      const { data, error } = await supabase.rpc("create_or_update_menu_with_items", {
        p_menu_id: menu.menu_id,
        p_user_id: user.id,
        p_menu_name: menu.name,
        p_menu_description: menu.description,
        p_items: itemsJson,
      });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("EMPTY_RESULT");

      const updatedMenu = mapRPCMenusToMenuType(data)[0];

      set((state) => ({
        menus: state.menus.map((m) =>
          m.menu_id === updatedMenu.menu_id ? updatedMenu : m
        ),
        loading: false,
      }));

      addToast(true, "Menu updated");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      addToast(false, message);
      set({ error: message, loading: false });
    }
  },

  removeMenu: async (menu_id) => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("NOT_AUTHENTICATED");

      const { error } = await supabase.rpc("delete_menu_with_items", {
        p_menu_id: menu_id,
        p_user_id: user.id,
      });

      if (error) throw error;

      set((state) => ({
        menus: state.menus.filter((m) => m.menu_id !== menu_id),
        loading: false,
      }));

      addToast(true, "Menu deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      addToast(false, message);
      set({ error: message, loading: false });
    }
  },

  makeFav: async (menu_id) => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("NOT_AUTHENTICATED");

      const { error } = await supabase.rpc("toggle_menu_fav", {
        p_menu_id: menu_id,
        p_user_id: user.id,
      });

      if (error) throw error;

      set((state) => ({
        menus: state.menus.map((m) =>
          m.menu_id === menu_id ? { ...m, is_fav: !m.is_fav } : m
        ),
        loading: false,
      }));

      addToast(true, "Favorite toggled");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      addToast(false, message);
      set({ error: message, loading: false });
    }
  },

  getMenuById: (id) => {
    return get().menus.find((m) => m.menu_id === id);
  },
}));

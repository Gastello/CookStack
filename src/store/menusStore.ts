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
  items: MenuItemType[];
};

type MenusState = {
  menus: MenuType[];
  loading: boolean;
  error: string | null;

  fetchMenus: () => Promise<void>;
  addMenu: () => Promise<void>;
  updateMenu: (menu: MenuType) => Promise<void>;
  removeMenu: (menu_id: string) => Promise<void>;

  getMenuById: (id: string) => MenuType | undefined;
};

const addToast = useToastStore.getState().addToast;

function mapRPCMenusToMenuType(data: any[]): MenuType[] {
  return data.map((m) => ({
    menu_id: m.menu_id,
    name: m.name,
    description: m.description,
    time: m.time,
    calories: m.calories,
    items: (m.items ?? []).map((mi: any) => ({
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

  fetchMenus: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        addToast(false, "User not authenticated");
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase.rpc("get_all_menus_for_user", {
        p_user_id: user.id,
      });

      if (error) throw error;
      if (!data) throw new Error("No menus returned");

      // note: get_all_menus_for_user does NOT return items, so 
      // optionally fetch each menu items later via get_menu_with_items, or
      // add a new RPC that returns menus with items

      // For now let's fetch menus without items
      const menus: MenuType[] = (data as any[]).map((m) => ({
        menu_id: m.id,
        name: m.name,
        description: m.description,
        time: m.time,
        calories: m.calories,
        items: [],
      }));

      set({ menus, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : String(err),
        loading: false,
      });
    }
  },

  addMenu: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("NOT_AUTHENTICATED");

      // створюємо порожнє меню з дефолтними значеннями і без item-ів
      const { data, error } = await supabase.rpc("create_or_update_menu_with_items", {
        p_menu_id: null,
        p_user_id: user.id,
        p_name: "New menu",
        p_description: null,
        p_items: JSON.stringify([]),
      });

      if (error) throw error;
      if (!data || data.length === 0) throw new Error("EMPTY_RESULT");

      const newMenu = mapRPCMenusToMenuType(data)[0];

      addToast(true, "New menu created!");
      set((state) => ({
        menus: [...state.menus, newMenu],
        loading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const toastMap: Record<string, string> = {
        NOT_AUTHENTICATED: "Please log in to continue.",
        EMPTY_RESULT: "Failed to create menu.",
      };
      addToast(false, toastMap[message] || "Something went wrong.");
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

      // Передаємо items як JSONB string
      const itemsJson = JSON.stringify(menu.items.map((i) => ({
        type: i.type,
        value: i.value,
        position: i.position,
      })));

      const { data, error } = await supabase.rpc("create_or_update_menu_with_items", {
        p_menu_id: menu.menu_id,
        p_user_id: user.id,
        p_name: menu.name,
        p_description: menu.description,
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

      addToast(true, "Menu updated successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const toastMap: Record<string, string> = {
        NOT_AUTHENTICATED: "Please log in to continue.",
        EMPTY_RESULT: "Failed to update menu.",
      };
      addToast(false, toastMap[message] || "Something went wrong.");
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

      addToast(true, "Menu deleted successfully");

      set((state) => ({
        menus: state.menus.filter((m) => m.menu_id !== menu_id),
        loading: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const toastMap: Record<string, string> = {
        NOT_AUTHENTICATED: "Please log in to continue.",
      };
      addToast(false, toastMap[message] || "Failed to delete menu.");
      set({ error: message, loading: false });
    }
  },

  getMenuById: (id) => {
    const { menus } = get();
    return menus.find((m) => m.menu_id === id);
  },
}));

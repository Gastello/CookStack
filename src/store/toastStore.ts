import { create } from "zustand";

type ToastType = {
  id: string;
  success: boolean;
  message: string;
};
type ToastState = {
  toastList: ToastType[];
  addToast: (toastStatus: boolean, toastMessage: string) => void;
  deleteToast: (toastId: string) => void;
};
export const useToastStore = create<ToastState>((set) => ({
  toastList: [],
  addToast: (toastStatus: boolean, toastMessage: string) => {
    const toastId = crypto.randomUUID();
    set((s) => {
      const newToast = {
        id: toastId,
        success: toastStatus,
        message: toastMessage,
      };
      return { toastList: [...s.toastList, newToast] };
    });
  },
  deleteToast: (toastId: string) =>
    set((s) => ({
      toastList: s.toastList.filter((toast) => toast.id != toastId),
    })),
}));

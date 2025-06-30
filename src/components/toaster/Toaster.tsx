import { useToastStore, type ToastType } from "../../store/toastStore";
import Toast from "./Toast";

export default function Toaster() {
  const { toastList } = useToastStore();
  const { deleteToast } = useToastStore();

  return (
    <div className="absolute right-[30px] top-[30px] w-[250px] h-full overflow-hidden z-100">
      {toastList.map((toast: ToastType) => {
        return (
          <Toast
            key={toast.id}
            toast={toast}
            deleteToast={() => deleteToast(toast.id)}
          />
        );
      })}
    </div>
  );
}

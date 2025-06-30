import { useToastStore } from "../../store/toastStore";
import Emoji, { EMOJI } from "../emoji/Emoji";

export default function Toaster() {
  const { toastList } = useToastStore();
  const { addToast } = useToastStore();
  const { deleteToast } = useToastStore();
  return (
    <div className="absolute right-[30px] top-[30px] w-[250px] z-100">
      {toastList.map((toast) => {
        return (
          <div
            key={toast.id}
            className="p-[10px] bg-[#FFFFFF] shadow-sm rounded-[10px] mb-2.5 cursor-pointer"
            onClick={() => deleteToast(toast.id)}
          >
            <Emoji
              size="16px"
              name={toast.success ? EMOJI.checkmarkTrue : EMOJI.checkmarkFalse}
            />
            <span className="ml-2.5 font-semibold text-[12px]/[16px] text-[#1F2937]">
              {toast.message}
            </span>
          </div>
        );
      })}

      <button
        className="p-2 bg-amber-300"
        onClick={() => addToast(true, "test")}
      >
        ADD TOAST
      </button>
    </div>
  );
}

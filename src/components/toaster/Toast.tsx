import { useEffect, useRef } from "react";
import { type ToastType } from "../../store/toastStore";
import Emoji, { EMOJI } from "../emoji/Emoji";

type ToastProps = {
  toast: ToastType;
  deleteToast: () => void;
};
export default function Toast({ toast, deleteToast }: ToastProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remaining = useRef(10000);
  const lastStart = useRef(Date.now());

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, []);

  const startTimer = () => {
    lastStart.current = Date.now();
    timerRef.current = setTimeout(() => deleteToast(), remaining.current);
  };

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="p-[10px] bg-[#FFFFFF] shadow-sm rounded-[10px] mb-2.5 flex gap-[5px] justify-between">
      <div className="self-center grow-0">
        <Emoji
          size="16px"
          name={toast.success ? EMOJI.checkmarkTrue : EMOJI.checkmarkFalse}
        />
      </div>
      <div className="ml-2.5 font-semibold text-[12px]/[16px] text-[#1F2937] grow-1">
        {toast.message}
      </div>
      <div className="grow-0">
        <button onClick={deleteToast} className="rotate-45 inline-block">
          <Emoji name={EMOJI.plus} size="14px" />
        </button>
      </div>
    </div>
  );
}

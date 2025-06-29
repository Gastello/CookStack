import Emoji, { EMOJI } from "../emoji/Emoji";

type ToastProps = {
  success: boolean;
  message: string;
};
export default function Toast({ success, message }: ToastProps) {
  return (
    <div className="absolute right-[30px] top-[30px] w-[300px]">
      <div className="p-[10px] bg-[#FFFFFF] shadow-sm rounded-[10px] mb-2.5">
        <Emoji
          size="16px"
          name={success ? EMOJI.checkmarkTrue : EMOJI.checkmarkFalse}
        />
        <span className="ml-2.5 font-semibold text-[12px]/[16px] text-[#1F2937]">
          {message}
        </span>
      </div>
    </div>
  );
}

import type { EMOJI } from "../emoji/Emoji";
import Emoji from "../emoji/Emoji";

type ButtonProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  color?: string;
  textColor?: string;
  icon?: (typeof EMOJI)[keyof typeof EMOJI];
  isDisabled?: boolean;
};

export default function Button({
  onClick = () => {},
  text,
  color = "#16A34A",
  textColor = "#ffffff",
  icon,
  isDisabled = false,
}: ButtonProps) {
  return (
    <button
      disabled={isDisabled}
      style={{
        backgroundColor: color,
        color: textColor,
        opacity: isDisabled ? "0.5" : "1",
        cursor: isDisabled ? "default" : "pointer",
      }}
      className="px-[16px] py-[12px] text-[14px]/[24px] rounded-xl w-full"
      onClick={onClick}
    >
      {icon && (
        <span className="mr-[10px]">
          <Emoji name={icon} size="14px" />
        </span>
      )}
      {text}
    </button>
  );
}

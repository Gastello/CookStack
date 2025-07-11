import type { ANIMATED_EMOJI } from "../animatedEmoji/AnimatedEmoji";
import AnimatedEmoji from "../animatedEmoji/AnimatedEmoji";
import type { EMOJI } from "../emoji/Emoji";
import Emoji from "../emoji/Emoji";

type ButtonPropsBaseProps = {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  text: string;
  color?: string;
  textColor?: string;
  isDisabled?: boolean;
  textSize?: string;
};

type ButtonProps =
  | (ButtonPropsBaseProps & {
      animIcon?: never;
      icon?: (typeof EMOJI)[keyof typeof EMOJI];
    })
  | (ButtonPropsBaseProps & {
      animIcon?: (typeof ANIMATED_EMOJI)[keyof typeof ANIMATED_EMOJI];
      icon?: never;
    });

export default function Button({
  onClick = () => {},
  text,
  color = "#16A34A",
  textColor = "#ffffff",
  icon,
  animIcon,
  isDisabled = false,
  textSize,
}: ButtonProps) {
  return (
    <button
      disabled={isDisabled}
      style={{
        backgroundColor: color,
        color: textColor,
        opacity: isDisabled ? "0.5" : "1",
        cursor: isDisabled ? "default" : "pointer",
        fontSize: textSize ? textSize : "14px",
      }}
      className="px-[16px] py-[12px] text-[14px]/[24px] rounded-xl w-full"
      onClick={onClick}
    >
      {icon && (
        <span style={{ marginRight: text ? "10px" : "0px" }}>
          <Emoji name={icon} size={textSize ? textSize : "14px"} />
        </span>
      )}
      {animIcon && (
        <span style={{ marginRight: text ? "10px" : "0px" }}>
          <AnimatedEmoji isPlaying={false} name={animIcon} size="20px" />
        </span>
      )}
      {text}
    </button>
  );
}

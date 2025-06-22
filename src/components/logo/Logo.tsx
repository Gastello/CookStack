import Emoji, { EMOJI } from "../emoji/Emoji";

export default function Logo() {
  return (
    <span className="text-[20px]/[28px] font-medium">
      <span className="mr-[5px]">CookStack</span>
      <Emoji name={EMOJI.pan} size="20px" />
    </span>
  );
}

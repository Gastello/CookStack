import { Link } from "react-router-dom";
import Button from "../components/button/Button";
import { EMOJI } from "../components/emoji/Emoji";
import AnimatedEmoji, {
  ANIMATED_EMOJI,
} from "../components/animatedEmoji/AnimatedEmoji";

type ErrorPropsBase = {
  animEmoji?: (typeof ANIMATED_EMOJI)[keyof typeof ANIMATED_EMOJI];
  header: string;
  text?: string;
};

type ErrorProps =
  | (ErrorPropsBase & {
      showBtn: true;
      btnText: string;
      btnPath: string;
    })
  | (ErrorPropsBase & {
      showBtn?: false;
      btnText?: never;
      btnPath?: never;
    });

export default function Error({
  animEmoji = ANIMATED_EMOJI.meltingFace,
  header,
  text,
  showBtn = false,
  btnText = "",
  btnPath = "",
}: ErrorProps) {
  return (
    <div className="ralative flex flex-col h-full p-[30px]">
      <div className="flex grow items-center justify-center">
        <div className="max-w-[315px]">
          <div className="text-center mb-[20px]">
            <AnimatedEmoji name={animEmoji} />
          </div>
          <div className="text-center mb-[5px] font-medium text-[17px]/[28px] text-[#1F2937]">
            {header}
          </div>
          <div className="text-center mb-[25px] text-[14px]/[24px] text-[#6B7280]">
            {text}
          </div>
          {showBtn && (
            <div>
              <Link to={btnPath}>
                <Button
                  icon={EMOJI.dart}
                  textColor="#16A34A"
                  color="#F0FDF4"
                  text={btnText}
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

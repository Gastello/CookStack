import { Link } from "react-router-dom";
import Button from "../components/button/Button";
import { EMOJI } from "../components/emoji/Emoji";
import AnimatedEmoji, {
  ANIMATED_EMOJI,
} from "../components/animatedEmoji/AnimatedEmoji";

export default function Error() {
  return (
    <div className="ralative flex flex-col h-full p-[30px]">
      <div className="flex grow items-center justify-center">
        <div className="max-w-[315px]">
          <div className="text-center mb-[20px]">
            <AnimatedEmoji name={ANIMATED_EMOJI.meltingFace} />
          </div>
          <div className="text-center mb-[5px] font-medium text-[17px]/[28px] text-[#1F2937]">
            Oops! We overcooked this page.
          </div>
          <div className="text-center mb-[25px] text-[14px]/[24px] text-[#6B7280]">
            The recipe you&apos;re looking for is missing...
            <br />
            But don&apos;t worry — the rest of the kitchen is still open!
          </div>
          <div>
            <Link to="/">
              <Button
                icon={EMOJI.dart}
                textColor="#16A34A"
                color="#F0FDF4"
                text={"Go to CookStack Home"}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

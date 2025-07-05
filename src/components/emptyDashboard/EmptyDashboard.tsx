import Button from "../button/Button";
import Emoji, { EMOJI } from "../emoji/Emoji";

type EmptyDashboardProps = {
  emoji: (typeof EMOJI)[keyof typeof EMOJI];
  title: string;
  subtitle: string;
  btnText?: string;
  onClick?: () => void;
};
export default function EmptyDashboard({
  emoji,
  title,
  subtitle,
  btnText,
  onClick
}: EmptyDashboardProps) {
  return (
    <div className="flex grow items-center justify-center">
      <div className="max-w-[315px]">
        <div className="text-center mb-[20px]">
          <Emoji name={emoji} size="50px" />
        </div>
        <div className="text-center mb-[5px] font-medium text-[17px]/[28px] text-[#1F2937]">
          {title}
        </div>
        <div className="text-center mb-[25px] text-[14px]/[24px] text-[#6B7280]">
          {subtitle}
        </div>
        {btnText && (
          <div>
            <Button
              icon={EMOJI.dart}
              textColor="#16A34A"
              color="#F0FDF4"
              text={btnText}
              onClick={onClick}
            />
          </div>
        )}
      </div>
    </div>
  );
}

import Button from "../button/Button";
import { EMOJI } from "../emoji/Emoji";
import Input from "../input/Input";

type RandomMealsDashboardHeaderProps = {
  title: string;
  subtitle: string;
  btnText: string;
  btnIcon: (typeof EMOJI)[keyof typeof EMOJI];
};
export default function RandomMealsDashboardHeader({
  title,
  subtitle,
  btnText,
  btnIcon,
}: RandomMealsDashboardHeaderProps) {
  return (
    <div className="flex justify-between">
      <div>
        <div className="font-semibold text-[20px]/[34px] text=[#1F2937]">
          {title}
        </div>
        <div className="text-[14px]/[24px] text-[#6B7280]">{subtitle}</div>
      </div>
      <div className="flex self-baseline gap-[20px]">
        <Input placeholder="Calories" isBordered={true} placeholderEmoji={EMOJI.fire} placeholderColor="#1F2937" type="number"/>
        <div>
          <Button
            text={btnText}
            icon={btnIcon}
            color="#F0FDF4"
            textColor="#16A34A"
          />
        </div>
      </div>
    </div>
  );
}

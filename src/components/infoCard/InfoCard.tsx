import Emoji, { EMOJI } from "../emoji/Emoji";

type InfoCardProps = {
  icon?: (typeof EMOJI)[keyof typeof EMOJI];
  header: string;
  text: string;
};
export default function InfoCard({
  icon,
  header,
  text,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl bg-white shadow-sm p-[25px]">
      {icon && (
        <div className="text-center mb-[15px]">
          <Emoji name={icon} size="30px" />
        </div>
      )}
      <div className="mb-[10px] text-[16px]/[28px] color-[#1F2937] text-center">
        {header}
      </div>
      <div className="text-[14px]/[24px] text-[#6B7280] text-center">
        {text}
      </div>
    </div>
  );
}

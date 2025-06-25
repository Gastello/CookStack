import Button from "../components/button/Button";
import Emoji, { EMOJI } from "../components/emoji/Emoji";

export default function Menus() {
  return (
    <div className="flex flex-col h-full p-[30px]">
      {/* Header  */}
      <div className="flex justify-between">
        <div>
          <div className="font-semibold text-[20px]/[34px] text=[#1F2937]">
            My Menus
          </div>
          <div className="text-[14px]/[24px] text-[#6B7280]">
            Create and manage your meal plans
          </div>
        </div>
        <div>
          <Button
            text="Create Menu"
            icon={EMOJI.memo}
            color="#F0FDF4"
            textColor="#16A34A"
          />
        </div>
      </div>
      <div className="flex grow items-center justify-center">
        <div className="max-w-[315px]">
          <div className="text-center mb-[20px]">
            <Emoji name={EMOJI.clipboard} size="50px" />
          </div>
          <div className="text-center mb-[5px] font-medium text-[17px]/[28px] text-[#1F2937]">
            No menus yet
          </div>
          <div className="text-center mb-[25px] text-[14px]/[24px] text-[#6B7280]">
            Start by creating your first menu to organize your meals
          </div>
          <div>
            <Button
              icon={EMOJI.dart}
              textColor="#16A34A"
              color="#F0FDF4"
              text="Create your first menu"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

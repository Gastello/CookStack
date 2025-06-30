import type { DishType } from "../../pages/Dishes";
import Emoji, { EMOJI } from "../emoji/Emoji";
import Tag from "../tag/Tag";

type DishesDashboardProps = {
  dishes: DishType[];
};
export default function DishesDashboard({ dishes }: DishesDashboardProps) {
  return (
    <div className="mt-[20px] grid grid-cols-4 gap-[20px]">
      {dishes.map((dish) => {
        return (
          <div
            key={dish?.id}
            className="bg-white rounded-2xl shadow-sm p-[10px] pt-[20px] flex flex-col gap-[10px] justify-between"
          >
            <div className="flex justify-between gap-[5px]">
              <div>
                <div className="font-medium text-left text-[16px] text-[#1F2937] mb-[8px]">
                  {dish?.name}
                </div>
                <div className="text-[12px]/[20px] text-[#6B7280]">
                  <span className="mr-[5px]">
                    <Emoji size="12px" name={EMOJI.clock} />
                  </span>
                  {dish?.time} min
                </div>
                <div className="text-[12px]/[20px] text-[#6B7280]">
                  <span className="mr-[5px]">
                    <Emoji size="12px" name={EMOJI.fire} />
                  </span>
                  {dish?.calories} cal
                </div>
              </div>
              <div>
                <div className="w-16 h-16 rounded-lg bg-[#d9d9d9]"></div>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex gap-[5px] flex-wrap">
                {dish?.tags.map((tag) => {
                  return (
                    <Tag
                      key={`${tag.text}_${tag.color}`}
                      color={tag.color}
                      text={tag.text}
                    />
                  );
                })}
              </div>
              <div>
                {dish?.isFav ? (
                  <Emoji name={EMOJI.heartRed} size="22px" />
                ) : (
                  <Emoji name={EMOJI.heartGray} size="22px" />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

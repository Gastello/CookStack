import { Link } from "react-router-dom";
import { useDishesStore } from "../../store/dishedStore";
import Emoji, { EMOJI } from "../emoji/Emoji";
import Tag from "../tag/Tag";

export default function DishesDashboard() {
  const dishes = useDishesStore((s) => s.dishes);
  const makeFav = useDishesStore((s) => s.makeFav);

  return (
    <div className="mt-[20px] grid grid-cols-4 gap-[20px]">
      {dishes.map((dish) => {
        return (
          <div
            key={dish.id}
            className="bg-white rounded-2xl shadow-sm p-[10px] pt-[20px] flex flex-col gap-[10px] justify-between"
          >
            <div className="flex justify-between gap-[5px]">
              <div>
                <div className="font-medium text-left text-[16px] text-[#1F2937] mb-[8px]">
                  <Link to={dish.id}>{dish.name}</Link>
                </div>
                <div className="text-[12px]/[20px] text-[#6B7280]">
                  <span className="mr-[5px]">
                    <Emoji size="12px" name={EMOJI.clock} />
                  </span>
                  {dish.time} min
                </div>
                <div className="text-[12px]/[20px] text-[#6B7280]">
                  <span className="mr-[5px]">
                    <Emoji size="12px" name={EMOJI.fire} />
                  </span>
                  {dish.calories} cal
                </div>
              </div>
              <div>
                <div
                  style={{
                    backgroundImage: dish.img
                      ? `url(${dish.img})`
                      : `url(/assets/emoji/pan.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="w-16 h-16 rounded-lg"
                ></div>
              </div>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex gap-[5px] flex-wrap">
                {dish.tags &&
                  dish.tags.map((tag) => {
                    return (
                      <Tag key={tag.id} color={tag.color} text={tag.text} />
                    );
                  })}
              </div>

              <div className="cursor-pointer" onClick={() => makeFav(dish.id)}>
                {dish.isFav ? (
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

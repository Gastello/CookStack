import { useEffect, useState } from "react";
import Tag from "../tag/Tag";
import type { DishType } from "../../store/dishedStore";
import type { TagType } from "../../store/tagsStore";
import ChangeableText from "../changeableText/ChangeableText";

type DishDetailsItemProps = {
  dish: DishType | undefined;
};

export default function DishDetailsItem({ dish }: DishDetailsItemProps) {
  const [name, setName] = useState<string>("");
  const [calories, setCalories] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [tags, setTags] = useState<TagType[]>([]);

  useEffect(() => {
    if (dish) {
      setName(dish?.name);
      setCalories(dish?.calories);
      setTime(dish?.time);
      setDescription(dish?.description ?? "");
      setImg(dish?.img ?? "");
      setTags(dish?.tags);
    }
  }, [dish]);

  return (
    <div className="mt-[20px] max-w-[800px] w-full rounded-2xl bg-white shadow-sm p-[20px] mx-auto select-none">
      <div className="flex justify-between">
        <div className="min-w-0 flex-1">
          <ChangeableText
            styles="text-lg font-medium text-gray-800 mb-[5px]"
            text={name}
            onChange={(val) => setName(val)}
          />
          <div>
            <span className="font-medium text-gray-500 text-[14px]/[20px] mr-[5px]">
              Calories:
            </span>
            <ChangeableText
              styles="text-gray-500 text-[14px]/[20px]"
              text={calories.toString()}
              digitsOnly
              onChange={(val) => setCalories(Number(val))}
            />
          </div>
          <div>
            <span className="font-medium text-gray-500 text-[14px]/[20px] mr-[5px]">
              Time:
            </span>
            <ChangeableText
              styles="text-gray-500 text-[14px]/[20px]"
              text={time.toString()}
              digitsOnly
              onChange={(val) => setTime(Number(val))}
            />

            <span className="font-medium text-gray-500 text-[14px]/[20px] ml-[5px]">
              mins
            </span>
          </div>
          {dish?.description && (
            <>
              <div className=" text-gray-500 font-medium text-[14px]/[20px]">
                Description:
              </div>
              <ChangeableText
                styles="text-gray-500 text-[14px]/[20px]"
                text={description}
                onChange={(val) => setDescription(val)}
              />
            </>
          )}
        </div>
        <div className="w-[256px] grow-0">
          {
            <div className="mb-[10px]">
              <div
                style={{
                  backgroundImage: dish?.img
                    ? `url(${dish?.img})`
                    : `url(/assets/animatedEmoji/pan.webm)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                className="w-[256px] h-[256px] rounded-lg"
              ></div>
            </div>
          }
          <div className="flex gap-[5px] flex-wrap">
            {dish?.tags &&
              dish.tags.map((tag) => {
                return (
                  <Tag
                    key={`${tag.text}_${tag.color}`}
                    color={tag.color}
                    text={tag.text}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

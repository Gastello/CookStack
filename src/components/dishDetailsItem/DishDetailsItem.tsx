import Tag from "../tag/Tag";
import ChangeableText from "../changeableText/ChangeableText";
import type { TagType } from "../../store/tagsStore";

type DishDetailsItemProps = {
  name: string;
  calories: number;
  time: number;
  description?: string;
  img?: string;
  tags?: TagType[];
  setName: (name: string) => void;
  setCalories: (cals: number) => void;
  setTime: (time: number) => void;
  setDescription: (desc: string) => void;
  setImg: (img: string) => void;
  setTags: (tags: TagType[]) => void;
  editable: boolean;
};

export default function DishDetailsItem({
  name,
  calories,
  time,
  description,
  img,
  tags,
  setName,
  setCalories,
  setTime,
  setDescription,
  setImg,
  setTags,
  editable=false,
}: DishDetailsItemProps) {
  return (
    <div className="mt-[20px] max-w-[800px] w-full rounded-2xl bg-white shadow-sm p-[20px] mx-auto select-none">
      <div className="flex justify-between">
        <div className="min-w-0 flex-1">
          <ChangeableText
            styles="text-lg font-medium text-gray-800 mb-[5px]"
            text={name}
            onChange={(val) => setName(val)}
            editable={editable}
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
              editable={editable}
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
              editable={editable}
            />

            <span className="font-medium text-gray-500 text-[14px]/[20px] ml-[5px]">
              mins
            </span>
          </div>
          {description && (
            <>
              <div className=" text-gray-500 font-medium text-[14px]/[20px]">
                Description:
              </div>
              <ChangeableText
                styles="text-gray-500 text-[14px]/[20px]"
                text={description}
                onChange={(val) => setDescription(val)}
                editable={editable}
              />
            </>
          )}
        </div>
        <div className="w-[256px] grow-0">
          {
            <div className="mb-[10px]">
              <div
                style={{
                  backgroundImage: img
                    ? `url(${img})`
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
            {tags &&
              tags.map((tag) => {
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

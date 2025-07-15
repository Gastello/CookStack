import Tag from "../tag/Tag";
import { type TagType } from "../../store/tagsStore";
import Input from "../input/Input";
import Emoji, { EMOJI } from "../emoji/Emoji";
import TagsInput from "../tagsInput/TagsInput";
import { useState } from "react";

type Setters = {
  setName: (name: string) => void;
  setCalories: (cals: number) => void;
  setTime: (time: number) => void;
  setDescription: (desc: string) => void;
  setImg: (img: string) => void;
  setTags: (tags: TagType[]) => void;
};
type Dish = {
  id: string;
  name: string;
  calories: number;
  time: number;
  description?: string;
  img?: string;
  tags?: TagType[];
};
type DishDetailsItemProps = {
  dish: Dish;
  setters: Setters;
  editable: boolean;
};

export default function DishDetailsItem({
  setters,
  dish,
  editable = false,
}: DishDetailsItemProps) {
  const [color, setColor] = useState(0.5);
  return (
    <div className="relative flex flex-col h-full p-[30px]">
      <div className="mt-[20px] max-w-[800px] w-full rounded-2xl bg-white shadow-sm p-[20px] mx-auto">
        {editable ? (
          <div>
            <div className="flex justify-between gap-2.5 mb-[10px]">
              <div className="grow">
                <div className="mb-[10px]">
                  <Input
                    label="Dish name:"
                    height="24px"
                    placeholderEmoji={EMOJI.forkAndKnife}
                    placeholderColor="#6a7282"
                    onChange={(e) => setters.setName(e.currentTarget.value)}
                    startValue={dish.name}
                  />
                </div>
                <div>
                  <Input
                    label="Image URL:"
                    startValue={dish.img}
                    height="24px"
                    placeholderEmoji={EMOJI.clipboard}
                    placeholderColor="#6a7282"
                    onChange={(e) => setters.setImg(e.currentTarget.value)}
                  />
                </div>
              </div>
              <div className="relative w-[108px] rounded-2xl overflow-hidden">
                <div
                  className="absolute w-full h-full z-1"
                  style={{
                    backgroundImage: `url(${dish.img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                <div className="absolute w-full h-full text-[10px] flex items-center justify-center z-0 bg-gray-200">
                  Image Preview
                </div>
              </div>
            </div>
            <div className="flex gap-2.5 mb-[10px]">
              <div className="grow">
                <Input
                  label="Calories:"
                  startValue={dish.calories.toString()}
                  height="24px"
                  type="number"
                  placeholderEmoji={EMOJI.fire}
                  placeholderColor="#6a7282"
                  onChange={(e) =>
                    setters.setCalories(Number(e.currentTarget.value))
                  }
                />
              </div>
              <div className="grow">
                <Input
                  label="Time:"
                  startValue={dish.time.toString()}
                  height="24px"
                  type="number"
                  placeholderEmoji={EMOJI.clock}
                  placeholderColor="#6a7282"
                  onChange={(e) =>
                    setters.setTime(Number(e.currentTarget.value))
                  }
                />
              </div>
            </div>
            <div className="mb-[10px]">
              <Input
                label="Description:"
                startValue={dish.description}
                height="150px"
                placeholderEmoji={EMOJI.clock}
                placeholderColor="#6a7282"
                isTextArea={true}
                onChange={(e) => setters.setDescription(e.currentTarget.value)}
              />
            </div>
            <div>
              <TagsInput
                label="Choose tags:"
                currentTags={dish.tags}
                setCurrentTags={setters.setTags}
                color={color}
                setColor={setColor}
              />
            </div>
          </div>
        ) : (
          <div className="flex gap-2.5 justify-between">
            <div className="grow min-w-0">
              <div className="text-lg font-medium text-gray-800 mb-[5px] text-center">
                {dish.name}
              </div>
              <div className="text-gray-500 text-[14px]/[20px]">
                <span className="mr-[10px]">
                  <Emoji name={EMOJI.fire} size="14px" />
                </span>
                <span className="font-medium">Calories:</span> {dish.calories}
              </div>
              <div className=" text-gray-500 text-[14px]/[20px]">
                <span className="mr-[10px]">
                  <Emoji name={EMOJI.clock} size="14px" />
                </span>
                <span className="font-medium">Time:</span> {dish.time} min
              </div>
              {dish.description && (
                <>
                  <div className=" text-gray-500 font-medium text-[14px]/[20px] mb-[5px]">
                    <span className="mr-[10px]">
                      <Emoji name={EMOJI.forkAndKnife} size="14px" />
                    </span>
                    Description:
                  </div>
                  <div className="text-gray-500 text-[14px]/[20px] break-all">
                    {dish.description}
                  </div>
                </>
              )}
            </div>
            {(dish.img || (dish.tags?.length ?? 0) > 0) && (
              <div className="grow-0 basis-[256px]">
                {dish.img && (
                  <div className="mb-[10px]">
                    <div
                      style={{
                        backgroundImage: `url(${dish.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                      className="w-[256px] h-[256px] rounded-lg "
                    ></div>
                  </div>
                )}
                <div className="flex gap-[5px] justify-end flex-wrap">
                  {dish.tags &&
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
            )}
          </div>
        )}
      </div>
    </div>
  );
}

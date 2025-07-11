import { useState } from "react";
import { useDishesStore } from "../../store/dishedStore";
import Button from "../button/Button";
import { EMOJI } from "../emoji/Emoji";
import Input from "../input/Input";

type DishesFilterProps = {
  filterMenuVisible: boolean;
  setFilterMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function DishesFilter({
  filterMenuVisible,
  setFilterMenuVisible,
}: DishesFilterProps) {
  const setFilter = useDishesStore((s) => s.setFilter);

  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const [calories, setCalories] = useState("");
  const [sortOrderName, setSortOrderName] = useState<"asc" | "desc">("asc");
  const [sortOrderTime, setSortOrderTime] = useState<"asc" | "desc">("asc");
  const [sortOrderCalories, setSortOrderCalories] = useState<"asc" | "desc">(
    "asc"
  );

  return (
    <div className="relative">
      <Button
        icon={EMOJI.abacus}
        textSize="18px"
        text=""
        color="#F0FDF4"
        onClick={() => setFilterMenuVisible((prev) => !prev)}
      />
      {filterMenuVisible && (
        <div className="absolute z-5 bottom-0 right-0  px-[16px] py-[12px] bg-white rounded-xl transform translate-y-full border border-[#E5E7EB] flex flex-col gap-[5px] text-[#374151]">
          <div className="text-center">Filter</div>
          <Input
            placeholder="Dish name"
            isBordered={true}
            placeholderEmoji={EMOJI.forkAndKnife}
            type="text"
            width="150px"
            height="20px"
            textSize="12px"
            startValue={name}
            onChange={(e) => {
              const val = e.currentTarget.value;
              setName(val);
              setFilter({
                search: val,
              });
            }}
          />
          <Input
            placeholder="Max time"
            isBordered={true}
            placeholderEmoji={EMOJI.clock}
            type="number"
            width="150px"
            height="20px"
            textSize="12px"
            startValue={time}
            onChange={(e) => {
              const val = e.currentTarget.value;
              setTime(val);
              setFilter({
                time: Number(val),
              });
            }}
          />
          <Input
            placeholder="Max calories"
            isBordered={true}
            placeholderEmoji={EMOJI.fire}
            type="number"
            width="150px"
            height="20px"
            textSize="12px"
            startValue={calories}
            onChange={(e) => {
              const val = e.currentTarget.value;
              setCalories(val);
              setFilter({
                calories: Number(val),
              });
            }}
          />
          <div className="text-center">Sort</div>
          <div className="flex flex-col gap-[5px] mb-[10px]">
            <div>
              <Button
                text="Dish name"
                textSize="12px"
                color="transparent"
                isBordered
                textColor="#374151"
                paddingX="4px"
                paddingY="0px"
                icon={EMOJI.forkAndKnife}
                sortIco={sortOrderName}
                onClick={() => {
                  setFilter({
                    sortBy: "name",
                    sortOrder: sortOrderName,
                  });
                  setSortOrderName(sortOrderName == "asc" ? "desc" : "asc");
                }}
              />
            </div>
            <div>
              <Button
                text="Cooking time"
                textSize="12px"
                color="transparent"
                isBordered
                textColor="#374151"
                paddingX="4px"
                paddingY="0px"
                icon={EMOJI.clock}
                sortIco={sortOrderTime}
                onClick={() => {
                  setFilter({
                    sortBy: "time",
                    sortOrder: sortOrderTime,
                  });
                  setSortOrderTime(sortOrderTime == "asc" ? "desc" : "asc");
                }}
              />
            </div>
            <div>
              <Button
                text="Calories"
                textSize="12px"
                color="transparent"
                isBordered
                textColor="#374151"
                paddingX="4px"
                paddingY="0px"
                icon={EMOJI.fire}
                sortIco={sortOrderCalories}
                onClick={() => {
                  setFilter({
                    sortBy: "calories",
                    sortOrder: sortOrderCalories,
                  });
                  setSortOrderCalories(
                    sortOrderCalories == "asc" ? "desc" : "asc"
                  );
                }}
              />
            </div>
          </div>
          {/* <Button
                  text="Apply"
                  icon={EMOJI.abacus}
                  isBordered
                  color="transparent"
                  textColor="#374151"
                  paddingX="4px"
                  paddingY="2px"
                /> */}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";
import DishesDashboard from "../components/dishesDashboard/DishesDashboard";
import { useDishesStore } from "../store/dishedStore";
import Loader, { LOADER_EMOJIES } from "../components/loader/Loader";
import { useTagsStore } from "../store/tagsStore";
import Button from "../components/button/Button";
import Input from "../components/input/Input";

export default function Dishes() {
  const { dishes } = useDishesStore();
  const { fetchDishes } = useDishesStore();
  const { loading } = useDishesStore();
  const { addDish } = useDishesStore();
  const { fetchTags } = useTagsStore();

  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  return (
    <div className="relative flex flex-col h-full p-[30px]">
      <DashboardHeader
        title="My Dishes"
        subtitle="Browse and manage your dish collection"
      >
        <div className="flex gap-[10px]">
          {dishes && dishes.length != 0 && (
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
                  />
                  <Input
                    placeholder="Cooking time"
                    isBordered={true}
                    placeholderEmoji={EMOJI.clock}
                    type="number"
                    width="150px"
                    height="20px"
                  />
                  <Input
                    placeholder="Calories"
                    isBordered={true}
                    placeholderEmoji={EMOJI.fire}
                    type="number"
                    width="150px"
                    height="20px"
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
                        paddingY="2px"
                        icon={EMOJI.forkAndKnife}
                        sortIco="descending"
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
                        paddingY="2px"
                        icon={EMOJI.clock}
                        sortIco="descending"
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
                        paddingY="2px"
                        icon={EMOJI.fire}
                        sortIco="descending"
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
          )}
          <div className="shrink-0">
            <Button
              onClick={addDish}
              text="Add Dish"
              icon={EMOJI.forkAndKnife}
              color="#F0FDF4"
              textColor="#16A34A"
            />
          </div>
        </div>
      </DashboardHeader>
      {loading ? (
        <Loader loading={true} size={256} name={LOADER_EMOJIES.forkAndKnife} />
      ) : dishes && dishes.length != 0 ? (
        <DishesDashboard />
      ) : (
        <EmptyDashboard
          emoji={EMOJI.forkAndKnife}
          title="No dishes yet"
          subtitle="Start by adding your favorite dishes to your collection"
          btnText="Add your first dish"
          onClick={addDish}
        />
      )}
    </div>
  );
}

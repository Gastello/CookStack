import { useEffect } from "react";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";
import DishesDashboard from "../components/dishesDashboard/DishesDashboard";
import { useDishesStore } from "../store/dishedStore";
import Loader, { LOADER_EMOJIES } from "../components/loader/Loader";
import { useTagsStore } from "../store/tagsStore";
import Button from "../components/button/Button";

export default function Dishes() {
  const { dishes } = useDishesStore();
  const { fetchDishes } = useDishesStore();
  const { loading } = useDishesStore();
  const { addDish } = useDishesStore();
  const { fetchTags } = useTagsStore();

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
              />
              <div className="absolute bottom-0 right-0  px-[16px] py-[12px] bg-white rounded-xl transform translate-y-full">asd</div>
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

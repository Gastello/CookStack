import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDishesStore, type DishType } from "../store/dishedStore";
import Loader, { LOADER_EMOJIES } from "../components/loader/Loader";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import Tag from "../components/tag/Tag";
import Error from "./Error";
// import { useTagsStore } from "../store/tagsStore";

export default function DishDetails() {
  const { id } = useParams<{ id: string }>();
  const { getDishById, fetchDishes, loading, dishes } = useDishesStore();
  //   const {
  //     addTag,
  //     error,
  //     loading: tagsLoading,
  //     removeTag,
  //     fetchTags,
  //     updateTag,
  //   } = useTagsStore();
  const [dish, setDish] = useState<DishType | undefined>(undefined);

  // Завантажуємо dishes якщо їх ще нема
  useEffect(() => {
    if (!id) return;

    const cachedDish = getDishById(id);
    if (!cachedDish) {
      fetchDishes();
    }
  }, [id, getDishById, fetchDishes]);

  // Відслідковуємо оновлення dishes та loading і встановлюємо dish, коли дані є
  useEffect(() => {
    if (!id) return;

    if (!loading) {
      const foundDish = getDishById(id);
      setDish(foundDish);
    }
  }, [id, getDishById, dishes, loading]);

  if (!dish && !loading)
    return (
      <Error
        header="Dish not found!"
        text="Looks like this meal got burned, lost, or never existed."
        showBtn={false}
      />
    );
  return (
    <div className="relative flex flex-col h-full p-[30px]">
      <DashboardHeader
        title="My Dishes"
        subtitle="Browse and manage your dish collection"
      />
      {loading ? (
        <Loader loading={loading} name={LOADER_EMOJIES.hamburger} />
      ) : (
        <div className="mt-[20px] max-w-[800px] w-full rounded-2xl bg-white shadow-sm p-[20px] mx-auto">
          <div className="flex justify-between">
            <div>
              <div className="text-lg font-medium text-gray-800 mb-[5px]">
                {dish?.name}
              </div>
              <div className="text-gray-500 text-[14px]/[20px]">
                <span className="font-medium">Calories:</span> {dish?.calories}
              </div>
              <div className=" text-gray-500 text-[14px]/[20px]">
                <span className="font-medium">Time:</span> {dish?.time} min
              </div>
              <div className=" text-gray-500 font-medium text-[14px]/[20px]">
                Description:
              </div>
              <div className="text-gray-500 text-[14px]/[20px]">
                {dish?.description}
              </div>
            </div>
            <div>
              {dish?.img && (
                <div className="mb-[10px]">
                  <div
                    style={{
                      backgroundImage: dish.img
                        ? `url(${dish.img})`
                        : `url(/assets/emoji/pan.png)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                    className="w-[256px] h-[256px] rounded-lg "
                  ></div>
                </div>
              )}
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
      )}
    </div>
  );
}

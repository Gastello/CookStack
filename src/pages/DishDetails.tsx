import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDishesStore, type DishType } from "../store/dishedStore";
import Loader, { LOADER_EMOJIES } from "../components/loader/Loader";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import Error from "./Error";
import Button from "../components/button/Button";
import { EMOJI } from "../components/emoji/Emoji";
import DishDetailsItem from "../components/dishDetailsItem/DishDetailsItem";
// import { useTagsStore } from "../store/tagsStore";

export default function DishDetails() {
  const { id } = useParams<{ id: string }>();
  const { getDishById, fetchDishes, removeDish, loading, dishes } =
    useDishesStore();
  //   const {
  //     addTag,
  //     error,
  //     loading: tagsLoading,
  //     removeTag,
  //     fetchTags,
  //     updateTag,
  //   } = useTagsStore();
  const [dish, setDish] = useState<DishType | undefined>(undefined);

  const navigate = useNavigate();

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
      >
        <div className="flex self-baseline gap-[20px]">
          <div>
            <Button
              text="Save"
              icon={EMOJI.checkmarkTrue}
              color="#F0FDF4"
              textColor="#16A34A"
            />
          </div>
          <div>
            <Button
              onClick={() => {
                if (dish?.id) {
                  removeDish(dish.id);
                  navigate("/dishes");
                }
              }}
              text="Delete"
              icon={EMOJI.checkmarkFalse}
              color="#FDF0F0"
              textColor="#A31616"
            />
          </div>
        </div>
      </DashboardHeader>
      {loading ? (
        <Loader loading={loading} name={LOADER_EMOJIES.hamburger} />
      ) : (
        <DishDetailsItem dish={dish} />
      )}
    </div>
  );
}

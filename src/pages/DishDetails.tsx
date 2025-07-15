import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDishesStore, type DishType } from "../store/dishedStore";
import Loader, { LOADER_EMOJIES } from "../components/loader/Loader";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import Error from "./Error";
import Button from "../components/button/Button";
import { EMOJI } from "../components/emoji/Emoji";
import DishDetailsItem from "../components/dishDetailsItem/DishDetailsItem";
import { useTagsStore, type TagType } from "../store/tagsStore";
import { useToastStore } from "../store/toastStore";

export default function DishDetails() {
  const { id } = useParams<{ id: string }>();

  const getDishById = useDishesStore((s) => s.getDishById);
  const fetchDishes = useDishesStore((s) => s.fetchDishes);
  const removeDish = useDishesStore((s) => s.removeDish);
  const loading = useDishesStore((s) => s.loading);
  const dishes = useDishesStore((s) => s.dishes);
  const updateDish = useDishesStore((s) => s.updateDish);

  const { addToast } = useToastStore();
  const { deleteUnusedTags } = useTagsStore();

  const [dish, setDish] = useState<DishType | undefined>(undefined);
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [calories, setCalories] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [img, setImg] = useState<string>("");
  const [tags, setTags] = useState<TagType[]>([]);

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (dish) {
      setName(dish?.name);
      setCalories(dish?.calories);
      setTime(dish?.time);
      setDescription(dish?.description ?? "");
      setImg(dish?.img ?? "");
      setTags(dish?.tags);
    }
  }, [dish, editable]);

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
          {editable ? (
            <>
              <div>
                <Button
                  onClick={async () => {
                    await updateDish({
                      id: dish!.id,
                      name: name,
                      time: time,
                      calories: calories,
                      isFav: dish!.isFav,
                      description: description,
                      img: img,
                      tags: tags,
                    });
                    deleteUnusedTags();
                    setEditable(false);
                  }}
                  text="Save"
                  icon={EMOJI.checkmarkTrue}
                  color="#F0FDF4"
                  textColor="#16A34A"
                />
              </div>
              <div>
                <Button
                  onClick={() => {
                    deleteUnusedTags();
                    setEditable(false);
                  }}
                  text="Discard"
                  icon={EMOJI.checkmarkFalse}
                  color="#FDF0F0"
                  textColor="#A31616"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <Button
                  onClick={() => {
                    setEditable(true);
                  }}
                  text="Change"
                  icon={EMOJI.pencil}
                  color="#F0FDF4"
                  textColor="#16A34A"
                />
              </div>
              <div>
                <Button
                  onClick={async () => {
                    if (dish?.id) {
                      await removeDish(dish.id);
                      deleteUnusedTags();
                      navigate("/dishes");
                    }
                  }}
                  text="Delete"
                  icon={EMOJI.checkmarkFalse}
                  color="#FDF0F0"
                  textColor="#A31616"
                />
              </div>
            </>
          )}
        </div>
      </DashboardHeader>
      {loading ? (
        <Loader loading={loading} name={LOADER_EMOJIES.hamburger} />
      ) : (
        dish?.id && (
          <DishDetailsItem
            editable={editable}
            dish={{ id: dish.id, name, calories, time, description, img, tags }}
            setters={{
              setCalories,
              setDescription,
              setImg,
              setName,
              setTags,
              setTime,
            }}
          />
        )
      )}
    </div>
  );
}

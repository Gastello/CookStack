import { useEffect, useState } from "react";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";
import DishesDashboard from "../components/dishesDashboard/DishesDashboard";

export type DishType = {
  id: string;
  name: string;
  time: number;
  calories: number;
  isFav: boolean;
  tags: TagType[];
} | null;
export type TagType = {
  text: string;
  color: string;
};
export default function Dishes() {
  const [dishes, setDishes] = useState<DishType[]>([
    {
      id: "1",
      name: "Avocado Toast",
      time: 10,
      calories: 240,
      isFav: true,
      tags: [
        { text: "Breakfast", color: "#FF8C8C" },
        { text: "Lunch", color: "#959DD9" },
        { text: "Dinner", color: "#84E99B" },
      ],
    },
    {
      id: "2",
      name: "Avocado Toast",
      time: 10,
      calories: 240,
      isFav: false,
      tags: [
        { text: "Lunch", color: "#959DD9" },
        { text: "Dinner", color: "#84E99B" },
      ],
    },
    {
      id: "3",
      name: "Avocado Toast",
      time: 10,
      calories: 240,
      isFav: false,
      tags: [
        { text: "Breakfast", color: "#FF8C8C" },
        { text: "Lunch", color: "#959DD9" },
      ],
    },
    {
      id: "4",
      name: "Avocado Toast",
      time: 10,
      calories: 240,
      isFav: false,
      tags: [
        { text: "Breakfast", color: "#FF8C8C" },
        { text: "Lunch", color: "#959DD9" },
      ],
    },
    {
      id: "5",
      name: "Avocado Toast",
      time: 10,
      calories: 240,
      isFav: false,
      tags: [
        { text: "Breakfast", color: "#FF8C8C" },
        { text: "Lunch", color: "#959DD9" },
      ],
    },
    {
      id: "6",
      name: "Avocado Toast",
      time: 10,
      calories: 240,
      isFav: false,
      tags: [
        { text: "Breakfast", color: "#FF8C8C" },
        { text: "Lunch", color: "#959DD9" },
      ],
    },
    {
      id: "7",
      name: "AvocadoAvocadoAvocado ToastToastToastToastToast",
      time: 1000000000000000000,
      calories: 222222222222222240,
      isFav: true,
      tags: [
        { text: "BreakfastBreakfastBreakfastBreakfast", color: "#FF8C8C" },
        { text: "Breakfast", color: "#FF8C8C" },
        { text: "Lunch", color: "#959DD9" },
      ],
    },
  ]);

  useEffect(() => {
    setDishes((prev) => [
      ...prev.sort((a, b) => {
        if (!a && !b) return 0;
        if (!a) return 1;
        if (!b) return -1;
        return Number(b.isFav) - Number(a.isFav);
      }),
    ]);
  }, [dishes]);

  return (
    <div className="flex flex-col h-full p-[30px]">
      <DashboardHeader
        title="My Dishes"
        subtitle="Browse and manage your dish collection"
        btnText="Add Dish"
        btnIcon={EMOJI.forkAndKnife}
      />
      {dishes ? (
        <DishesDashboard dishes={dishes} />
      ) : (
        <EmptyDashboard
          emoji={EMOJI.forkAndKnife}
          title="No dishes yet"
          subtitle="Start by adding your favorite dishes to your collection"
          btnText="Add your first dish"
        />
      )}
    </div>
  );
}

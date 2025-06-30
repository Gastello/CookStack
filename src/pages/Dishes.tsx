import { useEffect } from "react";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";
import DishesDashboard from "../components/dishesDashboard/DishesDashboard";
import { useDishesStore } from "../store/dishedStore";

export default function Dishes() {
  const { dishes, fetchDishes, loading, error, addDish } = useDishesStore();

  useEffect(() => {
    fetchDishes();
  }, [fetchDishes]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col h-full p-[30px]">
      <DashboardHeader
        title="My Dishes"
        subtitle="Browse and manage your dish collection"
        btnText="Add Dish"
        btnIcon={EMOJI.forkAndKnife}
        btnEvent={addDish}
      />
      {dishes && dishes.length != 0 ? (
        <DishesDashboard />
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

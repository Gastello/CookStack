import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";
import RandomMealsDashboardHeader from "../components/randomMealsDashboardHeader/RandomMealsDashboardHeader";

export default function RandomMeals() {
  return (
    <div className="flex flex-col h-full p-[30px]">
      <RandomMealsDashboardHeader
        title="Random Meals"
        subtitle="Get inspired with random meal suggestions"
        btnText="Shuffle"
        btnIcon={EMOJI.dice}
      />
      <EmptyDashboard
        emoji={EMOJI.dice}
        title="Ready to get inspired?"
        subtitle="Click shuffle to get random meal suggestions"
      />
    </div>
  );
}

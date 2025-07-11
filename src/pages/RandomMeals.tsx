import Button from "../components/button/Button";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";

export default function RandomMeals() {
  return (
    <div className="flex flex-col h-full p-[30px]">
      <DashboardHeader
        title="Random Meals"
        subtitle="Get inspired with random meal suggestions"
      >
        <div className="flex self-baseline gap-[20px]">
          <div>
            <Button
              text="Shuffle"
              icon={EMOJI.dice}
              color="#F0FDF4"
              textColor="#16A34A"
            />
          </div>
        </div>
      </DashboardHeader>
      <EmptyDashboard
        emoji={EMOJI.dice}
        title="Ready to get inspired?"
        subtitle="Click shuffle to get random meal suggestions"
      />
    </div>
  );
}

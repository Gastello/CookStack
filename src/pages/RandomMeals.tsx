import Button from "../components/button/Button";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import Dropdown from "../components/dropdown/Dropdown";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";
import Input from "../components/input/Input";

export default function RandomMeals() {
  return (
    <div className="flex flex-col h-full p-[30px]">
      <DashboardHeader
        title="Random Meals"
        subtitle="Get inspired with random meal suggestions"
      >
        <div className="flex self-baseline gap-[20px]">
          <Input
            placeholder="Cooking time"
            isBordered={true}
            placeholderEmoji={EMOJI.clock}
            placeholderColor="#1F2937"
            type="number"
            width="230px"
          />
          <Input
            placeholder="Calories"
            isBordered={true}
            placeholderEmoji={EMOJI.fire}
            placeholderColor="#1F2937"
            type="number"
            width="230px"
          />
          <div>
            <Dropdown
              placeholder="Choose tags"
              items={["Breakfast", "Lunch", "Dinner"]}
            />
          </div>
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

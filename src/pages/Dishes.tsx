import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";

export default function Dishes() {
  return (
    <div className="flex flex-col h-full p-[30px]">
      <DashboardHeader
        title="My Dishes"
        subtitle="Browse and manage your dish collection"
        btnText="Add Dish"
        btnIcon={EMOJI.forkAndKnife}
      />
      <EmptyDashboard
        emoji={EMOJI.forkAndKnife}
        title="No dishes yet"
        subtitle="Start by adding your favorite dishes to your collection"
        btnText="Add your first dish"
      />
    </div>
  );
}

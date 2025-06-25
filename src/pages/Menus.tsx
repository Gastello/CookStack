import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";

export default function Menus() {
  return (
    <div className="flex flex-col h-full p-[30px]">
      <DashboardHeader
        title="My Menus"
        subtitle="Create and manage your meal plans"
        btnText="Create Menu"
        btnIcon={EMOJI.memo}
      />
      <EmptyDashboard
        emoji={EMOJI.clipboard}
        title="No menus yet"
        subtitle="Start by creating your first menu to organize your meals"
        btnText="Create your first menu"
      />
    </div>
  );
}

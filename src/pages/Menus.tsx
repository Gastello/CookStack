import Button from "../components/button/Button";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";
import MenusDashboard from "../components/menusDashboard/MenusDashboard";

export default function Menus() {
  return (
    <div className="flex flex-col h-full p-[30px]">
      <DashboardHeader
        title="My Menus"
        subtitle="Create and manage your meal plans"
      >
        <Button
          text="Create Menu"
          icon={EMOJI.memo}
          color="#F0FDF4"
          textColor="#16A34A"
        />
      </DashboardHeader>

      {true ? (
        <MenusDashboard />
      ) : (
        <EmptyDashboard
          emoji={EMOJI.memo}
          title="No menus yet"
          subtitle="Start by creating your first menu to organize your meals"
          btnText="Create your first menu"
        />
      )}
    </div>
  );
}

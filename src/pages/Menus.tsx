import { useEffect } from "react";
import Button from "../components/button/Button";
import DashboardHeader from "../components/dashboardHeader/DashboardHeader";
import { EMOJI } from "../components/emoji/Emoji";
import EmptyDashboard from "../components/emptyDashboard/EmptyDashboard";
import Loader, { LOADER_EMOJIES } from "../components/loader/Loader";
import MenusDashboard from "../components/menusDashboard/MenusDashboard";
import { useMenusStore } from "../store/menusStore";

export default function Menus() {
  const menus = useMenusStore((s) => s.menus);
  const loading = useMenusStore((s) => s.loading);
  const fetchMenus = useMenusStore((s) => s.fetchMenus);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  return (
    <div className="relative flex flex-col h-full p-[30px]">
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

      {loading ? (
        <Loader loading={true} size={256} name={LOADER_EMOJIES.memo} />
      ) : menus && menus.length != 0 ? (
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

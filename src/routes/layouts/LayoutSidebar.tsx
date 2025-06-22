import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";

export default function LayoutSidebar() {
  return (
    <div>
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}

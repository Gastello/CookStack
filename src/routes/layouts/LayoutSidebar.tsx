import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";
import Sidebar from "../../components/sidebar/Sidebar";

export default function LayoutSidebar() {
  return (
    <div>
      <Header />
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";

export default function LayoutDefault() {
  return (
    <div>
      <Header />
      <div className="flex">
        <Outlet />
      </div>
    </div>
  );
}

import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";

export default function LayoutDefault() {
  return (
    <div className="h-full">
      <Header />
      <Outlet />
    </div>
  );
}

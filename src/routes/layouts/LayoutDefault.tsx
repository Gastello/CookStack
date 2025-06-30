import { Outlet } from "react-router-dom";
import Header from "../../components/header/Header";
import Toaster from "../../components/toaster/Toaster";

export default function LayoutDefault() {
  return (
    <div className="h-full">
      <Header />
      <Outlet />
      <Toaster/>
    </div>
  );
}

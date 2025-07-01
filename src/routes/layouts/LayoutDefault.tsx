import { Navigate, Outlet, useLocation } from "react-router-dom";
import Header from "../../components/header/Header";
import Toaster from "../../components/toaster/Toaster";
import { useUserStore } from "../../store/userStore";

export default function LayoutDefault() {
  const { user } = useUserStore();
  const location = useLocation();

  if (
    (user && location.pathname === "/login") ||
    (user && location.pathname === "/register") ||
    (user && location.pathname === "/")
  ) {
    return <Navigate to="/menus" replace />;
  }

  return (
    <div className="h-full">
      <Header />
      <Outlet />
      <Toaster />
    </div>
  );
}

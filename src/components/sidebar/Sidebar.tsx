import { NavLink, useNavigate } from "react-router-dom";
import Emoji, { EMOJI } from "../emoji/Emoji";
import Logo from "../logo/Logo";
import { useState } from "react";
import { useUserStore } from "../../store/userStore";
import { useToastStore } from "../../store/toastStore";

export default function Sidebar() {
  const { user } = useUserStore();
  const { signOutUser } = useUserStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToastStore();

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { success, error } = await signOutUser();

      if (error) {
        console.error("Logout error:", error);
        addToast(false, error);
      } else if (success) {
        addToast(true, "See you next time!");
        navigate("/login");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      addToast(false, "Unexpected error!");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="max-w-[256px] w-full bg-white h-screen py-[30px] px-[24px]">
      <div>
        <div className="px-[40px]">
          <Logo />
        </div>
        <div className="text-center text-[14px]/[24px] mb-[30px]">
          <span className="mr-[5px]">
            Hello, {user?.user_metadata.display_name}!
          </span>
          <Emoji size="14px" name={EMOJI.wavingHand} />
        </div>
        <nav className="*:block *:text-[14px]/[24px] *:px-[16px] *:py-[12px] *:rounded-xl *:mb-[8px]">
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-[#15803D] bg-[#F0FDF4]"
                : "text-[#4B5563] hover:text-[#15803D] hover:bg-[#F0FDF4]"
            }
            to={"/menus"}
          >
            <Emoji name={EMOJI.memo} size="14px" /> My Menus
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-[#15803D] bg-[#F0FDF4]"
                : "text-[#4B5563] hover:text-[#15803D] hover:bg-[#F0FDF4]"
            }
            to={"/dishes"}
          >
            <Emoji name={EMOJI.forkAndKnife} size="14px" /> My Dishes
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-[#15803D] bg-[#F0FDF4]"
                : "text-[#4B5563] hover:text-[#15803D] hover:bg-[#F0FDF4]"
            }
            to={"/random-meals"}
          >
            <Emoji name={EMOJI.dice} size="14px" /> Random Meals
          </NavLink>
          <div
            className={`${
              isLoading
                ? "text-[#801515] bg-[#FDF0F0]"
                : "text-[#4B5563] hover:text-[#801515] hover:bg-[#FDF0F0] cursor-pointer"
            }`}
            onClick={signOut}
          >
            <Emoji name={EMOJI.wavingHand} size="14px" /> Log out
          </div>
        </nav>
      </div>
    </div>
  );
}

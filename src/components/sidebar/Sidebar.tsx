import { NavLink } from "react-router-dom";
import Emoji, { EMOJI } from "../emoji/Emoji";
import Logo from "../logo/Logo";

export default function Sidebar() {
  return (
    <div className="max-w-[256px] w-full bg-white h-screen py-[30px] px-[24px]">
      <div>
        <div className="px-[40px]">
          <Logo />
        </div>
        <div className="text-center text-[14px]/[24px] mb-[30px]">
          <span>Hello, Gastello!</span>{" "}
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
            <Emoji name={EMOJI.clipboard} size="14px" /> My Menus
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
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "text-[#15803D] bg-[#F0FDF4]"
                : "text-[#4B5563] hover:text-[#801515] hover:bg-[#FDF0F0]"
            }
            to={"home"}
          >
            <Emoji name={EMOJI.wavingHand} size="14px" /> Log out
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

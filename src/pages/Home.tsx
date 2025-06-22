import { Link } from "react-router-dom";
import Emoji, { EMOJI } from "../components/emoji/Emoji";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex gap-[50px]">
        <Link to="/about">
          <div className="bg-white rounded-2xl shadow-sm py-[20px] px-[36px] hover:text-[#15803D] hover:bg-[#F0FDF4]">
            <div className="mb-[10px]">
              <Emoji name={EMOJI.eyes} size="128px" />
            </div>
            <div className="text-[18px]/[22px] font-[500] text-center">
              About
            </div>
          </div>
        </Link>
        <Link to="/login">
          <div className="bg-white rounded-2xl shadow-sm py-[20px] px-[36px] hover:text-[#15803D] hover:bg-[#F0FDF4]">
            <div className="mb-[10px]">
              <Emoji name={EMOJI.door} size="128px" />
            </div>
            <div className="text-[18px]/[22px] font-[500] text-center">
              Login
            </div>
          </div>
        </Link>
        <Link to="/register">
          <div className="bg-white rounded-2xl shadow-sm py-[20px] px-[36px] hover:text-[#15803D] hover:bg-[#F0FDF4]">
            <div className="mb-[10px]">
              <Emoji name={EMOJI.key} size="128px" />
            </div>
            <div className="text-[18px]/[22px] font-[500] text-center">
              Register
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

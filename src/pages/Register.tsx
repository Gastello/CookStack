import { Link } from "react-router-dom";
import Button from "../components/button/Button";
import Emoji, { EMOJI } from "../components/emoji/Emoji";
import Input from "../components/input/Input";

export default function Register() {
  return (
    <div className="flex items-center justify-center h-full py-[30px] px-[64px]">
      <div className="max-w-[450px] w-full mx-auto p-[32px] shadow-sm bg-white rounded-2xl">
        <div className="mb-[15px] text-center">
          <Emoji name={EMOJI.manCook} size="40px" />
        </div>
        <div className="font-semibold text-[20px]/[32px] text-[#1F2937] mb-[6px] text-center">
          Create an account
        </div>
        <div className="text-[14px]/[24px] text-[#6B7280] text-center mb-[30px]">
          Join CookStack and start organizing your recipes
        </div>
        <form className="mb-[22px]">
          <div className="*:mb-[16px]">
            <Input
              label="Username"
              placeholder="Enter your username"
              isBordered={false}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              isBordered={false}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              type="password"
              isBordered={false}
            />
          </div>
          <div>
            <Button text="Create Account" />
          </div>
        </form>
        <div className="text-[14px]/[24px] flex gap-[15px] justify-center">
          <div className="text-[#4B5563]">Already have an account?</div>
          <div className="text-[#16A34A]">
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

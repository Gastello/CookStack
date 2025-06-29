import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button/Button";
import Emoji, { EMOJI } from "../components/emoji/Emoji";
import Input from "../components/input/Input";
import { useState } from "react";
import { useUserStore } from "../store/userStore";

export default function Register() {
  const [userName, setUserName] = useState("");
  const [userMail, setUserMail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUpNewUser } = useUserStore();

  const createAccount = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await signUpNewUser({
        email: userMail,
        password: userPassword,
        username: userName,
      });

      if (error) {
        console.error("Registration error:", error);
      } else if (data?.user) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  };

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUserName(e.target.value);
              }}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              isBordered={false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUserMail(e.target.value);
              }}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              type="password"
              isBordered={false}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setUserPassword(e.target.value);
              }}
            />
          </div>
          <div>
            <Button
              isDisabled={isLoading}
              text="Create Account"
              onClick={createAccount}
            />
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

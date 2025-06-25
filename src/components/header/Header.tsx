import { Link } from "react-router-dom";
import Logo from "../logo/Logo";

export default function Header() {
  return (
    <header>
      <div className="absolute left-[64px] top-[30px]">
        <Link to="/">
          <Logo />
        </Link>
      </div>
    </header>
  );
}

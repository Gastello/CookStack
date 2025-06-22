import Logo from "../logo/Logo";

export default function Header() {
  return (
    <header>
      <div className="absolute left-[64px] top-[30px]">
        <Logo />
      </div>
    </header>
  );
}

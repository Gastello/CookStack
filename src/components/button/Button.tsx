type ButtonProps = {
  text: string;
  color?: string;
  isDisabled?: boolean;
};

export default function Button({
  text,
  color = "#16A34A",
  isDisabled = false,
}: ButtonProps) {
  return (
    <button
      disabled={isDisabled}
      className={`px-[16px] py-[12px] bg-[${color}] text-[14px]/[24px] text-white rounded-xl w-full`}
    >
      {text}
    </button>
  );
}

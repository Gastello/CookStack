type DashboardHeaderProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};
export default function DashboardHeader({
  title,
  subtitle,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between">
      <div>
        <div className="font-semibold text-[20px]/[34px] text=[#1F2937]">
          {title}
        </div>
        <div className="text-[14px]/[24px] text-[#6B7280]">{subtitle}</div>
      </div>
      <div>{children}</div>
    </div>
  );
}

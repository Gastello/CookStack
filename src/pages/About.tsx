import Emoji, { EMOJI } from "../components/emoji/Emoji";
import InfoCard from "../components/infoCard/InfoCard";

export default function About() {
  return (
    <div className="flex items-center justify-center h-full py-[30px] px-[64px]">
      <div>
        <div className="mb-[15px] flex justify-center">
          <Emoji name={EMOJI.manCook} size="52px" />
        </div>
        <div className="font-semibold text-[26px]/[36px] text-[#1F2937] mb-[15px] text-center">
          About CookStack
        </div>
        <div className="text-[14px]/[24px] text-[#6B7280] text-center max-w-[580px] mb-[50px] mx-auto">
          CookStack is your personal kitchen companion, designed to make meal
          planning and recipe management a delightful experience.
        </div>
        <div className="flex gap-[32px] max-w-[800px] mb-[50px] mx-auto">
          <InfoCard
            header="Menu Planning"
            icon={EMOJI.memo}
            text="Create and organize weekly meal plans with ease"
          />
          <InfoCard
            header="Recipe Collection"
            icon={EMOJI.forkAndKnife}
            text="Store and manage your favorite recipes in one place"
          />
          <InfoCard
            header="Random Suggestions"
            icon={EMOJI.dice}
            text="Get inspired with random meal recommendations"
          />
        </div>
        <div className="max-w-[800px] mx-auto">
          <InfoCard
            header="Our Mission"
            text="We believe that cooking should be enjoyable and stress-free. Our mission is to help you organize your culinary journey, discover new recipes, and make meal planning a seamless part of your daily routine."
          />
        </div>
      </div>
    </div>
  );
}

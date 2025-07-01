import { useEffect, useState } from "react";

export const LOADER_EMOJIES = {
  pan: "Cooking",
  dice: "Dice",
  memo: "Memo",
  forkAndKnife: "Fork And Knife With Plate",
  banana: "Banana",
  bottle: "Bottle With Popping Cork",
  hamburger: "Hamburger",
  pancakes: "Pancakes",
  pizza: "Pizza",
  sandwich: "Sandwich",
};
type LoaderProps = {
  name?: (typeof LOADER_EMOJIES)[keyof typeof LOADER_EMOJIES];
  size?: number;
  duration?: number;
  loading?: boolean;
};
export default function Loader({
  size = 128,
  name = LOADER_EMOJIES.pan,
  loading,
  duration,
}: LoaderProps) {
  const [playing, setPlaying] = useState(true);

  // Сценарій 1: якщо loading є, вимикаємо анімацію коли loading стає false
  useEffect(() => {
    if (loading === false) setPlaying(false);
    if (loading === true) setPlaying(true);
  }, [loading]);

  // Сценарій 2: якщо loading немає, але є duration
  useEffect(() => {
    if (loading === undefined && duration) {
      setPlaying(true);
      const timer = setTimeout(() => setPlaying(false), duration);
      return () => clearTimeout(timer);
    }
  }, [loading, duration]);

  // Сценарій 3: якщо немає loading і duration, граємо один раз
  const handleEnded = () => {
    if (loading === undefined && !duration) setPlaying(false);
  };

  if (!playing) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <video
        width={size}
        height={size}
        autoPlay
        muted
        playsInline
        loop={!!loading || (!!duration && loading === undefined)}
        onEnded={handleEnded}
        src={`/assets/animatedEmoji/${name}.webm`}
      />
    </div>
  );
}

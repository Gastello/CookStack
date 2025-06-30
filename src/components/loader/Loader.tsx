import { useState, useEffect } from "react";

export const LOADER_GIFS = {
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
  name?: (typeof LOADER_GIFS)[keyof typeof LOADER_GIFS];
  size?: string;
  duration?: number;
  loading?: boolean;
};
export default function Loader({
  size = "128px",
  name = LOADER_GIFS.pan,
  loading,
  duration = 1518,
}: LoaderProps) {
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPlaying(false);
    }, duration);

    return () => clearTimeout(timeout);
  }, [duration]);

  if (loading === undefined && !playing) return null;
  if (!loading && loading !== undefined) return null;

  return (
    <div className="absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] z-5">
      <img
        height={size}
        width={size}
        src={`/assets/animatedEmoji/${name}.webp`}
        alt={name}
      />
    </div>
  );
}

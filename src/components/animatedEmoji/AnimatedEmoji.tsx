import { useEffect, useRef } from "react";

export const ANIMATED_EMOJI = {
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
  meltingFace: "Melting Face",

  checkmarkFalse: "checkmark-false",
  checkmarkTrue: "checkmark-true",
  clipboard: "clipboard",
  clock: "clock",
  dart: "dart",
  door: "door",
  eyes: "eyes",
  fire: "fire",
  heartGray: "heart-gray",
  heartRed: "heart-red",
  key: "key",
  wavingHand: "waving-hand",
  trash: "trash",
  save: "save",
  plus: "plus",
  manCook: "man-cook",
};
type AnimatedEmojiBaseProps = {
  name: (typeof ANIMATED_EMOJI)[keyof typeof ANIMATED_EMOJI];
  size?: string;
};

type AnimatedEmojiProps =
  | (AnimatedEmojiBaseProps & {
      loop: true;
      isPlaying?: never;
    })
  | (AnimatedEmojiBaseProps & {
      loop?: false;
      isPlaying?: boolean;
    });

export default function AnimatedEmoji({
  name,
  size = "128px",
  loop = false,
  isPlaying = false,
}: AnimatedEmojiProps) {
  const video = useRef<HTMLVideoElement>(null);
  const startVideo = () => {
    if (loop) return;
    if (video.current) {
      video.current.loop = true;
      video.current.play();
    }
  };
  const stopVideo = () => {
    if (loop) return;
    if (video.current) {
      video.current.loop = false;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      startVideo();
    } else stopVideo();
  }, [isPlaying]);

  return (
    <div className="inline-block">
      <video
        onMouseEnter={startVideo}
        onMouseLeave={stopVideo}
        ref={video}
        width={size}
        height={size}
        autoPlay
        muted
        playsInline
        loop={loop}
        src={`/assets/animatedEmoji/${name}.webm`}
      />
    </div>
  );
}

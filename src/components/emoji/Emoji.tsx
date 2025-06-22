export const EMOJI = {
  checkmarkFalse: "checkmark-false",
  checkmarkTrue: "checkmark-true",
  clipboard: "clipboard",
  clock: "clock",
  dart: "dart",
  dice: "dice",
  door: "door",
  eyes: "eyes",
  fire: "fire",
  forkAndKnife: "fork-and-knife",
  heartGray: "heart-gray",
  heartRed: "heart-red",
  key: "key",
  wavingHand: "waving-hand",
  trash: "trash",
  save: "save",
  plus: "plus",
  pan: "pan",
  memo: "memo",
  manCook: "man-cook",
};
type EmojiProps = {
  name: (typeof EMOJI)[keyof typeof EMOJI];
  size: string;
};
export default function Emoji({ name, size }: EmojiProps) {
  return (
    <div
      aria-label={name}
      role="img"
      className="inline-block align-middle relative top-[-2px] bg-no-repeat bg-center bg-contain"
      style={{
        backgroundImage: `url(/assets/emoji/${name}.png)`,
        width: size,
        height: size,
      }}
    />
  );
}

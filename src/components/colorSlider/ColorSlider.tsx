const MAX_COLOR_VALUE = 233;
const MIN_COLOR_VALUE = 132;

const gradientColors = [
  { stop: 0, color: [MAX_COLOR_VALUE, MIN_COLOR_VALUE, MIN_COLOR_VALUE] }, // red
  { stop: 0.17, color: [MAX_COLOR_VALUE, MAX_COLOR_VALUE, MIN_COLOR_VALUE] }, // yellow
  { stop: 0.34, color: [MIN_COLOR_VALUE, MAX_COLOR_VALUE, MIN_COLOR_VALUE] }, // green
  { stop: 0.51, color: [MIN_COLOR_VALUE, MAX_COLOR_VALUE, MAX_COLOR_VALUE] }, // cyan
  { stop: 0.68, color: [MIN_COLOR_VALUE, MIN_COLOR_VALUE, MAX_COLOR_VALUE] }, // blue
  { stop: 0.85, color: [MAX_COLOR_VALUE, MIN_COLOR_VALUE, MAX_COLOR_VALUE] }, // magenta
  { stop: 1, color: [MAX_COLOR_VALUE, MIN_COLOR_VALUE, MIN_COLOR_VALUE] }, // red (закриває цикл)
];

// Функція для інтерполяції кольору між двома точками
function interpolateColor(t: number, c0: number[], c1: number[]) {
  return c0.map((v, i) => Math.round(v + (c1[i] - v) * t));
}

// Функція конвертує масив RGB у рядок
const rgbArrayToString = (rgb: number[]) =>
  `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

// Формуємо рядок градієнту
const gradientString = `linear-gradient(to right, ${gradientColors
  .map(({ stop, color }) => `${rgbArrayToString(color)} ${stop * 100}%`)
  .join(", ")})`;

// Отримати колір з градієнту за позицією (0..1)
export function getColorAtPosition(pos: number) {
  for (let i = 0; i < gradientColors.length - 1; i++) {
    if (pos >= gradientColors[i].stop && pos <= gradientColors[i + 1].stop) {
      const localT =
        (pos - gradientColors[i].stop) /
        (gradientColors[i + 1].stop - gradientColors[i].stop);
      const rgb = interpolateColor(
        localT,
        gradientColors[i].color,
        gradientColors[i + 1].color
      );
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
  }
  return "rgb(255, 0, 0)"; // fallback red
}
type ColorSliderProps = {
  value: number;
  setValue: (value: number) => void;
};
export default function ColorSlider({ value, setValue }: ColorSliderProps) {
  const color = getColorAtPosition(value);

  return (
    <div className="flex items-center">
      <input
        type="range"
        min={0}
        max={1}
        step={0.001}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-[150px] h-[5px] rounded-lg appearance-none cursor-pointer"
        style={{
          background: gradientString,
          // кастомний кольоровий повзунок (thumb)
          accentColor: color, // для браузерів, які підтримують
        }}
      />
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          appearance: none;
          width: 15px;
          height: 15px;
          background: ${color};
          border: 2px solid #fff;
          cursor: pointer;
          top: 50%;
          transform: translateY(-50%);
          position: relative;
          z-index: 2;
        }
        input[type=range]::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: ${color};
          border: 2px solid #fff;
          cursor: pointer;
          top: 50%;
          transform: translateY(-50%);
          position: relative;
          z-index: 2;
        }
        input[type=range]::-webkit-slider-runnable-track {
          height: 5px;
          border-radius: 6px;
        }
        input[type=range]::-moz-range-track {
          height: 5px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}

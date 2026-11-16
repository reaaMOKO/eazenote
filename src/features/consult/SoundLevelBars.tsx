/**
 * Four bars that rise with the loudness of the microphone, echoing the sound
 * bars in the EazeNote logo. They reassure the doctor that the consult is
 * actually being picked up.
 */

/** Tallest height of each bar in pixels, shaped like the logo's bars. */
const BAR_MAX_HEIGHTS = [28, 52, 60, 36];
const BAR_RESTING_HEIGHT = 8;

interface SoundLevelBarsProps {
  /** Loudness from 0 (silent) to 1 (loud). */
  inputLevel: number;
  /** Gently pulse the bars to show work in progress (used while transcribing). */
  isPulsing?: boolean;
}

export function SoundLevelBars({ inputLevel, isPulsing = false }: SoundLevelBarsProps) {
  return (
    <div aria-hidden="true" className={`flex h-16 items-center gap-2 ${isPulsing ? "animate-pulse" : ""}`}>
      {BAR_MAX_HEIGHTS.map((maxHeight, barIndex) => {
        const level = isPulsing ? 0.6 : inputLevel;
        const height = BAR_RESTING_HEIGHT + (maxHeight - BAR_RESTING_HEIGHT) * level;
        return (
          <span
            key={barIndex}
            className={`w-2.5 rounded-full transition-[height] duration-100 ${
              barIndex === BAR_MAX_HEIGHTS.length - 1 ? "bg-green" : "bg-deep"
            }`}
            style={{ height }}
          />
        );
      })}
    </div>
  );
}

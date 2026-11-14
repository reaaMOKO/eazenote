/**
 * The EazeNote mark from the brand canvas: round deep-green badge with a white
 * speech bubble and sound bars, next to the two-tone wordmark.
 */

interface EazeNoteLogoProps {
  /** Badge diameter in pixels. The wordmark scales with it. */
  badgeSize?: number;
}

export function EazeNoteBadge({ badgeSize = 36 }: EazeNoteLogoProps) {
  return (
    <svg width={badgeSize} height={badgeSize} viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <circle cx="24" cy="24" r="24" fill="#1E5F4A" />
      <g transform="translate(10 10) scale(1.1667)">
        <path
          d="M5 4h14a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7l-5 4v-4H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3z"
          fill="#FFFFFF"
        />
        <rect x="6" y="8.5" width="1.6" height="3" rx="0.8" fill="#1E5F4A" />
        <rect x="8.8" y="7" width="1.6" height="6" rx="0.8" fill="#1E5F4A" />
        <rect x="11.6" y="6.5" width="1.6" height="7" rx="0.8" fill="#1E5F4A" />
        <rect x="14.4" y="8" width="1.6" height="4" rx="0.8" fill="#237A5B" />
        <rect x="6" y="14.6" width="12" height="1.4" rx="0.7" fill="#1E5F4A" />
      </g>
    </svg>
  );
}

export function EazeNoteLogo({ badgeSize = 36 }: EazeNoteLogoProps) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <EazeNoteBadge badgeSize={badgeSize} />
      <span
        className="font-extrabold tracking-tight text-deep"
        style={{ fontSize: badgeSize * 0.66, lineHeight: 1 }}
      >
        Eaze<span className="text-green">Note</span>
      </span>
    </span>
  );
}

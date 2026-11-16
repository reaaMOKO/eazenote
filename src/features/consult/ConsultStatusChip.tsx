import type { ConsultStatus, ConsultStatusTone } from "./consult-display";

// Each tone differs in wording as well as colour, so it reads without colour vision.
const TONE_CLASSES: Record<ConsultStatusTone, string> = {
  approved: "bg-tint text-deep",
  draft: "bg-caution-tint text-caution",
  waiting: "bg-line/60 text-slate",
};

/** The small rounded label showing where a consult stands: Approved, Draft, To record. */
export function ConsultStatusChip({ status }: { status: ConsultStatus }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${TONE_CLASSES[status.tone]}`}
    >
      {status.label}
    </span>
  );
}

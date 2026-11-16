import { summariseConsults } from "@/features/consult/consult-display";
import type { Consult } from "@/features/consult/consult-types";

/** Three numbers at a glance: consults, approved documents, and drafts still to check. */
export function TodaySummary({ consults }: { consults: Consult[] }) {
  const summary = summariseConsults(consults);

  const tiles = [
    { label: "Consults", value: summary.consultCount, needsAttention: false },
    { label: "Approved documents", value: summary.approvedDocumentCount, needsAttention: false },
    // Drafts waiting for the doctor are the to-do list, so they stand out when above zero.
    {
      label: "Drafts to check",
      value: summary.draftDocumentCount,
      needsAttention: summary.draftDocumentCount > 0,
    },
  ];

  return (
    <dl className="grid grid-cols-3 gap-3 sm:gap-6">
      {tiles.map((tile) => (
        // The number is shown above its label, but the label comes first for screen readers.
        <div
          key={tile.label}
          className="flex flex-col-reverse justify-end gap-1 rounded-3xl bg-white px-4 py-4 shadow-card sm:px-7 sm:py-5"
        >
          <dt className="text-sm font-semibold text-slate">{tile.label}</dt>
          <dd
            className={`text-3xl font-extrabold tracking-tight tabular-nums sm:text-4xl ${
              tile.needsAttention ? "text-caution" : "text-deep"
            }`}
          >
            {tile.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

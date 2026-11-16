import Link from "next/link";
import { describeConsultProgress, findNextStep } from "@/features/consult/consult-rules";
import type { Consult } from "@/features/consult/consult-types";
import { formatDateAndTime } from "@/lib/format";

/**
 * Consults from this session, each linking to the step where the doctor left off.
 * Only shown when there is at least one; the hero button covers the empty case.
 */
export function RecentConsults({ consults }: { consults: Consult[] }) {
  return (
    <section aria-labelledby="recent-consults-heading" className="flex flex-col gap-3">
      <h2 id="recent-consults-heading" className="text-2xl font-extrabold tracking-tight text-forest">
        Pick up where you left off
      </h2>

      <ul className="grid gap-3 sm:grid-cols-2">
        {consults.map((consult) => (
          <li key={consult.id}>
            <Link
              href={`/consults/${consult.id}/${findNextStep(consult)}`}
              className="flex min-h-20 flex-col justify-center gap-0.5 rounded-2xl border border-line bg-white px-5 py-4 hover:border-deep hover:bg-tint"
            >
              <span className="text-lg font-bold text-forest">{consult.patientName}</span>
              <span className="text-sm text-slate">{formatDateAndTime(consult.createdAt)}</span>
              <span className="mt-1 text-sm font-semibold text-green">
                {describeConsultProgress(consult)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

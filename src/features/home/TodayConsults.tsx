import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ChevronRightIcon } from "@/components/ui/icons";
import { describeConsultStatus, shortenPatientName } from "@/features/consult/consult-display";
import { describeConsultProgress, findNextStep } from "@/features/consult/consult-rules";
import type { Consult } from "@/features/consult/consult-types";
import { ConsultStatusChip } from "@/features/consult/ConsultStatusChip";
import { PatientAvatar } from "@/features/consult/PatientAvatar";
import { formatTime } from "@/lib/format";

/** Today's consults. Each row opens the consult at the step where the doctor left off. */
export function TodayConsults({ consults }: { consults: Consult[] }) {
  return (
    <Card aria-labelledby="today-consults-heading" className="flex flex-col gap-4">
      <h2 id="today-consults-heading" className="text-xl font-extrabold tracking-tight text-deep">
        Today&apos;s consults
      </h2>

      {consults.length === 0 ? (
        <p className="rounded-2xl bg-tint px-4 py-5 text-base text-slate">
          No consults yet. Start one and its drafts will appear here, about a minute after you stop
          recording.
        </p>
      ) : (
        <ul className="-mx-2 flex flex-col gap-1">
          {consults.map((consult) => (
            <li key={consult.id}>
              <Link
                href={`/consults/${consult.id}/${findNextStep(consult)}`}
                className="flex min-h-16 items-center gap-3 rounded-2xl px-2 py-2.5 hover:bg-tint"
              >
                <PatientAvatar patientName={consult.patientName} />

                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-base text-ink">
                    <span className="font-bold">{shortenPatientName(consult.patientName)}</span>
                    <span className="text-slate"> · Consult {formatTime(consult.createdAt)}</span>
                  </span>
                  <span className="truncate text-sm text-slate">
                    {describeConsultProgress(consult)}
                  </span>
                </span>

                <ConsultStatusChip status={describeConsultStatus(consult)} />
                <span className="text-slate">
                  <ChevronRightIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

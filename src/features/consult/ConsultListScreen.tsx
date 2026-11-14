"use client";

import Link from "next/link";
import { PageHeading } from "@/components/layout/PageHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { isPracticeProfileComplete } from "@/features/practice/practice-rules";
import { usePracticeProfile } from "@/features/practice/practice-store";
import { formatDateAndTime } from "@/lib/format";
import { describeConsultProgress, findNextStep } from "./consult-rules";
import { useConsultList } from "./consult-store";

/** Home screen after sign-in: start a consult, or pick up one in progress. */
export function ConsultListScreen() {
  const consults = useConsultList();
  const practiceProfile = usePracticeProfile();

  if (consults === undefined || practiceProfile === undefined) return null; // Still loading.

  return (
    <>
      <PageHeading title="Consults">
        Record a consultation and get a draft clinical note, referral letter or prescription to
        check and approve.
      </PageHeading>

      {!isPracticeProfileComplete(practiceProfile) && (
        <Notice tone="caution" title="Your letterhead is not set up yet">
          Documents will show blanks until you{" "}
          <Link href="/practice" className="font-semibold text-deep underline underline-offset-4">
            add your practice details
          </Link>
          .
        </Notice>
      )}

      <ButtonLink href="/consults/new" className="sm:self-start">
        Start a consult
      </ButtonLink>

      <section aria-labelledby="recent-consults-heading" className="flex flex-col gap-3">
        <h2 id="recent-consults-heading" className="text-xl font-bold text-deep">
          Consults in this session
        </h2>

        {consults.length === 0 ? (
          <p className="rounded-lg bg-tint px-4 py-5 text-base text-slate">
            No consults yet. Start one above; it takes about a minute from recording to draft.
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-line border-y border-line">
            {consults.map((consult) => (
              <li key={consult.id}>
                <Link
                  href={`/consults/${consult.id}/${findNextStep(consult)}`}
                  className="flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-1 px-1 py-3 hover:bg-tint"
                >
                  <span className="flex flex-col">
                    <span className="text-base font-semibold text-ink">{consult.patientName}</span>
                    <span className="text-sm text-slate">{formatDateAndTime(consult.createdAt)}</span>
                  </span>
                  <span className="text-sm font-semibold text-deep">
                    {describeConsultProgress(consult)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

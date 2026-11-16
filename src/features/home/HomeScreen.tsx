"use client";

import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MicrophoneIcon } from "@/components/ui/icons";
import { Notice } from "@/components/ui/Notice";
import { useConsultList } from "@/features/consult/consult-store";
import { isPracticeProfileComplete } from "@/features/practice/practice-rules";
import { usePracticeProfile } from "@/features/practice/practice-store";
import { LetterheadCard } from "./LetterheadCard";
import { TodayConsults } from "./TodayConsults";
import { TodaySummary } from "./TodaySummary";

/**
 * "Today": the home screen after sign-in.
 *
 * Laid out as cards, top to bottom in the order a doctor needs them:
 *   1. Start a consult (the one main action)
 *   2. Today's numbers at a glance
 *   3. Today's consults, each opening at the step where it was left
 *   4. On the side: the saved letterhead, and the approval reminder
 */
export function HomeScreen() {
  const consults = useConsultList();
  const practiceProfile = usePracticeProfile();

  if (consults === undefined || practiceProfile === undefined) return null; // Still loading.

  const isLetterheadReady = isPracticeProfileComplete(practiceProfile);

  return (
    <>
      {!isLetterheadReady && (
        <Notice tone="caution" title="Your letterhead is not set up yet">
          Documents will show blanks until you{" "}
          <Link href="/practice" className="font-semibold text-deep underline underline-offset-4">
            add your practice details
          </Link>
          .
        </Notice>
      )}

      <Card className="flex flex-wrap items-center justify-between gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-tight text-deep sm:text-[2rem]">
            Today
          </h1>
          <p className="max-w-prose text-base text-slate">
            {practiceProfile?.doctorName
              ? `Welcome back, ${practiceProfile.doctorName}.`
              : "Welcome to EazeNote."}{" "}
            Record a consult, check the drafts, approve.
          </p>
        </div>
        <ButtonLink href="/consults/new" className="max-sm:w-full">
          <MicrophoneIcon />
          Start a consult
        </ButtonLink>
      </Card>

      <TodaySummary consults={consults} />

      {/* "grid-cols-1" keeps long names from stretching the cards past a phone screen. */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <TodayConsults consults={consults} />

        <div className="flex flex-col gap-6">
          {isLetterheadReady && practiceProfile && <LetterheadCard practiceProfile={practiceProfile} />}

          <section className="rounded-3xl bg-deep p-5 text-white shadow-card sm:p-7">
            <h2 className="text-lg font-extrabold tracking-tight">You approve everything</h2>
            <p className="mt-2 text-sm leading-relaxed text-mint">
              Nothing is printed or sent until you approve it. Anything unclear in a consult is
              marked [CHECK], never guessed.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

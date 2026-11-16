"use client";

import Link from "next/link";
import { Notice } from "@/components/ui/Notice";
import { useConsultList } from "@/features/consult/consult-store";
import { isPracticeProfileComplete } from "@/features/practice/practice-rules";
import { usePracticeProfile } from "@/features/practice/practice-store";
import { ApprovalPromise } from "./ApprovalPromise";
import { DocumentCards } from "./DocumentCards";
import { HomeHero } from "./HomeHero";
import { RecentConsults } from "./RecentConsults";

/**
 * Home screen after sign-in. Styled after the EazeNote ad: a cream hero with
 * one bold question and one pill button, then flat colour blocks.
 *
 * Order matters for a working doctor:
 *   1. Start a consult (the one main action)
 *   2. Consults already in progress, if there are any
 *   3. What EazeNote produces, and the approval promise
 */
export function HomeScreen() {
  const consults = useConsultList();
  const practiceProfile = usePracticeProfile();

  if (consults === undefined || practiceProfile === undefined) return null; // Still loading.

  return (
    <>
      {!isPracticeProfileComplete(practiceProfile) && (
        <Notice tone="caution" title="Your letterhead is not set up yet">
          Documents will show blanks until you{" "}
          <Link href="/practice" className="font-semibold text-deep underline underline-offset-4">
            add your practice details
          </Link>
          .
        </Notice>
      )}

      <HomeHero doctorName={practiceProfile?.doctorName || null} />

      {consults.length > 0 && <RecentConsults consults={consults} />}

      <DocumentCards />
      <ApprovalPromise />
    </>
  );
}

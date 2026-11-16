import Link from "next/link";
import { Card } from "@/components/ui/Card";
import type { PracticeProfile } from "@/features/practice/practice-types";

/**
 * A quick reminder of whose details go on every document. It shows that the
 * one-time practice setup is done, with a way to change it.
 */
export function LetterheadCard({ practiceProfile }: { practiceProfile: PracticeProfile }) {
  return (
    <Card aria-labelledby="letterhead-card-heading" className="flex flex-col gap-2">
      <h2
        id="letterhead-card-heading"
        className="text-xs font-bold tracking-widest text-slate uppercase"
      >
        Your letterhead
      </h2>
      <p className="text-lg leading-snug font-extrabold tracking-tight text-deep">
        {practiceProfile.practiceName}
      </p>
      <p className="text-sm text-slate">
        {practiceProfile.doctorName}, HPCSA {practiceProfile.hpcsaNumber}
      </p>
      <p className="text-sm text-slate">Added to every document automatically.</p>
      <Link
        href="/practice"
        className="mt-1 flex min-h-11 items-center self-start text-sm font-semibold text-deep underline underline-offset-4 hover:text-green"
      >
        View or edit practice details
      </Link>
    </Card>
  );
}

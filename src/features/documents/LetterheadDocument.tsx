/**
 * A document laid out on the practice letterhead: the version that is shown
 * after approval, printed, and (from Phase 4) turned into a PDF.
 */
import type { PracticeProfile } from "@/features/practice/practice-types";
import { formatDate, formatDateAndTime } from "@/lib/format";
import { isApproved } from "./document-rules";
import { DOCUMENT_KIND_LABELS, type ClinicalDocument, type DocumentKind } from "./document-types";

/** Shown where a practice detail has not been filled in yet. */
function PlaceholderText({ children }: { children: string }) {
  return <span className="text-slate">[{children}]</span>;
}

/** The top of the letterhead: logo and practice details. Also used as the preview on the setup screen. */
export function LetterheadHeader({ practiceProfile }: { practiceProfile: PracticeProfile | null }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-deep pb-4">
      <div className="flex flex-col gap-1">
        <p className="text-xl font-extrabold tracking-tight text-deep">
          {practiceProfile?.practiceName || <PlaceholderText>Practice name</PlaceholderText>}
        </p>
        <p className="text-sm whitespace-pre-line text-ink">
          {practiceProfile?.practiceAddress || <PlaceholderText>Practice address</PlaceholderText>}
        </p>
        <p className="text-sm text-ink">
          Tel: {practiceProfile?.practicePhone || <PlaceholderText>Phone number</PlaceholderText>}
        </p>
        <p className="text-sm text-ink">
          Practice no:{" "}
          {practiceProfile?.practiceNumber || <PlaceholderText>Practice number</PlaceholderText>}
        </p>
      </div>

      {practiceProfile?.logoImage && (
        // A plain <img> is correct here: the logo is local data, not a file on a server.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={practiceProfile.logoImage}
          alt={`${practiceProfile.practiceName} logo`}
          className="max-h-20 max-w-44 object-contain"
        />
      )}
    </header>
  );
}

const PRINTED_TITLES: Record<DocumentKind, string> = {
  "clinical-note": "Clinical note",
  "referral-letter": "Referral letter",
  "prescription-draft": "Prescription",
};

interface LetterheadDocumentProps {
  document: ClinicalDocument;
  practiceProfile: PracticeProfile | null;
  patientName: string;
}

export function LetterheadDocument({ document, practiceProfile, patientName }: LetterheadDocumentProps) {
  const approval = document.approval;
  const isPrescription = document.kind === "prescription-draft";
  const isReferral = document.kind === "referral-letter";

  return (
    <article
      aria-label={`${DOCUMENT_KIND_LABELS[document.kind]} for ${patientName}`}
      className="flex flex-col gap-5 rounded-lg border border-line bg-white p-5 text-[15px] leading-relaxed text-ink sm:p-10 print:rounded-none print:border-0 print:p-0"
    >
      <LetterheadHeader practiceProfile={practiceProfile} />

      {/* Safety rule: a draft must never look like a finished document, on screen or on paper. */}
      {!isApproved(document) && (
        <p className="border-2 border-caution-line bg-caution-tint px-3 py-2 text-center font-extrabold text-caution">
          DRAFT, NOT APPROVED
        </p>
      )}

      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-extrabold tracking-tight text-deep">
          {PRINTED_TITLES[document.kind]}
        </h2>
        <p>{approval ? formatDate(approval.approvedAt) : "Not dated until approved"}</p>
      </div>

      <dl className="flex flex-col gap-3">
        {document.sections.map((section) => (
          <div key={section.id} className="break-inside-avoid">
            <dt className="font-bold">{section.heading}</dt>
            <dd className="whitespace-pre-line">{section.body}</dd>
          </div>
        ))}
      </dl>

      <footer className="mt-4 flex break-inside-avoid flex-col gap-1">
        {isReferral && practiceProfile?.signatureImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={practiceProfile.signatureImage}
            alt={`Signature of ${practiceProfile.doctorName}`}
            className="max-h-16 max-w-48 self-start object-contain"
          />
        )}

        {/* Prescriptions are never signed electronically in the MVP: leave room for a pen. */}
        {isPrescription && (
          <div className="mt-10 w-64 border-t border-ink pt-1 text-sm">Prescriber&apos;s signature</div>
        )}

        <p className="font-bold">
          {practiceProfile?.doctorName || <PlaceholderText>Doctor&apos;s name</PlaceholderText>}
        </p>
        <p className="text-sm">
          HPCSA no: {practiceProfile?.hpcsaNumber || <PlaceholderText>HPCSA number</PlaceholderText>}
        </p>

        {isPrescription && (
          <p className="mt-3 border-t border-line pt-2 text-sm font-bold">
            Not valid until signed by the prescriber.
          </p>
        )}

        {approval && (
          <p className="mt-3 text-xs text-slate">
            Approved by {approval.approvedByName} on {formatDateAndTime(approval.approvedAt)}.
            Drafted with EazeNote from the recorded consultation.
          </p>
        )}
      </footer>
    </article>
  );
}

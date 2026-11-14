"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeading } from "@/components/layout/PageHeading";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Notice } from "@/components/ui/Notice";
import { DEFAULT_TRANSCRIPT_RETENTION_DAYS } from "@/config/app-config";
import {
  DOCUMENT_KINDS,
  DOCUMENT_KIND_DESCRIPTIONS,
  DOCUMENT_KIND_LABELS,
  type ClinicalDocument,
  type DocumentKind,
} from "@/features/documents/document-types";
import { formatDurationInWords } from "@/lib/format";
import { draftingService } from "@/services";
import { ConsultScreenFrame } from "./ConsultScreenFrame";
import { saveConsult } from "./consult-store";
import type { Consult, Transcript } from "./consult-types";

/** Step 3: read the transcript and choose which documents to draft from it. */
export function TranscriptScreen() {
  return (
    <ConsultScreenFrame currentStep="transcript">
      {(consult) => <TranscriptReview consult={consult} />}
    </ConsultScreenFrame>
  );
}

function TranscriptReview({ consult }: { consult: Consult }) {
  if (!consult.transcript) {
    return (
      <>
        <PageHeading title="No transcript yet">
          Record the consult with {consult.patientName} first.
        </PageHeading>
        <ButtonLink href={`/consults/${consult.id}/record`} className="sm:self-start">
          Go to recording
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <PageHeading title={`Transcript for ${consult.patientName}`}>
        Check that the transcript matches the consult. Drafts are written from this text only.
      </PageHeading>

      {consult.transcript.isSampleData && (
        <Notice tone="info" title="This is a sample transcript">
          In demo mode every consult shows this sample, not what you recorded.
        </Notice>
      )}

      <TranscriptText transcript={consult.transcript} recordingSeconds={consult.recordingSeconds} />

      {consult.documents.length > 0 ? (
        <section className="flex flex-col gap-4">
          <Notice tone="success" title="Documents are already drafted for this consult" />
          <ButtonLink href={`/consults/${consult.id}/documents`} className="sm:self-start">
            Open the documents
          </ButtonLink>
        </section>
      ) : (
        <DocumentChooser consult={consult} transcript={consult.transcript} />
      )}
    </>
  );
}

function TranscriptText({
  transcript,
  recordingSeconds,
}: {
  transcript: Transcript;
  recordingSeconds: number | null;
}) {
  return (
    <section aria-labelledby="transcript-heading" className="flex flex-col gap-4">
      <h2 id="transcript-heading" className="sr-only">
        Transcript
      </h2>

      <dl className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-slate">
        <div className="flex gap-1.5">
          <dt>Languages heard:</dt>
          <dd className="font-semibold text-ink">{transcript.languages.join(", ")}</dd>
        </div>
        {recordingSeconds !== null && recordingSeconds > 0 && (
          <div className="flex gap-1.5">
            <dt>Recording length:</dt>
            <dd className="font-semibold text-ink">{formatDurationInWords(recordingSeconds)}</dd>
          </div>
        )}
      </dl>

      <ol className="flex flex-col gap-4 border-y border-line py-5">
        {transcript.segments.map((segment, segmentIndex) => (
          <li key={segmentIndex} className="grid gap-x-4 gap-y-0.5 sm:grid-cols-[5rem_1fr]">
            <span
              className={`text-sm font-bold ${
                segment.speaker === "Doctor" ? "text-deep" : "text-slate"
              }`}
            >
              {segment.speaker}
            </span>
            <span className="max-w-prose text-base text-ink">{segment.text}</span>
          </li>
        ))}
      </ol>

      <p className="text-sm text-slate">
        The audio is deleted straight after transcription. The transcript is deleted after{" "}
        {DEFAULT_TRANSCRIPT_RETENTION_DAYS} days unless you choose otherwise.
      </p>
    </section>
  );
}

function DocumentChooser({ consult, transcript }: { consult: Consult; transcript: Transcript }) {
  const router = useRouter();
  const [chosenKinds, setChosenKinds] = useState<DocumentKind[]>(["clinical-note"]);
  /** While drafting: the document being written now. Null when idle. */
  const [kindBeingDrafted, setKindBeingDrafted] = useState<DocumentKind | null>(null);
  const [draftingFailed, setDraftingFailed] = useState(false);

  const isDrafting = kindBeingDrafted !== null;
  const chosenCount = chosenKinds.length;

  function toggleKind(kind: DocumentKind, isChosen: boolean) {
    setChosenKinds((currentKinds) =>
      // Rebuild from DOCUMENT_KINDS so the order is always note, referral, prescription.
      DOCUMENT_KINDS.filter((candidate) =>
        candidate === kind ? isChosen : currentKinds.includes(candidate),
      ),
    );
  }

  async function handleDraftDocuments() {
    setDraftingFailed(false);
    const draftedDocuments: ClinicalDocument[] = [];
    try {
      // One at a time, so the screen can say which document is being written.
      for (const kind of chosenKinds) {
        setKindBeingDrafted(kind);
        draftedDocuments.push(
          await draftingService.draftDocument({ kind, transcript, patientName: consult.patientName }),
        );
      }
      saveConsult({ ...consult, documents: draftedDocuments });
      router.push(`/consults/${consult.id}/documents`);
    } catch {
      setDraftingFailed(true);
      setKindBeingDrafted(null);
    }
  }

  return (
    <section aria-labelledby="choose-documents-heading" className="flex flex-col gap-4">
      <fieldset disabled={isDrafting} className="flex flex-col gap-3">
        <legend id="choose-documents-heading" className="mb-3 text-xl font-bold text-deep">
          Choose the documents to draft
        </legend>
        {DOCUMENT_KINDS.map((kind) => (
          <Checkbox
            key={kind}
            label={DOCUMENT_KIND_LABELS[kind]}
            description={DOCUMENT_KIND_DESCRIPTIONS[kind]}
            isChecked={chosenKinds.includes(kind)}
            onChange={(isChosen) => toggleKind(kind, isChosen)}
          />
        ))}
      </fieldset>

      {draftingFailed && (
        <Notice tone="danger" title="The documents were not drafted" announce="alert">
          Check your internet connection, then try again. Your transcript is safe.
        </Notice>
      )}

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleDraftDocuments}
          disabled={chosenCount === 0 || isDrafting}
          aria-describedby="drafting-status"
          className="sm:self-start"
        >
          {isDrafting
            ? "Drafting"
            : chosenCount === 1
              ? "Draft 1 document"
              : `Draft ${chosenCount} documents`}
        </Button>
        <p id="drafting-status" role="status" className="min-h-6 text-sm text-slate">
          {isDrafting &&
            `Writing the ${DOCUMENT_KIND_LABELS[kindBeingDrafted].toLowerCase()} (${
              chosenKinds.indexOf(kindBeingDrafted) + 1
            } of ${chosenCount}).`}
          {!isDrafting && chosenCount === 0 && "Choose at least one document."}
        </p>
      </div>
    </section>
  );
}

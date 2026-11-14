"use client";

import { useState } from "react";
import { PageHeading } from "@/components/layout/PageHeading";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { PencilIcon } from "@/components/ui/icons";
import { useDemoSession } from "@/features/auth/session-store";
import { ConsultScreenFrame } from "@/features/consult/ConsultScreenFrame";
import { saveConsult } from "@/features/consult/consult-store";
import type { Consult } from "@/features/consult/consult-types";
import { usePracticeProfile } from "@/features/practice/practice-store";
import { formatDateAndTime } from "@/lib/format";
import { DeliverActions } from "./DeliverActions";
import { DocumentEditor } from "./DocumentEditor";
import {
  approveDocument,
  countCheckMarkersInDocument,
  findApprovalBlocker,
  isApproved,
  reopenForEditing,
  updateSectionBody,
} from "./document-rules";
import { DOCUMENT_KIND_LABELS, type ClinicalDocument, type DocumentKind } from "./document-types";
import { LetterheadDocument } from "./LetterheadDocument";

/** Step 4: review each draft, approve it, then deliver it. */
export function DocumentsScreen() {
  return (
    <ConsultScreenFrame currentStep="documents">
      {(consult) => <DocumentsReview consult={consult} />}
    </ConsultScreenFrame>
  );
}

function DocumentsReview({ consult }: { consult: Consult }) {
  const [selectedKind, setSelectedKind] = useState<DocumentKind | null>(null);

  if (consult.documents.length === 0) {
    return (
      <>
        <PageHeading title="No documents yet">
          Choose which documents to draft from the transcript first.
        </PageHeading>
        <ButtonLink href={`/consults/${consult.id}/transcript`} className="sm:self-start">
          Go to the transcript
        </ButtonLink>
      </>
    );
  }

  const selectedDocument =
    consult.documents.find((document) => document.kind === selectedKind) ?? consult.documents[0];

  /** Saves a changed document back into the consult. */
  function saveDocument(changedDocument: ClinicalDocument) {
    saveConsult({
      ...consult,
      documents: consult.documents.map((document) =>
        document.kind === changedDocument.kind ? changedDocument : document,
      ),
    });
  }

  return (
    <>
      <div className="print:hidden">
        <PageHeading title={`Documents for ${consult.patientName}`}>
          Read each draft, correct it, and approve it. Nothing can be copied, printed or sent
          until you approve it.
        </PageHeading>
      </div>

      {consult.documents.length > 1 && (
        <nav aria-label="Documents in this consult" className="flex flex-wrap gap-2 print:hidden">
          {consult.documents.map((document) => {
            const isSelected = document.kind === selectedDocument.kind;
            return (
              <button
                key={document.kind}
                type="button"
                aria-current={isSelected ? "true" : undefined}
                onClick={() => setSelectedKind(document.kind)}
                className={`flex min-h-12 flex-col items-start justify-center rounded-lg border-2 px-4 py-1.5 text-left ${
                  isSelected ? "border-deep bg-tint" : "border-line bg-white hover:border-slate"
                }`}
              >
                <span className="text-base font-bold text-deep">
                  {DOCUMENT_KIND_LABELS[document.kind]}
                </span>
                <span className="text-sm text-slate">
                  {isApproved(document) ? "Approved" : "Draft"}
                </span>
              </button>
            );
          })}
        </nav>
      )}

      {/* The key gives each document its own fresh workspace when the selection changes. */}
      <DocumentWorkspace
        key={selectedDocument.kind}
        consult={consult}
        document={selectedDocument}
        onDocumentChange={saveDocument}
      />
    </>
  );
}

interface DocumentWorkspaceProps {
  consult: Consult;
  document: ClinicalDocument;
  onDocumentChange: (changedDocument: ClinicalDocument) => void;
}

function DocumentWorkspace({ consult, document, onDocumentChange }: DocumentWorkspaceProps) {
  const session = useDemoSession();
  const practiceProfile = usePracticeProfile();
  const documentLabel = DOCUMENT_KIND_LABELS[document.kind];

  function handleApprove() {
    if (!session) return;
    onDocumentChange(
      approveDocument(
        document,
        { name: practiceProfile?.doctorName || session.email, email: session.email },
        new Date().toISOString(),
      ),
    );
  }

  // ---- Approved: show the finished letterhead document and the delivery actions. ----
  if (document.approval) {
    return (
      <section aria-label={`${documentLabel}, approved`} className="flex flex-col gap-5">
        <div className="flex flex-col gap-5 print:hidden">
          <Notice tone="success" title="Approved" announce="status">
            By {document.approval.approvedByName} on {formatDateAndTime(document.approval.approvedAt)}.
          </Notice>
          <DeliverActions
            document={document}
            patientName={consult.patientName}
            patientEmail={consult.patientEmail}
          />
        </div>

        <LetterheadDocument
          document={document}
          practiceProfile={practiceProfile ?? null}
          patientName={consult.patientName}
        />

        <div className="flex flex-col gap-1 print:hidden">
          <Button
            variant="secondary"
            onClick={() => onDocumentChange(reopenForEditing(document))}
            className="sm:self-start"
          >
            <PencilIcon />
            Edit {documentLabel.toLowerCase()}
          </Button>
          <p className="text-sm text-slate">Editing removes the approval. You approve it again after.</p>
        </div>
      </section>
    );
  }

  // ---- Draft: show the editor and the approve button. ----
  const approvalBlocker = findApprovalBlocker(document);
  const checkMarkerCount = countCheckMarkersInDocument(document);

  return (
    <section aria-label={`${documentLabel}, draft`} className="flex flex-col gap-5">
      <Notice tone="caution" title="Draft, not approved">
        {checkMarkerCount > 0
          ? `${checkMarkerCount} ${checkMarkerCount === 1 ? "detail was" : "details were"} unclear or not said in the consult and ${checkMarkerCount === 1 ? "is" : "are"} marked [CHECK]. Nothing has been guessed.`
          : "Read every line against what happened in the consult before you approve."}
      </Notice>

      <DocumentEditor
        document={document}
        onSectionChange={(sectionId, nextBody) =>
          onDocumentChange(updateSectionBody(document, sectionId, nextBody))
        }
      />

      <div className="flex flex-col gap-2 border-t border-line pt-5">
        <Button
          onClick={handleApprove}
          disabled={approvalBlocker !== null}
          aria-describedby="approval-blocker"
          className="sm:self-start"
        >
          Approve {documentLabel.toLowerCase()}
        </Button>
        <p id="approval-blocker" aria-live="polite" className="min-h-6 text-sm text-slate">
          {approvalBlocker ?? "Approving records your name and the time on this document."}
        </p>
      </div>
    </section>
  );
}

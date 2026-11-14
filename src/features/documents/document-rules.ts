/**
 * The safety rules for documents. These are the rules from the MVP plan:
 *
 *   1. Every document is a draft until a doctor approves it.
 *   2. Anything unclear is marked [CHECK]; a document cannot be approved
 *      while a [CHECK] marker remains.
 *   3. Nothing can be copied, printed or emailed before approval.
 *   4. Changing an approved document removes its approval.
 *   5. Every approval records who approved and when.
 *
 *   6. Prescription drafts are printed and signed by hand. They are never
 *      sent by email or phone, because an unsigned prescription is not valid
 *      and electronic prescriptions still need a legal check.
 *
 * Pure functions with no screen code, so each rule has a test in
 * document-rules.test.ts.
 */
import type { ClinicalDocument, DocumentApproval } from "./document-types";

/** Matches "[CHECK]" and "[CHECK: reason]". */
const CHECK_MARKER_PATTERN = /\[CHECK(?::[^\]]*)?\]/g;

export function countCheckMarkers(text: string): number {
  return text.match(CHECK_MARKER_PATTERN)?.length ?? 0;
}

export function countCheckMarkersInDocument(document: ClinicalDocument): number {
  return document.sections.reduce(
    (total, section) => total + countCheckMarkers(section.body),
    0,
  );
}

export function isApproved(document: ClinicalDocument): boolean {
  return document.approval !== null;
}

/** Rule 3: delivery (copy, print, email) is only allowed after approval. */
export function canDeliver(document: ClinicalDocument): boolean {
  return isApproved(document);
}

/** Rule 3 and 6: only approved documents can be sent, and never a prescription draft. */
export function canSendElectronically(document: ClinicalDocument): boolean {
  return canDeliver(document) && document.kind !== "prescription-draft";
}

/**
 * Rule 2: returns the reason the document cannot be approved yet,
 * or null when it is ready.
 */
export function findApprovalBlocker(document: ClinicalDocument): string | null {
  const emptySection = document.sections.find((section) => section.body.trim() === "");
  if (emptySection) {
    return `"${emptySection.heading}" is empty. Fill it in, or write "None" if it does not apply.`;
  }

  const checkMarkerCount = countCheckMarkersInDocument(document);
  if (checkMarkerCount > 0) {
    const itemsText = checkMarkerCount === 1 ? "1 item is" : `${checkMarkerCount} items are`;
    return `${itemsText} still marked [CHECK]. Replace each one with the correct detail before approving.`;
  }

  return null;
}

/** Rule 1 and 5: marks the document approved and records who did it and when. */
export function approveDocument(
  document: ClinicalDocument,
  approver: { name: string; email: string },
  approvedAt: string,
): ClinicalDocument {
  const approvalBlocker = findApprovalBlocker(document);
  if (approvalBlocker) {
    throw new Error(`Cannot approve: ${approvalBlocker}`);
  }

  const approval: DocumentApproval = {
    approvedByName: approver.name,
    approvedByEmail: approver.email,
    approvedAt,
  };
  return { ...document, approval };
}

/** Rule 4: any change to the text returns the document to draft. */
export function updateSectionBody(
  document: ClinicalDocument,
  sectionId: string,
  nextBody: string,
): ClinicalDocument {
  const currentSection = document.sections.find((section) => section.id === sectionId);
  if (!currentSection || currentSection.body === nextBody) return document;

  return {
    ...document,
    approval: null,
    sections: document.sections.map((section) =>
      section.id === sectionId ? { ...section, body: nextBody } : section,
    ),
  };
}

/** Rule 4, used by the "Edit document" button: reopening removes the approval. */
export function reopenForEditing(document: ClinicalDocument): ClinicalDocument {
  return { ...document, approval: null };
}

/** Plain text for "Copy", so a note pastes cleanly into a practice system. */
export function formatDocumentAsPlainText(document: ClinicalDocument): string {
  return document.sections
    .map((section) => `${section.heading}\n${section.body.trim()}`)
    .join("\n\n");
}

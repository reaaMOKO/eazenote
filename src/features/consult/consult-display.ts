/**
 * How a consult is shown in lists (the sidebar and the Today screen).
 * Pure functions with no screen code; tested in consult-display.test.ts.
 */
import type { Consult } from "./consult-types";

/** "Thandi Mokoena" becomes "TM". Used in the round avatar. */
export function getPatientInitials(patientName: string): string {
  const nameParts = patientName.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length === 0) return "?";
  const firstInitial = nameParts[0][0];
  const lastInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : "";
  return (firstInitial + lastInitial).toUpperCase();
}

/**
 * "Thandi Mokoena" becomes "Thandi M."
 *
 * Lists use the short form on purpose: the screen is often visible to whoever
 * is in the consulting room, and a full list of patient names is not theirs
 * to read. The full name is shown inside the consult itself.
 */
export function shortenPatientName(patientName: string): string {
  const nameParts = patientName.trim().split(/\s+/).filter(Boolean);
  if (nameParts.length <= 1) return nameParts[0] ?? "";
  const surnameInitial = nameParts[nameParts.length - 1][0].toUpperCase();
  return `${nameParts[0]} ${surnameInitial}.`;
}

/**
 * approved: every document is approved.
 * draft:    documents exist and at least one still needs approval.
 * waiting:  nothing to approve yet (not recorded, or no documents drafted).
 */
export type ConsultStatusTone = "approved" | "draft" | "waiting";

export interface ConsultStatus {
  label: string;
  tone: ConsultStatusTone;
}

export function describeConsultStatus(consult: Consult): ConsultStatus {
  if (consult.documents.length > 0) {
    const isEveryDocumentApproved = consult.documents.every((document) => document.approval);
    return isEveryDocumentApproved
      ? { label: "Approved", tone: "approved" }
      : { label: "Draft", tone: "draft" };
  }
  if (consult.transcript) return { label: "Transcribed", tone: "waiting" };
  return { label: "To record", tone: "waiting" };
}

export interface ConsultSummary {
  consultCount: number;
  approvedDocumentCount: number;
  /** Documents drafted but not yet approved: the doctor's to-do list. */
  draftDocumentCount: number;
}

/** The three numbers at the top of the Today screen. */
export function summariseConsults(consults: Consult[]): ConsultSummary {
  const allDocuments = consults.flatMap((consult) => consult.documents);
  const approvedDocumentCount = allDocuments.filter((document) => document.approval).length;
  return {
    consultCount: consults.length,
    approvedDocumentCount,
    draftDocumentCount: allDocuments.length - approvedDocumentCount,
  };
}

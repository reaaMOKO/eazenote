/**
 * Rules for starting and continuing a consult.
 * Pure functions with no screen code; tested in consult-rules.test.ts.
 */
import { looksLikeEmailAddress, looksLikePhoneNumber } from "@/lib/format";
import type { Consult, ConsultStep } from "./consult-types";

export interface NewConsultForm {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  isConsentConfirmed: boolean;
}

/**
 * The consent lock. Recording stays locked until the patient's name is
 * entered AND the doctor has ticked that the patient consented.
 * Returns the reason recording is locked, or null when it may start.
 */
export function findRecordingLockReason(form: NewConsultForm): string | null {
  if (form.patientName.trim() === "") {
    return "Enter the patient's name to continue.";
  }
  if (form.patientEmail.trim() !== "" && !looksLikeEmailAddress(form.patientEmail)) {
    return "Check the patient's email address, or leave it empty.";
  }
  if (form.patientPhone.trim() !== "" && !looksLikePhoneNumber(form.patientPhone)) {
    return "Check the patient's phone number, or leave it empty.";
  }
  if (!form.isConsentConfirmed) {
    return "Recording is locked until you confirm the patient has consented.";
  }
  return null;
}

/** Creates the consult record once the consent lock is open. */
export function createConsult(form: NewConsultForm, consultId: string, nowIso: string): Consult {
  const lockReason = findRecordingLockReason(form);
  if (lockReason) {
    throw new Error(`Cannot start a consult: ${lockReason}`);
  }

  return {
    id: consultId,
    createdAt: nowIso,
    patientName: form.patientName.trim(),
    patientEmail: form.patientEmail.trim(),
    patientPhone: form.patientPhone.trim(),
    consentConfirmedAt: nowIso,
    recordingSeconds: null,
    transcript: null,
    documents: [],
  };
}

/** Which step a consult should resume at, based on what has been done so far. */
export function findNextStep(consult: Consult): Exclude<ConsultStep, "patient"> {
  if (consult.documents.length > 0) return "documents";
  if (consult.transcript) return "transcript";
  return "record";
}

/** Short status shown in the consult list. */
export function describeConsultProgress(consult: Consult): string {
  if (consult.documents.length > 0) {
    const approvedCount = consult.documents.filter((document) => document.approval).length;
    return `${approvedCount} of ${consult.documents.length} documents approved`;
  }
  if (consult.transcript) return "Transcript ready, no documents drafted yet";
  return "Not recorded yet";
}

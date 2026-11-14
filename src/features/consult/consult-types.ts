import type { ClinicalDocument } from "@/features/documents/document-types";

/** One turn of speech in the transcript. */
export interface TranscriptSegment {
  speaker: "Doctor" | "Patient";
  text: string;
}

export interface Transcript {
  segments: TranscriptSegment[];
  /** Languages heard in the consult, e.g. ["English", "isiZulu"]. */
  languages: string[];
  /** True when this is the built-in sample, not a transcription of real audio. */
  isSampleData: boolean;
}

export interface Consult {
  id: string;
  createdAt: string;
  patientName: string;
  /** Only needed when a letter will be emailed to the patient. */
  patientEmail: string;
  /** When the doctor confirmed the patient agreed to be recorded. Always set: a consult cannot exist without it. */
  consentConfirmedAt: string;
  recordingSeconds: number | null;
  transcript: Transcript | null;
  documents: ClinicalDocument[];
}

/** The four steps of a consult, in order. */
export const CONSULT_STEPS = ["patient", "record", "transcript", "documents"] as const;

export type ConsultStep = (typeof CONSULT_STEPS)[number];

export const CONSULT_STEP_LABELS: Record<ConsultStep, string> = {
  patient: "Patient and consent",
  record: "Record",
  transcript: "Transcript",
  documents: "Documents",
};

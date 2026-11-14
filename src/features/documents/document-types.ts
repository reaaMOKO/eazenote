/** The three documents EazeNote can draft in the MVP. */
export const DOCUMENT_KINDS = ["clinical-note", "referral-letter", "prescription-draft"] as const;

export type DocumentKind = (typeof DOCUMENT_KINDS)[number];

export const DOCUMENT_KIND_LABELS: Record<DocumentKind, string> = {
  "clinical-note": "Clinical note",
  "referral-letter": "Referral letter",
  "prescription-draft": "Prescription draft",
};

export const DOCUMENT_KIND_DESCRIPTIONS: Record<DocumentKind, string> = {
  "clinical-note": "SOAP note to copy into your practice system.",
  "referral-letter": "Letter on your letterhead, with your signature.",
  "prescription-draft": "Printed for you to sign by hand.",
};

/** One editable block of a document, such as "Subjective" or "Reason for referral". */
export interface DocumentSection {
  id: string;
  heading: string;
  body: string;
}

/** The audit record: who approved the document, and when. */
export interface DocumentApproval {
  approvedByName: string;
  approvedByEmail: string;
  approvedAt: string;
}

export interface ClinicalDocument {
  kind: DocumentKind;
  sections: DocumentSection[];
  /** `null` means DRAFT, NOT APPROVED. Nothing may be delivered while this is null. */
  approval: DocumentApproval | null;
}

/** How an approved document can be sent: to an email address or to a phone number. */
export type DeliveryChannel = "email" | "phone";

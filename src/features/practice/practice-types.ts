/** Details printed on the letterhead of every document. */
export interface PracticeProfile {
  doctorName: string;
  practiceName: string;
  practiceAddress: string;
  practicePhone: string;
  /** Practice number issued by the Board of Healthcare Funders. */
  practiceNumber: string;
  /** The doctor's HPCSA registration number. */
  hpcsaNumber: string;
  /** Logo image, stored as text (a "data URL"). Optional. */
  logoImage: string | null;
  /** Signature image, placed on referral letters only. Optional. */
  signatureImage: string | null;
}

/** The text fields a doctor must fill in before documents can carry a letterhead. */
export const REQUIRED_PRACTICE_FIELDS = [
  "doctorName",
  "practiceName",
  "practiceAddress",
  "practicePhone",
  "practiceNumber",
  "hpcsaNumber",
] as const;

export type RequiredPracticeField = (typeof REQUIRED_PRACTICE_FIELDS)[number];

export const EMPTY_PRACTICE_PROFILE: PracticeProfile = {
  doctorName: "",
  practiceName: "",
  practiceAddress: "",
  practicePhone: "",
  practiceNumber: "",
  hpcsaNumber: "",
  logoImage: null,
  signatureImage: null,
};

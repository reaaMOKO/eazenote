/** Rules for the practice setup form. Pure functions: easy to test, no screen code. */
import { MAX_IMAGE_UPLOAD_BYTES } from "@/config/app-config";
import {
  REQUIRED_PRACTICE_FIELDS,
  type PracticeProfile,
  type RequiredPracticeField,
} from "./practice-types";

const MISSING_FIELD_MESSAGES: Record<RequiredPracticeField, string> = {
  doctorName: "Enter your name as it should appear on documents.",
  practiceName: "Enter the practice name.",
  practiceAddress: "Enter the practice address.",
  practicePhone: "Enter the practice phone number.",
  practiceNumber: "Enter the practice number.",
  hpcsaNumber: "Enter your HPCSA number.",
};

export type PracticeFieldErrors = Partial<Record<RequiredPracticeField, string>>;

/** Returns one message per empty required field. An empty object means the form is valid. */
export function findPracticeFieldErrors(profile: PracticeProfile): PracticeFieldErrors {
  const fieldErrors: PracticeFieldErrors = {};
  for (const fieldName of REQUIRED_PRACTICE_FIELDS) {
    if (profile[fieldName].trim() === "") {
      fieldErrors[fieldName] = MISSING_FIELD_MESSAGES[fieldName];
    }
  }
  return fieldErrors;
}

export function isPracticeProfileComplete(profile: PracticeProfile | null): boolean {
  return profile !== null && Object.keys(findPracticeFieldErrors(profile)).length === 0;
}

/** Returns a message if the image cannot be used, or null if it is fine. */
export function findImageUploadProblem(file: { type: string; size: number }): string | null {
  if (file.type !== "image/png" && file.type !== "image/jpeg") {
    return "Choose a PNG or JPG image.";
  }
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    const maxKilobytes = Math.round(MAX_IMAGE_UPLOAD_BYTES / 1024);
    return `That image is too large. Choose one under ${maxKilobytes} KB.`;
  }
  return null;
}

/**
 * Rules for the sign-in forms. Pure functions with no screen code;
 * tested in auth-rules.test.ts.
 */
import { looksLikeEmailAddress } from "@/lib/format";

/** Shortest password accepted when creating an account. */
export const MINIMUM_PASSWORD_LENGTH = 8;

/** Number of digits in the sign-in code that is emailed to the doctor. */
export const SIGN_IN_CODE_LENGTH = 6;

/** Any valid email address is accepted: personal or practice. */
export function findEmailProblem(email: string): string | null {
  if (email.trim() === "") return "Enter your email address.";
  if (!looksLikeEmailAddress(email)) return "Enter a valid email address, like name@example.com.";
  return null;
}

/**
 * When signing in, the password only has to be present: the server decides
 * whether it is correct. When creating an account, it must be long enough.
 */
export function findPasswordProblem(
  password: string,
  purpose: "sign-in" | "create-account",
): string | null {
  if (password === "") return "Enter your password.";
  if (purpose === "create-account" && password.length < MINIMUM_PASSWORD_LENGTH) {
    return `Use at least ${MINIMUM_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export function findSignInCodeProblem(code: string): string | null {
  const digitsOnly = code.replace(/\s/g, "");
  if (!new RegExp(`^\\d{${SIGN_IN_CODE_LENGTH}}$`).test(digitsOnly)) {
    return `Enter the ${SIGN_IN_CODE_LENGTH}-digit code from the email.`;
  }
  return null;
}

/**
 * Email: sends an approved referral letter.
 *
 *   Phase 1: sends nothing and says so (this file).
 *   Phase 4: a call to OUR server route, which holds the Resend API key and
 *            re-checks on the server that the letter is approved.
 */
import { canDeliver } from "@/features/documents/document-rules";
import type { ClinicalDocument } from "@/features/documents/document-types";
import { waitForDemoDelay } from "@/services/demo-delay";

export interface ReferralEmailRequest {
  recipientEmail: string;
  patientName: string;
  referralLetter: ClinicalDocument;
}

export type ReferralEmailResult =
  | { outcome: "sent" }
  | { outcome: "not-sent-demo-mode" };

export interface EmailService {
  sendReferralLetter: (request: ReferralEmailRequest) => Promise<ReferralEmailResult>;
}

export const sampleEmailService: EmailService = {
  async sendReferralLetter({ referralLetter }) {
    // Same rule the real service will enforce: drafts are never sent.
    if (!canDeliver(referralLetter)) {
      throw new Error("A referral letter must be approved before it can be emailed.");
    }
    await waitForDemoDelay(900);
    return { outcome: "not-sent-demo-mode" };
  },
};

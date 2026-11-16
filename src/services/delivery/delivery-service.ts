/**
 * Delivery: sends an approved document to an email address or a phone number.
 *
 *   Phase 1: sends nothing and says so (this file).
 *   Phase 4: a call to OUR server route, which holds the provider keys and
 *            re-checks on the server that the document may be sent.
 *
 * Still to decide before Phase 4: how a document reaches a phone (SMS with a
 * secure link, or WhatsApp). That choice sets the provider and the cost.
 */
import { canSendElectronically } from "@/features/documents/document-rules";
import type { ClinicalDocument, DeliveryChannel } from "@/features/documents/document-types";
import { waitForDemoDelay } from "@/services/demo-delay";

export interface SendDocumentRequest {
  channel: DeliveryChannel;
  /** An email address or a phone number, matching the channel. */
  recipient: string;
  patientName: string;
  document: ClinicalDocument;
}

export type SendDocumentResult = { outcome: "sent" } | { outcome: "not-sent-demo-mode" };

export interface DeliveryService {
  sendDocument: (request: SendDocumentRequest) => Promise<SendDocumentResult>;
}

export const sampleDeliveryService: DeliveryService = {
  async sendDocument({ document }) {
    // Same rules the real service will enforce on the server:
    // drafts are never sent, and prescriptions are never sent electronically.
    if (!canSendElectronically(document)) {
      throw new Error("This document cannot be sent. It must be approved, and not a prescription.");
    }
    await waitForDemoDelay(900);
    return { outcome: "not-sent-demo-mode" };
  },
};

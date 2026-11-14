/**
 * AI drafting: turns a transcript into a draft document.
 *
 *   Phase 1: sample drafts (this file).
 *   Phase 3: a call to OUR server route, which holds the Claude API key.
 *
 * Whatever writes the draft, the result always starts unapproved
 * (approval: null). Only a doctor pressing Approve can change that.
 */
import type { Transcript } from "@/features/consult/consult-types";
import type { ClinicalDocument, DocumentKind } from "@/features/documents/document-types";
import { buildSampleSections } from "@/services/sample-data/sample-consult";
import { waitForDemoDelay } from "@/services/demo-delay";

export interface DraftRequest {
  kind: DocumentKind;
  transcript: Transcript;
  patientName: string;
}

export interface DraftingService {
  draftDocument: (request: DraftRequest) => Promise<ClinicalDocument>;
}

export const sampleDraftingService: DraftingService = {
  async draftDocument({ kind, patientName }) {
    await waitForDemoDelay(1400);
    return {
      kind,
      sections: buildSampleSections(kind, patientName),
      approval: null,
    };
  },
};

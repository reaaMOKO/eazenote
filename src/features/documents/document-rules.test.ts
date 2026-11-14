import { describe, expect, it } from "vitest";
import {
  approveDocument,
  canDeliver,
  countCheckMarkers,
  countCheckMarkersInDocument,
  findApprovalBlocker,
  formatDocumentAsPlainText,
  reopenForEditing,
  updateSectionBody,
} from "./document-rules";
import type { ClinicalDocument } from "./document-types";

const APPROVER = { name: "Dr Test", email: "doctor@example.com" };
const APPROVED_AT = "2026-11-14T19:00:00.000Z";

function buildDraft(planText: string): ClinicalDocument {
  return {
    kind: "clinical-note",
    approval: null,
    sections: [
      { id: "assessment", heading: "Assessment", body: "Chest infection." },
      { id: "plan", heading: "Plan", body: planText },
    ],
  };
}

describe("[CHECK] markers", () => {
  it("counts plain and explained markers", () => {
    expect(countCheckMarkers("Dose: [CHECK]. Duration: [CHECK: not stated].")).toBe(2);
  });

  it("ignores text that only mentions the word", () => {
    expect(countCheckMarkers("Check the chest again in 3 days.")).toBe(0);
  });

  it("adds up markers across every section", () => {
    expect(countCheckMarkersInDocument(buildDraft("Amoxicillin for [CHECK] days."))).toBe(1);
  });
});

describe("approval", () => {
  it("is blocked while a [CHECK] marker remains", () => {
    const draft = buildDraft("Amoxicillin for [CHECK: duration not stated].");
    expect(findApprovalBlocker(draft)).toContain("still marked [CHECK]");
    expect(() => approveDocument(draft, APPROVER, APPROVED_AT)).toThrow();
  });

  it("is blocked while a section is empty", () => {
    expect(findApprovalBlocker(buildDraft("   "))).toContain('"Plan" is empty');
  });

  it("records who approved and when", () => {
    const approved = approveDocument(buildDraft("Amoxicillin for 5 days."), APPROVER, APPROVED_AT);
    expect(approved.approval).toEqual({
      approvedByName: "Dr Test",
      approvedByEmail: "doctor@example.com",
      approvedAt: APPROVED_AT,
    });
  });
});

describe("delivery", () => {
  it("is not allowed for a draft", () => {
    expect(canDeliver(buildDraft("Amoxicillin for 5 days."))).toBe(false);
  });

  it("is allowed once approved", () => {
    const approved = approveDocument(buildDraft("Amoxicillin for 5 days."), APPROVER, APPROVED_AT);
    expect(canDeliver(approved)).toBe(true);
  });
});

describe("editing after approval", () => {
  const approved = approveDocument(buildDraft("Amoxicillin for 5 days."), APPROVER, APPROVED_AT);

  it("removes the approval when text changes", () => {
    const edited = updateSectionBody(approved, "plan", "Amoxicillin for 7 days.");
    expect(edited.approval).toBeNull();
    expect(canDeliver(edited)).toBe(false);
  });

  it("keeps the approval when nothing actually changed", () => {
    expect(updateSectionBody(approved, "plan", "Amoxicillin for 5 days.")).toBe(approved);
  });

  it("removes the approval when reopened for editing", () => {
    expect(reopenForEditing(approved).approval).toBeNull();
  });
});

describe("plain text for copying", () => {
  it("lists each heading above its text", () => {
    expect(formatDocumentAsPlainText(buildDraft("Review in 3 days."))).toBe(
      "Assessment\nChest infection.\n\nPlan\nReview in 3 days.",
    );
  });
});

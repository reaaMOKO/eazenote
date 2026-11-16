import { describe, expect, it } from "vitest";
import type { ClinicalDocument } from "@/features/documents/document-types";
import {
  describeConsultStatus,
  getPatientInitials,
  shortenPatientName,
  summariseConsults,
} from "./consult-display";
import type { Consult } from "./consult-types";

const APPROVAL = {
  approvedByName: "Dr Test",
  approvedByEmail: "doctor@example.com",
  approvedAt: "2026-11-16T09:00:00.000Z",
};

function buildDocument(isApproved: boolean): ClinicalDocument {
  return { kind: "clinical-note", sections: [], approval: isApproved ? APPROVAL : null };
}

function buildConsult(changes: Partial<Consult> = {}): Consult {
  return {
    id: "consult-1",
    createdAt: "2026-11-16T08:30:00.000Z",
    patientName: "Thandi Mokoena",
    patientEmail: "",
    patientPhone: "",
    consentConfirmedAt: "2026-11-16T08:30:00.000Z",
    recordingSeconds: null,
    transcript: null,
    documents: [],
    ...changes,
  };
}

describe("patient names in lists", () => {
  it("shortens the surname to an initial", () => {
    expect(shortenPatientName("Thandi Mokoena")).toBe("Thandi M.");
    expect(shortenPatientName("Sipho van der Merwe")).toBe("Sipho M.");
  });

  it("leaves a single name as it is", () => {
    expect(shortenPatientName("Thandi")).toBe("Thandi");
  });

  it("builds initials from the first and last name", () => {
    expect(getPatientInitials("Thandi Mokoena")).toBe("TM");
    expect(getPatientInitials("thandi")).toBe("T");
    expect(getPatientInitials("  ")).toBe("?");
  });
});

describe("consult status", () => {
  it("starts as to record", () => {
    expect(describeConsultStatus(buildConsult())).toEqual({ label: "To record", tone: "waiting" });
  });

  it("is a draft while any document is unapproved", () => {
    const consult = buildConsult({ documents: [buildDocument(true), buildDocument(false)] });
    expect(describeConsultStatus(consult)).toEqual({ label: "Draft", tone: "draft" });
  });

  it("is approved only when every document is approved", () => {
    const consult = buildConsult({ documents: [buildDocument(true), buildDocument(true)] });
    expect(describeConsultStatus(consult)).toEqual({ label: "Approved", tone: "approved" });
  });
});

describe("today's summary", () => {
  it("counts consults, approved documents and drafts still to check", () => {
    const consults = [
      buildConsult({ documents: [buildDocument(true), buildDocument(false)] }),
      buildConsult({ id: "consult-2", documents: [buildDocument(true)] }),
      buildConsult({ id: "consult-3" }),
    ];
    expect(summariseConsults(consults)).toEqual({
      consultCount: 3,
      approvedDocumentCount: 2,
      draftDocumentCount: 1,
    });
  });
});

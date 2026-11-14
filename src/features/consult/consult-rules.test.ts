import { describe, expect, it } from "vitest";
import {
  createConsult,
  describeConsultProgress,
  findNextStep,
  findRecordingLockReason,
  type NewConsultForm,
} from "./consult-rules";

const NOW = "2026-11-14T19:00:00.000Z";

const COMPLETE_FORM: NewConsultForm = {
  patientName: "Thandi Mokoena",
  patientEmail: "",
  isConsentConfirmed: true,
};

describe("consent lock", () => {
  it("keeps recording locked until consent is ticked", () => {
    const lockReason = findRecordingLockReason({ ...COMPLETE_FORM, isConsentConfirmed: false });
    expect(lockReason).toContain("consented");
  });

  it("keeps recording locked without a patient name", () => {
    expect(findRecordingLockReason({ ...COMPLETE_FORM, patientName: "  " })).toContain("name");
  });

  it("rejects a malformed email but accepts an empty one", () => {
    expect(findRecordingLockReason({ ...COMPLETE_FORM, patientEmail: "thandi@" })).toContain("email");
    expect(findRecordingLockReason(COMPLETE_FORM)).toBeNull();
  });

  it("refuses to create a consult without consent", () => {
    expect(() =>
      createConsult({ ...COMPLETE_FORM, isConsentConfirmed: false }, "consult-1", NOW),
    ).toThrow();
  });

  it("records when consent was confirmed", () => {
    const consult = createConsult(COMPLETE_FORM, "consult-1", NOW);
    expect(consult.consentConfirmedAt).toBe(NOW);
  });
});

describe("resuming a consult", () => {
  const newConsult = createConsult(COMPLETE_FORM, "consult-1", NOW);

  it("starts at recording", () => {
    expect(findNextStep(newConsult)).toBe("record");
    expect(describeConsultProgress(newConsult)).toBe("Not recorded yet");
  });

  it("moves to the transcript once one exists", () => {
    const transcribed = {
      ...newConsult,
      transcript: { segments: [], languages: ["English"], isSampleData: true },
    };
    expect(findNextStep(transcribed)).toBe("transcript");
  });
});

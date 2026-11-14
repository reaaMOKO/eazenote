/**
 * SAMPLE DATA for Phase 1. Entirely fictional: no real patient, doctor or consult.
 *
 * It mirrors what the real services must produce in Phase 3:
 *   - a transcript that mixes English and isiZulu, as real consults do;
 *   - drafts that use ONLY what was said, with [CHECK: ...] wherever a detail
 *     was unclear or never mentioned. Nothing is guessed, especially doses.
 */
import type { Transcript } from "@/features/consult/consult-types";
import type { DocumentKind, DocumentSection } from "@/features/documents/document-types";

export const SAMPLE_TRANSCRIPT: Transcript = {
  isSampleData: true,
  languages: ["English", "isiZulu"],
  segments: [
    { speaker: "Doctor", text: "Sawubona, come in and have a seat. How can I help you today?" },
    {
      speaker: "Patient",
      text: "Sawubona dokotela. Ngiyakhwehlela, it's been five days now. And at night I get hot, ngiyajuluka.",
    },
    {
      speaker: "Doctor",
      text: "Five days of coughing, with fever and sweating at night. Are you bringing anything up when you cough?",
    },
    {
      speaker: "Patient",
      text: "Yebo, yellow phlegm. And isifuba sibuhlungu when I cough, here on the right side.",
    },
    { speaker: "Doctor", text: "Any blood in it? Any shortness of breath?" },
    { speaker: "Patient", text: "Cha, no blood. I get a bit short of breath on the stairs." },
    {
      speaker: "Doctor",
      text: "Do you smoke? Any chronic conditions, like asthma, sugar or high blood?",
    },
    {
      speaker: "Patient",
      text: "I don't smoke. I take pills for high blood, amlodipine, one every morning.",
    },
    {
      speaker: "Doctor",
      text: "Let me examine you. Temperature is 38.2. Blood pressure 132 over 84. Pulse 96. Oxygen saturation 95 percent. On the chest I can hear crackles at the right base.",
    },
    {
      speaker: "Doctor",
      text: "This looks like a chest infection, most likely pneumonia on the right side. I'm starting you on amoxicillin 500 milligrams, three times a day. Take paracetamol for the fever. I also want a chest X-ray, so I'll write a referral letter to radiology.",
    },
    { speaker: "Patient", text: "Ngiyabonga dokotela. Should I come back?" },
    { speaker: "Doctor", text: "Come back in three days, or sooner if the breathing gets worse." },
  ],
};

/** Builds the sample draft sections for one document kind. */
export function buildSampleSections(kind: DocumentKind, patientName: string): DocumentSection[] {
  switch (kind) {
    case "clinical-note":
      return [
        {
          id: "subjective",
          heading: "Subjective",
          body: [
            "Cough for 5 days, productive of yellow sputum. Fever and night sweats. Right-sided chest pain on coughing. No blood in sputum. Mild shortness of breath on stairs. Non-smoker.",
            "Background: hypertension.",
            "Medication: amlodipine, one every morning, strength [CHECK: not stated].",
            "Allergies: [CHECK: not discussed].",
          ].join("\n"),
        },
        {
          id: "objective",
          heading: "Objective",
          body: "Temperature 38.2 °C. Blood pressure 132/84 mmHg. Pulse 96 bpm. Oxygen saturation 95%. Chest: crackles at the right base.",
        },
        {
          id: "assessment",
          heading: "Assessment",
          body: "Chest infection, most likely right-sided pneumonia (as stated by the doctor).",
        },
        {
          id: "plan",
          heading: "Plan",
          body: [
            "Amoxicillin 500 mg three times a day, duration [CHECK: not stated].",
            "Paracetamol for fever, dose [CHECK: not stated].",
            "Chest X-ray: referral letter to radiology.",
            "Review in 3 days, or sooner if breathing worsens.",
          ].join("\n"),
        },
        { id: "languages", heading: "Languages used in the consult", body: "English / isiZulu" },
      ];

    case "referral-letter":
      return [
        { id: "to", heading: "To", body: "Radiology, [CHECK: practice or facility not named]" },
        {
          id: "regarding",
          heading: "Re",
          body: `${patientName}, date of birth [CHECK: not stated]`,
        },
        {
          id: "reason",
          heading: "Reason for referral",
          body: "Chest X-ray requested for suspected right-sided pneumonia.",
        },
        {
          id: "history",
          heading: "Relevant history",
          body: "Cough for 5 days, productive of yellow sputum, with fever, night sweats and right-sided chest pain on coughing. Mild shortness of breath on exertion. No blood in sputum. Non-smoker. Known hypertension.",
        },
        {
          id: "findings",
          heading: "Findings",
          body: "Temperature 38.2 °C. Blood pressure 132/84 mmHg. Pulse 96 bpm. Oxygen saturation 95%. Crackles at the right base.",
        },
        {
          id: "medication",
          heading: "Current medication",
          body: "Amlodipine, one every morning. Started today: amoxicillin 500 mg three times a day; paracetamol for fever.",
        },
        {
          id: "request",
          heading: "Request",
          body: "Please perform a chest X-ray and report the findings.",
        },
        { id: "urgency", heading: "Urgency", body: "[CHECK: not stated]" },
      ];

    case "prescription-draft":
      return [
        {
          id: "patient",
          heading: "Patient",
          body: `${patientName}, date of birth [CHECK: not stated]`,
        },
        {
          id: "item-1",
          heading: "Item 1",
          body: [
            "Medicine: Amoxicillin",
            "Strength: 500 mg",
            "Form: [CHECK: not stated]",
            "Dose: [CHECK: not stated]",
            "Frequency: three times a day",
            "Duration: [CHECK: not stated]",
            "Quantity: [CHECK: not stated]",
            "Repeats: [CHECK: not stated]",
          ].join("\n"),
        },
        {
          id: "item-2",
          heading: "Item 2",
          body: [
            "Medicine: Paracetamol",
            "Strength: [CHECK: not stated]",
            "Form: [CHECK: not stated]",
            "Dose: [CHECK: not stated]",
            "Frequency: [CHECK: not stated]",
            "Duration: for fever",
            "Quantity: [CHECK: not stated]",
            "Repeats: [CHECK: not stated]",
          ].join("\n"),
        },
      ];
  }
}

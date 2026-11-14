"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PageHeading } from "@/components/layout/PageHeading";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Notice } from "@/components/ui/Notice";
import { TextField } from "@/components/ui/TextField";
import { LockIcon, MicrophoneIcon } from "@/components/ui/icons";
import { ConsultStepper } from "./ConsultStepper";
import { createConsult, findRecordingLockReason, type NewConsultForm } from "./consult-rules";
import { saveConsult } from "./consult-store";

/**
 * Step 1: who the patient is, and confirmation that they agreed to be recorded.
 * The button to continue stays locked until consent is ticked (the consent lock).
 */
export function NewConsultScreen() {
  const router = useRouter();
  const [form, setForm] = useState<NewConsultForm>({
    patientName: "",
    patientEmail: "",
    isConsentConfirmed: false,
  });
  const [couldNotSave, setCouldNotSave] = useState(false);

  const recordingLockReason = findRecordingLockReason(form);
  const isRecordingLocked = recordingLockReason !== null;

  function updateForm(changes: Partial<NewConsultForm>) {
    setForm((currentForm) => ({ ...currentForm, ...changes }));
  }

  function handleContinue(event: FormEvent) {
    event.preventDefault();
    if (isRecordingLocked) return;

    const consult = createConsult(form, crypto.randomUUID(), new Date().toISOString());
    const wasSaved = saveConsult(consult);
    setCouldNotSave(!wasSaved);
    if (wasSaved) router.push(`/consults/${consult.id}/record`);
  }

  return (
    <>
      <ConsultStepper currentStep="patient" />

      <PageHeading title="New consult">
        Enter the patient&apos;s details and confirm their consent before you record.
      </PageHeading>

      <form onSubmit={handleContinue} noValidate className="flex flex-col gap-6">
        <TextField
          label="Patient's name"
          value={form.patientName}
          onChange={(patientName) => updateForm({ patientName })}
        />
        <TextField
          label="Patient's email address"
          type="email"
          inputMode="email"
          isOptional
          hint="Only needed if you will email a letter to the patient."
          value={form.patientEmail}
          onChange={(patientEmail) => updateForm({ patientEmail })}
        />

        <Checkbox
          label="The patient has consented to this consultation being recorded"
          description="Ask before you start. The audio is used to draft your documents, then deleted."
          isChecked={form.isConsentConfirmed}
          onChange={(isConsentConfirmed) => updateForm({ isConsentConfirmed })}
        />

        {couldNotSave && (
          <Notice tone="danger" title="The consult could not be started" announce="alert">
            This browser&apos;s storage is full or blocked. Leave private browsing, then try again.
          </Notice>
        )}

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            disabled={isRecordingLocked}
            aria-describedby="recording-lock-reason"
            className="sm:self-start"
          >
            {isRecordingLocked ? <LockIcon /> : <MicrophoneIcon />}
            Continue to recording
          </Button>
          {/* Says why the button is locked, and is read out when the reason changes. */}
          <p id="recording-lock-reason" aria-live="polite" className="min-h-6 text-sm text-slate">
            {recordingLockReason}
          </p>
        </div>
      </form>
    </>
  );
}

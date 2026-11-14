"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PageHeading } from "@/components/layout/PageHeading";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { TextField } from "@/components/ui/TextField";
import { LetterheadHeader } from "@/features/documents/LetterheadDocument";
import { ImageUploadField } from "./ImageUploadField";
import { findPracticeFieldErrors, type PracticeFieldErrors } from "./practice-rules";
import { savePracticeProfile, usePracticeProfile } from "./practice-store";
import { EMPTY_PRACTICE_PROFILE, type PracticeProfile } from "./practice-types";

/** One-time setup: the details that appear on every document's letterhead. */
export function PracticeSetupScreen() {
  const savedProfile = usePracticeProfile();

  // Wait until the saved details are read, so the form starts with them filled in.
  if (savedProfile === undefined) return null;

  return <PracticeSetupForm startingProfile={savedProfile ?? EMPTY_PRACTICE_PROFILE} />;
}

function countErrors(fieldErrors: PracticeFieldErrors): number {
  return Object.values(fieldErrors).filter(Boolean).length;
}

function PracticeSetupForm({ startingProfile }: { startingProfile: PracticeProfile }) {
  const router = useRouter();
  const [profile, setProfile] = useState(startingProfile);
  const [fieldErrors, setFieldErrors] = useState<PracticeFieldErrors>({});
  const [couldNotSave, setCouldNotSave] = useState(false);

  function updateField<FieldName extends keyof PracticeProfile>(
    fieldName: FieldName,
    fieldValue: PracticeProfile[FieldName],
  ) {
    setProfile((currentProfile) => ({ ...currentProfile, [fieldName]: fieldValue }));
    // Stop showing a field's error as soon as the doctor starts fixing it.
    setFieldErrors((currentErrors) => ({ ...currentErrors, [fieldName]: undefined }));
  }

  function handleSave(event: FormEvent) {
    event.preventDefault();

    const foundErrors = findPracticeFieldErrors(profile);
    setFieldErrors(foundErrors);
    if (countErrors(foundErrors) > 0) return;

    const wasSaved = savePracticeProfile(profile);
    setCouldNotSave(!wasSaved);
    if (wasSaved) router.push("/consults");
  }

  const errorCount = countErrors(fieldErrors);

  return (
    <>
      <PageHeading title="Practice details">
        These appear on the letterhead of every referral letter and prescription. You set them up
        once and can change them any time.
      </PageHeading>

      <form onSubmit={handleSave} noValidate className="flex flex-col gap-8">
        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 text-xl font-bold text-deep">The doctor</legend>
          <TextField
            label="Your name"
            hint="As it should appear on documents, e.g. Dr N. Dlamini."
            autoComplete="name"
            value={profile.doctorName}
            onChange={(value) => updateField("doctorName", value)}
            error={fieldErrors.doctorName}
          />
          <TextField
            label="HPCSA number"
            value={profile.hpcsaNumber}
            onChange={(value) => updateField("hpcsaNumber", value)}
            error={fieldErrors.hpcsaNumber}
          />
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 text-xl font-bold text-deep">The practice</legend>
          <TextField
            label="Practice name"
            autoComplete="organization"
            value={profile.practiceName}
            onChange={(value) => updateField("practiceName", value)}
            error={fieldErrors.practiceName}
          />
          <TextField
            label="Practice address"
            isMultiline
            autoComplete="street-address"
            value={profile.practiceAddress}
            onChange={(value) => updateField("practiceAddress", value)}
            error={fieldErrors.practiceAddress}
          />
          <TextField
            label="Practice phone number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={profile.practicePhone}
            onChange={(value) => updateField("practicePhone", value)}
            error={fieldErrors.practicePhone}
          />
          <TextField
            label="Practice number"
            value={profile.practiceNumber}
            onChange={(value) => updateField("practiceNumber", value)}
            error={fieldErrors.practiceNumber}
          />
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-4 text-xl font-bold text-deep">Logo and signature</legend>
          <ImageUploadField
            label="Practice logo"
            hint="Shown at the top of the letterhead."
            image={profile.logoImage}
            onChange={(image) => updateField("logoImage", image)}
          />
          <ImageUploadField
            label="Signature"
            hint="Placed on referral letters only. Prescriptions are always signed by hand."
            image={profile.signatureImage}
            onChange={(image) => updateField("signatureImage", image)}
          />
        </fieldset>

        <section aria-labelledby="letterhead-preview-heading" className="flex flex-col gap-3">
          <h2 id="letterhead-preview-heading" className="text-xl font-bold text-deep">
            Letterhead preview
          </h2>
          <div className="rounded-lg border border-line bg-white p-5 sm:p-8">
            <LetterheadHeader practiceProfile={profile} />
          </div>
        </section>

        {errorCount > 0 && (
          <Notice tone="danger" title="Some details are missing" announce="alert">
            {errorCount === 1 ? "1 field needs" : `${errorCount} fields need`} your attention above.
          </Notice>
        )}
        {couldNotSave && (
          <Notice tone="danger" title="Your details were not saved" announce="alert">
            This browser&apos;s storage is full or blocked. Try smaller images, or leave private
            browsing, then save again.
          </Notice>
        )}

        <Button type="submit" className="sm:self-start">
          Save practice details
        </Button>
      </form>
    </>
  );
}

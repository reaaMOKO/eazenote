"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PageHeading } from "@/components/layout/PageHeading";
import { Button, ButtonLink } from "@/components/ui/Button";
import { PencilIcon } from "@/components/ui/icons";
import { Notice } from "@/components/ui/Notice";
import { TextField } from "@/components/ui/TextField";
import { LetterheadHeader } from "@/features/documents/LetterheadDocument";
import { ImageUploadField } from "./ImageUploadField";
import {
  findPracticeFieldErrors,
  isPracticeProfileComplete,
  type PracticeFieldErrors,
} from "./practice-rules";
import { savePracticeProfile, usePracticeProfile } from "./practice-store";
import { EMPTY_PRACTICE_PROFILE, type PracticeProfile } from "./practice-types";

/**
 * Practice details are entered ONCE, not per patient.
 *
 *   First visit:  the setup form.
 *   After that:   a read-only summary with an "Edit" button. Every document
 *                 picks the saved details up automatically.
 */
export function PracticeSetupScreen() {
  const savedProfile = usePracticeProfile();
  const [isEditing, setIsEditing] = useState(false);

  // Wait until the saved details are read, so the form starts with them filled in.
  if (savedProfile === undefined) return null;

  const isAlreadySetUp = isPracticeProfileComplete(savedProfile);

  if (savedProfile && isAlreadySetUp && !isEditing) {
    return <SavedPracticeSummary profile={savedProfile} onEdit={() => setIsEditing(true)} />;
  }

  return (
    <PracticeSetupForm
      startingProfile={savedProfile ?? EMPTY_PRACTICE_PROFILE}
      isFirstSetup={!isAlreadySetUp}
      onFinishedEditing={() => setIsEditing(false)}
    />
  );
}

/** What the doctor sees once setup is done: the saved letterhead, nothing to fill in. */
function SavedPracticeSummary({ profile, onEdit }: { profile: PracticeProfile; onEdit: () => void }) {
  return (
    <>
      <PageHeading title="Practice details">
        Saved. These go on every document automatically, so there is nothing to fill in for each
        patient.
      </PageHeading>

      <div className="rounded-lg border border-line bg-white p-5 sm:p-8">
        <LetterheadHeader practiceProfile={profile} />
        <dl className="mt-4 grid gap-x-8 gap-y-3 text-base sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate">Doctor</dt>
            <dd className="font-semibold text-ink">{profile.doctorName}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate">HPCSA number</dt>
            <dd className="font-semibold text-ink">{profile.hpcsaNumber}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate">Logo</dt>
            <dd className="font-semibold text-ink">{profile.logoImage ? "Added" : "Not added"}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate">Signature for referral letters</dt>
            <dd className="font-semibold text-ink">
              {profile.signatureImage ? "Added" : "Not added"}
            </dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/consults/new">Start a consult</ButtonLink>
        <Button variant="secondary" onClick={onEdit}>
          <PencilIcon />
          Edit practice details
        </Button>
      </div>
    </>
  );
}

function countErrors(fieldErrors: PracticeFieldErrors): number {
  return Object.values(fieldErrors).filter(Boolean).length;
}

interface PracticeSetupFormProps {
  startingProfile: PracticeProfile;
  /** True the first time, before any details are saved. */
  isFirstSetup: boolean;
  /** Called after saving or cancelling an edit, to return to the summary. */
  onFinishedEditing: () => void;
}

function PracticeSetupForm({ startingProfile, isFirstSetup, onFinishedEditing }: PracticeSetupFormProps) {
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
    if (!wasSaved) return;

    // First setup leads straight into the first consult; a later edit returns to the summary.
    if (isFirstSetup) router.push("/consults");
    else onFinishedEditing();
  }

  const errorCount = countErrors(fieldErrors);

  return (
    <>
      <PageHeading title={isFirstSetup ? "Set up your practice" : "Edit practice details"}>
        {isFirstSetup
          ? "You do this once. EazeNote puts these details on the letterhead of every document, so you never retype them for a patient."
          : "Changes apply to every document you approve from now on."}
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

        <div className="flex flex-wrap gap-3">
          <Button type="submit">Save practice details</Button>
          {!isFirstSetup && (
            <Button variant="secondary" onClick={onFinishedEditing}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </>
  );
}

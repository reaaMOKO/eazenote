"use client";

import { useState, type FormEvent, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { TextField } from "@/components/ui/TextField";
import { looksLikeEmailAddress } from "@/lib/format";
import { emailService } from "@/services";
import type { ClinicalDocument } from "./document-types";

interface EmailReferralDialogProps {
  /** Lets the parent open the dialog with dialogRef.current.showModal(). */
  dialogRef: RefObject<HTMLDialogElement | null>;
  referralLetter: ClinicalDocument;
  patientName: string;
  /** Pre-fills the address box, e.g. with the patient's email if one was entered. */
  suggestedRecipientEmail: string;
}

type SendState = "editing" | "sending" | "not-sent-demo-mode" | "sent" | "failed";

/**
 * Asks who the approved referral letter goes to, then sends it.
 * Built on the browser's own <dialog>, which handles focus and the Escape key.
 */
export function EmailReferralDialog({
  dialogRef,
  referralLetter,
  patientName,
  suggestedRecipientEmail,
}: EmailReferralDialogProps) {
  const [recipientEmail, setRecipientEmail] = useState(suggestedRecipientEmail);
  const [recipientError, setRecipientError] = useState<string | undefined>();
  const [sendState, setSendState] = useState<SendState>("editing");

  const isFinished = sendState === "sent" || sendState === "not-sent-demo-mode";

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    if (!looksLikeEmailAddress(recipientEmail)) {
      setRecipientError("Enter the email address of the specialist or the patient.");
      return;
    }
    setRecipientError(undefined);
    setSendState("sending");
    try {
      const result = await emailService.sendReferralLetter({
        recipientEmail: recipientEmail.trim(),
        patientName,
        referralLetter,
      });
      setSendState(result.outcome);
    } catch {
      setSendState("failed");
    }
  }

  function handleClose() {
    dialogRef.current?.close();
    setSendState("editing");
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="email-referral-heading"
      onClose={() => setSendState("editing")}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-white p-6 text-ink backdrop:bg-ink/60"
    >
      <form onSubmit={handleSend} noValidate className="flex flex-col gap-5">
        <h2 id="email-referral-heading" className="text-xl font-extrabold tracking-tight text-deep">
          Email referral letter
        </h2>

        {!isFinished && (
          <>
            <TextField
              label="Send to"
              type="email"
              inputMode="email"
              value={recipientEmail}
              onChange={setRecipientEmail}
              error={recipientError}
              hint={`The approved letter for ${patientName} is attached as a PDF.`}
            />
            {sendState === "failed" && (
              <Notice tone="danger" title="The letter was not sent" announce="alert">
                Check your internet connection, then send again.
              </Notice>
            )}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={sendState === "sending"}>
                {sendState === "sending" ? "Sending" : "Send referral letter"}
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </>
        )}

        {sendState === "not-sent-demo-mode" && (
          <Notice tone="info" title="Demo mode: no email was sent" announce="status">
            In the live app, the letter would now be on its way to <strong>{recipientEmail}</strong>.
            Email sending is switched on in Phase 4.
          </Notice>
        )}
        {sendState === "sent" && (
          <Notice tone="success" title="Referral letter sent" announce="status">
            Sent to <strong>{recipientEmail}</strong>.
          </Notice>
        )}
        {isFinished && (
          <Button onClick={handleClose} className="self-start">
            Close
          </Button>
        )}
      </form>
    </dialog>
  );
}

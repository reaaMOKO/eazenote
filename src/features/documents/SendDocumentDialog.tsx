"use client";

import { useId, useState, type FormEvent, type RefObject } from "react";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { TextField } from "@/components/ui/TextField";
import { looksLikeEmailAddress, looksLikePhoneNumber } from "@/lib/format";
import { deliveryService } from "@/services";
import { DOCUMENT_KIND_LABELS, type ClinicalDocument, type DeliveryChannel } from "./document-types";

interface SendDocumentDialogProps {
  /** Lets the parent open the dialog with dialogRef.current.showModal(). */
  dialogRef: RefObject<HTMLDialogElement | null>;
  document: ClinicalDocument;
  patientName: string;
  /** The patient's contact details from the consult, used to pre-fill the boxes. */
  patientEmail: string;
  patientPhone: string;
}

type SendState = "editing" | "sending" | "not-sent-demo-mode" | "sent" | "failed";

const CHANNEL_LABELS: Record<DeliveryChannel, string> = {
  email: "Email",
  phone: "Phone", // Short, so both choices fit side by side on a phone screen.
};

/**
 * Asks where an APPROVED document should go (an email address or a phone
 * number), then sends it. Built on the browser's own <dialog>, which handles
 * focus and the Escape key.
 */
export function SendDocumentDialog({
  dialogRef,
  document,
  patientName,
  patientEmail,
  patientPhone,
}: SendDocumentDialogProps) {
  const headingId = useId();
  const documentName = DOCUMENT_KIND_LABELS[document.kind].toLowerCase();

  // Start on the channel the doctor already has details for.
  const [channel, setChannel] = useState<DeliveryChannel>(
    patientEmail === "" && patientPhone !== "" ? "phone" : "email",
  );
  const [emailAddress, setEmailAddress] = useState(patientEmail);
  const [phoneNumber, setPhoneNumber] = useState(patientPhone);
  const [recipientError, setRecipientError] = useState<string | undefined>();
  const [sendState, setSendState] = useState<SendState>("editing");

  const recipient = (channel === "email" ? emailAddress : phoneNumber).trim();
  const isFinished = sendState === "sent" || sendState === "not-sent-demo-mode";

  function chooseChannel(nextChannel: DeliveryChannel) {
    setChannel(nextChannel);
    setRecipientError(undefined);
  }

  async function handleSend(event: FormEvent) {
    event.preventDefault();

    const isRecipientValid =
      channel === "email" ? looksLikeEmailAddress(recipient) : looksLikePhoneNumber(recipient);
    if (!isRecipientValid) {
      setRecipientError(
        channel === "email"
          ? "Enter a valid email address, like name@example.com."
          : "Enter a valid phone number, like 082 123 4567.",
      );
      return;
    }

    setRecipientError(undefined);
    setSendState("sending");
    try {
      const result = await deliveryService.sendDocument({ channel, recipient, patientName, document });
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
      aria-labelledby={headingId}
      onClose={() => setSendState("editing")}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-white p-6 text-ink backdrop:bg-ink/60"
    >
      <form onSubmit={handleSend} noValidate className="flex flex-col gap-5">
        <h2 id={headingId} className="text-xl font-extrabold tracking-tight text-deep">
          Send {documentName} for {patientName}
        </h2>

        {!isFinished && (
          <>
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-base font-semibold text-ink">Send by</legend>
              <div className="grid grid-cols-2 gap-2">
                {(["email", "phone"] as const).map((channelOption) => (
                  <label
                    key={channelOption}
                    className={`flex min-h-12 cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2 text-base font-semibold ${
                      channel === channelOption ? "border-deep bg-tint text-deep" : "border-slate text-ink"
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery-channel"
                      checked={channel === channelOption}
                      onChange={() => chooseChannel(channelOption)}
                      className="size-5 accent-deep"
                    />
                    {CHANNEL_LABELS[channelOption]}
                  </label>
                ))}
              </div>
            </fieldset>

            {channel === "email" ? (
              <TextField
                label="Email address"
                type="email"
                inputMode="email"
                value={emailAddress}
                onChange={setEmailAddress}
                error={recipientError}
                hint={`The approved ${documentName} is attached as a PDF.`}
              />
            ) : (
              <TextField
                label="Phone number"
                type="tel"
                inputMode="tel"
                value={phoneNumber}
                onChange={setPhoneNumber}
                error={recipientError}
                hint={`A message with a secure link to the approved ${documentName}.`}
              />
            )}

            {/* A wrong address would disclose health information to a stranger. */}
            <p className="text-sm text-slate">
              Check the details carefully. This document contains the patient&apos;s health
              information.
            </p>

            {sendState === "failed" && (
              <Notice tone="danger" title="The document was not sent" announce="alert">
                Check your internet connection, then send again.
              </Notice>
            )}

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={sendState === "sending"}>
                {sendState === "sending" ? "Sending" : `Send ${documentName}`}
              </Button>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          </>
        )}

        {sendState === "not-sent-demo-mode" && (
          <Notice tone="info" title="Demo mode: nothing was sent" announce="status">
            In the live app, the {documentName} would now be on its way to{" "}
            <strong>{recipient}</strong>. Sending is not switched on yet.
          </Notice>
        )}
        {sendState === "sent" && (
          <Notice tone="success" title={`${DOCUMENT_KIND_LABELS[document.kind]} sent`} announce="status">
            Sent to <strong>{recipient}</strong>.
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

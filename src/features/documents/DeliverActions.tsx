"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyIcon, MailIcon, PrinterIcon } from "@/components/ui/icons";
import { canDeliver, formatDocumentAsPlainText } from "./document-rules";
import type { ClinicalDocument } from "./document-types";
import { EmailReferralDialog } from "./EmailReferralDialog";

interface DeliverActionsProps {
  document: ClinicalDocument;
  patientName: string;
  patientEmail: string;
}

/**
 * The ways an APPROVED document leaves EazeNote. Each kind has its own route:
 *   clinical note:      copy into the practice system, or print / save as PDF
 *   referral letter:    email, or print / save as PDF
 *   prescription draft: print, then sign by hand
 *
 * Nothing here runs automatically; the doctor presses each button.
 */
export function DeliverActions({ document, patientName, patientEmail }: DeliverActionsProps) {
  const emailDialogRef = useRef<HTMLDialogElement>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  // Safety rule: drafts are never delivered. The screen only shows these
  // buttons after approval, and this check stops any other route to them.
  if (!canDeliver(document)) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(formatDocumentAsPlainText(document));
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
  }

  /** Opens the browser's print window, where "Save as PDF" is also offered. */
  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        {document.kind === "clinical-note" && (
          <>
            <Button onClick={handleCopy}>
              <CopyIcon />
              Copy note
            </Button>
            <Button variant="secondary" onClick={handlePrint}>
              <PrinterIcon />
              Print or save as PDF
            </Button>
          </>
        )}

        {document.kind === "referral-letter" && (
          <>
            <Button onClick={() => emailDialogRef.current?.showModal()}>
              <MailIcon />
              Email referral letter
            </Button>
            <Button variant="secondary" onClick={handlePrint}>
              <PrinterIcon />
              Print or save as PDF
            </Button>
          </>
        )}

        {document.kind === "prescription-draft" && (
          <Button onClick={handlePrint}>
            <PrinterIcon />
            Print prescription
          </Button>
        )}
      </div>

      <p role="status" className="min-h-6 text-sm text-slate">
        {copyStatus === "copied" && "Copied. Paste it into your practice system."}
        {copyStatus === "failed" &&
          "Copying is blocked in this browser. Use Print or save as PDF instead."}
        {copyStatus === "idle" &&
          document.kind === "prescription-draft" &&
          "Sign the printed prescription by hand. It is not valid until signed."}
      </p>

      {document.kind === "referral-letter" && (
        <EmailReferralDialog
          dialogRef={emailDialogRef}
          referralLetter={document}
          patientName={patientName}
          suggestedRecipientEmail={patientEmail}
        />
      )}
    </div>
  );
}

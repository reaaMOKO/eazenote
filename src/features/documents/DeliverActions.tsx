"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CopyIcon, MailIcon, PrinterIcon } from "@/components/ui/icons";
import { canDeliver, canSendElectronically, formatDocumentAsPlainText } from "./document-rules";
import type { ClinicalDocument } from "./document-types";
import { SendDocumentDialog } from "./SendDocumentDialog";

interface DeliverActionsProps {
  document: ClinicalDocument;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
}

/**
 * The ways an APPROVED document leaves EazeNote:
 *
 *   clinical note:      send (email or phone), print / save as PDF, or copy
 *   referral letter:    send (email or phone), or print / save as PDF
 *   prescription draft: print only, then sign by hand
 *
 * Nothing here runs automatically; the doctor presses each button.
 */
export function DeliverActions({ document, patientName, patientEmail, patientPhone }: DeliverActionsProps) {
  const sendDialogRef = useRef<HTMLDialogElement>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  // Safety rule: drafts are never delivered. The screen only shows these
  // buttons after approval, and this check stops any other route to them.
  if (!canDeliver(document)) return null;

  const isSendingAllowed = canSendElectronically(document);
  const isPrescription = document.kind === "prescription-draft";

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
        {isSendingAllowed && (
          <Button onClick={() => sendDialogRef.current?.showModal()}>
            <MailIcon />
            {document.kind === "referral-letter" ? "Send referral letter" : "Send to patient"}
          </Button>
        )}

        <Button variant={isSendingAllowed ? "secondary" : "primary"} onClick={handlePrint}>
          <PrinterIcon />
          {isPrescription ? "Print prescription" : "Print or save as PDF"}
        </Button>

        {document.kind === "clinical-note" && (
          <Button variant="secondary" onClick={handleCopy}>
            <CopyIcon />
            Copy note
          </Button>
        )}
      </div>

      <p role="status" className="min-h-6 text-sm text-slate">
        {copyStatus === "copied" && "Copied. Paste it into your practice system."}
        {copyStatus === "failed" &&
          "Copying is blocked in this browser. Use Print or save as PDF instead."}
        {copyStatus === "idle" &&
          isPrescription &&
          "Sign the printed prescription by hand; it is not valid until signed. Prescriptions cannot be sent by email or phone."}
      </p>

      {isSendingAllowed && (
        <SendDocumentDialog
          dialogRef={sendDialogRef}
          document={document}
          patientName={patientName}
          patientEmail={patientEmail}
          patientPhone={patientPhone}
        />
      )}
    </div>
  );
}

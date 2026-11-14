import type { ReactNode } from "react";
import { AlertIcon, CheckIcon, InfoIcon } from "./icons";

/**
 * info:    neutral explanation.
 * caution: needs the doctor's attention before continuing (drafts, [CHECK] items).
 * danger:  something went wrong; says what to do next.
 * success: something finished (approved, copied).
 */
export type NoticeTone = "info" | "caution" | "danger" | "success";

const TONE_CLASSES: Record<NoticeTone, string> = {
  info: "border-line bg-tint text-ink",
  caution: "border-caution-line bg-caution-tint text-caution",
  danger: "border-danger bg-danger-tint text-danger",
  success: "border-deep bg-tint text-deep",
};

const TONE_ICONS: Record<NoticeTone, ReactNode> = {
  info: <InfoIcon />,
  caution: <AlertIcon />,
  danger: <AlertIcon />,
  success: <CheckIcon />,
};

interface NoticeProps {
  tone: NoticeTone;
  /** Short bold lead-in, e.g. "Draft, not approved". */
  title?: string;
  children?: ReactNode;
  /**
   * "alert" interrupts a screen reader immediately (errors).
   * "status" is announced politely (progress, confirmations).
   * Leave unset for notices that are on the page from the start.
   */
  announce?: "alert" | "status";
}

/** A message box. Tone is shown by icon and wording, never by colour alone. */
export function Notice({ tone, title, children, announce }: NoticeProps) {
  return (
    <div role={announce} className={`flex gap-3 rounded-lg border px-4 py-3 ${TONE_CLASSES[tone]}`}>
      <span className="mt-0.5">{TONE_ICONS[tone]}</span>
      <div className="flex flex-col gap-0.5 text-base">
        {title && <p className="font-bold">{title}</p>}
        {children && <div className="text-ink">{children}</div>}
      </div>
    </div>
  );
}

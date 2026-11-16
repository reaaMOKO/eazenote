/**
 * Line icons used across the app. All are decorative (aria-hidden): the text
 * next to each icon carries the meaning, so screen readers skip the picture.
 */
import type { ReactNode } from "react";

interface IconProps {
  /** Width and height in pixels. */
  size?: number;
}

function LineIcon({ size = 20, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {children}
    </svg>
  );
}

export function MicrophoneIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </LineIcon>
  );
}

export function StopIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" />
    </LineIcon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </LineIcon>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="M12 4l9 16H3z" />
      <path d="M12 10v4M12 17.5v.01" />
    </LineIcon>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6M12 7.5v.01" />
    </LineIcon>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </LineIcon>
  );
}

export function CopyIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </LineIcon>
  );
}

export function PrinterIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="M7 9V4h10v5M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="7" y="14" width="10" height="6" />
    </LineIcon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </LineIcon>
  );
}

export function PencilIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z" />
    </LineIcon>
  );
}

/** Lines on a page: the clinical note. */
export function NoteIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="M6 3h9l4 4v14H6z" />
      <path d="M9 11h7M9 15h7M9 7h3" />
    </LineIcon>
  );
}

/** An arrow curving onward: the referral letter. */
export function ReferralIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <path d="M4 19c0-6 4-10 11-10h4" />
      <path d="M15 5l4 4-4 4" />
    </LineIcon>
  );
}

/** A capsule: the prescription. */
export function PillIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-45 12 12)" />
      <path d="M9.2 9.2l5.6 5.6" />
    </LineIcon>
  );
}

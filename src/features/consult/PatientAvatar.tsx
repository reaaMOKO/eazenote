import { getPatientInitials } from "./consult-display";

interface PatientAvatarProps {
  patientName: string;
  /** "small" in the sidebar, "regular" in lists. */
  size?: "small" | "regular";
  /** Solid green for the consult that is open now; soft mint otherwise. */
  isActive?: boolean;
}

/** A round badge with the patient's initials. Decoration: the name is always shown next to it. */
export function PatientAvatar({ patientName, size = "regular", isActive = false }: PatientAvatarProps) {
  const sizeClass = size === "small" ? "size-8 text-xs" : "size-11 text-sm";
  const colorClass = isActive ? "bg-deep text-white" : "bg-mint text-deep";

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${sizeClass} ${colorClass}`}
    >
      {getPatientInitials(patientName)}
    </span>
  );
}

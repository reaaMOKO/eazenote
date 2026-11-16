"use client";

import { useId, type ReactNode } from "react";

interface CheckboxProps {
  label: ReactNode;
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
  /** Extra explanation shown under the label. */
  description?: string;
}

/** A large tick box. The whole row is the click target, not just the small square. */
export function Checkbox({ label, isChecked, onChange, description }: CheckboxProps) {
  const checkboxId = useId();
  const descriptionId = `${checkboxId}-description`;

  return (
    <label
      htmlFor={checkboxId}
      className={`flex min-h-12 cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 ${
        isChecked ? "border-deep bg-tint" : "border-slate bg-white"
      }`}
    >
      <input
        id={checkboxId}
        type="checkbox"
        checked={isChecked}
        aria-describedby={description ? descriptionId : undefined}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-6 shrink-0 accent-deep"
      />
      <span className="flex flex-col gap-0.5">
        <span className="text-base font-semibold text-ink">{label}</span>
        {description && (
          <span id={descriptionId} className="text-sm text-slate">
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

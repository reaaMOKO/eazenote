"use client";

import { useId } from "react";

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  /** Shown under the label to explain what to enter. */
  hint?: string;
  /** Shown in place of the hint when the value is not acceptable. */
  error?: string;
  /** Adds "(optional)" to the label. Fields are required unless this is set. */
  isOptional?: boolean;
  /** Use a taller box for text that runs over several lines, like an address. */
  isMultiline?: boolean;
  type?: "text" | "email" | "tel";
  /** Helps the browser offer the right autofill, e.g. "email" or "off". */
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
}

const INPUT_CLASSES =
  "w-full rounded-lg border bg-white px-4 py-3 text-base text-ink placeholder:text-slate";

/**
 * A labelled text box. The label, hint and error are linked to the box so
 * screen readers announce them together.
 */
export function TextField({
  label,
  value,
  onChange,
  hint,
  error,
  isOptional = false,
  isMultiline = false,
  type = "text",
  autoComplete = "off",
  inputMode,
}: TextFieldProps) {
  const fieldId = useId();
  const messageId = `${fieldId}-message`;
  const hasMessage = Boolean(error || hint);
  const borderClass = error ? "border-danger border-2" : "border-slate";

  const sharedProps = {
    id: fieldId,
    value,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": hasMessage ? messageId : undefined,
    className: `${INPUT_CLASSES} ${borderClass}`,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-base font-semibold text-ink">
        {label}
        {isOptional && <span className="font-normal text-slate"> (optional)</span>}
      </label>

      {isMultiline ? (
        <textarea
          {...sharedProps}
          rows={3}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          {...sharedProps}
          type={type}
          inputMode={inputMode}
          required={!isOptional}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {hasMessage && (
        <p id={messageId} className={`text-sm ${error ? "font-semibold text-danger" : "text-slate"}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

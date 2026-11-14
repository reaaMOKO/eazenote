"use client";

import { useId, useState } from "react";

interface PasswordFieldProps {
  label: string;
  value: string;
  onChange: (nextValue: string) => void;
  hint?: string;
  error?: string;
  /**
   * "current-password" when signing in, "new-password" when creating an
   * account. This is what lets password managers fill in or suggest one.
   */
  autoComplete: "current-password" | "new-password";
}

/**
 * A password box with a Show / Hide button, so the doctor can check what
 * they typed instead of retyping after a failed sign-in.
 */
export function PasswordField({ label, value, onChange, hint, error, autoComplete }: PasswordFieldProps) {
  const fieldId = useId();
  const messageId = `${fieldId}-message`;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const hasMessage = Boolean(error || hint);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-base font-semibold text-ink">
        {label}
      </label>

      <div
        className={`flex rounded-lg border bg-white focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-deep ${
          error ? "border-2 border-danger" : "border-slate"
        }`}
      >
        <input
          id={fieldId}
          type={isPasswordVisible ? "text" : "password"}
          value={value}
          required
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 rounded-lg bg-transparent px-4 py-3 text-base text-ink outline-none"
        />
        <button
          type="button"
          aria-pressed={isPasswordVisible}
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          onClick={() => setIsPasswordVisible((isVisible) => !isVisible)}
          className="min-h-11 rounded-lg px-4 text-sm font-semibold text-deep hover:text-green"
        >
          {isPasswordVisible ? "Hide" : "Show"}
        </button>
      </div>

      {hasMessage && (
        <p id={messageId} className={`text-sm ${error ? "font-semibold text-danger" : "text-slate"}`}>
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

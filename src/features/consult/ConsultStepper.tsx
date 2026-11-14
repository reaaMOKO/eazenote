import { CONSULT_STEPS, CONSULT_STEP_LABELS, type ConsultStep } from "./consult-types";

/**
 * Shows where the doctor is in the four consult steps.
 * On a phone the step names do not fit under the bars, so one line names the
 * current step instead; screen readers still hear every step.
 */
export function ConsultStepper({ currentStep }: { currentStep: ConsultStep }) {
  const currentStepIndex = CONSULT_STEPS.indexOf(currentStep);

  return (
    <nav aria-label="Consult progress" className="print:hidden">
      {/* Phone: one short line. Hidden from screen readers, which read the full list below. */}
      <p aria-hidden="true" className="mb-2 text-sm font-bold text-deep sm:hidden">
        Step {currentStepIndex + 1} of {CONSULT_STEPS.length}: {CONSULT_STEP_LABELS[currentStep]}
      </p>
      <ol className="flex gap-2">
        {CONSULT_STEPS.map((step, stepIndex) => {
          const isCurrent = stepIndex === currentStepIndex;
          const isDone = stepIndex < currentStepIndex;

          return (
            <li key={step} aria-current={isCurrent ? "step" : undefined} className="flex-1">
              <span
                className={`block h-1.5 rounded-full ${isCurrent || isDone ? "bg-deep" : "bg-line"}`}
              />
              <span
                className={`mt-2 block text-sm max-sm:sr-only ${
                  isCurrent ? "font-bold text-deep" : "text-slate"
                }`}
              >
                {stepIndex + 1}. {CONSULT_STEP_LABELS[step]}
                {isDone && <span className="sr-only"> (done)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

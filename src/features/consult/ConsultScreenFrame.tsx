"use client";

import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { PageHeading } from "@/components/layout/PageHeading";
import { ButtonLink } from "@/components/ui/Button";
import { ConsultStepper } from "./ConsultStepper";
import { useConsult } from "./consult-store";
import type { Consult, ConsultStep } from "./consult-types";

interface ConsultScreenFrameProps {
  currentStep: Exclude<ConsultStep, "patient">;
  /** Draws the screen once the consult has been found. */
  children: (consult: Consult) => ReactNode;
}

/**
 * Shared start of the Record, Transcript and Documents screens: reads the
 * consult id from the page address, loads the consult, and handles the
 * "still loading" and "not found" cases in one place.
 */
export function ConsultScreenFrame({ currentStep, children }: ConsultScreenFrameProps) {
  const { consultId } = useParams<{ consultId: string }>();
  const consult = useConsult(consultId);

  if (consult === undefined) return null; // Still loading.

  if (consult === null) {
    return (
      <>
        <PageHeading title="Consult not found">
          This consult is no longer here. In demo mode, consults clear when the tab is closed.
        </PageHeading>
        <ButtonLink href="/consults" className="sm:self-start">
          Back to consults
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <ConsultStepper currentStep={currentStep} />
      {children(consult)}
    </>
  );
}

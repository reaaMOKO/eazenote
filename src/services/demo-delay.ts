/**
 * Phase 1 only. Real transcription and drafting take seconds, so the sample
 * services pause briefly. That lets the "Transcribing" and "Drafting" progress
 * states be seen and tested before the real services exist.
 */
export function waitForDemoDelay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

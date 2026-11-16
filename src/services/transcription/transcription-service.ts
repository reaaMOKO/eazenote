/**
 * Speech-to-text: turns consult audio into a transcript.
 *
 * Screens only ever use the TranscriptionService shape below, so switching
 * provider is a change to this folder alone:
 *   Phase 1: sample transcript (this file).
 *   Phase 3: a call to OUR server route, which holds the API key and calls
 *            Vulavula or ElevenLabs. The browser never talks to them directly.
 */
import type { Transcript } from "@/features/consult/consult-types";
import { SAMPLE_TRANSCRIPT } from "@/services/sample-data/sample-consult";
import { waitForDemoDelay } from "@/services/demo-delay";

export interface TranscriptionService {
  /** `audio` is null when the doctor chose the sample recording instead of the microphone. */
  transcribeConsultAudio: (audio: Blob | null) => Promise<Transcript>;
}

export const sampleTranscriptionService: TranscriptionService = {
  async transcribeConsultAudio() {
    // The recording is deliberately ignored: Phase 1 uploads nothing.
    await waitForDemoDelay(2200);
    return SAMPLE_TRANSCRIPT;
  },
};

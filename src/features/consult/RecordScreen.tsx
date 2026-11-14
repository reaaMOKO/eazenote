"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageHeading } from "@/components/layout/PageHeading";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { CheckIcon, MicrophoneIcon, StopIcon } from "@/components/ui/icons";
import { IS_DEMO_MODE } from "@/config/app-config";
import { formatDateAndTime, formatDurationInWords, formatRecordingClock } from "@/lib/format";
import { transcriptionService } from "@/services";
import { ConsultScreenFrame } from "./ConsultScreenFrame";
import { saveConsult } from "./consult-store";
import type { Consult } from "./consult-types";
import { SoundLevelBars } from "./SoundLevelBars";
import { useAudioRecorder } from "./use-audio-recorder";

/** Step 2: record the consultation, then send it for transcription. */
export function RecordScreen() {
  return (
    <ConsultScreenFrame currentStep="record">
      {(consult) => <RecordingPanel consult={consult} />}
    </ConsultScreenFrame>
  );
}

function RecordingPanel({ consult }: { consult: Consult }) {
  const router = useRouter();
  const recorder = useAudioRecorder();
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionFailed, setTranscriptionFailed] = useState(false);

  const isRecording = recorder.status === "recording";
  const isStartingMicrophone = recorder.status === "requesting-microphone";

  /**
   * Sends the audio for transcription and moves to the transcript screen.
   * `recordedAudio` is null when the sample recording is used instead of the microphone.
   * The audio is not stored anywhere: once this function ends, it is gone.
   */
  async function transcribeAndContinue(recordedAudio: Blob | null, recordingSeconds: number) {
    setIsTranscribing(true);
    setTranscriptionFailed(false);
    try {
      const transcript = await transcriptionService.transcribeConsultAudio(recordedAudio);
      saveConsult({ ...consult, recordingSeconds, transcript });
      router.push(`/consults/${consult.id}/transcript`);
    } catch {
      setTranscriptionFailed(true);
      setIsTranscribing(false);
    }
  }

  async function handleStopRecording() {
    const recordingSeconds = recorder.elapsedSeconds;
    const recordedAudio = await recorder.stopRecording();
    await transcribeAndContinue(recordedAudio, recordingSeconds);
  }

  // A consult is recorded once. Its transcript is the record from here on.
  if (consult.transcript && !isTranscribing) {
    return (
      <>
        <PageHeading title="Already recorded">
          This consult with {consult.patientName} has been transcribed.
        </PageHeading>
        <ButtonLink href={`/consults/${consult.id}/transcript`} className="sm:self-start">
          View the transcript
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <PageHeading title={`Record the consult with ${consult.patientName}`}>
        Consult as normal, in any mix of languages. Press stop when you are done.
      </PageHeading>

      <section
        aria-label="Recorder"
        className="flex flex-col items-center gap-6 rounded-2xl bg-tint px-4 py-10 text-center"
      >
        {isTranscribing ? (
          <div role="status" className="flex flex-col items-center gap-3">
            <SoundLevelBars inputLevel={0} isPulsing />
            <p className="text-xl font-bold text-deep">Transcribing the consult</p>
            <p className="text-base text-slate">This takes up to a minute. Keep this page open.</p>
          </div>
        ) : (
          <>
            <p
              className={`flex items-center gap-2 text-base font-bold ${
                isRecording ? "text-danger" : "text-slate"
              }`}
            >
              {isRecording && <span className="size-3 animate-pulse rounded-full bg-danger" />}
              {isRecording ? "Recording" : "Ready to record"}
            </p>

            <p
              role="timer"
              aria-label={`Recording time: ${formatDurationInWords(recorder.elapsedSeconds)}`}
              className="text-6xl font-extrabold tracking-tight text-deep tabular-nums"
            >
              {formatRecordingClock(recorder.elapsedSeconds)}
            </p>

            <SoundLevelBars inputLevel={isRecording ? recorder.inputLevel : 0} />

            {isRecording ? (
              <Button variant="danger" onClick={handleStopRecording} className="w-full max-w-xs">
                <StopIcon />
                Stop recording
              </Button>
            ) : (
              <Button
                onClick={recorder.startRecording}
                disabled={isStartingMicrophone}
                className="w-full max-w-xs"
              >
                <MicrophoneIcon />
                {isStartingMicrophone ? "Waiting for the microphone" : "Start recording"}
              </Button>
            )}

            <p className="flex items-center gap-2 text-sm text-slate">
              <CheckIcon size={16} />
              Patient consent confirmed on {formatDateAndTime(consult.consentConfirmedAt)}
            </p>
          </>
        )}
      </section>

      {recorder.failureMessage && (
        <Notice tone="danger" title="Recording did not start" announce="alert">
          {recorder.failureMessage}
        </Notice>
      )}

      {transcriptionFailed && (
        <Notice tone="danger" title="The consult was not transcribed" announce="alert">
          Check your internet connection, then record again. The recording was not kept.
        </Notice>
      )}

      {/* Lets testers without a working microphone try the rest of the flow. Removed with demo mode. */}
      {IS_DEMO_MODE && !isRecording && !isTranscribing && (
        <Button
          variant="quiet"
          onClick={() => transcribeAndContinue(null, 0)}
          className="self-center"
        >
          No microphone? Use the sample recording
        </Button>
      )}
    </>
  );
}

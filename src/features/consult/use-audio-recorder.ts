"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

export type RecorderStatus = "idle" | "requesting-microphone" | "recording" | "failed";

/** How often the clock and the sound-level bars refresh while recording. */
const REFRESH_INTERVAL_MS = 100;

/** Turns a browser microphone error into a message that says what to do next. */
function describeMicrophoneFailure(error: unknown): string {
  const errorName = error instanceof DOMException ? error.name : "";
  if (errorName === "NotAllowedError" || errorName === "SecurityError") {
    return "Microphone access is blocked. Allow the microphone for this site in your browser's address bar, then try again.";
  }
  if (errorName === "NotFoundError") {
    return "No microphone was found. Connect one, or use a phone or laptop with a built-in microphone.";
  }
  return "The microphone could not be started. Close other apps that may be using it, then try again.";
}

/**
 * Records consult audio with the device microphone.
 *
 * The audio is held in the browser's memory only. It is handed to the caller
 * once when recording stops, and this hook keeps no copy.
 */
export function useAudioRecorder() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  /** Loudness right now, from 0 (silent) to 1 (loud). Proves the microphone is hearing something. */
  const [inputLevel, setInputLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const refreshTimerRef = useRef<number | null>(null);

  /** Switches the microphone off and stops the timers. Safe to call more than once. */
  const releaseMicrophone = useCallback(() => {
    if (refreshTimerRef.current !== null) {
      window.clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    microphoneStreamRef.current?.getTracks().forEach((track) => track.stop());
    microphoneStreamRef.current = null;
    mediaRecorderRef.current = null;
    void audioContextRef.current?.close().catch(() => undefined);
    audioContextRef.current = null;
  }, []);

  // Leaving the screen mid-recording must not leave the microphone on, and
  // the abandoned audio is thrown away. (Next.js keeps the screen alive in the
  // background, so the on-screen state is reset here too.)
  useLayoutEffect(() => {
    return () => {
      releaseMicrophone();
      audioChunksRef.current = [];
      setStatus("idle");
      setElapsedSeconds(0);
      setInputLevel(0);
    };
  }, [releaseMicrophone]);

  async function startRecording(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setFailureMessage("This browser cannot record audio. Use a recent version of Chrome, Edge or Safari.");
      setStatus("failed");
      return;
    }

    setFailureMessage(null);
    setStatus("requesting-microphone");

    let microphoneStream: MediaStream;
    try {
      microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (error) {
      setFailureMessage(describeMicrophoneFailure(error));
      setStatus("failed");
      return;
    }
    microphoneStreamRef.current = microphoneStream;

    // Collect the audio in pieces as it is recorded.
    audioChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(microphoneStream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start(1000);

    // Measure loudness so the screen can show that sound is being picked up.
    const audioContext = new AudioContext();
    // Some browsers start the audio engine paused until asked to resume.
    void audioContext.resume().catch(() => undefined);
    const loudnessAnalyser = audioContext.createAnalyser();
    loudnessAnalyser.fftSize = 512;
    audioContext.createMediaStreamSource(microphoneStream).connect(loudnessAnalyser);
    audioContextRef.current = audioContext;
    const soundSamples = new Uint8Array(loudnessAnalyser.fftSize);

    const startedAtMs = Date.now();
    setElapsedSeconds(0);
    refreshTimerRef.current = window.setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAtMs) / 1000));

      loudnessAnalyser.getByteTimeDomainData(soundSamples);
      let sumOfSquares = 0;
      for (const sample of soundSamples) {
        const centredSample = (sample - 128) / 128;
        sumOfSquares += centredSample * centredSample;
      }
      const loudness = Math.sqrt(sumOfSquares / soundSamples.length);
      // Normal speech is very quiet on this scale. The square root lifts quiet
      // sounds so the bars visibly move, without loud sounds going off the top.
      setInputLevel(Math.min(1, Math.sqrt(loudness) * 1.8));
    }, REFRESH_INTERVAL_MS);

    setStatus("recording");
  }

  /** Stops recording and returns the audio. Returns null if nothing was being recorded. */
  function stopRecording(): Promise<Blob | null> {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
      releaseMicrophone();
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      mediaRecorder.onstop = () => {
        const recordedAudio = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        audioChunksRef.current = []; // Keep no copy here.
        releaseMicrophone();
        setInputLevel(0);
        setStatus("idle");
        resolve(recordedAudio);
      };
      mediaRecorder.stop();
    });
  }

  return { status, failureMessage, elapsedSeconds, inputLevel, startRecording, stopRecording };
}

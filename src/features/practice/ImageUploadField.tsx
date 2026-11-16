"use client";

import { useId, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import { findImageUploadProblem } from "./practice-rules";

interface ImageUploadFieldProps {
  label: string;
  hint: string;
  /** The chosen image as a data URL, or null if none. */
  image: string | null;
  onChange: (image: string | null) => void;
}

/** Reads a chosen file into text (a data URL) so it can be shown and saved. */
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(String(fileReader.result));
    fileReader.onerror = () => reject(fileReader.error);
    fileReader.readAsDataURL(file);
  });
}

/**
 * Picks an optional image (logo or signature).
 * PHASE 1: the image stays in this browser. PHASE 2: it is uploaded to private storage.
 */
export function ImageUploadField({ label, hint, image, onChange }: ImageUploadFieldProps) {
  const inputId = useId();
  const messageId = `${inputId}-message`;
  const [uploadProblem, setUploadProblem] = useState<string | null>(null);

  async function handleFileChosen(event: ChangeEvent<HTMLInputElement>) {
    const chosenFile = event.target.files?.[0];
    event.target.value = ""; // Lets the same file be chosen again after "Remove".
    if (!chosenFile) return;

    const problem = findImageUploadProblem(chosenFile);
    setUploadProblem(problem);
    if (problem) return;

    try {
      onChange(await readFileAsDataUrl(chosenFile));
    } catch {
      setUploadProblem("That image could not be read. Try a different file.");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-base font-semibold text-ink">
        {label} <span className="font-normal text-slate">(optional)</span>
      </label>

      {image && (
        // A plain <img> is correct here: the picture is local data, not a file on a server.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={`Current ${label.toLowerCase()}`}
          className="max-h-24 max-w-60 self-start rounded border border-line bg-white object-contain p-2"
        />
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          id={inputId}
          type="file"
          accept="image/png,image/jpeg"
          aria-describedby={messageId}
          onChange={handleFileChosen}
          className="max-w-full text-base text-ink file:mr-3 file:min-h-12 file:cursor-pointer file:rounded-lg file:border-2 file:border-solid file:border-deep file:bg-white file:px-5 file:font-semibold file:text-deep"
        />
        {image && (
          <Button variant="quiet" onClick={() => onChange(null)}>
            Remove {label.toLowerCase()}
          </Button>
        )}
      </div>

      <p
        id={messageId}
        role={uploadProblem ? "alert" : undefined}
        className={`text-sm ${uploadProblem ? "font-semibold text-danger" : "text-slate"}`}
      >
        {uploadProblem ?? `${hint} PNG or JPG, under 300 KB.`}
      </p>
    </div>
  );
}

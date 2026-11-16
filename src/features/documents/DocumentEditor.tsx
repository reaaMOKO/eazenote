"use client";

import { useId } from "react";
import { AlertIcon } from "@/components/ui/icons";
import { countCheckMarkers } from "./document-rules";
import type { ClinicalDocument, DocumentSection } from "./document-types";

interface DocumentEditorProps {
  document: ClinicalDocument;
  onSectionChange: (sectionId: string, nextBody: string) => void;
}

/** The draft as editable text, one box per section. */
export function DocumentEditor({ document, onSectionChange }: DocumentEditorProps) {
  return (
    <div className="flex flex-col gap-5">
      {document.sections.map((section) => (
        <SectionEditor
          key={section.id}
          section={section}
          onChange={(nextBody) => onSectionChange(section.id, nextBody)}
        />
      ))}
    </div>
  );
}

function SectionEditor({
  section,
  onChange,
}: {
  section: DocumentSection;
  onChange: (nextBody: string) => void;
}) {
  const textareaId = useId();
  const warningId = `${textareaId}-warning`;
  const checkMarkerCount = countCheckMarkers(section.body);
  const hasCheckMarkers = checkMarkerCount > 0;

  // Fallback height for browsers where text boxes do not grow on their own.
  const visibleRows = Math.max(2, section.body.split("\n").length + 1);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={textareaId} className="text-base font-bold text-ink">
        {section.heading}
      </label>
      <textarea
        id={textareaId}
        value={section.body}
        rows={visibleRows}
        spellCheck
        aria-describedby={hasCheckMarkers ? warningId : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-base leading-relaxed text-ink ${
          hasCheckMarkers ? "border-2 border-caution-line" : "border-slate"
        }`}
      />
      {hasCheckMarkers && (
        <p id={warningId} className="flex items-center gap-1.5 text-sm font-semibold text-caution">
          <AlertIcon size={16} />
          {checkMarkerCount === 1
            ? "1 item to check in this section."
            : `${checkMarkerCount} items to check in this section.`}
        </p>
      )}
    </div>
  );
}

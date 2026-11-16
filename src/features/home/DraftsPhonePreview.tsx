import { EazeNoteLogo } from "@/components/brand/EazeNoteLogo";

/** The three drafts shown inside the phone, each with its card colour. */
const PREVIEW_DRAFTS = [
  { name: "Clinical note", colorClass: "bg-forest" },
  { name: "Referral letter", colorClass: "bg-amber" },
  { name: "Prescription", colorClass: "bg-green" },
];

/**
 * A small picture of a phone showing drafts arriving after a consult, like the
 * phone in the ad. It is an illustration, not a control: hidden from screen
 * readers, and left out on phones, where it would only push the button down.
 */
export function DraftsPhonePreview() {
  return (
    <div
      aria-hidden="true"
      className="hidden w-60 rotate-3 rounded-[2.25rem] border-[7px] border-forest bg-cream shadow-2xl shadow-forest/25 md:block"
    >
      <div className="flex items-center rounded-t-[1.75rem] border-b border-line bg-white px-4 py-3">
        <EazeNoteLogo badgeSize={22} />
      </div>

      <div className="flex flex-col gap-2.5 p-3 pb-5">
        <p className="self-end rounded-2xl rounded-br-sm bg-mint px-3 py-2 text-xs font-medium text-forest">
          Consult recorded
        </p>

        <div className="flex flex-col gap-2 rounded-2xl rounded-bl-sm bg-white p-3 shadow-sm">
          <p className="text-xs font-bold text-forest">Your drafts are ready to check</p>
          {PREVIEW_DRAFTS.map((draft) => (
            <div key={draft.name} className="flex items-center gap-2.5 rounded-lg bg-cream px-2.5 py-2">
              <span className={`size-6 shrink-0 rounded-md ${draft.colorClass}`} />
              <span className="flex flex-col leading-tight">
                <span className="text-xs font-bold text-forest">{draft.name}</span>
                <span className="text-[10px] text-slate">Draft</span>
              </span>
            </div>
          ))}
        </div>

        <p className="self-end rounded-full bg-forest px-3 py-1.5 text-xs font-bold text-cream">
          Approved
        </p>
      </div>
    </div>
  );
}

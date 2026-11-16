import type { ReactNode } from "react";
import { NoteIcon, PillIcon, ReferralIcon } from "@/components/ui/icons";

interface DocumentCard {
  title: string;
  description: string;
  icon: ReactNode;
  /** Colour of the icon panel. */
  panelClass: string;
  /** Slight tilt on wider screens, so the three cards fan out as in the ad. */
  tiltClass: string;
}

const DOCUMENT_CARDS: DocumentCard[] = [
  {
    title: "Clinical note",
    description: "A SOAP note to copy into your practice system.",
    icon: <NoteIcon size={44} />,
    panelClass: "bg-forest text-white",
    tiltClass: "sm:translate-y-2 sm:-rotate-2",
  },
  {
    title: "Referral letter",
    description: "On your letterhead, ready to print or send.",
    icon: <ReferralIcon size={44} />,
    panelClass: "bg-amber text-forest",
    tiltClass: "sm:-translate-y-1",
  },
  {
    title: "Prescription",
    description: "Printed for you to sign by hand.",
    icon: <PillIcon size={44} />,
    panelClass: "bg-green text-white",
    tiltClass: "sm:translate-y-2 sm:rotate-2",
  },
];

/**
 * The orange block: the three documents one recording can produce.
 * On a phone each card lies flat (icon left, text right) to stay short;
 * on wider screens the cards stand upright and fan out.
 */
export function DocumentCards() {
  return (
    <section
      aria-labelledby="document-cards-heading"
      className="rounded-3xl bg-ember px-6 py-10 sm:px-12 sm:py-14"
    >
      <h2
        id="document-cards-heading"
        className="text-center text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-[2.75rem]"
      >
        Everything from <span className="text-sun">one recording.</span>
      </h2>

      <ul className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-3 sm:gap-6">
        {DOCUMENT_CARDS.map((card) => (
          <li
            key={card.title}
            className={`flex overflow-hidden rounded-2xl bg-cream shadow-xl shadow-black/15 sm:flex-col ${card.tiltClass}`}
          >
            <div
              aria-hidden="true"
              className={`flex w-24 shrink-0 items-center justify-center sm:h-32 sm:w-auto ${card.panelClass}`}
            >
              {card.icon}
            </div>
            <div className="flex flex-col gap-1 p-4 sm:p-5">
              <h3 className="text-lg font-extrabold text-forest">{card.title}</h3>
              <p className="text-sm text-slate">{card.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

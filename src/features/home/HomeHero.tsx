import { ButtonLink } from "@/components/ui/Button";
import { MicrophoneIcon } from "@/components/ui/icons";
import { DraftsPhonePreview } from "./DraftsPhonePreview";

interface HomeHeroProps {
  /** The doctor's name from the practice details, or null before setup. */
  doctorName: string | null;
}

/**
 * The top of the home screen: one question, one button.
 * Everything else on the screen is secondary to "Start a consult".
 */
export function HomeHero({ doctorName }: HomeHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-cream px-6 py-10 sm:px-12 sm:py-14">
      {/* The soft ring from the opening of the ad. Decoration only. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 -right-28 size-96 rounded-full border-[32px] border-ring"
      />

      <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col items-start gap-5">
          <p className="text-base font-semibold text-green">
            {doctorName ? `Welcome back, ${doctorName}` : "Welcome to EazeNote"}
          </p>

          <h1 className="animate-reveal text-[2.5rem] leading-[1.05] font-extrabold tracking-tight text-forest sm:text-6xl">
            Ready for your <span className="text-ember sm:whitespace-nowrap">next consult?</span>
          </h1>

          <p className="max-w-md text-lg text-slate">
            Record it, check the draft, approve it. Less admin, more time for care.
          </p>

          <ButtonLink href="/consults/new" emphasis="hero">
            <MicrophoneIcon size={22} />
            Start a consult
          </ButtonLink>

          <p className="text-sm font-bold text-green">
            Clinical notes · Referral letters · Prescriptions
          </p>
        </div>

        <DraftsPhonePreview />
      </div>
    </section>
  );
}

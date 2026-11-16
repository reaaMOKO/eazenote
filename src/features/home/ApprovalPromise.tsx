/**
 * The yellow block: the three steps, with the last one boxed the way the ad
 * boxes its key phrase. "Approve" is the step that makes EazeNote safe, so it
 * is the one that gets the emphasis.
 */
export function ApprovalPromise() {
  return (
    <section
      aria-labelledby="approval-promise-heading"
      className="rounded-3xl bg-amber px-6 py-12 text-center sm:py-16"
    >
      <h2
        id="approval-promise-heading"
        className="text-4xl leading-[1.15] font-extrabold tracking-tight text-forest sm:text-6xl"
      >
        Record. Check.
        <br />
        <span className="inline-block rounded-xl bg-forest px-4 pb-1 text-cream">Approve.</span>
      </h2>
      <p className="mx-auto mt-5 max-w-md text-base font-semibold text-forest sm:text-lg">
        Nothing is printed or sent until you approve it.
      </p>
    </section>
  );
}

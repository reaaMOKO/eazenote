import type { ReactNode } from "react";

interface PageHeadingProps {
  title: string;
  /** One or two plain sentences saying what this screen is for. */
  children?: ReactNode;
}

/** The single main heading of a screen. */
export function PageHeading({ title, children }: PageHeadingProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-tight text-deep sm:text-[2rem]">
        {title}
      </h1>
      {children && <p className="max-w-prose text-base text-slate">{children}</p>}
    </div>
  );
}

import { IS_DEMO_MODE } from "@/config/app-config";

/**
 * A thin strip under the header while the app runs on sample data, so nobody
 * mistakes a sample transcript or draft for a real one. It disappears
 * automatically when IS_DEMO_MODE is switched off.
 */
export function DemoModeBar() {
  if (!IS_DEMO_MODE) return null;

  return (
    <div className="bg-deep print:hidden">
      <p className="mx-auto w-full max-w-3xl px-4 py-2 text-sm text-white sm:px-6">
        <strong className="font-bold">Demo mode.</strong> Sample data only. Nothing is uploaded or
        emailed, and consults clear when you close this tab. Do not enter real patient details.
      </p>
    </div>
  );
}

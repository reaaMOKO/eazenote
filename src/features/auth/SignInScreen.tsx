"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { EazeNoteLogo } from "@/components/brand/EazeNoteLogo";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { TextField } from "@/components/ui/TextField";
import { IS_DEMO_MODE } from "@/config/app-config";
import { isPracticeProfileComplete } from "@/features/practice/practice-rules";
import { readPracticeProfile } from "@/features/practice/practice-store";
import { looksLikeEmailAddress } from "@/lib/format";
import { startDemoSession, useDemoSession } from "./session-store";

/**
 * Sign-in by email link: no password to remember or to leak.
 *
 * PHASE 1: no email is sent. The second step explains that and lets the
 * tester continue. PHASE 2 replaces handleContinueInDemoMode with a real
 * Supabase magic link.
 */
export function SignInScreen() {
  const router = useRouter();
  const session = useDemoSession();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>();
  const [hasRequestedLink, setHasRequestedLink] = useState(false);
  const [storageError, setStorageError] = useState(false);

  // As soon as there is a session (just created, or from an earlier visit),
  // leave this screen. First-time doctors set up their letterhead first.
  useEffect(() => {
    if (!session) return;
    const nextScreen = isPracticeProfileComplete(readPracticeProfile()) ? "/consults" : "/practice";
    router.replace(nextScreen);
  }, [session, router]);

  function handleRequestLink(event: FormEvent) {
    event.preventDefault();
    if (!looksLikeEmailAddress(email)) {
      setEmailError("Enter your email address, like name@practice.co.za.");
      return;
    }
    setEmailError(undefined);
    setHasRequestedLink(true);
  }

  function handleContinueInDemoMode() {
    // Starting the session triggers the redirect in the effect above.
    const wasSaved = startDemoSession(email);
    setStorageError(!wasSaved);
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-4 py-10 sm:px-6">
      <EazeNoteLogo badgeSize={44} />

      <div className="flex flex-col gap-2">
        <h1 className="text-[2rem] leading-tight font-extrabold tracking-tight text-deep">
          Sign in to EazeNote
        </h1>
        <p className="text-base text-slate">
          Record the consult, check the draft, approve it. Notes, referral letters and
          prescriptions on your own letterhead.
        </p>
      </div>

      {!hasRequestedLink ? (
        <form onSubmit={handleRequestLink} noValidate className="flex flex-col gap-4">
          <TextField
            label="Email address"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            error={emailError}
            hint="We email you a sign-in link. There is no password."
          />
          <Button type="submit">Email me a sign-in link</Button>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          {IS_DEMO_MODE ? (
            <Notice tone="info" title="Demo mode: no email was sent" announce="status">
              In the live app, a sign-in link goes to <strong>{email}</strong>. For now, continue
              without it.
            </Notice>
          ) : (
            <Notice tone="success" title="Check your email" announce="status">
              We sent a sign-in link to <strong>{email}</strong>.
            </Notice>
          )}

          {storageError && (
            <Notice tone="danger" title="This browser is blocking storage" announce="alert">
              EazeNote could not remember your sign-in. Leave private browsing, or allow site data
              for this page, then try again.
            </Notice>
          )}

          {IS_DEMO_MODE && <Button onClick={handleContinueInDemoMode}>Continue to EazeNote</Button>}
          <Button variant="quiet" onClick={() => setHasRequestedLink(false)}>
            Use a different email address
          </Button>
        </div>
      )}
    </main>
  );
}

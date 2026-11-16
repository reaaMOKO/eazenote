"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { EazeNoteLogo } from "@/components/brand/EazeNoteLogo";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/components/ui/Notice";
import { PasswordField } from "@/components/ui/PasswordField";
import { TextField } from "@/components/ui/TextField";
import { IS_DEMO_MODE } from "@/config/app-config";
import { isPracticeProfileComplete } from "@/features/practice/practice-rules";
import { readPracticeProfile } from "@/features/practice/practice-store";
import {
  findEmailProblem,
  findPasswordProblem,
  findSignInCodeProblem,
  MINIMUM_PASSWORD_LENGTH,
  SIGN_IN_CODE_LENGTH,
} from "./auth-rules";
import { startDemoSession, useDemoSession } from "./session-store";

/**
 * The four views of this screen:
 *   password:       email + password (the default, what most people expect)
 *   create-account: first-time doctors choose a password
 *   code-request:   ask for a sign-in code by email instead of a password
 *   code-entry:     type the code from that email
 */
type SignInMode = "password" | "create-account" | "code-request" | "code-entry";

const HEADINGS: Record<SignInMode, string> = {
  password: "Sign in to EazeNote",
  "create-account": "Create your EazeNote account",
  "code-request": "Sign in with an email code",
  "code-entry": "Enter your sign-in code",
};

interface FieldErrors {
  email?: string;
  password?: string;
  code?: string;
}

/**
 * PHASE 1: nothing is checked. Any valid email signs in, and the password
 * and code are thrown away the moment the form is submitted; they are never
 * saved or sent anywhere. PHASE 2 hands them to Supabase Auth, which checks
 * them on the server (signInWithPassword, signUp, signInWithOtp, verifyOtp).
 */
export function SignInScreen() {
  const router = useRouter();
  const session = useDemoSession();

  const [mode, setMode] = useState<SignInMode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [storageError, setStorageError] = useState(false);

  // As soon as there is a session (just created, or from an earlier visit),
  // leave this screen. First-time doctors set up their practice details once.
  useEffect(() => {
    if (!session) return;
    const nextScreen = isPracticeProfileComplete(readPracticeProfile()) ? "/consults" : "/practice";
    router.replace(nextScreen);
  }, [session, router]);

  function switchMode(nextMode: SignInMode) {
    setMode(nextMode);
    setFieldErrors({});
    setPassword("");
    setCode("");
  }

  /** Starts the session. The redirect happens in the effect above. */
  function signIn() {
    const wasSaved = startDemoSession(email);
    setStorageError(!wasSaved);
    // Do not keep the password or code in memory once they have been used.
    setPassword("");
    setCode("");
    // Next.js keeps this screen alive in the background. Clear it, so the next
    // person to sign in on this device does not see this doctor's email.
    if (wasSaved) {
      setEmail("");
      setMode("password");
    }
  }

  function handlePasswordSubmit(event: FormEvent) {
    event.preventDefault();
    const foundErrors: FieldErrors = {
      email: findEmailProblem(email) ?? undefined,
      password:
        findPasswordProblem(password, mode === "create-account" ? "create-account" : "sign-in") ??
        undefined,
    };
    setFieldErrors(foundErrors);
    if (foundErrors.email || foundErrors.password) return;
    signIn();
  }

  function handleCodeRequest(event: FormEvent) {
    event.preventDefault();
    const emailProblem = findEmailProblem(email) ?? undefined;
    setFieldErrors({ email: emailProblem });
    if (emailProblem) return;
    switchMode("code-entry");
  }

  function handleCodeSubmit(event: FormEvent) {
    event.preventDefault();
    const codeProblem = findSignInCodeProblem(code) ?? undefined;
    setFieldErrors({ code: codeProblem });
    if (codeProblem) return;
    signIn();
  }

  const emailField = (
    <TextField
      label="Email address"
      type="email"
      inputMode="email"
      autoComplete="email"
      value={email}
      onChange={setEmail}
      error={fieldErrors.email}
    />
  );

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-7 px-4 py-10 sm:px-6">
      <EazeNoteLogo badgeSize={44} />

      <h1 className="text-[2rem] leading-tight font-extrabold tracking-tight text-deep">
        {HEADINGS[mode]}
      </h1>

      {storageError && (
        <Notice tone="danger" title="This browser is blocking storage" announce="alert">
          EazeNote could not remember your sign-in. Leave private browsing, or allow site data for
          this page, then try again.
        </Notice>
      )}

      {/* ---- Email and password: sign in, or create an account ---- */}
      {(mode === "password" || mode === "create-account") && (
        <form onSubmit={handlePasswordSubmit} noValidate className="flex flex-col gap-4">
          {emailField}
          <PasswordField
            label="Password"
            autoComplete={mode === "create-account" ? "new-password" : "current-password"}
            value={password}
            onChange={setPassword}
            error={fieldErrors.password}
            hint={
              mode === "create-account"
                ? `At least ${MINIMUM_PASSWORD_LENGTH} characters.`
                : undefined
            }
          />
          {mode === "password" && (
            <Button variant="quiet" onClick={() => switchMode("code-request")} className="-mt-2 self-start">
              Forgot your password?
            </Button>
          )}

          {IS_DEMO_MODE && (
            <Notice tone="info" title="Demo mode">
              Any email and password will sign you in. Nothing is checked or stored.
            </Notice>
          )}

          <Button type="submit">{mode === "create-account" ? "Create account" : "Sign in"}</Button>
        </form>
      )}

      {/* ---- Sign in with a code: step 1, ask for the code ---- */}
      {mode === "code-request" && (
        <form onSubmit={handleCodeRequest} noValidate className="flex flex-col gap-4">
          <p className="text-base text-slate">
            We email you a {SIGN_IN_CODE_LENGTH}-digit code. Use it if you forgot your password, or
            if you prefer not to type one.
          </p>
          {emailField}
          <Button type="submit">Email me a code</Button>
        </form>
      )}

      {/* ---- Sign in with a code: step 2, type the code ---- */}
      {mode === "code-entry" && (
        <form onSubmit={handleCodeSubmit} noValidate className="flex flex-col gap-4">
          {IS_DEMO_MODE ? (
            <Notice tone="info" title="Demo mode: no email was sent" announce="status">
              In the live app, a code goes to <strong>{email}</strong>. For now, enter any{" "}
              {SIGN_IN_CODE_LENGTH} digits.
            </Notice>
          ) : (
            <Notice tone="success" title="Check your email" announce="status">
              We sent a code to <strong>{email}</strong>. It can take a minute to arrive.
            </Notice>
          )}
          <TextField
            label={`${SIGN_IN_CODE_LENGTH}-digit code`}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={setCode}
            error={fieldErrors.code}
          />
          <Button type="submit">Sign in</Button>
          <Button variant="quiet" onClick={() => switchMode("code-request")} className="self-start">
            Use a different email address
          </Button>
        </form>
      )}

      {/* ---- Ways to switch between the views ---- */}
      <div className="flex flex-col gap-3 border-t border-line pt-5">
        {mode === "password" && (
          <>
            <Button variant="secondary" onClick={() => switchMode("code-request")}>
              Email me a sign-in code instead
            </Button>
            <p className="text-base text-slate">
              New to EazeNote?{" "}
              <button
                type="button"
                onClick={() => switchMode("create-account")}
                className="min-h-11 font-semibold text-deep underline underline-offset-4 hover:text-green"
              >
                Create an account
              </button>
            </p>
          </>
        )}
        {mode !== "password" && (
          <Button variant="quiet" onClick={() => switchMode("password")} className="self-start">
            {mode === "create-account"
              ? "I already have an account"
              : "Sign in with a password instead"}
          </Button>
        )}
      </div>
    </main>
  );
}

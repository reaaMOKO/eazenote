/**
 * Server-side secrets: the ONLY place in the app that reads API keys.
 *
 * Why this file exists
 *   API keys must never reach the browser. The "server-only" import below makes
 *   the build fail if any browser-side file imports this module, so a mistake
 *   is caught before it can be deployed.
 *
 * Phase 1 does not call any outside service, so nothing imports this yet.
 * Phase 3 server functions will call getServerSecret("ANTHROPIC_API_KEY") etc.
 */
import "server-only";

/** Every secret the server is allowed to read. Names match .env.example. */
export type ServerSecretName =
  | "SUPABASE_SERVICE_ROLE_KEY"
  | "VULAVULA_API_KEY"
  | "ELEVENLABS_API_KEY"
  | "ANTHROPIC_API_KEY"
  | "RESEND_API_KEY";

/**
 * Returns the secret's value, or throws a clear setup error.
 * The error names the missing variable but never prints a value.
 */
export function getServerSecret(secretName: ServerSecretName): string {
  const secretValue = process.env[secretName];

  if (!secretValue) {
    throw new Error(
      `Missing server secret "${secretName}". Add it to .env.local on your computer ` +
        `or to Vercel → Settings → Environment Variables. Never commit it to GitHub.`,
    );
  }

  return secretValue;
}

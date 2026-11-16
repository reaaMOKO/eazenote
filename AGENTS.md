<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## EazeNote project rules (for people and AI assistants)

Read `README.md` first. These rules are not optional:

- **Secrets:** API keys are read only in `src/server/env.ts`. Never hard-code a key, never log one, never give a secret a `NEXT_PUBLIC_` name. Run `npm run check:secrets` before every commit.
- **Outside services:** screens call `src/services/index.ts` only. The browser never talks to Vulavula, ElevenLabs, Claude or Resend directly; the server does.
- **Safety rules live in code and tests:** the consent lock (`src/features/consult/consult-rules.ts`) and the draft / [CHECK] / approval rules (`src/features/documents/document-rules.ts`). Do not weaken them, and add a test for any change.
- **No real patient data** in code, tests, sample data, logs or screenshots.
- **Names say what things do** (`isConsentConfirmed`, `findApprovalBlocker`). Comments explain why, not what.
- Run `npm run check` before opening a pull request.

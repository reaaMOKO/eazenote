# EazeNote

EazeNote is the EazeHealth tool a doctor uses during a consultation. The doctor records the consult with the patient's consent, and gets a draft **clinical note**, **referral letter** or **prescription draft** on their own letterhead. They check it, approve it, and copy, print or email it.

## Where the build is

| Phase | What it adds | Status |
|---|---|---|
| 0. Foundations | Project setup, brand styles, secret-handling rules | Done |
| 1. Screens | Every screen, running on sample data | Done |
| 2. Login and database | Supabase sign-in, practice details, per-doctor data rules | Next |
| 3. Server and API keys | Real speech-to-text and AI drafting | |
| 4. Documents out | PDFs, real email, approval records | |
| 5. Safety and hardening | Auto-delete, rate limits, more tests, accessibility pass | |
| 6. Deploy and dry run | Live at app.eazehealth.co.za | |

**The app is in demo mode.** Every consult shows the same fictional sample transcript and drafts. Nothing is uploaded or emailed, and no API keys are needed. Do not enter real patient details.

## Run it on your computer

You need [Node.js](https://nodejs.org) version 22 or newer.

```bash
npm install     # once, to download the packages
npm run dev     # starts the app at http://localhost:3000
```

Other commands:

| Command | What it does |
|---|---|
| `npm run check` | Runs everything below, then a production build. Run before every pull request. |
| `npm run check:secrets` | Fails if an API key or `.env` file is about to be committed. |
| `npm run lint` | Code style. |
| `npm run typecheck` | Catches type mistakes. |
| `npm run test` | Tests for the safety rules. |

The same checks run on GitHub for every push (`.github/workflows/checks.yml`).

## API keys and secrets

No keys are needed until Phase 2. When they are:

1. Copy `.env.example` to `.env.local` and put the real values there. `.env.local` is git-ignored and never leaves your computer.
2. On Vercel, add the same names under **Settings → Environment Variables**.
3. Set a spending limit on each provider account before creating its key.

Rules the code enforces:

- Keys are read in one file only, `src/server/env.ts`. It is marked server-only, so the build fails if browser code imports it.
- The browser only talks to EazeNote's own server. The server talks to the speech, AI and email providers.
- A secret must never have a name starting with `NEXT_PUBLIC_`; that prefix publishes the value to every visitor's browser.
- Never paste a key into code, a chat or an email. If one is ever committed, delete it in the provider's dashboard and create a new one.

## Safety rules built into the code

| Rule | Where it lives |
|---|---|
| Recording is locked until the doctor confirms patient consent | `src/features/consult/consult-rules.ts` |
| Every document is "DRAFT, NOT APPROVED" until a doctor approves it | `src/features/documents/document-rules.ts` |
| Unclear or unsaid details are marked `[CHECK]`, never guessed; a document cannot be approved while one remains | same file |
| Nothing can be copied, printed or emailed before approval | same file |
| Editing an approved document removes the approval | same file |
| Every approval records who approved and when | same file |
| Prescription drafts are printed and signed by hand, never sent by email or phone | same file |

Each rule has tests next to it (`*.test.ts`).

## How the code is organised

```
src/
  app/            Page addresses (routes). Each page file is a few lines that show one screen.
  features/       One folder per part of the product:
    auth/           sign-in
    practice/       practice details and letterhead
    consult/        new consult, recording, transcript
    documents/      drafting, editing, approval, delivery
  services/       The outside services, each behind one small file:
    transcription/  speech-to-text   (sample data now; Vulavula or ElevenLabs in Phase 3)
    drafting/       AI drafting      (sample data now; Claude in Phase 3)
    delivery/       email and phone  (sends nothing now; real sending in Phase 4)
    index.ts        chooses which implementation the app uses
  components/     Shared building blocks: buttons, text boxes, notices, logo, header
  config/         Settings that are safe to be public (demo mode, limits)
  lib/            Small helpers (dates, browser storage)
  server/         Server-only code. API keys are read here and nowhere else.
scripts/          The secret scan
```

Naming: files ending in `-rules.ts` hold decisions with no screen code; `-store.ts` files hold where data is kept; `-types.ts` files describe the shape of the data; files starting with a capital letter are screens or parts of screens.

## What changes after Phase 1

- `src/lib/browser-store.ts` and the `*-store.ts` files keep demo data in the browser. Phase 2 replaces them with the database.
- The sign-in check in `src/components/layout/SignedInShell.tsx` runs in the browser only. Phase 2 moves it to the server.
- "Print or save as PDF" uses the browser's print window. Phase 4 generates PDFs on the server.

## Before real patient data

Role-play only until these are done (see the EazeNote MVP plan): the patient consent form, the legal check on prescriptions, POPIA steps including operator agreements, and hosting patient data in a South African region where possible.

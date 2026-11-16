#!/usr/bin/env node
/**
 * Secret scan: fails if anything that looks like a real API key, a private key,
 * or a committed .env file is about to go to GitHub.
 *
 * Run it with:  npm run check:secrets
 * It also runs automatically on GitHub for every push (.github/workflows/checks.yml).
 *
 * It checks every file git would upload: tracked files plus new files that are
 * not git-ignored.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename } from "node:path";

/** What a leaked secret looks like, and how to explain it to a non-developer. */
const SECRET_PATTERNS = [
  { label: "Claude (Anthropic) API key", pattern: /sk-ant-[A-Za-z0-9_-]{20,}/ },
  { label: "ElevenLabs API key", pattern: /\bsk_[a-f0-9]{40,}\b/ },
  { label: "Resend API key", pattern: /\bre_[A-Za-z0-9]{8,}_[A-Za-z0-9]{16,}\b/ },
  { label: "Supabase secret key", pattern: /\bsb_secret_[A-Za-z0-9_-]{20,}/ },
  {
    label: "Signed token (for example a Supabase service-role key)",
    pattern: /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/,
  },
  { label: "Private key file contents", pattern: /-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/ },
  {
    label: "A secret named with the browser-visible NEXT_PUBLIC_ prefix",
    pattern: /NEXT_PUBLIC_[A-Z0-9_]*(?:SECRET|SERVICE_ROLE|API_KEY|TOKEN|PASSWORD)/,
  },
];

/** Files that may legitimately contain pattern-like text. */
const FILES_TO_SKIP = new Set(["package-lock.json", "scripts/check-for-secrets.mjs"]);

/** Skip images, fonts and other files that are not text. */
const BINARY_FILE_EXTENSION = /\.(?:png|jpe?g|gif|webp|ico|woff2?|ttf|otf|pdf|zip)$/i;

function listFilesGitWouldUpload() {
  const gitOutput = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard"],
    { encoding: "utf8" },
  );
  return gitOutput.split("\n").filter(Boolean);
}

/** .env.example holds names only, so it is the one env file allowed in git. */
function isForbiddenEnvFile(filePath) {
  const fileName = basename(filePath);
  return fileName.startsWith(".env") && fileName !== ".env.example";
}

function findProblemsInFile(filePath) {
  if (isForbiddenEnvFile(filePath)) {
    return [`${filePath}: env files hold real secrets and must never be committed.`];
  }
  if (FILES_TO_SKIP.has(filePath) || BINARY_FILE_EXTENSION.test(filePath)) {
    return [];
  }

  let fileText;
  try {
    fileText = readFileSync(filePath, "utf8");
  } catch {
    return []; // File was deleted but not yet committed; nothing to scan.
  }

  const problems = [];
  fileText.split("\n").forEach((lineText, lineIndex) => {
    for (const { label, pattern } of SECRET_PATTERNS) {
      if (pattern.test(lineText)) {
        // Report where it is, never the value itself.
        problems.push(`${filePath}:${lineIndex + 1}: looks like: ${label}`);
      }
    }
  });
  return problems;
}

const problems = listFilesGitWouldUpload().flatMap(findProblemsInFile);

if (problems.length > 0) {
  console.error("Secret scan FAILED. Do not commit or push until these are fixed:\n");
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error(
    "\nMove the value into .env.local (your computer) or Vercel's environment variables." +
      "\nIf a real key was ever committed or pushed, treat it as leaked: delete it in the" +
      "\nprovider's dashboard and create a new one.",
  );
  process.exit(1);
}

console.log("Secret scan passed: no keys, private keys or env files found.");

/**
 * App-wide settings that are safe for the browser to see.
 * Nothing secret may ever go in this file.
 */

/**
 * Phase 1 runs entirely on sample data: no login service, no database,
 * no speech-to-text, no AI and no email. This flag drives the on-screen
 * "Demo mode" notices so nobody mistakes sample output for a real result.
 * It becomes false when the real services are connected (Phase 2 and 3).
 */
export const IS_DEMO_MODE = true;

/** How long a transcript is kept before automatic deletion (enforced from Phase 5). */
export const DEFAULT_TRANSCRIPT_RETENTION_DAYS = 7;

/** Largest logo or signature image the practice setup screen accepts. */
export const MAX_IMAGE_UPLOAD_BYTES = 300 * 1024;

/** Marker the AI must use for anything unclear or not said in the consult. */
export const CHECK_MARKER_LABEL = "[CHECK]";

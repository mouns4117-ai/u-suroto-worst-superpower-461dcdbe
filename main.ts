// Worst Superpower — one-line entry program.
// Writes the entry line to /output/entry.txt (gate: UTF-8, 1-140 chars, single line).
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";

const ENTRY =
  "I can summon rain indoors, but only in a one-metre circle directly above my own head.";

// Fail-fast gate validation: 1-140 chars, non-blank, single line, valid UTF-8.
if (ENTRY.length < 1 || ENTRY.length > 140) {
  throw new Error(`entry length ${ENTRY.length} outside gate 1-140`);
}
if (!ENTRY.trim()) throw new Error("entry is blank");
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (Buffer.from(ENTRY, "utf8").toString("utf8") !== ENTRY) {
  throw new Error("entry is not valid UTF-8");
}

const OUT_DIR = "/output";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
// Empty /output by contents only; never remove the mounted directory itself.
for (const name of readdirSync(OUT_DIR)) {
  rmSync(`${OUT_DIR}/${name}`, { recursive: true, force: true });
}

writeFileSync(`${OUT_DIR}/entry.txt`, ENTRY, "utf8");

// Post-write read-back verification: bytes must match exactly.
const back = readFileSync(`${OUT_DIR}/entry.txt`, "utf8");
if (back !== ENTRY) throw new Error("read-back mismatch: entry.txt differs from ENTRY");
const sha256 = createHash("sha256").update(back, "utf8").digest("hex");
console.log(`wrote /output/entry.txt (${ENTRY.length} chars) sha256=${sha256}`);

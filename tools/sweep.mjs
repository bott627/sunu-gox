#!/usr/bin/env node
/**
 * Consistency sweep. Run it before you publish; CI runs it on every pull request.
 *
 *     pnpm run sweep
 *
 * Five checks, each one here because it has caught a real mistake in this
 * material rather than because it was easy to write:
 *
 *   1. Every relative link resolves to a file that exists.
 *   2. Every "§N.M" reference names a section that exists in part NN.
 *   3. Heading count — a second "# " forces a page break when a part is printed.
 *   4. No instructor-only wording in a public repository.
 *   5. UK spelling. The list below is the rule; Sunu Gox also records it in
 *      authoring/STRUCTURE.md.
 *
 * Exit code 0 means clean. No dependencies: plain Node.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative, resolve, dirname, basename, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const SKIP_DIRS = new Set(["archive", ".git", "node_modules", "dist", ".astro"]);
const SKIP_FILES = new Set();

/** Documents whose top-level headings are deliberate dividers, not page titles. */
const MULTI_H1_OK = new Set(["parts.md"]);
/** Fragments rather than documents: a pull request template has no title. */
const FRAGMENT_DIRS = [".github"];
/** Documents that discuss the public/private boundary instead of crossing it. */
const LEAK_EXEMPT = ["CONTRIBUTING.md", ".github"];

/**
 * How many "# " headings a document should have. `null` means "at most one".
 *
 * Sunu Gox opens each part with its own title, so exactly one. Quarter Stack
 * Open takes the title from the site instead, so its pages have none — and a
 * second "# " in either would force a page break when a part is printed.
 */
const H1_RULE = existsSync(join(ROOT, "content", "layer-1")) ? 1 : null;

/** Wording that only ever appears in a solution or an answer key. */
const LEAKS = ["planted defect", "mark scheme", "marking scheme", "model answer",
               "do not publish", "not for students"];

/** A pattern that must not appear, and what to write instead. */
const UK = [
  [/neighborhood/, "neighbourhood"],
  [/\bartifacts?\b/, "artefact"],
  [/organiz(e|ed|es|ing|ation)/, "organise"],
  [/analyz/, "analys"],
  [/recogniz/, "recognis"],
  [/initializ/, "initialis"],
  [/behavior/, "behaviour"],
  [/defense/, "defence"],
  [/\bjudgments?\b/, "judgement"],
  [/\bfulfill(s|ed|ing)?\b/, "fulfil"],
  [/\bcatalog(s|ed|ing)?\b/, "catalogue"],
  [/\blabeled\b/, "labelled"],
  [/\bmodeling\b/, "modelling"],
];

function markdownFiles(dir = ROOT, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) markdownFiles(join(dir, entry.name), found);
    } else if (entry.name.endsWith(".md") && !SKIP_FILES.has(entry.name)) {
      found.push(join(dir, entry.name));
    }
  }
  return found;
}

/** {"07": Set("7.1", "7.2", …)} from the numbered parts. */
function sectionsByPart(files) {
  const map = new Map();
  for (const file of files) {
    const rel = relative(ROOT, file);
    const num = basename(rel).match(/^(\d\d)-/);
    if (!num || !rel.includes("layer")) continue;
    const text = readFileSync(file, "utf8");
    const secs = new Set([...text.matchAll(/^#{2,3} (\d+\.\d+)/gm)].map((m) => m[1]));
    map.set(num[1], secs);
  }
  return map;
}

function countTopHeadings(text) {
  let inFence = false, count = 0;
  for (const line of text.split("\n")) {
    if (line.startsWith("```")) inFence = !inFence;
    else if (!inFence && line.startsWith("# ")) count++;
  }
  return count;
}

const files = markdownFiles();
const sections = sectionsByPart(files);
const problems = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  const text = readFileSync(file, "utf8");
  const lower = text.toLowerCase();
  const inFragmentDir = FRAGMENT_DIRS.some((d) => rel.startsWith(d + sep) || rel.startsWith(d + "/"));
  const leakExempt = LEAK_EXEMPT.some((d) => rel === d || rel.startsWith(d + sep) || rel.startsWith(d + "/"));

  for (const [, link] of text.matchAll(/\]\((?!https?:|mailto:)([^)#]+)[^)]*\)/g)) {
    const target = resolve(dirname(file), link);
    if (!existsSync(target) && !target.endsWith(".html")) {
      problems.push(`${rel}: link goes nowhere -> ${link}`);
    }
  }

  for (const [, num, sec] of text.matchAll(/§(\d+)\.(\d+)/g)) {
    const key = num.padStart(2, "0");
    if (sections.has(key) && !sections.get(key).has(`${num}.${sec}`)) {
      problems.push(`${rel}: §${num}.${sec} does not exist in part ${key}`);
    }
  }

  const h1 = countTopHeadings(text);
  if (!inFragmentDir && !MULTI_H1_OK.has(basename(rel))) {
    if (H1_RULE === 1 && h1 !== 1) {
      problems.push(`${rel}: ${h1} top-level headings, expected exactly 1`);
    } else if (H1_RULE === null && h1 > 1) {
      problems.push(`${rel}: ${h1} top-level headings — page titles come from the site, not the document`);
    }
  }

  if (!leakExempt) {
    for (const phrase of LEAKS) {
      if (lower.includes(phrase)) {
        problems.push(`${rel}: contains "${phrase}" — that belongs in the instructor repository`);
      }
    }
  }

  for (const [pattern, right] of UK) {
    const hit = lower.match(pattern);
    if (hit) problems.push(`${rel}: "${hit[0]}" — this material uses UK spelling ("${right}")`);
  }
}

if (problems.length) {
  console.error(`${problems.length} problem(s):\n`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}
console.log("Sweep clean: links, section references, headings, no leaks, UK spelling.");

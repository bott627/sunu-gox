A Kamariana - BotT627

# Sunu Gox — structure and naming

**Authoring reference.** Students never read this file.

[DOMAIN-CHARTER.md](DOMAIN-CHARTER.md) fixes *what the product is*.
[LAYERS.md](LAYERS.md) fixes *the order layers come in*.
This file fixes *what things are called and how they nest*.

---

## On disk

```
.
├── README.md ..................... start here
│
├── content/ ...................... everything a student ever sees
│   ├── 00-why-this-lab-exists.md   shared preface — reused by every layer
│   ├── layer-2/
│   │   └── README.md ........... not written yet — what Layer 1 says must land here
│   ├── layer-3/
│   │   └── README.md ........... not written yet — same, for Layer 3
│   └── layer-1/
│       ├── 01-introduction.md
│       ├── 02-setup-and-installation.md
│       ├── 03-designing-the-database.md
│       ├── 04-seeding-agencies.md
│       ├── 05-building-the-api.md
│       ├── 06-testing-your-api.md
│       ├── 07-auditing-ai-code.md
│       ├── 08-post-lab-challenges.md
│       ├── 09-exercise.md
│
├── package.json .................. `pnpm run sweep`
├── tools/
│   └── sweep.mjs ................. links, section refs, headings, spelling
│
└── authoring/ .................... never seen by students, but contributors read it
    ├── DOMAIN-CHARTER.md ......... what the product is
    ├── LAYERS.md ................. what order layers come in
    ├── STRUCTURE.md .............. what things are called   (this file)
    └── teaching/
        ├── PIVOT-PLAN.md ......... what is being changed and why
        ├── TEACHING-LOG.md ....... what happened in the room
        ├── DEFENCE-SHEET.md ...... printable, for the defence
        └── examiner-experiment.md  protocol for the examiner idea
```

**Five rules this layout enforces:**

1. **This repository is public, so everything in it is shippable.** Anything a student must not see is not here at all — it is in the private companion repository, described below. A folder boundary stops you emailing a solution by accident; a repository boundary stops you publishing one.
2. **An assessment is not a part.** It gets its own folder in the instructor repository, named after itself, because it is sat once rather than worked through — and because a paper handed out on the day has no business sitting in a public directory listing next to week two.
3. **Student-facing and author-facing material both live here.** `content/` is what a student reads; `authoring/` is the rules for writing it. A contributor needs both, which is why neither is private.

### The companion repository — `bott627/sunu-gox-instructor`, private

```
.
├── layer-1/
│   ├── guide.md .................. solutions, timings, what will go wrong
│   └── midterm/
│       ├── README.md ............. how to run it, and the message for students
│       ├── midterm.md ............ the paper, handed out on the day
│       ├── marking-scheme.md ..... what the paper hides, and the measured answers
│       └── defence-sheet.md ...... printable, question bank
├── teaching/
│   ├── PIVOT-PLAN.md ............. what is being changed and why
│   ├── TEACHING-LOG.md ........... what happened in the room. Names real students
│   ├── DEFENCE-SHEET.md .......... printable, for the lab defences
│   └── examiner-experiment.md .... protocol for the examiner idea
└── archive/ ...................... where this material came from
```

**Two rules for the pairing:**

- **It mirrors the public layout, one level shallower.** `layer-1/guide.md` here answers `content/layer-1/` there. A contributor who never sees this repository can still work, and an instructor who has both can hold them side by side.
- **Nothing moves from private to public without being read line by line.** The teaching log records real students; the midterm hides defects a future cohort is meant to find cold. `pnpm run sweep` refuses to let a few giveaway phrases cross the boundary, but it is a seatbelt, not a driver.
4. **`00` lives above the layers**, because it is the same preface for every lab taught. Layers start at `01`.
5. **A layer that does not exist yet still has a folder and a `README.md`** — holding only what an earlier layer decided must land there, and why. When a layer discovers something that belongs later, it goes in that layer's README the same day rather than into anybody's memory. The README is author-facing, but it carries no solutions, so `content/` stays shippable.

---

## The hierarchy

```
LAYER  ...................  1–7, each the whole product, less crude
│                           e.g. Layer 1 "It remembers and answers"
│
├── PART  ...............  01–09, one teaching session or less
│   │                      e.g. part 03 "Designing the database"
│   │
│   ├── header .........  Goal / You are done when
│   │
│   ├── SECTION  .......  numbered N.M, where N is the part number
│   │   │                 e.g. 3.2 "Build the schema in four pieces"
│   │   │
│   │   ├── PIECE  ....  numbered, build-along parts only
│   │   │                 e.g. "Piece 2 — Add the first agency"
│   │   │
│   │   └── CALLOUT  ..  info · tip · success · warning · danger · mta
│   │
│   └── closing blocks   Checklist → Commit your work → Next
│
└── end-of-layer validation ... students use each other's work
```

## What each level is for

| Level | Answers | Size |
| :--- | :--- | :--- |
| **Layer** | "What can the product do now that it could not before?" | A course, or most of one |
| **Part** | "What do I build in this sitting?" | One session, 60–90 min |
| **Section** | "What is the next distinct move?" | 5–20 min |
| **Piece** | "What do I type next, and why?" | One code block plus its reason |
| **Callout** | "What must not be missed here?" | 1–5 lines |

---

## Naming rules

### Layers — a capability, in plain words

Not a technology. **"It refuses bad data"**, never "The validation layer".

A layer is named for what a citizen could now do, so a student who stops here can say what they built without naming a framework.

### Parts — gerund plus object

**"Designing the database"**, "Seeding the agencies", "Building the API", "Testing your API", "Auditing AI code".

Front matter (`00`, `01`) and closing parts (`08`, `09`) may be nouns — "Introduction", "Exercise" — because they are not build sessions.

> **No `Step N` prefixes.** Parts are referred to by their number only: *part `03`*. A second numbering scheme was removed once already; do not reintroduce it.

### Sections — `N.M` plus a plain instruction

**"3.2 Write the script in four pieces"**. Imperative where the student acts; a question where they are deciding ("3.1 Why seed?").

### Pieces — only in build-along parts

Used where a student types a file into existence: `03`, `04`, `05`. Numbered from 1, each with a name — **"Piece 4 — Make it run"**.

The rule that makes them work: **one piece, one code block, one reason.** If a piece needs two explanations it is two pieces.

### Showing progress between pieces

When a piece adds code to a file that already exists, show **where** it goes, not just what it is:

```javascript
// index.js

// ... Piece 1 — imports and setup (already in your file) ...
// ... Piece 2 — GET /api/agencies (already in your file) ...

// ▼ NEW — Piece 3 ▼
app.post('/api/reports', async (request, response) => {
  // ...
});
// ▲ end of Piece 3 ▲

// ... app.listen(...) — already in your file, stays last ...
```

- Earlier pieces collapse to one `// ...` comment each, naming what they contain.
- New code sits between `▼ NEW` and `▲ end` markers. Students type only what is between them.
- The code **after** the new block is shown too, collapsed, so placement is never a guess.
- Markers are ordinary comments: they survive copy-paste, PDF export and the Obsidian renderer. When the material moves to Astro, they map directly onto line highlighting.

### Explaining a piece

Below every piece, a **line-by-line table** — `| Line | What it does |` — for the lines that introduce something new. Lines already explained in an earlier piece are not explained again.

### Test requests live in `requests/`

Every request a student uses to test or prove something is written in a `.http` file in `requests/` at the project root, and committed. Part `06` introduces it with `requests/api.http`; later parts add their own file rather than appending to that one.

Use `###` between requests, a `#` comment line naming each one, and variables at the top of the file (`@baseUrl`, and ids) rather than pasted values.

### Express handlers use `request` and `response` in full

Never `req` and `res` in these labs. Most code online, and most AI output, abbreviates them — part `05` says so once, so students recognise the short forms when they meet them.

### Callouts — six types, fixed meanings

| Type | Use for |
| :--- | :--- |
| `info` | Background. Why it works this way. Skippable |
| `tip` | A shortcut or a second way to do it |
| `success` | A checkpoint. "If you see this, you are on track" |
| `warning` | A common mistake, placed *before* they hit it |
| `danger` | Will break the project or expose a password |
| `mta` | **Major Take Away** — the transferable idea |

Do not invent a seventh. The vocabulary is only useful while it is small enough to learn once.

---

### Heading levels — exactly one `#` per part

The part title is the only `#`. Sections are `##`. Anything inside a section is `###`.

This is not cosmetic: the print stylesheet starts a new page at every `#`, so a part with fourteen `#` headings becomes fourteen forced page breaks in the exported PDF. Part `02` was like this until it was found by counting.

### Closing blocks are not numbered

**Try this**, **Common errors**, **Checklist before moving on** and **Commit your work** stay unnumbered. They are the same in every part, so a number adds nothing and would shift every time a section is inserted above them.

---

## The shape of a build part

Every part that produces a file follows the same spine, so students learn the rhythm once:

| Block | Purpose |
| :--- | :--- |
| **Goal / You are done when** | Two lines at the top. What, and how you will know |
| **`N.1` Why this exists** | The problem, before the solution |
| **`N.2` Build it in pieces** | Type, explain, type, explain |
| **`N.3` Check your finished file** | The complete file, to compare against |
| **`N.4` Run it** | With expected output and a `success` checkpoint |
| **`N.5` See it in the database** | Beekeeper Studio. Proof it is real |
| **Try this** | Break it deliberately, watch the constraint fire |
| **Checklist before moving on** | Ticks, not prose |
| **Commit your work** | The exact conventional-commit message |
| **Next** | Pointer to the following part |

---

## Assessed work — three kinds, and a part wants a mix

Brought over from Quarter Stack Open, where it was worked out first. It governs every exercise, challenge, task and audit in this lab.

| Kind | What makes two submissions differ | Where it already happens |
| :--- | :--- | :--- |
| **Unique by content** | The brief demands something only this student knows — their language, their town, a rule they chose | `07` Audit 3 and Audit 4; the midterm's "what the builder cannot know" row |
| **Unique by process** | The work looks the same, but the evidence is individual: their own uuids, their commit times and order, the requests they sent that found nothing | The eleven commits; `06`'s ids; `requests/*.http` |
| **Shared by design** | Everyone judges the same thing, and comparability is the whole point | `07` Audit 1; `08`'s three challenges; the midterm's Part A |

**Why it matters.** For the first kind there is **no answer key and nothing to copy**, because a classmate's answer is about a different life, and no tool can supply it either — nobody told it. That is the cheapest protection this material has.

**The cost, stated honestly.** Unique submissions are slower to mark and impossible to mark by comparison, so the rubric carries more weight. Shared work marks fast and copies easily. A part wants both.

> **Check every assessed item against the table before publishing a part.** If something is none of the three, two students can submit identical work for identical marks and nothing in the material will tell you. That is a design fault, not a discipline problem.

A build-along layer will lean **shared by design**, and should — students are learning a shape, and the shape is the same for everyone. The protection then has to come from somewhere else: the commit history, the defence, and at least one content-unique hook per assessed part.

---

## Cross-referencing

| Refer to | Write | Never |
| :--- | :--- | :--- |
| A part | part `03` | file `03`, chapter 3, Step 2 |
| A section | `03` §3.4 | "the migration bit", "the part about migrations" |
| A piece | `03` Piece 4 | — |
| Another layer | Layer 2 | "next term" |

**Never say "file".** Files are how this is stored today; on the web there are no files, and the word will be wrong the moment the material moves.

---

## Spelling — UK throughout

`neighbourhood`, `initialise`, `organise`, `judgement`, `artefact`, `defence`, `practice` for the noun and `practise` for the verb.

Three things are not spelling and do not change:

- **Code and identifiers** — `.toUpperCase()`, `color` in CSS, a package called `express-validator`
- **Literal interface text** — quote what the screen actually says, US spelling included
- **A *meter* is a measuring device.** The urgency meter in `08` is correct UK English; *metre* is the unit of length

---

**`§` is the section sign** — shorthand for "section", from legal and academic writing. Use it for section references throughout: `02` §2.14.

It is unfamiliar to most students, so it is **defined once**, in `01` under "Finding your way around". Define it there and nowhere else; do not gloss it again each time it appears.

---

## Section numbers match part numbers — keep it that way

**Resolved.** Sections are numbered `N.M` where **`N` is the part number**:

| Part | Sections |
| :--- | :--- |
| `02` Setup & installation | `2.0` – `2.14` |
| `03` Designing the database | `3.1` – `3.5` |
| `04` Seeding the agencies | `4.1` – `4.5` |
| `05` Building the API | `5.1` – `5.3` |
| `06` Testing your API | `6.0`, then named `Test 1`–`Test 7` |
| `07` Auditing AI code | `7.0` – `7.6` |

So *"part `03` §3.2"* names one thing with one number.

> **This was broken twice before.** Parts were once titled `Step 1`…`Step 7`, offset by one from their numbers; removing the titles left the section numbers still following the dead scheme, so `part 03` owned sections `2.x`. Both are fixed.
>
> **When you add a part, its sections take its number.** Do not introduce a second sequence, ever. It has cost two sweeps already.

**Two deliberate exceptions:** part `08` uses `8.0` for "What you hand in, and how you prove it" — front matter for the three challenges, not a challenge itself. And part `06` uses `6.0` for "Pick a tool" and then named `Test 1`–`Test 7` headings. The tests are a numbered sequence of their own and reading them as `6.1`–`6.7` would suggest they are sections rather than exercises. Leave it.

---

## Adding a layer

1. `mkdir content/layer-N/`
2. Parts start at `01`. Do not repeat `00` — it lives above the layers.
3. Sections take their part's number.
4. Add a matching `layer-N/` folder in the instructor repository if the layer has solutions.
5. Update the parts table in [LAYERS.md](LAYERS.md).
6. Read [DOMAIN-CHARTER.md](DOMAIN-CHARTER.md) before inventing any entity.

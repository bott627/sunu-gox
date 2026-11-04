A Kamariana - BotT627

# Sunu Gox — the layers

**Authoring reference.** Students meet one layer at a time and never read this file.

The domain is fixed in [DOMAIN-CHARTER.md](DOMAIN-CHARTER.md). Naming and nesting are fixed in [STRUCTURE.md](STRUCTURE.md). This file fixes the *order*.

---

## Three principles

### 1. Every layer is the whole product, never a tier

There is no "backend layer" followed by a "frontend layer". **Layer 1 is already end to end** — request, validation, database, response, a human reading it. Its interface is simply the crudest one available: HTTP requests typed by hand.

Each layer afterwards makes the same product **less crude**, in both depth and reach at once. Nothing is ever built to completion and set aside, because building a whole API before anyone can use it is how you find out in month six that the design was wrong.

| Layer | The whole product, with the interface being… |
| :--- | :--- |
| 1 | HTTP requests you type by hand |
| 2 | …the same, but it refuses bad data |
| 3 | …and it knows who you are |
| 4 | a browser |
| 5 | a phone |
| 6 | your voice, in your language |
| 7 | …all of it, running somewhere that stays up |

### 2. Every layer is a defensible stopping point

Life happens. People take work, move, run out of money, have children. **Most students will not reach Layer 7, and the structure must not punish them for it.**

So every layer ends with an **exit claim** — one sentence a student can honestly say about themselves, that means something to an employer, on its own. A layer that only makes sense to someone who will reach the next one has failed the people this lab most exists for.

### 3. Every layer is motivated by the previous one visibly breaking

Not by a syllabus saying it comes next. The student should *hit* the problem before being handed the solution.

Building optimises to avoid rework. **Teaching engineers the rework deliberately** — and the charter's [deliberate simplifications](DOMAIN-CHARTER.md) table is the list of breakages waiting to happen.

---

## The map

| # | Layer | Ships | Exit claim |
| :-- | :--- | :--- | :--- |
| **1** | **It remembers and answers** | A REST API over a 1:N schema, tested and audited | "I can build a REST API over a relational schema and defend every line of it" |
| **2** | **It refuses bad data** | An API that rejects malformed input with useful errors | "I can design and enforce an input contract" |
| **3** | **It knows who you are** | Phone registration; reports have owners | "I can implement phone-based authentication and model ownership" |
| **4** | **People can see it** | A typed Next.js app a citizen can file from | "I can build a typed full-stack web application against my own API" |
| **5** | **People can reach it** | A mobile app that works on a poor connection | "I can ship a mobile client for low bandwidth and intermittent connectivity" |
| **6** | **People can speak to it** | Voice reports, in Wolof and Mandinka | "I can build multilingual voice input for users who do not type" |
| **7** | **It stays up** | A live service with real operations | "I can deploy, monitor and operate a production service" |

---

## Layer by layer

### Layer 1 — It remembers and answers ✅ *built, taught*

| | |
| :--- | :--- |
| **Entry** | Database I (SQL, MySQL), basic JavaScript |
| **Adds to the charter** | `Agency`, `Report` |
| **Interface** | REST Client in VS Code, with requests committed in `requests/` — the student is the user |
| **What breaks next** | It accepts `{"status": "banana"}`. Nobody knows who filed anything |

Parts, as currently written. The shared preface `content/00-why-this-lab-exists.md` sits above the layers and is read before any of them:

| Part | Name                   | Ships                                             |
| :--- | :--------------------- | :------------------------------------------------ |
| `01` | Introduction           | The problem, the schema, the rubric               |
| `02` | Setup & installation   | A running Node + Postgres + Prisma project        |
| `03` | Designing the database | Two tables and a relation, generated from a model |
| `04` | Seeding the agencies   | Idempotent reference data                         |
| `05` | Building the API       | Three endpoints                                   |
| `06` | Testing your API       | Proof that they work                              |
| `07` | Auditing AI code       | Judgement, and the three kinds of wrong           |
| `08` | Post-lab challenges    | Independent extension                             |
| `09` | Exercise               | Validation and atomic updates                     |

> **Numbering note — resolved.** Parts were once titled `Step 1`…`Step 7`, offset by one from their numbers. The titles were removed, and in a second sweep the **section** numbers were realigned too, so part `03` now owns sections `3.x` rather than `2.x`.
>
> One thing, one number. See [STRUCTURE.md](STRUCTURE.md) — and do not introduce a second sequence when you write Layer 2.

**End-of-layer validation:** students file reports against **each other's** APIs. A real user with expectations you did not anticipate is the closest thing to shipping that a layer whose only interface is hand-written requests can offer, and it is where they discover their error messages are useless.

---

### Layer 2 — It refuses bad data

| | |
| :--- | :--- |
| **Entry** | Layer 1 complete |
| **Adds to the charter** | `status` becomes an enum; validation rules become explicit |
| **New tools** | Zod — **in plain JavaScript**, no TypeScript yet |
| **Motivated by** | `07` Audit 1: an endpoint that happily stores `"banana"` |
| **What breaks next** | Every report is anonymous, so none of them can be followed up |

The first layer where the student's own Layer 1 code is the thing being improved. Keep Zod in JavaScript here — types arrive in Layer 4, where they pay for themselves.

**Carried forward from Layer 1:** fast automated checks, and validation as a declared contract rather than remembered `if` statements. Written up in [`content/layer-2/README.md`](../content/layer-2/README.md) — read it before planning this layer.

---

### Layer 3 — It knows who you are

| | |
| :--- | :--- |
| **Entry** | Layer 2 complete |
| **Adds to the charter** | `User`, phone number as identity, report authorship |
| **Motivated by** | You can file a report as anybody, including as somebody else |
| **What breaks next** | Only developers can use it. It runs on your laptop |

Phone-based registration rather than email, because that is how people here are actually reachable — and it forces real questions about identity, verification cost, and what happens when someone changes SIM.

**From this layer on, every layer ends deployed** — simplest managed host, minimal ceremony. Operations becomes the *subject* in Layer 7; being reachable starts here.

**Carried forward from Layer 1:** review by risk, and security work with a slot in the plan rather than a mention. Both need authentication and personal data to mean anything, which is why they wait for this layer. Written up in [`content/layer-3/README.md`](../content/layer-3/README.md).

---

### Layer 4 — People can see it

| | |
| :--- | :--- |
| **Entry** | Layer 3 complete |
| **New tools** | TypeScript, then Next.js |
| **Motivated by** | Nobody outside this room can use what you have built |
| **What breaks next** | Most citizens are on a phone, on data they pay for by the megabyte |

**This is the seam with Quarter Stack Open.** That course is the frontend quarter — fifteen parts, two sites, HTML through to `fetch` — and its Part 13 consumes exactly the kind of API Layer 1 builds. A student arriving here from it has already met responsive layout, forms, the DOM and asynchronous requests, which is most of what Layer 4 would otherwise have to teach from nothing. Two consequences worth holding to:

- **Do not re-teach what that course teaches.** Layer 4's job is the *contract* between an API and a client — `z.infer`, one shared type, a change that breaks the client at compile time — not CSS.
- **Do not assume it either.** Some students arrive without it. Layer 4 needs a stated, short list of what it expects and where to get it, the way `02` does for Node and PostgreSQL.

The two courses already share a vocabulary — the five moves, the three kinds of wrong, Try It Now, the audits, the defence — because they were written to be taken in either order by the same person. `AGENTS.md` is in both now: that course writes one for the site in its Part 6, this one writes one for the API in `07` §7.7 Step 6. A student who has done both should end with two, each specific to its own repository, and should be able to say why neither is generic.

**TypeScript arrives here, not earlier, and this is a deliberate and contestable choice.** At Layer 2's size the practical benefit is modest and the migration is a distraction. Here it earns itself immediately: one shared contract between API and client, so changing the API breaks the client *at compile time* instead of at 2am. The Zod schemas written in Layer 2 become the types via `z.infer` — the payoff lands on code the student already owns.

---

### Layer 5 — People can reach it

| | |
| :--- | :--- |
| **Entry** | Layer 4 complete |
| **Motivated by** | The web app assumes a good connection and a laptop. Most users have neither |
| **What breaks next** | Plenty of people do not write comfortably in any language |

Offline-first, retry, data cost, low-end Android. These constraints are real here and largely invisible in curricula written elsewhere — which makes this layer difficult to outsource to a generic tutorial, by design.

---

### Layer 6 — People can speak to it

| | |
| :--- | :--- |
| **Entry** | Layer 5 complete |
| **Adds to the charter** | `VoiceNote`, language fields — see [Language](DOMAIN-CHARTER.md) |
| **Motivated by** | A civic tool that requires typing in English excludes the people it exists for |
| **What breaks next** | It works, and now it has to keep working |

**The hardest layer and the most valuable.** Students meet the ground for it early, in `07` §7.8, when they discover how thin the tooling is in Wolof and Mandinka while sounding exactly as confident as in English.

Nothing in this layer can be lifted from an existing tutorial. That is the point.

---

### Layer 7 — It stays up

| | |
| :--- | :--- |
| **Entry** | Layer 6 complete, or Layer 4 for a student who wants operations sooner |
| **Motivated by** | Everything so far assumed nothing ever goes wrong at 3am |

Migrations against live data, backups and *restores*, secrets, monitoring, incident response. The only layer where the subject is what happens after the code is written.

---

## The reference repository

One repository, growing across every layer, **tagged at each boundary**:

```
layer-1-complete
layer-2-complete
…
```

This is what makes the domain continuous in practice rather than only in principle. It is how a student clones in if they join at Layer 3, fell behind, or is returning after a year away — and it is what makes "every layer is a stopping point" true operationally rather than as a slogan.

Students keep their own repository throughout. The reference exists to rejoin from, not to copy.

---

## Writing a new layer

1. **Read the charter first.** If the layer needs a new entity, amend the charter *before* writing the layer.
2. **State what breaks.** A layer that cannot name the failure it fixes has no motivation, and students will feel it.
3. **State the exit claim.** If you cannot write an honest one-sentence claim, the layer is not a stopping point and needs re-cutting.
4. **Keep the domain.** Sunu Gox data in every example. Never a blog, never a to-do list, never `users` and `posts` from someone else's documentation.
5. **Reuse the vocabulary** — Try It Now, Spot It, MTA boxes, the defence. One system across both courses.
6. **One new hard idea per layer.** Zod *or* TypeScript, not both.
7. **Classify every assessed item** — unique by content, unique by process, or shared by design. A layer whose assessed work is entirely shared can be copied wholesale; see `STRUCTURE.md`, *Assessed work*.

---

## Open decisions

| Question | Notes |
| :--- | :--- |
| **One site or several?** | Decided: one site, per-layer sidebar, with a way back to all layers. Needs a builder change — Astro-time work, not now |
| **Do layers map to courses?** | Layer 1 is Web II & DB II. Layers 2–3 could be one course or two; unresolved until Layer 2 is written |
| **Is Layer 7 last, or available earlier?** | Currently last, with light deployment from Layer 3. A student who wants operations sooner should not be blocked |
| **Does `ServiceType` ever arrive?** | Charter lists it as "later, if ever". Deciding *never* is a legitimate answer and would simplify three layers |

A Kamariana - BotT627

# Sunu Gox — domain charter

**Authoring reference.** Students never read this file; they meet its contents through the layers. Its job is to keep every layer talking about the same product in the same words.

---

## The one rule

**Every layer references this charter. No layer redefines it.**

A layer may **add** to the domain — new entities, new fields, new rules. A layer may never **replace** what is already here, rename it, or quietly teach a different version of it.

If a layer genuinely needs to change something in this file, that is a charter amendment (see the end), not a local decision. The amendment is written here first, and only then does the layer change.

> **Why this file exists at all.** The single biggest structural advantage of this curriculum is that **the domain never changes while the stack grows**. A student meeting Next.js in Layer 5 is not also meeting a new business problem — they already understand Sunu Gox to the bone, so all their attention is available for the new technology.
>
> That advantage is easy to lose and almost impossible to rebuild. It leaks one borrowed tutorial at a time.

---

## The borrowed-domain rule

**Never demonstrate a concept on someone else's example domain.**

Every framework's documentation teaches with a blog, a to-do list, or `users` and `posts`. The moment one of those is pasted into a layer "just to show the idea", students are learning the technology *and* an unfamiliar toy at the same time — which is the exact cost this curriculum is built to avoid.

Every example, every snippet, every code sample in a callout: **Sunu Gox data, or nothing.**

If you need a second entity to demonstrate a relationship, take it from the *not yet built* list below. Do not invent one.

---

## The problem, stated canonically

> In our communities, civic issues happen daily — a water pipe bursts in Serrekunda, or an animal carcass is left on the road in Brikama. Agencies like NAWEC or the Area Councils often do not find out for days, because there is no direct channel for citizens to report them.

**Sunu Gox** is Wolof: *sunu* = "our", *gox* = "neighbourhood". The `x` is the throaty sound in *loch*, so it is said **"sunu gokh"**.

This statement does not change. Later layers add capability to it; none of them restate the problem differently.

---

## The agencies

Fixed reference data, seeded — never user-generated. These exact strings are canonical:

| Canonical `name` | Refers to |
| :--- | :--- |
| `NAWEC (Water & Electricity)` | National Water and Electricity Company |
| `Kanifing Municipal Council (KMC)` | Kanifing municipality |
| `Brikama Area Council (BAC)` | Brikama area |

Three, and only three, until a layer amends this. They are real organisations serving real areas, which is what makes the local-knowledge argument honest rather than decorative.

---

## The entities

**Built (Layer 1):**

| Entity | Fields | Notes |
| :--- | :--- | :--- |
| `Agency` | `id`, `name` (unique), `reports[]` | Reference data. One agency has many reports |
| `Report` | `id`, `location`, `description`, `status`, `createdAt`, `agencyId`, `agency` | Belongs to exactly one agency |

`status` is `PENDING` or `RESOLVED`. Default `PENDING`.

**Optional fields, added by extension parts.** Not every student builds these, so a later layer must not assume a student's repository has them — check the reference repository instead:

| Field | Added in | Type and default | Notes |
| :--- | :--- | :--- | :--- |
| `priority` | `08` Challenge 1 | `String`, default `"LOW"` | `LOW`, `MEDIUM` or `HIGH` by convention — not enforced |
| `upvotes` | `09` Task 2 | `Int`, default `0` | Only ever changed with an atomic `increment` |

**Not yet built.** These are reserved names — when a layer needs them, it uses these, and does not invent alternatives:

| Entity | Arrives around | Why it is not here yet |
| :--- | :--- | :--- |
| `User` | auth layer | A report with no author cannot be trusted or followed up |
| `Photo` | mobile layer | `media_url` in Open311; needs storage decisions |
| `VoiceNote` | voice layer | The reason the whole product exists for people who do not type |
| `ServiceType` | later, if ever | Open311's `service_code` — see the simplification below |
| coordinates | mapping | `lat`/`long` in Open311 |
| `language` fields | web / voice layers | Which language a report was filed in, and which a citizen prefers — see **Language** below |

---

## Language

**Not yet decided. Recorded here so it is decided once, deliberately, rather than drifting into place one screen at a time.**

Sunu Gox is for people in Serrekunda, Brikama and Kanifing. English is The Gambia's official language, but a great many citizens do not read it comfortably — which is the entire reason the later layers add voice reporting. A civic tool that only speaks English excludes the people it was built for.

Students meet this directly in [`07` §7.8](../content/layer-1/07-auditing-ai-code.md), where they ask an AI to translate the report form and discover how thin its Wolof and Mandinka are — while sounding exactly as confident as it does in English.

### The open decisions

| Decision | Why it cannot be left to drift |
| :--- | :--- |
| **Which languages does Sunu Gox commit to?** | Every added language is a permanent maintenance obligation, not a one-off translation. Committing to three and serving them well beats claiming eight |
| **Is language a property of the citizen, the report, or both?** | A citizen may prefer Mandinka but file a report in Wolof. These are different fields and conflating them cannot be undone cheaply |
| **What does a voice note actually store?** | Audio only, a transcript, a translation, or all three. This decides storage cost, search, and whether a Council clerk can read the queue at all |
| **Which language does search work in?** | If reports arrive in three languages, a search in one finds a third of them. This is a database decision, not a UI one |
| **What happens to an untranslated string?** | Silent fallback to English, or a visible gap. Silent fallback hides how incomplete a translation is, often for years |

### What is already fixed

These are not open, and no layer may quietly decide otherwise:

- **UTF-8 everywhere** — database, API, and every client. Non-negotiable, and cheapest to get right before there is data.
- **The official Gambian Latin orthography** for each local language, whatever that language's own standard uses — not French conventions, not Senegalese spelling, not stripped-down ASCII. **The exact letters are established per language, with someone who writes it**, and recorded here when a layer needs them. They are deliberately not guessed at in this file.
- **The database is created with UTF-8 encoding**, and this is checked rather than assumed (`SHOW SERVER_ENCODING;` must say `UTF8`). A database created as `SQL_ASCII` will mangle Wolof and it cannot be fixed later without a dump and reload.
- **Collation is a decision, not a default.** Whether `ñ` sorts next to `n` or at the very end of the alphabet depends on the collation, and so does whether a search for `naga` finds `ñaga`.
- **Language is never inferred from a phone number or a location.** Ask, or default to English and let the citizen change it.

> **A correction worth recording, because the wrong version of it is everywhere.** `VARCHAR(191)` means 191 **characters**, not 191 bytes — in PostgreSQL *and* in MySQL with `utf8mb4`. Diacritics do not eat into a declared length, and this project uses `TEXT` with no limit anyway.
>
> The number 191 comes from an old MySQL index-key limit (767 bytes ÷ 4) and has nothing to do with accented characters. If you meet someone claiming diacritics will truncate a `VARCHAR` column, they have confused declared length with index length.
>
> **The real traps are encoding and collation — the two points above.** A `latin1` column or a `SQL_ASCII` database cannot store these characters at all; the wrong collation sorts and searches them wrongly, forever, and silently.

---

## Vocabulary

Drift in words is drift in the domain. Use the left column everywhere — in prose, code, comments, and commit messages.

| Use | Never | Why |
| :--- | :--- | :--- |
| **report** | ticket, issue, complaint, case | Matches Open311's `service request`; "complaint" changes the tone of the product |
| **agency** | department, organisation, provider, authority | Matches Open311's `agency_responsible` |
| **citizen** *(in prose)* | customer, client, end-user | This is civic infrastructure, not a shop |
| **`User`** *(in code, once it exists)* | `Citizen`, `Reporter`, `Account` | Standard in every auth library; fighting it costs more than it saves |
| **status** | state, stage, phase | One word, already in the schema |
| **location** | address, place, area | `location` is the field name; keep prose and code aligned |

> **The one deliberate inconsistency:** *citizen* in prose, `User` in code. It is not an oversight. The product serves citizens; the auth table is a `User` table like every other auth table on earth. Say so out loud when it first appears, rather than letting students think one of the two is a mistake.

---

## Rules that hold in every layer

1. **One agency has many reports. One report belongs to exactly one agency.** The 1:N relation is the spine of the whole product.
2. **Agencies are seeded, not created by users.** No endpoint, screen or app ever lets a citizen invent an agency.
3. **A report is never deleted.** Resolved, not removed — this is a public record. (If a layer needs deletion, that is an amendment and needs an argument.)
4. **The database defends its own integrity.** Application validation is in addition to constraints, never instead of them.
5. **Every report must be attributable to a real agency at the moment it is filed.** A report pointing at a non-existent agency is rejected, not stored.

---

## Deliberate simplifications, and what would undo them

Recorded so later layers can lift them knowingly rather than trip over them.

| Simplification | What it costs | What would have to change |
| :--- | :--- | :--- |
| Agency name merges *who fixes it* with *what kind of issue it is* | Cannot ask "show me all water problems across agencies" | Split out `ServiceType`, giving `Report` two relations instead of one |
| Two statuses only (`PENDING`, `RESOLVED`) | No "we have seen it and are working on it" | Add `IN_PROGRESS`; decide whether status becomes an enum |
| `status` is a `String`, not an enum | Nothing stops `"banana"` | The validation layer. This is the motivating failure for it |
| `priority`, once added, is a `String` too | Nothing stops `"URGENT"` or `"banana"` | The same validation layer that fixes `status` |
| No `User` | Anyone can file anything as anyone | The auth layer |
| No coordinates | Cannot put reports on a map | `lat`/`long`, and a decision about precision and privacy |
| English only, everywhere | Excludes the citizens the product exists for | A language decision, taken once, in the section below |

**These are the ladder.** Each row is a layer waiting to happen, and each one is already visible to a student who looks — which is exactly how a layer should be motivated.

---

## Alignment with Open311

Sunu Gox is a simplified version of **Open311**, the specification real city governments run today. Field names follow it deliberately, so students learn the industry's vocabulary rather than one invented for a course.

| Open311 | Sunu Gox |
| :--- | :--- |
| `service_request_id` | `id` |
| `description` | `description` |
| `address` | `location` |
| `status` | `status` |
| `requested_datetime` | `createdAt` |
| `agency_responsible` | `agencyId` → `Agency` |

**When naming anything new, check Open311 first.** If it has a name for the thing, use it.

---

## Amending this charter

1. Write the change here, with the reason and the date.
2. Then change the layer.
3. Never the other way round.

An amendment that makes an earlier layer wrong is not automatically forbidden — but it must be deliberate, and the earlier layer has to be updated in the same pass, or students will meet two versions of the truth.

### Amendment log

| Date | Change | Reason |
| :--- | :--- | :--- |
| — | Charter created from Layer 1 as taught | Establish the canonical domain before further layers are written |
| — | **Language** section added, with four points fixed and five decisions left open | Raised by `07` §7.8, where students discover how thin the tooling is in Wolof and Mandinka. Fixing UTF-8 and orthography now is far cheaper than after there is data |
| 2026-09-13 | **`priority`** added to `Report` as an optional field — `String`, default `"LOW"` | Introduced by `08` Challenge 1 before the charter recorded it. Recorded after the fact, so later layers know it exists in some repositories and not others |
| 2026-09-13 | **`upvotes`** added to `Report` as an optional field — `Int`, default `0` | Introduced by `09` Task 2, which teaches atomic updates. Recorded for the same reason |

A Kamariana - BotT627

# Sunu Gox Open

A civic reporting API for The Gambia, taught as a curriculum that grows in layers.

Citizens report local issues — a burst NAWEC pipe in Serrekunda, uncollected waste in Brikama — to the agency responsible for fixing them. The product stays the same across every layer; what changes is how much it can do and who can reach it.

---

## Where things are

| Path | What it is |
| :--- | :--- |
| **`content/`** | Everything a student sees. Safe to distribute |
| `content/00-why-this-lab-exists.md` | Shared preface. Read before any layer |
| `content/layer-1/` | Layer 1 — *It remembers and answers* |
| `content/layer-2/`, `content/layer-3/` | Not written yet. Each README holds what an earlier layer decided must land there |
| **`authoring/`** | How the curriculum is built. Students never read these, and contributors should |
| `tools/` | The checks — `pnpm run sweep`. The sweep runs on every pull request |
| `authoring/DOMAIN-CHARTER.md` | What the product is. Read before inventing anything |
| `authoring/LAYERS.md` | What order the layers come in |
| `authoring/STRUCTURE.md` | What things are called and how they nest |
| `authoring/teaching/` | How it is taught, and what the room actually did |

---

## Start here

**Teaching Layer 1?** [`authoring/LAYERS.md`](authoring/LAYERS.md) for the shape. The instructor guide — timings, solutions, the failures that will bite, and everything for the midterm — is in the **private** companion repository, `bott627/sunu-gox-instructor`. Ask if you are teaching this and do not have access.

**Setting the midterm?** Same place. The paper is handed out on the day, so it is not published here.

**Writing a new layer?** [`authoring/DOMAIN-CHARTER.md`](authoring/DOMAIN-CHARTER.md) first — it decides what you are allowed to invent. Then [`authoring/STRUCTURE.md`](authoring/STRUCTURE.md) for naming, and the checklist at the end of [`authoring/LAYERS.md`](authoring/LAYERS.md).

**Just want to see the lab?** [`content/00-why-this-lab-exists.md`](content/00-why-this-lab-exists.md), then [`content/layer-1/01-introduction.md`](content/layer-1/01-introduction.md).

---

## The layers

| #     | Layer                      | Exit claim                                                                    |
| :---- | :------------------------- | :---------------------------------------------------------------------------- |
| **1** | It remembers and answers ✅ | "I can build a REST API over a relational schema and defend every line of it" |
| 2     | It refuses bad data        | "I can design and enforce an input contract"                                  |
| 3     | It knows who you are       | "I can implement phone-based authentication and model ownership"              |
| 4     | People can see it          | "I can build a typed full-stack web application against my own API"           |
| 5     | People can reach it        | "I can ship a mobile client for low bandwidth and intermittent connectivity"  |
| 6     | People can speak to it     | "I can build multilingual voice input for users who do not type"              |
| 7     | It stays up                | "I can deploy, monitor and operate a production service"                      |

Every layer is a **defensible stopping point**. Most students will not reach Layer 7, and the structure does not punish them for it — each exit claim means something to an employer on its own.

---

## Licence, and contributing

| | |
| :--- | :--- |
| **The material** — every `.md` in `content/` and `authoring/` | [CC BY-SA 4.0](LICENSE). Use it, teach it, translate it, change it. Credit it, and keep derivatives under the same licence |
| **The code** — `tools/`, `sharing/`, and every snippet students type | [MIT](LICENSE-CODE) |

Attribution, if you need a line: *"Sunu Gox, by A Kamariana (BotT627), CC BY-SA 4.0."*

Corrections and new material are welcome — [`CONTRIBUTING.md`](CONTRIBUTING.md) has the one standard that matters: **every behavioural claim has to have been run, not reasoned about.**

---

## Three rules that hold everywhere

1. **The domain never changes while the stack grows.** A student meeting a new framework is never also meeting a new business problem. See the charter.
2. **Never borrow someone else's example domain.** No blogs, no to-do lists, no `users` and `posts`. Sunu Gox data or nothing.
3. **Every layer is motivated by the previous one visibly breaking.** Students hit the problem before they are handed the solution.

# Contributing

Corrections and new material are welcome, including from people who have never met me. Two things make a contribution easy to accept, and both are about saving the next reader's time rather than mine.

## Before you write anything

Read **[`authoring/STRUCTURE.md`](authoring/STRUCTURE.md)** — what things are called, how parts are numbered, how a piece of code shows its own progression, and why nothing here says "file". Then **[`authoring/DOMAIN-CHARTER.md`](authoring/DOMAIN-CHARTER.md)**, which decides what may be invented: this material has one domain, Sunu Gox, and never borrows someone else's example.

A pull request that renames things, adds a second numbering scheme, or teaches with a blog and a to-do list will be turned down on those grounds alone, however good the writing is.

## What is most useful

| | |
| :--- | :--- |
| **A correction with evidence** | The best contribution there is. Something in here is wrong, and you ran it. Say what you ran, what you got, and on what versions |
| **A failure from your own room** | You taught a part and students got stuck somewhere the material does not expect. That is a documentation defect and it is worth more than a typo fix |
| **A part of an unwritten layer** | Layers 2 and 3 have READMEs saying what must land in them. Start there, not from scratch |
| **Translation of student-facing text** | Wolof, Mandinka, Fula, Jola. See `07` §7.8 for why this matters here, and expect to be credited by name |

## The one standard

**Every behavioural claim has to have been run.** Not reasoned about — run.

If a part says an endpoint answers `404`, someone sent the request and read `404`. If it quotes an error, that is the error text, copied. Say in the pull request what you ran it on: Node, Express, Prisma and PostgreSQL versions.

This is not pedantry, and it is not aimed at you. Everything in this material that was ever wrong was wrong because somebody — usually me — wrote down what *should* happen instead of what did. The whole of part `07` teaches students to catch exactly that, so the material cannot be allowed to do it.

## Practicalities

- One topic per pull request. A typo fix and a new section are two pull requests.
- `pnpm run sweep` must pass. It checks links, section references, headings and UK spelling, and it runs on your pull request anyway.
- UK spelling throughout, with the exceptions listed in `STRUCTURE.md`.
- **Nothing that belongs to an instructor.** Solutions, mark schemes and exam material live in a separate private repository. If your contribution needs to touch one, say so in the pull request and leave it out of the diff.

## Licence

By contributing you agree that your prose is licensed **CC BY-SA 4.0** and your code **MIT**, the same as the rest of the repository. You keep the copyright in what you wrote, and you will be credited in the commit history and, for anything substantial, in the part itself.

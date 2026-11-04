---
title: "Layer 3 — It knows who you are"
---
A Kamariana - BotT627

# Layer 3 — It knows who you are

**Not written yet.** This is a note to whoever writes it, including me. The layer's shape — entry, charter additions, what breaks next — is in [`authoring/LAYERS.md`](../../authoring/LAYERS.md); this document holds only what earlier layers decided must land here.

---

## Carried forward from Layer 1

Both items below were deliberately *not* taught in Layer 1, because an API with no authentication and no personal data cannot make either of them mean anything. A risk policy with nothing at risk is a worksheet.

### 1. Review by risk

Once reports have authors and accounts have phone numbers, changes stop being equally dangerous. That is the first point at which a student can write, and defend, a rule like this:

| The change touches | How it gets reviewed |
| :--- | :--- |
| Wording, layout, a new read-only list | Automated checks are enough |
| Authentication, ownership, anyone's phone number or personal data | **A person reads the diff**, every time |

**What this layer should produce:** that table, committed in the repository, written by the student for their own project — and at least one occasion where they have to apply it to their own change and say which row it fell into.

The teaching point is the one `07` sets up: a tool reviewing another tool's output shares its blind spots, so the question is never *"is review necessary?"* but *"which changes can a check catch, and which need somebody who understands what an attacker would try?"*

### 2. Security work on the schedule

`07` establishes that cheaper code does not mean cheaper correctness. Layer 3 is where that stops being an argument and becomes a line in the plan: **when building gets faster, some of the time saved goes to the review, because attackers got faster too.**

**What this layer should produce:** a scheduled security pass over the student's own authentication — not a sidebar, an item with a slot — and the habit of asking for it out loud before shipping. Including what to do when somebody senior says there is no time for it.

---

## When this is written

Delete the "not written yet" line, keep the carried-forward items that have landed, and record anything Layer 3 decides must land later under the same heading in that layer's README.

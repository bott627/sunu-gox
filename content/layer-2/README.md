---
title: "Layer 2 — It refuses bad data"
---
A Kamariana - BotT627

# Layer 2 — It refuses bad data

**Not written yet.** This is a note to whoever writes it, including me. The layer's shape — entry, charter additions, tools, what breaks next — is in [`authoring/LAYERS.md`](../../authoring/LAYERS.md); this document holds only what Layer 1 decided must land here.

---

## Carried forward from Layer 1

### 1. Fast automated checks

Layer 1 proves everything with `requests/*.http` sent by hand. That was the right first instrument — a student reads the response and decides — but it has two limits that bite here:

- **Nobody re-runs twenty requests by hand.** `08` and `09` already have to *tell* students to re-send `requests/api.http` as a regression check, and that instruction is the weakest promise in the layer.
- **A check that takes a person cannot be run by anything else.** Where work is directed rather than typed, the thing doing the work needs a check it can run itself, in seconds, without waiting for you.

**What this layer should produce:** a test command that runs in seconds and covers the seven cases `06` proved by hand, so that *nothing is finished until it passes*. The `.http` files stay — they are how a human inspects a response — but they stop being the only safety net.

Write it as the motivated failure, the way every layer does it: the student breaks something in Layer 1 code, does not notice, and finds out from a test rather than from the lecturer.

### 2. Validation as a declared contract, not scattered `if` statements

`09` has students hand-roll length checks, and `07` Audit 1 ends with `"banana"` stored in a `String` column. That is the motivating failure already written. What this layer adds is the shift from *checks I remembered to write* to *a contract declared once* — and `status` becoming an enum the database itself enforces.

Both of these mean the `AGENTS.md` written in `07` §7.7 Step 6 gets its first revision: the rule that was a sentence a tool had to be told becomes a constraint the schema enforces. **Have students update that document as part of this layer, and say why that is the better outcome.**

---

## When this is written

Delete the "not written yet" line, keep the carried-forward items that have landed, and record anything Layer 2 decides must land in Layer 3 under the same heading in [`../layer-3/README.md`](../layer-3/README.md).

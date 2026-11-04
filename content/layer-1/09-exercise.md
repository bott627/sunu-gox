---
title: "Exercise — Scaling the Sunu Gox API"
sidebar: "09 · Exercise — Scaling the Sunu Gox API"
description: "make your API refuse useless data, and count agreement without losing votes."
---
A Kamariana - BotT627

# Exercise — Scaling the Sunu Gox API

**Goal:** make your API refuse useless data, and count agreement without losing votes.
**Prerequisite:** parts `05` and `06` complete — all seven tests in `requests/api.http` pass.
**You are done when:** both tasks are proved by requests in `requests/exercise.http`, and those seven tests still pass afterwards.

---

## 9.1 Objective

You have a working relational API. Before we put a frontend on it, it needs to stop accepting rubbish data, and it needs to handle the situation where twenty people report the same burst pipe.

Both tasks are required.

### What you hand in for each

| Task | What is in your repository when it is done |
| :--- | :----------------------------------------- |
| **1** | Validation on `POST /api/reports`, the `422` error-array response, the requests proving a missing field is still `400` and short content is `422`, and one sentence in your README about Kotu |
| **2** | The `upvotes` field with its migration, `POST /api/reports/:id/upvote` using atomic `increment`, and the requests proving the count rises each time and that an unknown id gives `404` |

As in part `08`, **the requests are the deliverable.** Apart from the one README sentence, nothing here asks for prose.

> [!tip] Prove each task from a request file
> Put the requests for this exercise in `requests/exercise.http`, using the pattern from part `06`, and commit the file with the task it proves. Start it with:
>
> ```http
> @baseUrl = http://localhost:3000
> @nawecId = PASTE_NAWEC_ID_HERE
> @reportId = PASTE_A_REPORT_ID_HERE
> @fakeId = 00000000-0000-0000-0000-000000000000
> ```

> [!tip] The six probes still apply — and one of them flips
> From `07` §7.5: probe 3 (**a required field missing**) and probe 5 (**a value present but outside the rules**) are precisely the two rows of Task 1's table — missing is `400`, present-but-too-short is `422`. Probe 2 (**an id that does not exist**) is Task 2's `404`.
>
> **Probe 6 is the interesting one.** Everywhere else in this lab, sending the same request twice should be *safe* — part `08`'s status change answers `200` with the same report however often you send it. On an upvote, sending it twice is **supposed** to count twice. That is the whole reason Task 2 is a `POST` and the status change was a `PATCH`.
>
> A probe tells you what happened. Only you can say whether what happened was right.

---

## 9.2 Task 1 — Backend input validation

### The problem

Your API currently accepts any non-empty string. A citizen can submit:

```json
{ "location": "a", "description": "x", "agencyId": "..." }
```

and your database stores it. NAWEC receives a report that says `a` / `x` and can do nothing with it. Your validation checks that fields are *present*, not that they are *useful*.

### Your task

1. Install a validation library — `express-validator` is the common choice — **or** write the checks yourself in plain JavaScript. Either is acceptable; be able to defend your choice.

2. Modify `POST /api/reports` to enforce:
   - `location` — at least **5 characters** (`"a"` is too short; `"Serrekunda Market"` is fine)
   - `description` — at least **15 characters**, so citizens actually explain the problem

3. When validation fails, return HTTP **422 (Unprocessable Entity)** with an array describing every problem found.

4. **Keep the check you already have.** A request that is missing a field altogether still gets the `400` from part `05` — the `422` rules only apply once every field is present. In that order:

   | The request | Response |
   | :--- | :--- |
   | A field is missing, or the JSON will not parse | `400` — as it already does |
   | Every field present, but `location` or `description` too short | `422`, listing **every** failing field |
   | Every field present and long enough | Carries on to the database, as before |

### Why 422 and not 400?

You used `400 Bad Request` in the lab, and it was correct there. The distinction:

| Status                     | Means                                                                              |
| :------------------------- | :--------------------------------------------------------------------------------- |
| `400 Bad Request`          | The request is malformed — a field is missing entirely, or the JSON will not parse |
| `422 Unprocessable Entity` | The request is well-formed and understood, but the *content* fails your rules      |

`{"location": "a", "description": "x", "agencyId": "..."}` is perfectly valid JSON with every field present. The server understood it fine. It just refuses the content. That is `422`.

### Return every error, not just the first

If both fields are too short, say so in one response:

```json
{
  "errors": [
    { "field": "location",    "message": "must be at least 5 characters" },
    { "field": "description", "message": "must be at least 15 characters" }
  ]
}
```

Returning one error at a time forces the user to submit, fix, submit, fix. Return them all at once.

### Think about

- **Kotu is a real place, and it has four letters.** What does your rule do to a citizen who lives there? A rule can look sensible and still reject real data, because it was written without knowing where it would be used. You still implement the rule as given — but write one sentence in your README saying what you would change, and why.
- What should happen if `location` arrives as a number, like `12345`? Try it before you decide.

### Done when

Each line is one request in `requests/exercise.http`:

- Every field present, both too short → `422`, and the array lists **both** fields
- Every field present and long enough → `201`, as before
- A field left out altogether → still `400`, not `422`
- One sentence in your README on what you would change about the 5-character rule, and why

Then **send every request in `requests/api.http` again.** Test 3 must still return `400`, and every other test must still behave as part `06` says. If a status changed, either you meant it — and can say why — or you have just broken something that used to work. Catching that is the reason those requests were saved.

Use this message exactly — see part `02` §2.14 for why.

```bash
git add . && git commit -m "feat: add input validation to report creation"
```

```bash
git push
```

---

## 9.3 Task 2 — Upvoting reports

### The problem

If twenty people notice the same burst pipe in Serrekunda, twenty separate reports are the wrong outcome. NAWEC sees twenty tickets instead of one urgent problem, and nothing tells them it is urgent.

Instead, citizens should be able to say **"me too"** on a report that already exists.

### Your task

1. Add an `Int` field named `upvotes` to the `Report` model, defaulting to **`0`**.
2. Generate and run the migration:

   ```bash
   npx prisma migrate dev --name your_meaningful_name
   ```

   The two warnings in part `08` §8.1 apply here too: add the default in the same edit as the field, and restart your server if it says it does not know `upvotes`.
3. Create `POST /api/reports/:id/upvote`.
4. Increment the count using Prisma's **atomic** `increment` operation. **Do not** fetch the report, add one in JavaScript, and save it back.
5. Return `200` with the updated report, and `404` — not `500` — for a report id that does not exist.

### Think about

- **Why `POST`, and not `PATCH`?** Every call changes the count again. Sending it twice counts twice — the non-idempotent behaviour part `05` described for `POST`.
- **What stops one citizen upvoting the same report a hundred times?** Nothing, yet — the API has no idea who anyone is. Write down what it would take to prevent it. That gap is what the layer after next exists to close.

### Why atomic matters — the actual reason

The obvious approach:

```javascript
const report = await prisma.report.findUnique({ where: { id } });   // reads 5
await prisma.report.update({
  where: { id },
  data: { upvotes: report.upvotes + 1 }                             // writes 6
});
```

Now two citizens in Serrekunda press the button at the same moment:

| Time | Request A | Request B | Stored value |
| :--- | :--- | :--- | :--- |
| 1 | reads `upvotes` = 5 | | 5 |
| 2 | | reads `upvotes` = 5 | 5 |
| 3 | writes 6 | | 6 |
| 4 | | writes 6 | **6** |

Two people upvoted. The count went up by one. One vote vanished.

This is a **race condition**, and it is not rare — it is the normal outcome under load. The fix is to never read the value into JavaScript at all. Tell the *database* to add one, and let PostgreSQL handle the ordering:

```javascript
data: { upvotes: { increment: 1 } }
```

Prisma turns that into a single statement. Shortened, what it actually sends is:

```sql
UPDATE "Report" SET "upvotes" = ("Report"."upvotes" + $1) WHERE "Report"."id" = $2
```

The adding happens **inside PostgreSQL**, one request after another. Both requests land, the count goes to 7, nothing is lost.

This is not a story. It was measured while preparing this exercise — Express 5, Prisma 6 and PostgreSQL, on an ordinary laptop — by sending 51 upvotes to one report over HTTP at the same moment, three times over:

| Approach | Upvotes sent | Count stored, three attempts |
| :--- | :--- | :--- |
| Read, add one in JavaScript, write back | 51 | **8**, **4**, **4** |
| `increment` | 51 | **51**, **51**, **51** |

Between 43 and 47 votes vanished on every attempt. Not occasionally — every time.

> [!mta] Understand why the naive version is wrong
> Be ready to explain this table in the Week 2 lab. Understanding *why* the naive version is wrong matters more than knowing which method to call.
>
> It also works on your screen. One person clicking **Send Request** never produces two requests at the same instant, so the naive version passes every test you can run by hand — and loses votes the first day real people use it. **Passing your own tests is not the same as being correct under load.**

### Done when

- The same upvote request, sent twice, returns `200` both times and the count rises by one each time
- A request with `@fakeId` returns `404`, not `500`
- Every report already in your table reads `upvotes: 0` in Beekeeper Studio after the migration
- The seven tests in `requests/api.http` still pass

> [!info] You cannot produce the race yourself, and that is the point
> Nothing you can click will send two requests in the same instant, so **your own testing cannot tell these two versions apart** — the naive one will pass every request you send by hand. The numbers in the table above came from a script that fires 51 at once. Ask to see it run in the lab; watching 47 votes disappear is worth two minutes.

Use this message exactly — see part `02` §2.14 for why.

```bash
git add . && git commit -m "feat: add atomic upvote endpoint"
```

```bash
git push
```

---

## 9.4 Submission

**Submit the URL of your GitHub repository.** That is the whole submission — no zip file.

Before you submit, confirm on github.com that:

1. Your lecturer is still listed under **Settings → Collaborators**. Your repository is private, so without this nobody can mark it.
2. **`node_modules` is not there.** If it is, your `.gitignore` failed — fix it and push again.
3. **`.env` is not there.** If it is, you have published a password. Fix `.gitignore`, push, and then change your database password.
4. **`.env.example` is there.**
5. Your **commit history** shows the work in stages — at minimum the eleven commits listed in `02` §2.14, in order.

Also include, either as files in the repository or as an attachment:

- A request in `requests/exercise.http`, and a screenshot of its response, showing a failed validation returning **422** with multiple errors listed
- A request in `requests/exercise.http`, and screenshots of its response sent twice, showing the upvote count increasing

### Marking

| Criteria | Marks |
| :--- | :--- |
| Validation rules correctly enforced on both fields | **25%** |
| Correct use of `422` with a complete error array | **25%** |
| `upvotes` field migrated correctly with default `0` | **20%** |
| Atomic `increment` used (not read-then-write) | **30%** |

Each criterion is checked by **sending the requests you committed**, on the marker's own machine. A criterion with nothing in `requests/exercise.http` behind it is judged on the code alone, which is a much weaker position than a response nobody can argue with.

**Your commit history is checked separately.** A repository whose entire contents arrive in a single commit does not show the work being built in stages, and cannot be distinguished from work that was not yours. Commit at each step, as instructed in each file, and this is never a problem.

---

## 9.5 A note on getting help

**If something does not work**, answer the three questions in `08` §8.5 first — what you expected, the exact error text, and the smallest change that makes it appear or disappear. Most of the time that is the whole fix, and it is what makes anyone else's help useful.

Look things up. Read the Prisma documentation. Ask each other. **Use AI** — openly, and as much as you find useful. None of that is discouraged here, and none of it needs to be hidden.

There is one line, and it is simple: **you may not submit code you cannot explain.**

In the Week 2 lab you may be asked to walk through your own upvote endpoint and say why it is atomic. If you can do that, it does not matter where the code came from. If you cannot, it does not matter either — and the marks reflect that, not the tool you used.

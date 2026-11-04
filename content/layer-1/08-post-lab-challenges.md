---
title: "Post-lab challenges"
sidebar: "08 · Post-lab challenges"
description: "extend your working Sunu Gox API on your own."
---
A Kamariana - BotT627

# Post-lab challenges

**Goal:** extend your working Sunu Gox API on your own.
**Prerequisite:** all seven tests in part `06` pass.
**You are done when:** each challenge's **Done when** lines are proved by requests in `requests/challenges.http`, in three separate commits.

These three challenges build on each other in difficulty. Attempt them in order. No solutions are given here — working out where you went wrong is the point.

## 8.0 What you hand in, and how you prove it

| Challenge | What is in your repository when it is done |
| :-------- | :----------------------------------------- |
| **1** | The new field and its migration in `prisma/`, `POST /api/reports` accepting and storing it, and the requests that prove the default |
| **2** | Your fixed `PATCH` endpoint from part `07`, meeting every row of the specification, one request per row, and your lowercase decision written in the README |
| **3** | `GET /api/reports/active` using `where` and `orderBy`, naming each report's agency, and the before-and-after requests that show a resolved report leaving the feed |

Nothing here asks for an essay. Apart from the one README decision in Challenge 2, **the requests are the deliverable** — they are how anyone else, including whoever marks this, can tell that it works.

> [!warning] One commit per challenge
> Use the exact message given at the end of it. Three challenges, three commits. One commit containing all three is not evidence that you did them in order — and if the third one breaks, you cannot get back to the second.

> [!tip] Test each challenge from a request file
> Put the requests that prove each challenge works in `requests/challenges.http`, using the pattern from part `06`, and commit the file with the challenge it tests. Start it with the variables you will need:
>
> ```http
> @baseUrl = http://localhost:3000
> @nawecId = PASTE_NAWEC_ID_HERE
> @reportId = PASTE_A_REPORT_ID_HERE
> @fakeId = 00000000-0000-0000-0000-000000000000
> ```
>
> Then add one request for every line of each challenge's **Done when**. If a line has no request proving it, it is not done.

> [!tip] You already have the method — reuse it
> Part `07` §7.5 gave you six probes: the happy path, an id that does not exist, a required field missing, no body at all, a value outside the rules, and the same request twice.
>
> **Challenge 2's specification is five of those six, written out as a table.** That is not a coincidence — a specification *is* the probes, decided in advance. The sixth is missing on purpose: send the same `PATCH` twice and decide for yourself what should happen when NAWEC marks one report resolved two days running.
>
> For Challenges 1 and 3 nobody hands you the table. **Run the probes that apply and decide the right answer yourself** — and notice which ones do not apply at all to a `GET` with no body and no id. Working that out is the judgement this part is building.

---

## 8.1 Challenge 1 — The urgency meter *(schema modification)*

### The problem

Not all civic issues are equal. A broken water main wasting thousands of litres of clean water needs faster attention than one uncollected bin. Right now your API treats them identically.

### Your task

1. Add a new `String` field to the `Report` model in `schema.prisma` called `priority`.
2. It should accept `LOW`, `MEDIUM` or `HIGH`, and **default to `LOW`** when the citizen does not supply one.
3. Run a new migration to apply the change to PostgreSQL. Give it a name that says what changed:

   ```bash
   npx prisma migrate dev --name your_meaningful_name
   ```

4. Update `POST /api/reports` to accept and store `priority`.

> [!warning] Add the default in the same edit as the field
> Your `Report` table already has rows. Add `priority` as a required field **without** a default, and Prisma refuses to migrate:
>
> ```
> ⚠️ We found changes that cannot be executed:
>   • Step 0 Added the required column `priority` to the `Report` table without a default value. There are 1 rows in this table, it is not possible to execute this step.
> ```
>
> The number of rows will match your table. Prisma cannot invent a value for reports that already exist, so it stops. Put the default in the schema in the same edit, then migrate.

> [!tip] If the server says "Unknown argument priority"
> The full message is:
>
> ```
> PrismaClientValidationError
> Unknown argument `priority`. Available options are marked with ?.
> ```
>
> The Prisma client your server is using does not know about the new field yet. Check the migration finished without errors, then stop `npm run dev` and start it again.

### Think about

- What happens to the reports **already** in your table when you add a column? Look at them in Beekeeper Studio afterwards.
- Should the default live in the schema, in your JavaScript, or both? What is the difference?
- Nothing stops `"VERY HIGH"`, or `"low"`, or an empty string. `priority` is a `String`, exactly like `status` — you are about to meet the same hole again in Challenge 2.

### Done when

Two requests and one look at the table:

- `POST /api/reports` **without** `priority` returns `201`, and the report comes back `"priority": "LOW"`
- `POST /api/reports` with `"priority": "HIGH"` returns `201` and stores `HIGH`
- The reports that were already in your table before the migration now read `LOW` in Beekeeper Studio

```bash
git add . && git commit -m "feat: add priority field to reports"
```

```bash
git push
```

---

## 8.2 Challenge 2 — Marking things resolved *(data modification)*

### The problem

When NAWEC actually fixes the pipe, somebody needs to say so. Your API can create reports but has no way to change one.

### You already have the endpoint

In part `07` Audit 1 you audited a `PATCH /api/reports/:id/status` endpoint and fixed it. **That fixed endpoint is your starting point.** Do not add a second one: Express answers with the first route that matches, so a duplicate further down would never run, and you would be editing code that does nothing.

### Your task

Make your endpoint meet this specification — every row. Each row is proved by its own request in `requests/challenges.http`.

| When the request is | It must |
| :--- | :--- |
| A real report id, with `{"status": "RESOLVED"}` | Return `200` and the updated report, using `prisma.report.update()` |
| A report id that does not exist | Return `404` — not `500` |
| A body with no `status` in it | Return `400` — not `200` |
| **No body at all** | Return `400` — not `500` |
| `{"status": "resolved"}`, in lowercase | **Your decision.** Accept it, or reject it with `400`. Choose deliberately, and write down which in your README |

The last row has no right answer in these notes. The first four do.

### Think about

- **Why `PATCH` and not `PUT`?** `PUT` replaces an entire resource; `PATCH` changes part of one. You are changing one field.
- Prisma throws error code **`P2025`** when the record to update does not exist. What HTTP status should that become? You already used the right one somewhere in part `05`.
- What if someone sends `{"status": "resolved"}` in lowercase? Or `{"status": "banana"}`? Decide what your API should do, and make it do that deliberately.

> [!mta] Nothing stops `"banana"`, and that is not an accident
> `status` is a `String`. PostgreSQL will store any string you give it, happily and forever. Your database will accept `"banana"`, `"RESOVLED"` with a typo, and an empty string.
>
> The database defended you against a **missing agency** in part `06`, because you declared that relationship. It cannot defend you here, because you never told it what a valid status is. **A constraint you did not declare is a constraint that does not exist.**
>
> Deciding what to do about this is the whole of the next layer of Sunu Gox. For now, notice that you can see the hole.

### Done when

- Every row of the specification has its own request in `requests/challenges.http`, and each one returns what the row says
- The status change is visible in Beekeeper Studio, not only in the response
- Your README says what you decided about lowercase `"resolved"`, and why
- You can say out loud what your endpoint does with `"banana"` — and why nothing stopped it
- The seven tests in `requests/api.http` from part `06` still pass

```bash
git add . && git commit -m "feat: add endpoint to update report status"
```

```bash
git push
```

---

## 8.3 Challenge 3 — The live civic feed *(filtering and sorting)*

### The problem

A public dashboard should not show issues that were fixed months ago. Citizens want to see what is broken **right now**.

### Your task

1. Create `GET /api/reports/active`.
2. Use Prisma's `where` option to return **only** reports whose status is exactly `PENDING`.
3. Use `orderBy` so the newest reports appear at the top.

### Think about

- `where` is your SQL `WHERE`. `orderBy` is your SQL `ORDER BY`. You know this already from Database I — you are only learning new syntax for the same idea.
- **A trap worth understanding:** Express matches routes in the order you declare them. If you later add `GET /api/reports/:id`, and you put it *above* `/api/reports/active`, Express will treat the word `active` as an `:id` and your feed will break. Specific routes go before parameterised ones. Try it deliberately and watch it fail.
- Right now the feed shows the report but not *which agency* it belongs to. You already know the one option that fixes that. Add it.

### Done when

- `GET /api/reports/active` returns only reports whose status is `PENDING`
- The newest report is at the top
- Each report in the feed names its agency
- **Before and after:** one request to the feed, then Challenge 2's `PATCH` marking one of those reports `RESOLVED`, then the same feed request again — and that report is gone. Three requests, in that order, in `requests/challenges.http`

```bash
git add . && git commit -m "feat: add active reports feed"
```

```bash
git push
```

---

## 8.4 If you finish early

Not marked, but worth your time:

- **Count instead of list.** Return how many pending reports each agency has, without returning the reports themselves. Prisma has `_count`.
- **Filter the nested include.** In `GET /api/agencies/:id/reports`, nest only the *pending* reports. (Hint: `include: { reports: { where: ... } }`.)
- **Paginate.** If Serrekunda files 10,000 reports, your feed returns all of them. Look up `take` and `skip`.

---

## Checklist before moving on

- [ ] Challenge 1: a report filed without `priority` comes back `LOW`
- [ ] Challenge 2: every row of the specification proved — including `404` for an unknown id and `400` for a missing body
- [ ] Challenge 2: your lowercase decision is written in your README
- [ ] Challenge 3: the feed shows only `PENDING`, newest first, each with its agency
- [ ] Challenge 3: a before-and-after pair of feed requests shows a resolved report leaving it
- [ ] `requests/challenges.http` holds a request for every **Done when** line
- [ ] The seven tests in `requests/api.http` from part `06` still pass
- [ ] Three separate commits, with the three messages given
- [ ] Everything is pushed and visible on github.com
- [ ] You can explain, out loud, why `"banana"` is still accepted as a status

---

## 8.5 Getting help

Whoever you ask — a classmate, your lecturer, or an AI — answer these three first:

1. What did you expect to happen?
2. What actually happened — the **exact** error text, not "it didn't work"?
3. What is the smallest change that makes the error appear or disappear?

This is not a hurdle before you are allowed help. It is what makes the help useful. A person cannot guess what your code does, and an AI given "it doesn't work" will invent a plausible answer to a problem you do not have.

Answering the three questions also solves a surprising number of problems before you ask anyone.

And one more, specific to this part: **if you cannot tell whether your code works, what you are missing is a request, not an explanation.** Go back to the six probes in `07` §7.5 and send one.

**Next:** part `09` — Exercise.

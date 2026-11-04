---
title: "Auditing AI code"
sidebar: "07 · Auditing AI code"
description: "take code you did not write, decide whether it is correct, and prove it."
---
A Kamariana - BotT627

# Auditing AI code

**Goal:** take code you did not write, decide whether it is correct, and prove it.
**Prerequisite:** your own API works and all seven tests in part `06` pass.
**You are done when:** you have found the defects, proved each one, and written down how you proved it.

---

## 7.1 Why this lab exists

You have now built this API yourself. That was deliberate — because for the rest of your career, most of the code you are responsible for will be code you did not write. Some of it will come from colleagues. Increasingly, much of it will come from an AI.

Nobody is going to stop you using AI, in this lab or at work. The question that decides whether you are employable is different:

**When it hands you something that runs, can you tell whether it is right?**

That is the only skill this lab is testing.

> [!mta] Running is not the same as correct
> Broken code that crashes is the easy case — it tells you it is broken.
>
> The dangerous case is code that **runs, returns a sensible-looking answer, and is wrong.** It passes a quick test. It reaches production. It fails months later on data nobody tried, and by then it is expensive.
>
> Your value is not in producing code. It is in being the person who can tell the difference.

## 7.2 Three kinds of wrong

Everything you find today falls into one of three categories, and **which category matters more than which bug.** One of them is disappearing. Two of them are not.

| Kind                             | What it means                                                                                                         | Fixed by a better model?                                                |
| :------------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| **1. It is not good enough yet** | The model made a mistake a stronger model would not make                                                              | **Yes** — and quickly. Do not build a career on this one                |
| **2. It was never told**         | Your version, your data, your users, your rules — it could not know, because nobody said                              | **No.** The information was not in the room                             |
| **3. It has barely seen this**   | Whole areas where the training data is thin: a new library, a niche tool, a language few people write on the internet | **No, not for a long time** — and its confidence does not drop to match |

Label every defect you find today with 1, 2 or 3. You will be asked to justify the label.

> [!warning] Category 1 is the trap
> It is the most satisfying to find and the least worth learning from. "The AI wrote a bug" is a story that gets less true every month.
>
> **Categories 2 and 3 are your actual job**, and they are permanent.

> [!mta] Ask what would tell the model it was wrong
> Why is kind 1 shrinking so fast, while kinds 2 and 3 barely move? One reason: a tool improves quickly at anything where **something can automatically tell it that it failed.**
>
> The endpoint in Audit 1 is exactly that. Send an unknown id and get a `500` where a `404` belonged — that is a signal. It can be produced at scale, checked by a machine, and nobody has to read it. There is also one well-known right answer, repeated in a million Express projects.
>
> Now hold that against Audit 4. When it writes Wolof, **what fails?** Nothing runs. No test goes red. The only thing on earth that can tell it that it was wrong is a person who speaks the language — and there are very few of those in what it learned from.
>
> Same tool, same confident voice, two completely different rates of improvement, for that one reason.
>
> **This is the most useful question you can ask about any tool, in any field: what would catch this if it were wrong?** Where the answer is "a test", expect fast improvement and stop treating those finds as achievements. Where the answer is "a person who knows the situation" — that is your job, and it will be for a long time.
>
> Nobody can give you a rate for this, and anyone who offers one is guessing. The direction and the reason are what you can rely on.

---

## 7.3 The four audits

|       | Audit                         | What you do                                                        |
| :---- | :---------------------------- | :----------------------------------------------------------------- |
| **1** | The endpoint under audit      | Find the defects in code you were given, and prove each one        |
| **2** | Advice that breaks projects   | Two real cases from this lab. Explain why the advice was wrong     |
| **3** | Specify, commission, break    | Write the contract *first*, then commission against it and test it |
| **4** | Ask it to speak your language | Find the limit that a better model will not fix                    |

Audit 1 carries the most marks. Audit 4 is the one nobody expects, and the one worth the most afterwards.

**Audits 1 and 3 are code. Audits 2 and 4 are writing** — they are marked on your reasoning, not on anything you build.

### What you hand in for each

This is the whole deliverable. If you are unsure what an audit is asking of you, it is asking for the row below it.

| Audit | What is in your README when you are finished |
| :---- | :------------------------------------------- |
| **1** | A table of defects — each with the exact request and response that proves it, each labelled kind 1, 2 or 3 — plus your fixed endpoint in `index.js` and the requests in `requests/audit.http` |
| **2** | One paragraph on why the `--force` advice is wrong here, the answer your AI gave you, your installed Prisma version, and two sentences on what would have caught it |
| **3** | Your specification *written before you prompted*, the prompt it produced, the code you were given, the sorted table of what went wrong, and your fixes |
| **4** | The three-language table filled in, who judged each row, and a paragraph on whether the tool's confidence changed between languages |

Every row has the same shape: **do the thing, prove what happened, write it down.** Nothing here is marked on your opinion of the code.

---

## 7.4 The rules

1. **You may use AI freely** in this lab. That is the point.
2. **A claim is not a finding.** "This looks wrong" earns nothing. You must **prove** it — run it, show the output, show what the correct behaviour is.
3. **Every finding needs three things:** what is wrong, how you proved it, and how you fixed it.

---

## 7.5 Audit 1 — The endpoint under audit

Below is a `PATCH` endpoint that updates a report's status. It was AI-generated. It runs. It is not correct.

```javascript
app.patch('/api/reports/:id/status', async (request, response) => {
  const { id } = request.params;
  const { status } = request.body;

  const report = await prisma.report.findUnique({ where: { id } });

  const updated = await prisma.report.update({
    where: { id: id },
    data: { status: status }
  });

  response.json(updated);
});
```

### Where it goes

Add it to `index.js` below your other endpoints and above `app.listen` — the same convention as part `05`:

```javascript
// index.js

// ... Pieces 1 to 4 from part 05 (already in your file) ...

// ▼ NEW — Audit 1: the endpoint under audit ▼
app.patch('/api/reports/:id/status', async (request, response) => {
  // ...the code above, exactly as given...
});
// ▲ end of Audit 1 ▲

// ... app.listen(...) — already in your file, stays last ...
```

Paste it **exactly as given** and change nothing yet. You cannot prove a defect in code you have already edited.

Then attack it. **There are at least four defects.** Find them, prove each one with a real request, and only then fix them.

### Set up your proof file

Create `requests/audit.http`, beside the `api.http` you wrote in part `06`, and start it like this:

```http
@baseUrl = http://localhost:3000
@reportId = PASTE_A_REPORT_ID_HERE
@fakeId = 00000000-0000-0000-0000-000000000000

###
// Worked example — the endpoint doing its job (not a defect)
PATCH {{baseUrl}}/api/reports/{{reportId}}/status
Content-Type: application/json

{
  "status": "RESOLVED"
}
```

For `@reportId`, use the `id` of any report you filed in part `06`. It is in the response to Test 2, or in the `Report` table in Beekeeper Studio.

Send the worked example. You should get `200 OK`, with the report returned as `"status": "RESOLVED"` — the endpoint behaving correctly on the one input its author clearly imagined.

Each defect you find gets its own request underneath, in the same pattern. Your evidence then lives in your repository, and whoever marks your work can send exactly the requests you sent.

### How to look for a defect — six probes

**You are not expected to find defects by reading the code.** You find them by sending things and comparing what came back with what should have come back. These six work on any endpoint — this one, the one you commission in Audit 3, and every endpoint you are ever handed.

**You have sent four of them already**, in part `06` §6.3 — the happy path, a thing that does not exist, a required field missing, and the same request twice. Only two of the six are new: a request with no body at all, and a value that is present but outside the rules.

| # | Send this                                                               | What you are looking for                                                                          |
| :-- | :---------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ |
| 1 | **The happy path** — the one input the author clearly imagined          | What *working* looks like. Every other probe is compared against this                             |
| 2 | **An id that does not exist** — use `{{fakeId}}`                        | A `404` and a clear message. A `500`, or a cheerful `200`, is a defect                            |
| 3 | **A required field missing** — send `{}`                                | A `400` that names what is missing. Read the **body**, not only the status code                   |
| 4 | **No body at all** — delete the JSON and the `Content-Type` line        | Whether it answers at all, and what appears in the terminal running your server                   |
| 5 | **A value outside the rules** — `"banana"`, `5`, `true`                 | Whether anything checks. Your database will store nonsense without complaining                    |
| 6 | **The same request twice**                                              | Whether the second one is safe, and whether the answer changes                                    |

Before you send each one, **write down in one line what you expect.** The gap between your expectation and the response is the finding. If you had no expectation, there is nothing to compare and you will stare at a correct-looking answer.

### What one finding looks like, start to finish

This is **not** your endpoint, and it is **not** one of the defects you are hunting. It is here so that you have seen a finished finding before you write your own.

Suppose you had been handed this instead:

```javascript
// EXAMPLE ONLY — do not add this to your project
app.get('/api/agencies/:id/reports', async (request, response) => {
  const reports = await prisma.report.findMany({
    where: { agencyId: request.params.id }
  });
  response.json(reports);
});
```

**Probe 1 — the happy path.** A real agency id returns `200 OK` and its reports. The endpoint works.

**Probe 2 — an id that does not exist.**

```http
GET {{baseUrl}}/api/agencies/{{fakeId}}/reports
```

It answers `200 OK` with `[]`. Nothing crashed. Most people stop here and call it fine.

**Now ask what that answer means.** Send the same request for an agency that really exists but has no reports yet — `200 OK`, `[]`. **The two situations are indistinguishable.**

You have met this before, and you got it right: part `06` Tests 6 and 7 are exactly these two situations, and your own API answers `200` with `[]` for one and `404` for the other. The endpoint above collapses them into a single answer. "There is no such agency" and "this agency has nothing outstanding" come back identical, so a frontend showing *NAWEC: no pending reports* cannot tell you that it just asked about an agency that was never there. That is the dangerous case from §7.1: it runs, it looks sensible, and it is wrong.

**The write-up:**

| Defect                                                                                                  | How I proved it                                                                                                                                                                           | Kind (1/2/3)                                                                                      | How I fixed it                                                                                                             |
| :------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------- |
| An agency id that does not exist returns `200 OK` and `[]` — the same answer as an agency with no reports | `GET /api/agencies/00000000-0000-0000-0000-000000000000/reports` → `200`, body `[]`. Then `GET /api/agencies/<real NAWEC id>/reports` with no reports filed → `200`, body `[]`. Identical | **2** — nobody ever told it that an unknown agency should be a `404`. The code does exactly what it says it does | `findUnique` on the agency first, and `404` with `{"error": "Agency not found"}` when it is missing. Then the list as before |

Notice what the middle column contains: **the exact request, and the exact response.** "It doesn't handle errors" is an opinion and earns nothing. "This request returned this status and this body" is a finding.

### Questions for this endpoint

1. What happens if you send a report ID that does not exist? Try it.
2. What happens if you send `{}` with no `status` at all? Try it — and look closely at what comes back, not only at the status code.
3. What happens if the request arrives with no body at all?
4. What is the `findUnique` line on line 5 actually used for?
5. What happens if you send `{"status": "banana"}`? Should it?
6. Compare this with the error handling you wrote in part `05`. What is missing?

> [!tip] If you are stuck, this is the order to work in
> This is the hardest thing in Layer 1, and being stuck at the start is the normal position, not a sign that you are behind. Nobody audits code by staring at it.
>
> 1. **Send the happy path.** If you have never seen the endpoint work, you cannot recognise it failing.
> 2. **Work the six probes in order**, without thinking about the code at all. Send, read the response, write it down.
> 3. **Write your expectation before each send** — one line is enough.
> 4. **Then read the code once per probe**, asking only one question: *does this line actually do anything?* Line 5 of the endpoint is worth that question.
> 5. **Compare it with your own part `05` code.** You already wrote an endpoint that creates a report, and you handled cases this one ignores. Which ones?
> 6. **You may ask an AI "what could break this endpoint?"** — then you must prove every suggestion yourself, with a request. Some of what it offers will not be true of this code. Separating the real ones from the plausible ones **is the audit.**

### What to record

For each defect, write in your README:

| Defect            | How I proved it                                         | Kind (1/2/3) | How I fixed it          |
| :---------------- | :------------------------------------------------------ | :----------- | :---------------------- |
| *(what is wrong)* | *(the exact request you sent and the response you got)* | *(and why)*  | *(the change you made)* |
|                   |                                                         |              |                         |

**Done when:** your README holds at least four rows with a real request and response in the middle column, `requests/audit.http` holds the request behind each row, the endpoint in `index.js` is fixed — and **the seven tests in `requests/api.http` from part `06` still pass.** A fix that breaks something you had working is not a fix.

> [!mta] Two proved defects beat four opinions
> Look at the marks in §7.9: finding defects carries **20%**, proving them carries **30%**. The proof is worth more than the find.
>
> If you run out of time with two defects, each with the request and response that establishes it, you are in a far better position than someone who listed six things that *look* wrong. In the room and at work, the sentence that ends an argument is not "I think this is broken" — it is "here is the request, here is what came back."

---

## 7.6 Audit 2 — Two pieces of advice that break real projects

These are not hypothetical. Both happened while preparing this lab, and both were verified.

### Case 1 — The tool tells you to break your own project

Run this in your project:

```bash
npm audit
```

npm reports high severity vulnerabilities and tells you to run `npm audit fix --force`. Ask an AI whether you should follow that advice, and write down what it says. It may well agree — npm recommends it, after all.

**Do not run it.** Part `02` §2.7 shows what it actually does: silently downgrades Prisma to a version that no longer matches your client, leaving your project in a state npm itself calls *invalid*. The failure does not appear immediately. It appears later, somewhere else, looking like an unrelated bug.

**Your task:** in one paragraph, explain *why* the advice is wrong here. Not "because the notes said so" — explain the reachability argument in your own words.

### Case 2 — The confident answer that is out of date

Ask an AI: *"How do I connect Prisma to PostgreSQL?"*

For years the standard answer was this — and it is exactly what your own `schema.prisma` contains:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

It works in your project because this lab pins Prisma to version 6.

On **Prisma 7** the same code fails immediately with `P1012 — The datasource property 'url' is no longer supported`.

> [!warning] This example is dated, and that is the point
> The behaviour above was verified while preparing this lab. **Prisma will have moved on since.** The error code, the wording, even whether this is still true, may have changed by the time you read it.
>
> So verify it rather than believing it: run `npx prisma --version`, then check the current Prisma documentation for how a datasource is declared today. If the notes are out of date, you have just done the thing this whole part is teaching — **to the notes.** Tell your lecturer; it gets corrected.
>
> A worked example about stale information has no business being stale and unmarked.

The AI is not lying. That answer was correct for years and is most of what it learned from. It does not know which version *you* installed.

Now check what your AI actually gave you against what you actually have. Run `npx prisma --version`. Did its answer say which version it was written for? Would it work on yours?

**Your task:** record which answer you got, and whether it matched your installed version. Then, in two sentences: *if you had installed Prisma 7 and received the version 6 answer, what would you have needed to know in order to catch it?*

### What to record

Four things, in your README:

1. What your AI said about `npm audit fix --force` — copied in, not summarised
2. One paragraph in your own words on why that advice is wrong **here** — the reachability argument, not "because the notes said so"
3. The connection answer you were given, the output of `npx prisma --version`, and whether the two matched
4. Your two sentences on what you would have needed to know to catch the version 6 answer on Prisma 7

**Done when:** those four are written down and **nothing in your project changed.** This is the one audit where the correct action was to not run the command.

> [!mta] Verification is contact with reality, not more opinions
> When you doubt an answer, the weakest thing you can do is ask again — or ask a different AI. Same training, same assumptions, same blind spots. Two confident answers that agree are not evidence.
>
> What settles it is **contact with reality**: run the command. Read the actual error. Check the version you actually installed. Open the file and look.
>
> Every defect in this lab was found that way. Not by reasoning harder — by running it and reading what came back.

---

## 7.7 Audit 3 — Specify it, commission it, then break it

Audits 1 and 2 judged work that arrived. This one starts a step earlier, with **the part that is actually yours**: deciding what should be built before anyone builds it.

### Step 1 — Choose one capability

For example: *search reports by location*, *count the pending reports for one agency*, *list the three agencies with the most pending reports*. Or your own.

> [!warning] Not "delete a report"
> It is a tempting choice and it is ruled out — by a decision about the product, not about the code. **A Sunu Gox report is a public record.** A citizen filed it, an agency is accountable for it, and nothing in this system quietly makes it disappear. Resolved, not removed.
>
> If your capability would delete or silently rewrite what a citizen reported, choose a different one.

> [!mta] You could not have known that rule, and that is the lesson
> Nothing in the code you have written says reports are permanent. You could read the entire repository and not find it. It is a decision about what this product *is*, and it lives in somebody's head until they say it out loud.
>
> **Specifications are full of constraints that are not in the codebase.** Legal ones, ethical ones, promises made to a client, things that went wrong in 2019 and must not happen again. Nobody can infer them, and that includes any tool you point at the problem.
>
> So when you are the one commissioning work, the question is not only *what should this do?* but **what do I know that whoever builds this does not?** That question is most of the job in Step 2.

### Step 2 — Write the specification. Do not prompt yet

This is **move 1 of the five** from [`00` §0.5](../00-why-this-lab-exists.md) — *define* — and it is the move this lab has never asked you to make. Until now every brief was handed to you.

**Before you open any AI**, write this in your README. It is a contract, and it takes about ten minutes.

| Line                                                                             | Yours |
| :------------------------------------------------------------------------------- | :---- |
| **What it does**, in one sentence                                                |       |
| **Method and route**                                                             |       |
| **Inputs**, and which are required                                               |       |
| **Success** — status code, and the shape of what comes back                      |       |
| **Every failure case** — and the status code for each                            |       |
| **What it must never do**                                                        |       |
| **What the builder cannot know unless I say** — my schema, my versions, my rules |       |
| **How I will prove each line above**                                             |       |

The last two rows before the proof line are **move 2** — *constrain*: what it must never do, and what it could not possibly know unless you tell it.

> [!tip] The failure cases are the specification
> Anyone can write "it deletes a report". The specification is the rest: what happens for an id that does not exist, for an empty body, for an id belonging to a different agency, for the same request sent twice.
>
> Look at your own code from `05` if you need the shape. You already wrote endpoints that answer these questions — you simply were not asked to write the questions down first.

### Step 3 — Now write the prompt, from your specification

**Move 3** — *direct*. A prompt is a specification addressed to a builder; the work was done in Step 2.

Your prompt should carry the contract. If you catch yourself typing *"and it should handle errors properly"*, go back — that sentence means nothing, and it is precisely the kind of instruction that produces code you will later blame the tool for.

### Step 4 — Test it against your own specification

**Move 4** — *verify*. Note how much easier this is than in Audit 1, where you had to invent the standard as you went.

Every line of your contract is a test. Run all of them.

### Step 5 — Sort what you find, honestly

This is the part being marked. Each defect goes in exactly one row:

| Bucket                                 | What it means                                                  | Whose failure                     |
| :------------------------------------- | :------------------------------------------------------------- | :-------------------------------- |
| **It broke a line I specified**        | You said 404; it returned 200                                  | **The tool's**                    |
| **It did something I never specified** | You never mentioned duplicate requests, so nobody handled them | **Yours**                         |
| **It could not have known**            | Your schema, your version, your rules — never supplied         | **Nobody's, until you supply it** |

> [!info] These buckets are not a second scheme — they are §7.2 asked from the other end
> §7.2 asks **why the tool got it wrong**. This table asks **who should have prevented it**. Same defects, two questions:
>
> | Bucket here | Kind in §7.2 |
> | :--- | :--- |
> | It broke a line I specified | **Kind 1** — you told it, and it still failed |
> | It did something I never specified | **Kind 2** — never told, and you were the one who did not tell it |
> | It could not have known | **Kind 2** — never told, and nobody could have told it without knowing your context |
>
> Notice what is missing: nothing here is **kind 3**. Thin training data is not an Express endpoint problem — you meet it in Audit 4, in Wolof.

> [!mta] Most "AI defects" are unwritten requirements
> When you sort honestly, the middle row is usually the biggest — and this surprises almost everyone the first time.
>
> That row is not a story about AI. It is the oldest failure in engineering, and it predates computers: **work delivered to a specification that never existed gets judged against one that only lived in somebody's head.** Contractors, junior colleagues, agencies and models all fail the same way, for the same reason.
>
> The specification you just wrote is the professional instrument for it. Same document, whoever is building.

> [!warning] If you found nothing, you have not finished
> Finding no defect usually means the test was too gentle, not that the code was perfect. Try the empty body. The missing record. The wrong type. Two requests at the same instant. The case with zero results.
>
> "I could not break it" is an acceptable answer **only** if you can list what you tried — and if your specification was thin enough that there was little to break, say that too. It is a more honest finding than a bug.

### Step 6 — Put the constraints where they will be read again

In Step 2 you wrote down **what the builder could not know unless you said it** — your versions, your schema, your rules. You then had to say it in your prompt. Tomorrow you would have to say it again, and the day after that.

People who do this for a living stopped repeating themselves. The constraints go in a document at the root of the repository, which every new session reads before it touches anything:

```markdown
<!-- AGENTS.md -->
# Working on Sunu Gox

## Stack — do not change these
- Node 24, Express 5, Prisma 6. **Prisma stays on 6**: on 7, `url = env("DATABASE_URL")` fails with `P1012`.
- PostgreSQL. Ids are `uuid` strings, never integers.
- Never run `npm audit fix --force`. It downgrades Prisma and breaks the client.

## Rules of this product
- A report is a public record. Nothing deletes a report — `RESOLVED` is how one ends.
- `status` is a free `String`. The only values we use are `PENDING` and `RESOLVED`, in capitals.
- The three agencies are seeded, not created by users: NAWEC, KMC, BAC.
- There is no authentication yet, so no endpoint can know who is asking.

## How to check your work
- Send every request in `requests/api.http`. All seven must still pass.
- An agency that exists with no reports is `200` and `[]`. An agency that does not exist is `404`.
```

**Write your own.** The block above is an example, not a template to copy — half of it is only true because of decisions *you* made in parts `03` to `05`, and the rest you discovered in this part.

`AGENTS.md` is the name most tools now look for; some read `CLAUDE.md` instead. Check what yours reads, and if you are unsure, write one and have the other point at it.

> [!mta] The second time you explain the same thing, write it down instead
> A correction you have to repeat is **a defect in your setup, not in the tool.** The same is true of a colleague who keeps making the same mistake, and the fix is the same: the knowledge is missing from where the work happens, so put it there.
>
> This is move 2 — *constrain* — turned into something durable. A specification directs one piece of work. This document directs every piece of work after it, including the ones you are not in the room for.

Commit it along with the rest of this part.

### What to record

1. Your specification, as written **before** you prompted
2. The exact prompt
3. The code you were given
4. The sorted table from Step 5, with proof for each row
5. Your fixes
6. `AGENTS.md` in the root of your repository, holding the constraints from Step 6

**Done when:** all six are in place, the first five in your README **in that order**, so that anyone reading it can see the specification came first — and every row of your sorted table has a request and a response behind it, exactly as in Audit 1.

---

## 7.8 Audit 4 — Ask it to speak your language

Sunu Gox is for people in Serrekunda, Brikama and Kanifing. A great many of them do not read English comfortably — which is the whole reason the later layers of this project add voice reporting. So at some point this application has to speak **Wolof**, **Mandinka**, or whichever language its users actually use at home.

This is the part of the lab where **you are a better judge than the machine**, and better than your lecturer too.

### The task

Ask your AI to translate the user-facing text of the report form. Give it exactly this and nothing more:

```
Translate these labels for a civic reporting app into Wolof:
"Report a problem", "Where is it?", "Describe the problem",
"Which agency?", "Pending", "Resolved", "Thank you — your report was sent".
```

Then run it again for **Mandinka**. Then run it a third time for a language you speak well — Fula, Jola, Serer, Manjago, whatever that is for you.

> [!info] If you do not speak any of them well enough to judge
> Then this is a two-person task, and that is realistic rather than a workaround. Find someone in the room who does, and have them assess it while you record what they say.
>
> Noticing that **you are not the right person to verify something** is a professional skill in itself, and a rarer one than it should be.

### What to look for

Do not settle for "it looks fine". Check specifically:

- **Is it actually that language**, or a neighbouring one it has more data for?
- **Orthography.** Each of these languages has an official Latin spelling used in The Gambia, and it includes letters that are not on an English keyboard. **Establish what yours actually uses before you judge the output** — ask a teacher, a parent, or anyone who writes it. Then check: did the tool use those letters, substitute English ones, or fall back on French or Senegalese conventions?
- **Real words, or plausible-sounding ones?** A model with thin data will still produce something confident and fluent-looking.
- **Register.** Is this how a person would actually address a stranger about a burst pipe, or is it a stiff dictionary rendering?
- **Loanwords.** Did it reach for an English or French word where a real everyday term exists?
- **Did its confidence change at all** between English and Wolof? Compare how it presented each answer.

> [!info] These notes deliberately do not tell you which letters
> I could have listed them. I have not, for two reasons.
>
> The first is that **I am not the authority on how Wolof or Mandinka is written**, and this is a lab about not asserting things you cannot verify. Writing a confident list of letters I had not checked with anyone would be the exact failure you are here to catch — and you would be right to find it.
>
> The second is that establishing it *is* the work. The people who can confirm it are in this room, or one phone call away.
>
> **If you find these notes have got something wrong about your language, say so.** That is the most valuable thing you could hand back, and it goes into the next version with your name on it.

### What to record

| Language          | What it produced | What is actually wrong | Who judged it |
| :---------------- | :--------------- | :--------------------- | :------------ |
| Wolof             |                  |                        |               |
| Mandinka          |                  |                        |               |
| *(your language)* |                  |                        |               |

Then answer, in a short paragraph:

**Did the tool signal, in any way, that it was less sure about Wolof than about English?**

**Done when:** all three rows of the table are filled in, each one says who judged it, and that paragraph is written. If someone else judged a language for you, name them — that is a credit, not a confession.

> [!mta] Confidence is flat; competence is not
> This is the most important thing in this lab, and Audit 4 is the only place you can feel it rather than be told it.
>
> The model wrote English and Wolof in the **same confident voice**, having seen an enormous amount of one and very little of the other. Nothing in the output warns you which is which. There is no wobble, no hedge, no "I am on thinner ice here".
>
> That is true far beyond language. It sounds exactly as certain about a library released last month as about one used by millions, about your country's procurement rules as about California's, about your company's internal system as about React.
>
> **You cannot detect this by reading more carefully.** You can only detect it by knowing something the model does not — which is why what you know about where you live is professional equipment, not background.

> [!warning] This is not a "gotcha", and it is not a complaint about AI
> Low-resource languages are thin in training data for reasons no one at these companies chose, and the models are improving. The point is not that the tool is bad.
>
> The point is that **its confidence carries no information about its competence**, so you have to supply that judgement — and for Wolof, in Serrekunda, you are far better placed to do it than anyone who built the model.

### Why this is in a database lab

Because the same gap decides technical questions you will meet within a year:

- Run `SHOW SERVER_ENCODING;` on your database. If it answers anything but `UTF8`, Wolof cannot be stored in it correctly — and that cannot be fixed later without dumping and reloading everything. Did you check, or assume?
- Sort your agencies alphabetically. Where does a name beginning `ñ` land — next to `n`, or at the very end? That is **collation**, you chose it by accident, and it decides what every sorted list in the product looks like.
- A citizen searches for `naga`. Should it find a report containing `ñaga`? Accent-insensitive search does not happen by default; somebody has to ask for it.
- If a report arrives as a voice note in Mandinka, what exactly gets stored — the audio, a transcription, both, and in which language does the search work?

You are not being asked to solve those today. You are being asked to notice **how unlikely it is that anyone else asks them for you.** A specialist in internationalisation anywhere in the world knows about collation; the odds of one being on your project, asking about Mandinka specifically, are low. You are the one who is here.

---

## 7.9 What you are being marked on

Not whether you used AI. Whether you can **stand behind** the result.

| Criteria          | What is assessed                                                                                                     | Marks   |
| :---------------- | :------------------------------------------------------------------------------------------------------------------- | :------ |
| **Defects found** | Real defects identified in Audit 1, each one genuine rather than cosmetic                                            | **20%** |
| **Proof**         | Each defect proved with an actual request and response, not asserted                                                 | **30%** |
| **Specification** | Audit 3: a contract written *before* prompting, with the failure cases in it — and an honest sort of what went wrong | **15%** |
| **Fixes**         | Corrections that work, and match the standard of your own code in `05`                                               | **10%** |
| **Kinds named**   | Each defect labelled 1, 2 or 3 — and you can justify the label                                                       | **10%** |
| **Reasoning**     | Audits 2, 3 and 4 explained in your own words, showing you understand *why*, not just *what*                         | **15%** |

> [!danger] "The AI wrote it" is not a defence
> If you submit a fix you cannot explain, you have not passed this lab — you have demonstrated exactly the problem it exists to catch.
>
> You may be asked to walk through any fix out loud. That is not a trap. It is the actual job: the person who signs off on the code is accountable for it, and "the tool said so" has never been an acceptable answer to a user whose data was lost.

---

## Checklist before moving on

- [ ] At least four real defects found in Audit 1, each with the request and response that proves it
- [ ] Every defect labelled **1**, **2** or **3**, with a reason you can defend
- [ ] Your fixes work, and match the standard of your own code in part `05`
- [ ] Audit 2: you can explain in your own words *why* the `--force` advice is wrong here
- [ ] Audit 3: your **specification, written before you prompted** — with failure cases in it
- [ ] Audit 3: your prompt, the code you got, and the sorted table with proof for each row
- [ ] Audit 3: `AGENTS.md` committed, in your own words, with your versions and your product rules in it
- [ ] Audit 4: recorded honestly, including what the tool got wrong
- [ ] `requests/audit.http` holds the request that proves each defect
- [ ] You can walk through any fix out loud without reading from the screen

---

## Commit your work

Run `git status` first — `requests/audit.http` should be listed. It is your proof, so it belongs in the commit.

Use this message exactly — see part `02` §2.14 for why.

```bash
git add . && git commit -m "feat: audit and fix AI-generated status endpoint"
```

```bash
git push
```

**Next:** part `08` — Post-lab challenges.

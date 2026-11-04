---
title: "Why this lab exists"
sidebar: "00 · Why this lab exists"
---
A Kamariana - BotT627

# Why this lab exists

**Read this before anything else.** It is short, and it is the same in every lab we teach.

---

## 0.1 The honest position

You can ask an AI to build almost anything on this syllabus, and it will produce something that works. Faster than you. Faster than us.

If a lab still claims its value is *teaching you to produce that thing*, it is selling something you can already get for free. You would be right to walk out.

So this lab is not built on that claim. Here is what it is built on instead.

---

## 0.2 What actually stopped working

For a long time, education ran on one bundle:

> A lecturer delivers information → the student produces an artefact → the artefact proves they learned.

**Both halves of that are now broken.**

The first half broke years ago. Documentation, YouTube and Stack Overflow deliver information better than any lecture, on demand, at 2am, repeatable.

The second half broke recently. When a machine can produce the artefact, **the artefact is no longer evidence of anything.** A finished assignment proves nothing about the person who submitted it.

Anyone still teaching as though that bundle works is wasting everybody's time, including their own.

---

## 0.3 What did not break — and is now worth more

Four things got *scarcer*, not cheaper, when answers became free.

### 1. Sequencing

AI answers the question you ask. It does not tell you **what to learn, in what order, or what to safely skip.**

Ask it to teach you backend development and you get a thousand true facts with no spine. What you need is a path: this before that, this matters, this does not, you are ready for the next thing now. That is a curriculum, and it is worth more when infinite answers are free, not less.

### 2. Certification

Employers need someone to vouch that you are competent. They need this **more** than before — because your output stopped being proof.

If anyone can generate a portfolio, a portfolio is no longer a credential. Someone has to have watched you work, questioned you, and been willing to put their name to the answer. That is what an institution is for.

### 3. Judgement transfer

This one is the hardest to get anywhere else.

There is a category of knowledge that consists of **knowing what to be suspicious of.** That a tool can confidently recommend a fix that breaks your project. That a "high severity" warning can be irrelevant. That code which runs can still be wrong.

You cannot get this by asking, because *you do not know to ask.* It is transferred by watching someone who has been burned, and by getting burned yourself under supervision. That is apprenticeship, and it is the oldest thing in this document.

It is also learnable rather than mystical. Part `07` gives it a shape: **three kinds of wrong**, only one of which gets better as the models do. Knowing which kind you are looking at is most of the skill.

### 4. Someone who notices you stopped

No chatbot has ever noticed that you went quiet for two weeks and asked why.

Deadlines, a cohort moving at the same pace, someone who knows your name and can see you struggling — this is unglamorous and completely unautomated. It is also, for most people, the difference between finishing and not.

---

## 0.4 What that means for how this lab runs

Because the artefact is no longer evidence, this lab is built differently:

| | How it works here | Where you will meet it |
| :--- | :--- | :--- |
| **Using AI** | Allowed, openly, throughout. Banning it would be unenforceable and would train you for a world that no longer exists | Everywhere. Part `07` makes it the subject |
| **What is graded** | Not what you submitted — **what you can explain and defend about it** | `01` §1.12, the rubric |
| **Being questioned** | Expect to be asked to walk through your own code out loud. This is not a trap; it is the job | Any part, at any time |
| **Evidence of work** | Your commit history, showing the work built in stages rather than one submission at midnight — and the request files that prove each claim you make | `02` §2.14, `06` §6.3, and every part after them |
| **A dedicated part** | You will be given AI-generated code containing real defects and asked to find them, prove them, and fix them | Part `07` |

Every row above is a claim this lab has to keep. The third column is where you can check that it does.

> [!mta] What this lab is actually selling
> Not the ability to produce working code. That is now cheap, and getting cheaper.
>
> The ability to **decide whether code is correct**, to **say why**, and to **stand behind that judgement** when something breaks at two in the morning and a real person is affected.
>
> That is what "the tool said so" cannot buy, and it is the whole of what we can give you.

---

## 0.5 The job is changing its name

What you are training for is drifting away from **software engineering** and towards something people are starting to call **agentic engineering**. It is worth naming, because the two ask different things of you.

| | Software engineering | Agentic engineering |
| :--- | :--- | :--- |
| **Your hands are on** | the code | the problem |
| **You know** | how every line works, because you wrote it | why every decision was made, because you made it |
| **The bottleneck is** | how fast you can build | how well you can specify and how honestly you can verify |
| **Failure looks like** | code that does not run | code that runs beautifully and solves the wrong problem |

It used to be that you built the thing with your own hands. You knew it intimately because there was no other way to have it. Increasingly the work is: *here is the problem I want solved, here are the constraints, here is roughly how I would approach it* — and then judging honestly what comes back.

### The five moves

Directing a build well is a skill, and it is not the same skill as building. It has a shape:

1. **Define.** What problem, for whom, and what does *done* actually mean? Most bad output traces back to a request nobody could have satisfied.
2. **Constrain.** What must it not do, and what could it not possibly know — your version, your users, your language, your rules?
3. **Direct.** Say how, not only what. "Build me an endpoint" and "build me an endpoint that returns 404 for an unknown id and 400 for an empty body" produce different work.
4. **Verify.** Contact with reality. Send the request. Send the empty body. Read what actually came back.
5. **Own it.** You sign the result. Nobody downstream cares who typed it.

Moves 2 and 4 are most of what this lab already teaches. Moves 1, 3 and 5 are what parts `07` to `09` train — where you commission code, then have to prove whether it is right.

**Move 4 has a concrete shape here**, and you will meet it three times: as the seven tests you send in part `06`, as the six probes you point at somebody else's endpoint in `07` §7.5, and as a specification you write *before* anyone builds anything in `07` and `08`. Same move, three levels of difficulty — the last one is the only one nobody can do for you.

> [!mta] The approach changed; the principles did not
> This is the whole reason a lab like this still exists.
>
> A foreign key is still the truth about a relationship. A `201` still means *created*. A unique constraint still refuses a duplicate at the only level that cannot be bypassed. Those principles are exactly what you specify **against** and verify **with** — they are the content of moves 1 to 4.
>
> Someone who never learned them is not doing agentic engineering. They are typing wishes and accepting whatever arrives, and they will find out which one they were doing on the day it matters.

> [!warning] This is where things are going, not where they have arrived
> Nobody knows the pace, and anyone who gives you a timeline is guessing. Plenty of work is still done the old way, and will be for years.
>
> What is already true is that **you can only direct what you could recognise, and only verify what you understand.** That part is safe to build a career on whichever way the rest of it goes.

---

## 0.6 What we will not pretend

We do not know how long this stays true. Tools that check their own work are improving quickly, and anyone who tells you they know the timeline is guessing.

What we would bet on: **judgement, accountability and knowing your own context outlast syntax by a long way.** What we would not bet on: any particular number of years.

You are entitled to that honesty, because you are spending your time and money on the answer.

---

**Next:** part `01` — Introduction.

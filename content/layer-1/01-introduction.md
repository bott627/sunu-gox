---
title: "Building \"Sunu Gox\" (Our Neighbourhood Civic Alert API)"
sidebar: "01 · Building \"Sunu Gox\" (Our Neighbourhood Civic Alert API)"
---
A Kamariana - BotT627

# Building "Sunu Gox" (Our Neighbourhood Civic Alert API)

---

## 1.1 The problem

In our communities, civic issues happen daily — a water pipe bursts in Serrekunda, or an animal carcass is left on the road in Brikama. Often, agencies like **NAWEC** or the **Area Councils** do not find out about these problems until days later, because there is no direct channel for citizens to report them.

## 1.2 Our mission

You will build a **backend API** that lets citizens report local issues to the agency responsible for fixing them.

You will probably use AI somewhere in that. Almost everyone does now, and this lab is written on that assumption rather than pretending otherwise.

Which means the API is not the achievement. **The achievement is the decisions inside it**, and those are yours:

- What are the tables, and how do they relate?
- Which side does the foreign key belong on?
- What should the server answer when the request is fine but the data is not?
- What happens when someone sends something you did not expect?

Nothing can hand you those decisions, because they depend on the problem in front of you. You will be asked to defend them.

To manage this data cleanly we will implement a **One-to-Many (1:N)** database relationship. Consider the following business rule:

- **One Agency** can have **many Reports** filed against it.
- **Each Report** belongs to exactly **one Agency**.

> [!info] Where the name comes from
> **Sunu Gox** is Wolof: *sunu* = "our", *gox* = "neighbourhood". Our Neighbourhood.
>
> In Wolof spelling the letter **x** is the throaty sound in *loch* or *Bach* — so it is pronounced **"sunu gokh"**, not "gocks".

## 1.3 Three ways to take this lab

- **Self-paced:** each part shows an estimated time in §1.5. Go at your own speed — nothing here expires.
- **With a cohort:** follow the weekly schedule, share your work, and compare findings. Struggling together is faster than struggling alone.
- **In a classroom:** a lecturer sets the pace and the deadlines. The material is the same, and so is the marking.

### Where this sits

Modern web work has four quarters: **the frontend**, **the backend**, **the database**, and **operations**. This lab is the backend and the database together — the half nobody sees, where the data actually lives and where getting it wrong is expensive.

If you have already done the frontend quarter — HTML, CSS and JavaScript, building pages somebody can look at — **this is the quarter that gives those pages something true to show.** If you have not, you lose nothing by starting here: everything in this lab is tested with requests rather than with a browser interface, so no frontend knowledge is assumed at any point.

---

## 1.4 How to read these labs

Throughout the lab you will see coloured boxes. Each means something specific, so learn them once:

| Box         | Meaning                                                                    |
| :---------- | :------------------------------------------------------------------------- |
| **Info**    | Background — why something works the way it does. Skippable, but it helps  |
| **Tip**     | A shortcut, or a way to save yourself time                                 |
| **Success** | A checkpoint. If you see this result, you are on track                     |
| **Warning** | A common mistake. Read it *before* you hit it                              |
| **Danger**  | Doing this will break your project or expose a password. Do not skim these |
| **MTA**     | **Major Take Away** — the transferable idea. These outlast the syntax      |

### Finding your way around

Each part is split into numbered sections that match the part's number — part `03` has §3.1, §3.2 and so on.

**`§` is the section sign.** It is shorthand for the word "section", used in law and academic writing. So **`02` §2.14** means *part 02, section 2.14*. When you see it, you are being pointed at an exact place, not a vague one.

**"Terminal" means Git Bash if you are on Windows.** These labs say *terminal* for the window where you type commands. On macOS and Linux that is the app called Terminal. **On Windows it is Git Bash**, which you install in part `02` — not Command Prompt and not PowerShell, both of which handle quotes differently and will fail on several commands later on.

> [!tip] The Study Buddy, on the website
> If you are reading these labs on the site rather than on paper, **highlight any passage and an "Ask AI" chip appears.** A panel slides in and offers to go deeper, explain it more simply, give a different analogy, or quiz you on what you just read.
>
> It writes the question for you, **shows you the question before it sends it**, and lets you edit it. Read those prompts. Learning what a good question to an AI looks like is worth as much as the answer, and you will use it for the rest of your career.
>
> **It will not do your exercises.** The prompt tells the tool to coach with hints and questions instead of writing solutions. That is not a restriction on you — you may use your own AI freely, as part `07` says at length. It is what this particular tool is for: understanding, which is the thing being marked.

> [!mta] What MTA boxes are for
> Most of what you type this term will be out of date sooner or later. The MTA boxes will not be. They mark the ideas that carry across languages, frameworks and jobs — the reasons behind the steps rather than the steps themselves.
>
> If you go back over nothing else, go back over these. Some of you will sit an exam on this material; some of you are here without one. Either way, the MTA boxes are the part still worth having in five years, when the commands have changed and the tool you used to write the code has been replaced twice.

---

## 1.5 The parts

| Part | What it covers              | Roughly        |
| :--- | :-------------------------- | :------------- |
| `00` | Why this lab exists         | 10 min         |
| `01` | Introduction — you are here | 20 min         |
| `02` | Setup and installation      | **1½–2 hours** |
| `03` | Designing the database      | 45 min         |
| `04` | Seeding the agencies        | 45 min         |
| `05` | Building the API            | 1½ hours       |
| `06` | Testing your API            | 1 hour         |
| `07` | Auditing AI code            | 1½ hours       |
| `08` | Post-lab challenges         | 3 hours        |
| `09` | Exercise                    | 4 hours        |

Around **15 hours** in total, and the times assume you are reading properly rather than pasting.

> [!warning] Part `02` is the one that surprises people
> Installing four tools, creating a GitHub account and connecting Git to it takes far longer than it sounds — and almost all of it is downloading, which depends on your connection rather than your ability.
>
> **Do part `02` before anything else, on the best connection you can find.** If you are attending a session, do it before you arrive. Nobody has ever regretted this; plenty have lost a session to it.

Work through them in order. Do not skip ahead — each part assumes the previous one succeeded.

---

## 1.6 Context and objectives

In introduction to Databases and Web Programming, you might have learned how to design isolated tables, write raw SQL queries using MySQL, and build basic **frontend** interfaces using HTML, CSS, and JavaScript. In this practical lab, we bridge those worlds.

We are building a real-world civic reporting API. Citizens report infrastructure issues — busted NAWEC pipes, uncollected Council waste — directly to the responsible agency.

### Learning objectives

This is a quick start to designing and building a real API, end to end. By the end of the lab you will be able to:

1. **Turn a real-world situation into a relational data model** — decide what the tables are, and how they relate.
2. **Generate and migrate a PostgreSQL database** from that model using **Prisma ORM**, without writing the `CREATE TABLE` statements yourself.
3. **Design and build REST endpoints in Express**, choosing the correct HTTP status code for each outcome.
4. **Map a One-to-Many (1:N) relationship** and replace a raw SQL `JOIN` with Prisma's `.findUnique({ include: ... })`.
5. **Distinguish what your application validates from what the database enforces** — and know why you need both.
6. **Work in version control the way a team does** — staged commits, meaningful messages, secrets kept out of the repository.
7. **Judge code you did not write** — including AI-generated code — by finding its defects, proving them with real requests, and fixing them.

Objectives 1, 2 and 4 are the database half. Objectives 3 and 5 are the API half. Objective 6 is how professionals do all of it.

**Objective 7 is the one that makes the rest of it defensible.** Producing working code is no longer scarce; deciding whether code is correct is. It has a lab of its own — part `07` — and its own marks.

## 1.7 The database design

Two tables. One relationship. That is the whole design.

```prisma
model Agency {
  id      String   @id @default(uuid())
  name    String   @unique   // e.g. "NAWEC", "Kanifing Municipal Council"
  reports Report[]           // 1:N relationship indicator
}

model Report {
  id          String   @id @default(uuid())
  location    String   // e.g. "Serrekunda Market"
  description String   // e.g. "Busted water main pipe"
  status      String   @default("PENDING")
  createdAt   DateTime @default(now())

  // Relationship fields
  agencyId String
  agency   Agency @relation(fields: [agencyId], references: [id])
}
```

Read it out loud: an Agency **has many** Reports; a Report **belongs to** one Agency. The `agencyId` column on `Report` is the foreign key — the same concept you wrote by hand in Database I, now declared instead of typed.

---

## 1.8 The endpoints you will build

| Method | Route                       | Purpose                                             |
| :----- | :-------------------------- | :-------------------------------------------------- |
| `GET`  | `/api/agencies`             | List all agencies and their IDs                     |
| `POST` | `/api/reports`              | File a new civic report against an agency           |
| `GET`  | `/api/agencies/:id/reports` | One agency's dashboard, with all its reports nested |

That third route is the point of the whole lab. It replaces a SQL `JOIN` with one line of Prisma.

---

## 1.9 This is not a toy problem

There is an international standard for exactly what you are building. It is called **Open311** — an open specification for citizen-reported, non-emergency civic issues. Cities run it in production to accept reports from the public and route them to whoever is responsible for fixing them.

It is used by Chicago, Toronto, San Francisco, Washington DC, Boston and New York, and by cities across Germany and the UK. It is not only a rich-country standard: the **World Bank** has supported Open311 deployments in the Philippines, Mozambique and Tanzania.

The current version of the API is called **GeoReport v2**. Compare its Service Request object with the `Report` model you are about to build:

| Open311 GeoReport v2     | Sunu Gox `Report`         |                            |
| :----------------------- | :------------------------ | :------------------------- |
| `service_request_id`     | `id`                      | The unique ID              |
| `description`            | `description`             | What is wrong              |
| `address`                | `location`                | Where it is                |
| `status`                 | `status`                  | Open or closed             |
| `requested_datetime`     | `createdAt`               | When it was filed          |
| **`agency_responsible`** | **`agencyId` → `Agency`** | **Who must fix it**        |
| `lat` / `long`           | *(not yet)*               | Coordinates for a map      |
| `media_url`              | *(not yet)*               | Photo of the problem       |
| `service_code`           | *(not yet)*               | What *kind* of issue it is |

Same concepts, same names, fewer fields. That `agency_responsible` row is why this lab calls the model `Agency` rather than something invented — you are learning the vocabulary the industry already uses.

Two differences worth noticing:

- **Open311 allows only two statuses:** `open` and `closed`. We use `PENDING` and `RESOLVED`. Ours is more readable; theirs is stricter. Neither is wrong — but a standard has to be unambiguous across hundreds of cities, so it picks two words and stops.
- **Open311 separates the *type* of issue (`service_code`) from the *agency* that fixes it.** We merge them: "NAWEC (Water & Electricity)" tells you both. That is a deliberate simplification for a two-table lab. Ask yourself what would have to change in the schema to separate them.

What you build in this lab is a simplified version of a specification real governments run today.

---

## 1.10 "Why learn this when AI can build it?"

The mission said you will probably use AI. So ask the obvious follow-up — it is the right question, and you deserve a straight answer rather than a lecture.

**The concession first.** If you want a working API that looks finished, an AI will produce one faster than you can, and faster than we can. That part of the job has changed permanently, and anyone who tells you otherwise is protecting their own subject.

Here is what remains, and why this lab is built the way it is.

During the preparation of these notes, an AI was asked to check something routine about installing Prisma. It gave a confident answer that was **wrong** — not because it was careless, but because the correct answer changed with a recent version and most of what it had read was the old way. Following that advice breaks this project at part `3`, and the failure appears later, somewhere else, looking like an unrelated problem.

Two separate tools — and the AI — all recommended a command that silently damages the install. You will meet that exact situation in `part 2` 1.7, and you will be shown the evidence.

> [!mta] What you are actually competing with
> **Yes — AI can check its own work, and it is getting better at it. I am not going to tell you it cannot.**
>
> But notice what actually caught the bug: not thinking harder, **running it**. And someone had to know to run it. Right now that is you. How long that stays true, I genuinely do not know — anyone who tells you they do is guessing.
>
> What I can tell you is that you are not competing with the AI. You are competing with **everyone else who has the same AI**. The difference between you and them is what you can tell it to do, and whether you would notice if it were wrong.

That is the whole reason this lab makes you run the migration yourself, read the SQL it generated, and deliberately send a broken request to watch the database refuse it. Not so you can memorise the commands — you can look those up, and so can a machine. So that when something confidently tells you the wrong thing, **you have seen the right thing with your own eyes** and can tell the difference.

---

## 1.11 Before the lab — required

Work through **§§2.0 to 2.5 of the next part, Setup and Installation, before you arrive.** That means:

- Install Node 24+, PostgreSQL, Git and Beekeeper Studio
- Install the **REST Client** extension in VS Code — part `06` §6.1 shows how
- Create a **GitHub account** and verify your email address
- Connect Git to GitHub (`gh auth login`, or a Personal Access Token)

Already have some of these? Good — just update them to the current version and check them off.

These downloads are large. Doing them over shared wifi during the session will cost you most of the lab. Students who arrive prepared finish; students who do not, usually do not.

You will create a **GitHub repository first** and build the project inside it, committing at the end of every step with the exact message given in that part. Your commit history is part of what you submit — it shows the work being built in stages.

---

## 1.12 Assessment rubric

Your submission is your **GitHub repository**. It is assessed against objectives 1–6.

**You may use AI to produce any of it.** That is not what is being marked. What is being marked is whether the decisions are right, and whether you can account for them.

| #   | Criteria                              | What is assessed                                                                                                                                                            | Verified by | Marks   |
| :-- | :------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------- | :------ |
| 1   | **Data model & migration**            | `schema.prisma` models `Agency` and `Report` with a correct 1:N relation. `prisma migrate dev` creates both tables and the foreign key without errors.                      | Repository  | **20%** |
| 2   | **Data integrity — seeding**          | `seed.js` runs successfully and populates the three agencies. It uses `upsert`, so running it twice does not fail.                                                          | Repository  | **15%** |
| 3   | **API design & status codes**         | `POST /api/reports` creates a report and returns **201**. Missing fields return **400** with a useful message.                                                              | Evidence    | **20%** |
| 4   | **ORM relationship**                  | `GET /api/agencies/:id/reports` uses `include` to nest the reports. Returns **404** for an unknown agency, and an **empty array** — not an error — for one with no reports. | Evidence    | **25%** |
| 5   | **Application vs database integrity** | A fake `agencyId` is rejected by the foreign key constraint and no report is written — **and you can say which check caught it, and why**.                                  | Explanation | **10%** |
| 6   | **Version control**                   | Repository private with your lecturer added. Commits staged step by step using the given messages. **No `.env` or `node_modules` committed.**                               | Repository  | **10%** |

> [!danger] Any criterion can be turned into a question
> The "Verified by" column says how each criterion is *normally* checked. It is not a limit.
>
> **You may be asked to explain any line of your submission out loud.** A criterion you cannot account for scores zero, whatever is in the repository — and a criterion you can explain well is not damaged by having used AI to write it.
>
> This is deliberate, and it is the fairest rule available. It does not ask where your code came from, because that question cannot be answered honestly or checked reliably. It asks the only thing that actually matters to an employer: **do you understand what you are handing over?**

> [!success] You get a second attempt — use it
> If you cannot explain something when asked, you are not finished. **You may come back and explain it once more**, in the same session or the next, and the marks are restored in full.
>
> That is not leniency. It is the point. Being asked a question you cannot answer, then going away and working out the answer, *is* the learning — and it is worth more than having been able to answer it first time.
>
> Nobody is trying to catch you out. Come back and explain it.

> [!warning] Criterion 6 is the easiest to lose and the easiest to keep
> Ten per cent is decided entirely by habits that cost you five seconds each. Commit at the end of every part with the message given, and never commit your `.env`. Students who leave everything to one commit on the last night lose these marks for no reason.

> [!info] Where the marks concentrate
> Criterion 4 carries the most weight because it is the centre of the lab — the single line that replaces a SQL `JOIN`.
>
> Criterion 5 carries fewer marks but is the idea most worth keeping: your code and your database defend the data in **different ways**, and a real system needs both. It is also the criterion most often asked about out loud.

> [!mta] What "your work" means now
> It used to mean the work your hands produced. That definition no longer separates anybody from anybody.
>
> Here it means the work **you can stand behind** — the decisions you made, the reasons you can give, and the defects you would have caught. That is the version of it an employer is buying, and it is the version this rubric measures.

**Objective 7 is assessed separately**, in part `7` — auditing AI code — which carries its own rubric. That lab marks you on defects found, proof, fixes and reasoning. Nothing there depends on whether you used an AI; all of it depends on whether you can stand behind the result.

---

**Next:** part `02` — Setup and installation.


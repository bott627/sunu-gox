---
title: "Testing your API"
sidebar: "06 · Testing your API"
description: "prove all three endpoints work, and watch the database reject bad data."
---
A Kamariana - BotT627

# Testing your API

**Goal:** prove all three endpoints work, and watch the database reject bad data.
**You are done when:** all seven requests in `requests/api.http` return what this part says they should, and the file is committed.

Keep `npm run dev` running in a terminal for the whole of this part. You will send every request from VS Code, so **one terminal is enough.**

---

## 6.1 Set up REST Client

In part `05` your browser was the client. That works for a `GET`, but typing an address into a browser cannot send a `POST` with a JSON body. To test properly you need a client that can send any request you write.

This lab uses **REST Client**, an extension for VS Code. You write requests as plain text in a file, click to send them, and read the response beside your code.

> [!info] Why a file of requests, and not a click-around tool?
> Many tools keep your requests inside the tool. REST Client keeps them in a **file in your project** — so they are committed with your code, kept in your history, and can be sent again by anyone who clones your repository, including whoever marks it.
>
> Your tests become part of your work, not something that happened once on your screen.

### Install the extension

1. Open VS Code.
2. Open the **Extensions** panel: `Ctrl + Shift + X` on Windows and Linux, `Cmd + Shift + X` on macOS.
3. Search for **REST Client**.
4. Choose the one published by **Huachao Mao** — its ID is `humao.rest-client` — and click **Install**.

> [!warning] Check the publisher
> The search may show more than one extension with a similar name. These notes use **REST Client by Huachao Mao**. If you install a different one, none of the steps below will match what you see.

### Create the requests folder

Your requests get a folder of their own, so they never mix with your server code. Create it in the root of `sunu-gox-api`, beside `package.json`:

```
sunu-gox-api/
├── node_modules/
├── prisma/
├── requests/              <-- NEW folder
│   └── api.http           <-- NEW: every test in this part
├── .env
├── .gitignore
├── index.js
├── package.json
└── seed.js
```

In VS Code's file list, right-click an empty area → **New Folder…** → type `requests`. Then right-click the `requests` folder → **New File…** → type `api.http`.

**The name must end in `.http`.** That ending is how VS Code knows to hand the file to REST Client. A file called `api.txt`, or just `api`, will never show a **Send Request** link.

### How a request is written

Every request in the file follows the same pattern:

```http
###
# A comment describing the request
POST http://localhost:3000/api/reports
Content-Type: application/json

{
  "location": "Bakau"
}
```

| Line                             | What it is                                                                                        |
| :------------------------------- | :------------------------------------------------------------------------------------------------ |
| `###`                            | Separates one request from the next. Every request starts with one                                |
| `# A comment ...`                | A comment, for you. Lines starting with `#` or `//` are not sent                                  |
| `POST http://...`                | The **request line**: the method, then the address — exactly the two things that make an endpoint |
| `Content-Type: application/json` | A **header**. One per line, directly under the request line                                       |
| *(the blank line)*               | **Required.** It marks where the headers end and the body begins                                  |
| `{ ... }`                        | The **body** — the JSON that `express.json()` turns into `request.body`                           |

> [!warning] The blank line is not optional
> REST Client treats every line after the request line as a header, **until it reaches an empty line**. Leave the blank line out, and your JSON is read as more headers instead of as the body — so the body you can see in your file is never sent.

### Send your first request

Put this in `requests/api.http`:

```http
@baseUrl = http://localhost:3000

###
# Check the server is answering
GET {{baseUrl}}/api/agencies
```

`@baseUrl` is a **variable**: defined once on its own line, used anywhere as `{{baseUrl}}`. If your port ever changes, you change one line instead of every request.

With `npm run dev` still running, look just above the `GET` line: a small **Send Request** link has appeared. Click it — or put your cursor inside the request and press `Ctrl + Alt + R` (`Cmd + Alt + R` on macOS).

The response opens in a panel beside your file: the status line first, then the headers, then the JSON body.

> [!success] Checkpoint
> You see `HTTP/1.1 200 OK` and your three agencies. REST Client works — and you did not need a second terminal to send it.

> [!tip] No Send Request link?
> Check three things: the file name ends in `.http`; you have saved the file; and the language shown at the bottom right of VS Code says **HTTP**. If it says Plain Text, click it and choose **HTTP**.

> [!warning] A response you do not recognise? Check the port
> If the response is a web page you have never seen — HTML instead of your agencies — **another program on your computer is already using port 3000**, and it answered instead of your API.
>
> Look at the terminal running `npm run dev`. If it shows `EADDRINUSE: address already in use :::3000`, your server never started. Stop the other program, or change `PORT` in `index.js` and `@baseUrl` in `requests/api.http` to the same new number — `3001` is fine.

---

## 6.2 Save your agency ids as variables

Most of the tests need a real agency id. Rather than pasting a UUID into every request, store the ids once at the top of the file.

Copy two UUIDs from the response you just received — NAWEC's and BAC's — and change the top of `requests/api.http` to this:

```http
@baseUrl = http://localhost:3000
@nawecId = PASTE_NAWEC_ID_HERE
@bacId = PASTE_BAC_ID_HERE
@fakeId = 00000000-0000-0000-0000-000000000000
```

Replace the two `PASTE_…` values with your own UUIDs. Leave `@fakeId` exactly as it is: it is a correctly shaped id that belongs to no agency, and two of the tests rely on that.

> [!info] Your ids are not the same as anyone else's
> Every student's database generated its own UUIDs in part `04`. That is why these notes cannot give you the ids — and why a classmate's `requests/api.http` will not work against your database until those two lines are changed.

---

## 6.3 The seven tests

Add each request below to `requests/api.http`, **underneath** the ones already there, then send it. Work in order: each one proves something different, and Test 4 matters most.

### Test 1 — List the agencies

```http
###
# Test 1 — List the agencies
GET {{baseUrl}}/api/agencies
```

**Expected:** `200 OK` and a JSON array of three agencies, each with its UUID.

If you get an empty array `[]`, your seed did not run. Go back to part `04`.

---

### Test 2 — File a report

```http
###
# Test 2 — File a report
POST {{baseUrl}}/api/reports
Content-Type: application/json

{
  "location": "Serrekunda Market, near the mosque",
  "description": "A main clean-water pipe has burst and is flooding the street.",
  "agencyId": "{{nawecId}}"
}
```

`{{nawecId}}` sits inside quotes because it becomes a JSON string once REST Client swaps in your real id.

**Expected:** `201 Created`, and the new report — with `"status": "PENDING"` and a `createdAt` timestamp you never sent.

Those two fields came from `@default(...)` in your schema. The database wrote them, not your code.

---

### Test 3 — Missing fields are rejected

```http
###
# Test 3 — Missing fields are rejected
POST {{baseUrl}}/api/reports
Content-Type: application/json

{
  "location": "Westfield"
}
```

**Expected:** `400 Bad Request` and `Missing required fields: location, description, agencyId`.

Nothing reached the database. Your JavaScript stopped it.

---

### Test 4 — The important one: a fake agency id

```http
###
# Test 4 — A fake agency id
POST {{baseUrl}}/api/reports
Content-Type: application/json

{
  "location": "Bakau",
  "description": "Streetlight has been out for two weeks now.",
  "agencyId": "{{fakeId}}"
}
```

**Expected:** `400 Bad Request` and `Invalid agencyId — that agency does not exist.`

**Stop and think about what just happened.** That request had every required field, so your JavaScript validation passed it. It was PostgreSQL that refused — the foreign key constraint you declared in your schema would not allow a report to point at an agency that does not exist.

This is the concept: **your application code can be wrong, and the database still protects the data.** A report with no valid agency is impossible to create, not merely discouraged.

Confirm it in Beekeeper Studio: open the `Report` table. The report from Test 2 is there. There is no ghost report from Test 4.

---

### Test 5 — The agency dashboard

```http
###
# Test 5 — One agency and its reports
GET {{baseUrl}}/api/agencies/{{nawecId}}/reports
```

**Expected:** `200 OK` and:

```json
{
  "id": "3f2a91b4-...",
  "name": "NAWEC (Water & Electricity)",
  "reports": [
    {
      "id": "...",
      "location": "Serrekunda Market, near the mosque",
      "description": "A main clean-water pipe has burst and is flooding the street.",
      "status": "PENDING",
      "createdAt": "2026-08-15T09:30:00.000Z",
      "agencyId": "3f2a91b4-..."
    }
  ]
}
```

The agency, with its reports **nested inside it**. One HTTP request, one line of Prisma, no `JOIN` written by hand.

---

### Test 6 — An agency with no reports

```http
###
# Test 6 — An agency with no reports
GET {{baseUrl}}/api/agencies/{{bacId}}/reports
```

**Expected:** `200 OK` — the agency, with `"reports": []`.

An empty array, not an error. BAC exists; nobody has filed a report against it yet. Those are different things, and your API says so correctly.

---

### Test 7 — An agency that does not exist

```http
###
# Test 7 — An agency that does not exist
GET {{baseUrl}}/api/agencies/{{fakeId}}/reports
```

**Expected:** `404 Not Found` and `Agency not found`.

Compare Test 6 and Test 7 carefully:

| Situation                 | Status | Body               |
| :------------------------ | :----- | :----------------- |
| Agency exists, no reports | `200`  | `"reports": []`    |
| Agency does not exist     | `404`  | `Agency not found` |

Getting this distinction right is what separates a working API from a correct one.

> [!tip] Hold on to this distinction
> In part `07` you will be handed an endpoint that collapses these two rows into **one** answer — the same `200` and the same empty list for both situations. It runs, it looks sensible, and it is wrong. Recognising that is the first finding you will write.

### What the seven tests have in common

You were given these seven. The useful thing is the pattern underneath them, because nobody will hand you the list again:

| Test              | What kind of input it really is                        |
| :---------------- | :----------------------------------------------------- |
| 1, 2, 5           | **The happy path** — the input the code was written for |
| 3                 | **A required field missing**                            |
| 4                 | **A value that breaks a rule** — an agency id with no agency behind it |
| 6                 | **The empty case** — nothing to return, and that is not an error |
| 7                 | **A thing that does not exist**                         |

Two more appeared without being numbered: **the same request twice** (the tip under §6.4 about filing two reports) and **no readable body at all** (the "Try this" below).

**That list is the method.** Part `07` §7.5 turns it into six probes you point at code somebody else wrote — by then you will have sent four of them already.

---

## 6.4 Check your finished file

Your `requests/api.http` should now read like this, with your own two ids at the top:

```http
@baseUrl = http://localhost:3000
@nawecId = PASTE_NAWEC_ID_HERE
@bacId = PASTE_BAC_ID_HERE
@fakeId = 00000000-0000-0000-0000-000000000000

###
# Check the server is answering
GET {{baseUrl}}/api/agencies

###
# Test 1 — List the agencies
GET {{baseUrl}}/api/agencies

###
# Test 2 — File a report
POST {{baseUrl}}/api/reports
Content-Type: application/json

{
  "location": "Serrekunda Market, near the mosque",
  "description": "A main clean-water pipe has burst and is flooding the street.",
  "agencyId": "{{nawecId}}"
}

###
# Test 3 — Missing fields are rejected
POST {{baseUrl}}/api/reports
Content-Type: application/json

{
  "location": "Westfield"
}

###
# Test 4 — A fake agency id
POST {{baseUrl}}/api/reports
Content-Type: application/json

{
  "location": "Bakau",
  "description": "Streetlight has been out for two weeks now.",
  "agencyId": "{{fakeId}}"
}

###
# Test 5 — One agency and its reports
GET {{baseUrl}}/api/agencies/{{nawecId}}/reports

###
# Test 6 — An agency with no reports
GET {{baseUrl}}/api/agencies/{{bacId}}/reports

###
# Test 7 — An agency that does not exist
GET {{baseUrl}}/api/agencies/{{fakeId}}/reports
```

> [!tip] Sending Test 2 twice files two reports
> Every time you click **Send Request** on Test 2, a new report is created — that is `POST` behaving exactly as part `05` said it would. Extra copies do no harm here. If you want a clean start, run `node seed.js` again: it will not remove reports, but it will not duplicate your agencies either.

---

## Try this

Break it on purpose, twice. Both failures are far easier to recognise once you have caused them yourself.

### Break the body reader

In `index.js`, comment out the middleware from part `05`:

```javascript
// app.use(express.json());
```

Save, then send **Test 2** again.

REST Client shows `500 Internal Server Error`. Your server terminal shows the real reason:

```
TypeError: Cannot destructure property 'location' of 'request.body' as it is undefined.
```

Look at your request file: the JSON body is right there, and REST Client sent it. Express received it — but with no middleware to read it, `request.body` stayed empty, and your code reached into nothing.

**Put the line back and save.**

### Find out which layer is protecting you

You have proved the API works. Now find out *which* part of it is doing the protecting.

In `index.js`, comment out the validation block in `POST /api/reports`:

```javascript
  // if (!location || !description || !agencyId) {
  //   return response.status(400).json({ error: "Missing required fields..." });
  // }
```

Save, then send **Test 3** again — the one that should reject a report with only a `location`.

**The request still fails.** Your own check is gone, so something else refused it. Your job is to work out what.

Read the error in your server terminal — not the response panel, the terminal — and answer:

1. **Where did the error come from?** Your code, Prisma, or PostgreSQL?
   *One reliable tell:* errors that reached the database carry a code like `P2002` or `P2003` — you saw `P2003` in Test 4. An error with **no code** never got that far.
2. **Was anything written to the database?** Check `Report` in Beekeeper Studio.
3. **What status did the citizen get?** Compare it with the `400` they used to get.

> [!mta] Two defences, doing different jobs
> Deleting your validation did not make the data unsafe. Something below you still refused the write — which is the same lesson as Test 4, seen from the other side.
>
> But look at what the citizen received. Instead of *"Missing required fields: location, description, agencyId"* they got an unhandled server error, or a `500`, or nothing useful at all.
>
> **The layer below protects your data. Your validation protects your user.** They are not redundant, and neither one can do the other's job. An API that only has the lower layer is safe and unusable.

**Put the validation back before you commit.**

---

## Checklist — this is your lab submission

Each test maps to a marking criterion in `01` §1.12. Tick them off before you finish.

| Test | Result you need                                     | Marks it evidences                    |
| :--- | :-------------------------------------------------- | :------------------------------------ |
| 1    | Three agencies returned                             | 2 — Data integrity                    |
| 2    | Report created, status `201`                        | 3 — API design & status codes         |
| 3    | `400` for missing fields                            | 3 — API design & status codes         |
| 4    | `400` for a fake agency id, **and nothing written** | 5 — Application vs database integrity |
| 5    | Agency returned with reports nested inside          | 4 — ORM relationship                  |
| 6    | Empty array, not an error                           | 4 — ORM relationship                  |
| 7    | `404` for an agency that does not exist             | 4 — ORM relationship                  |

Your evidence is in two places:

- **`requests/api.http`, committed.** Anyone can open it and send exactly the requests you sent.
- **Screenshots of the responses to Tests 2, 4 and 5** — the evidence for criteria 3, 5 and 4, which between them carry 55% of the lab mark.

- [ ] REST Client is installed, and `requests/api.http` holds all seven tests
- [ ] Every test returns the status and body described above
- [ ] You broke `express.json()` on purpose and recognise the error it gives
- [ ] You removed your validation, saw what caught it instead, and put it back

> [!mta] Testing is how you check anything you did not write
> Everything you do in this part — send a real request, read the actual response, compare it against what you expected — is the same procedure you will use on code a machine produced for you.
>
> It is worth being clear about why that matters. You cannot verify code by reading it more carefully; plausible and correct look identical on the page, and the more fluent the code, the more convincing the wrong version is. **The only thing that settles it is contact with reality:** run it, send it the empty body, send it the missing id, and read what actually comes back.
>
> Reading is how you form a suspicion. Testing is how you know. That distinction outlives every tool in this lab.

> [!warning] Be ready to explain Test 4
> Criterion 5 is not only "did it return 400". You must be able to say **which check rejected the request and why** — your JavaScript validation passed it, and PostgreSQL's foreign key refused it. Re-read the explanation under Test 4 until you can say that in your own words.

## Commit your work

Before committing, run `git status`. You should see `requests/api.http` listed as a new file — it belongs in your repository.

> [!tip] What is safe to commit in a request file
> Agency ids are safe: they identify public records. **Passwords and access tokens are not.** When a later layer adds logging in, those never go into a request file you commit.

Use this message exactly — see part `02` §2.14 for why.

```bash
git add . && git commit -m "test: verify all endpoints against local database"
```

```bash
git push
```

Your repository now shows the whole lab built in stages — and it carries the tests that prove it works. That history is what you were asked to produce, as much as the working code is.

**Next:** part `07` — Auditing AI code.

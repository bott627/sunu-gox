---
title: "Building the API"
sidebar: "05 · Building the API"
description: "three working endpoints, including the one that replaces a SQL `JOIN`."
---
A Kamariana - BotT627

# Building the API

**Goal:** three working endpoints, including the one that replaces a SQL `JOIN`.
**You are done when:** `npm run dev` starts a server on port 3000, and your browser gets your agencies back from it.

---

## 5.1 Before you build — how an API works

A few short ideas before any code. Every one of them appears in the four pieces that follow. If you already know HTTP and Express, skim the tables and go straight to §5.2.

### A client asks, a server answers

Every conversation with an API has the same shape: a **client** sends a **request**, and a **server** sends back a **response**. One of each, every time.

```
   CLIENT                                          SERVER
   a browser, VS Code, a phone app                 your index.js

      │  REQUEST                                      │
      │  POST /api/reports                            │
      │  Content-Type: application/json               │
      │  { "location": "Bakau", ... }                 │
      │ ─────────────────────────────────────────────▶│
      │                                               │  reads it, checks it,
      │                                               │  asks the database
      │  RESPONSE                                     │
      │  201 Created                                  │
      │  { "id": "3f2a91b4-...", "status": "PENDING" }│
      │◀───────────────────────────────────────────── │
```

What travels in each direction:

| A request carries      | Example                          | Where you read it |
| :--------------------- | :------------------------------- | :---------------- |
| a **method**           | `POST`                           | `request.method`  |
| a **path**             | `/api/reports`                   | `request.path`    |
| **headers**            | `Content-Type: application/json` | `request.headers` |
| a **body** — sometimes | `{ "location": "Bakau" }`        | `request.body`    |

| A response carries | Example                          | How you send it                  |
| :----------------- | :------------------------------- | :------------------------------- |
| a **status code**  | `201`                            | `response.status(201)`           |
| **headers**        | `Content-Type: application/json` | set for you by `response.json()` |
| a **body**         | the new report                   | `response.json(newReport)`       |

> [!mta] One request, exactly one response
> Every request must get **one** response — never none, never two.
>
> Send none and the client waits until it gives up. Send two and Node refuses with `Cannot set headers after they are sent to the client`. Both are easy mistakes, and the pieces below show you how to avoid each.

### A server can also be a client

"Client" and "server" are not kinds of computer. They are **roles in one conversation** — and the same program can play both at once.

Your API already does. Look at the `.env` you wrote in part `02`:

```
DATABASE_URL="postgresql://...@localhost:5432/sunu_gox_db?schema=public"
```

`localhost:5432` is the address of **another server** — PostgreSQL. Every time your code runs a Prisma query, your API sends it a request and waits for rows to come back.

```
   browser ──request───▶  your API   ──query──▶  PostgreSQL
           ◀──response──  port 3000  ◀──rows───  port 5432

           to the browser,            to PostgreSQL,
           your API is the SERVER     your API is the CLIENT
```

Real systems chain this further. In a later layer, filing a report could send a text message to the agency: your API would call an SMS provider's API — and for that request, your server is their client.

### An endpoint is one door into your API

An **endpoint** is one **method** plus one **path** that your server knows how to answer.

Think of a council office. One building, several counters: one for reporting a problem, one for enquiries, one for payments. Each counter does one job, and you have to go to the right one. Endpoints are the counters of your API.

By the end of this part yours will have three:

| Endpoint                        | What it does                     |
| :------------------------------ | :------------------------------- |
| `GET /api/agencies`             | List every agency                |
| `POST /api/reports`             | File a new report                |
| `GET /api/agencies/:id/reports` | One agency, with all its reports |

**The method is part of the endpoint.** `GET /api/reports` and `POST /api/reports` share a path but are two different endpoints — one would read, one creates. Ask for an endpoint that does not exist and Express answers `404` with `Cannot GET /api/reports`.

A full address breaks into parts, the same way your connection string did in part `02`:

```
http://localhost:3000/api/agencies/3f2a91b4-.../reports
```

| Part     | Here                                 | Means                                    |
| :------- | :----------------------------------- | :--------------------------------------- |
| protocol | `http://`                            | How the two sides talk                   |
| host     | `localhost`                          | Which machine — this one                 |
| port     | `3000`                               | Which program on that machine — your API |
| path     | `/api/agencies/3f2a91b4-.../reports` | Which endpoint, and which agency         |

In your code that agency id is written `:id` — a placeholder that matches whatever id arrives. Piece 4 uses it.

### Methods say what the request wants

| Method   | Means                    | In Sunu Gox                                          |
| :------- | :----------------------- | :--------------------------------------------------- |
| `GET`    | Read. Changes nothing    | List agencies. View an agency's reports              |
| `POST`   | Create something new     | File a report                                        |
| `PATCH`  | Change part of something | Mark a report resolved — part `08`                   |
| `PUT`    | Replace something whole  | Not used in this lab                                 |
| `DELETE` | Remove something         | **Never, for reports** — a report is a public record |

Remember idempotence from part `04`? It applies here. Sending the same `GET` twice is harmless. Sending the same `POST` twice **files two reports** — which is why a citizen double-tapping "Submit" on a slow connection is a real problem, not a theoretical one.

### Status codes say how it went

The first digit tells you most of what you need:

| Starts with | Means                 | Whose problem    |
| :---------- | :-------------------- | :--------------- |
| `2xx`       | It worked             | Nobody's         |
| `4xx`       | The request was wrong | The **client's** |
| `5xx`       | The server failed     | **Yours**        |

The codes this lab uses:

| Code  | Name                  | Send it when                                 | Where               |
| :---- | :-------------------- | :------------------------------------------- | :------------------ |
| `200` | OK                    | It worked; here is the data                  | Pieces 2 and 4      |
| `201` | Created               | A new report now exists                      | Piece 3             |
| `400` | Bad Request           | A field is missing, or the agency id is fake | Piece 3             |
| `404` | Not Found             | That agency does not exist                   | Piece 4             |
| `422` | Unprocessable Entity  | Well-formed, but breaks your rules           | Exercise, part `09` |
| `500` | Internal Server Error | Your code or the database failed             | Every `catch` block |

> [!warning] The first digit is an accusation
> A `4xx` tells the citizen *you sent something wrong*. A `5xx` tells them *we broke*.
>
> Answering a missing field with `500` blames yourself for their mistake. Answering a crashed database with `400` blames them for yours.

### Express, and why middleware matters

Node can already receive HTTP requests — but only as raw text. You would have to pull the path apart, read the body byte by byte, and write every response by hand. **Express** does that work and gives you three things.

**1. Routes** — *when this method arrives at this path, run this function*:

```javascript
app.get('/api/agencies', async (request, response) => { /* ... */ });
//  ▲       ▲                    ▲
//  method  path                 handler — runs when both match
```

**2. `request` and `response`** — objects that make reading the request and sending the answer one line each.

**3. Middleware** — the idea that matters most, and the one people skip.

**Middleware is a function that runs on a request before it reaches your route.** Express passes every request down a line of middleware, in the order you registered them, and only then to the matching route:

```
request ──▶ express.json() ──▶ your route handler ──▶ response
            reads the JSON
            text and puts it
            in request.body
```

Every middleware receives `request`, `response`, and a third thing — `next`:

```javascript
app.use((request, response, next) => {
  console.log(`${request.method} ${request.path}`);
  next();   // pass the request on down the line
});
```

A middleware can do one of three things:

| It can                                       | Example                                                           |
| :------------------------------------------- | :---------------------------------------------------------------- |
| **Pass the request on**, by calling `next()` | The logger above                                                  |
| **Add to the request**, then pass it on      | `express.json()` adds `request.body`                              |
| **Answer early**, and stop the line          | Turning away a request from someone not logged in — a later layer |

Two consequences you will meet today:

- **Order matters.** A route registered above `express.json()` receives a request whose body has not been read, so `request.body` is `undefined`.
- **A middleware that neither calls `next()` nor responds leaves the request hanging.** The client simply waits.

> [!mta] Middleware is where "every request" work lives
> Anything that must happen to many requests — reading JSON, logging, checking who is calling, refusing bad input — belongs in middleware: written once, in front of the routes that need it.
>
> The next two layers of Sunu Gox add exactly that — refusing bad data, then knowing who you are — and both arrive as middleware. The shape you meet in one line today is the shape of both.

> [!info] `request` and `response`, or `req` and `res`?
> They are only parameter names. This lab writes them in full, so you always know which is which.
>
> Almost all Express code online — and almost everything an AI generates for you — shortens them to `req` and `res`. **Same objects, shorter names.** When you see `req.body`, read `request.body`.

---

## 5.2 Build the server in four pieces

Create `index.js` in your project root. You will build it in four pieces: type each one, then read the explanation beneath it before moving on.

> [!info] Why type this, when a tool would produce it in four seconds?
> Because in part `07` you will be handed an endpoint you did not write and asked to prove whether it is correct — and **you cannot audit a shape you have never built.**
>
> These four pieces are the shape. Once you have typed them, a generated endpoint is something you can read at a glance and interrogate: where is the validation, what does it return when the record is missing, what happens on an empty body. Without them it is a wall of plausible text.
>
> This is the only part of the lab that asks you to type for typing's sake, and it is over in twenty minutes.

### How to read the pieces

From Piece 2 onward, each piece shows **where** the new code goes, not only what it is:

```javascript
// ... Piece 1 — imports and setup (already in your file) ...

// ▼ NEW — Piece 2 ▼
app.get('/api/agencies', async (request, response) => {
  // the lines you type
});
// ▲ end of Piece 2 ▲

// ... app.listen(...) — already in your file, stays last ...
```

- A `// ...` line stands for code you **already have**. Do not type it, and do not delete your real code.
- **Type only what sits between `▼ NEW` and `▲ end`.** You can leave out the marker comments themselves.
- The collapsed line **below** the new block shows what your new code must sit above.

### Piece 1 — The skeleton

Everything in this piece is new.

```javascript
// index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Middleware — reads JSON request bodies into request.body
app.use(express.json());

// Routes go here — Pieces 2, 3 and 4

app.listen(PORT, () => {
  console.log(`Sunu Gox API running on http://localhost:${PORT}`);
});
```

| Line                                | What it does                                                                       |
| :---------------------------------- | :--------------------------------------------------------------------------------- |
| `require('express')`                | Loads Express from `node_modules`                                                  |
| `require('@prisma/client')`         | Loads the database client generated from your schema — the same one `seed.js` used |
| `const app = express()`             | Creates your application. Every route and middleware attaches to `app`             |
| `const prisma = new PrismaClient()` | Your way into the database. **One** for the whole server, shared by every request  |
| `const PORT = 3000`                 | The port your server listens on — the `3000` in `http://localhost:3000`            |
| `app.use(express.json())`           | Registers middleware that runs on **every** request — see §5.1                     |
| `app.listen(PORT, () => { ... })`   | Starts the server. The function inside runs once it is ready to take requests      |

`app.listen` is kept last by convention, so the file reads top to bottom in the order things happen: set up, add middleware, add routes, start. Express does not force this — but a file in that order is far easier to check.

> [!danger] `app.use(express.json())` is not optional
> Without it, `request.body` is `undefined`, and every `POST` fails with:
>
> ```
> TypeError: Cannot destructure property 'location' of 'request.body' as it is undefined.
> ```
>
> This is the single most common mistake in this lab. You will cause it on purpose in part `06`, so you recognise it by sight.

### Piece 2 — List the agencies

```javascript
// index.js

// ... Piece 1 — imports and setup (already in your file) ...

// ▼ NEW — Piece 2 ▼
/**
 * 1. LIST ALL AGENCIES
 * GET /api/agencies
 */
app.get('/api/agencies', async (request, response) => {
  try {
    const agencies = await prisma.agency.findMany();
    response.json(agencies);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to fetch agencies" });
  }
});
// ▲ end of Piece 2 ▲

// ... app.listen(...) — already in your file, stays last ...
```

| Line                                | What it does                                                                                   |
| :---------------------------------- | :--------------------------------------------------------------------------------------------- |
| `app.get('/api/agencies', ...)`     | Registers the endpoint: when a `GET` arrives at this path, run the function                    |
| `async (request, response) =>`      | The handler. `async` because asking the database takes time, and you must wait for it          |
| `await prisma.agency.findMany()`    | Asks PostgreSQL for every agency and waits for the rows — the same as `SELECT * FROM "Agency"` |
| `response.json(agencies)`           | Sends the list back as JSON. No status is set, so it is `200 OK` — the default                 |
| `try { ... } catch (error) { ... }` | If anything inside `try` fails, jump to `catch` instead of crashing                            |
| `console.error(error)`              | Prints the **real** error in your terminal, for you                                            |
| `response.status(500).json(...)`    | Tells the client the server failed — a `5xx`, because it is not their fault                    |

Notice the split in those last two lines: **the detail goes to your terminal, a short message goes to the client.** A raw database error can reveal table names and internals to anyone who asks. Keep it for yourself.

### Piece 3 — File a report

```javascript
// index.js

// ... Piece 1 — imports and setup (already in your file) ...
// ... Piece 2 — GET /api/agencies (already in your file) ...

// ▼ NEW — Piece 3 ▼
/**
 * 2. FILE A REPORT
 * POST /api/reports
 */
app.post('/api/reports', async (request, response) => {
  const { location, description, agencyId } = request.body;

  // Check before touching the database
  if (!location || !description || !agencyId) {
    return response.status(400).json({
      error: "Missing required fields: location, description, agencyId"
    });
  }

  try {
    const newReport = await prisma.report.create({
      data: { location, description, agencyId }
    });
    response.status(201).json(newReport);
  } catch (error) {
    // P2003 = foreign key constraint failed: that agency does not exist
    if (error.code === 'P2003') {
      return response.status(400).json({
        error: "Invalid agencyId — that agency does not exist."
      });
    }
    console.error(error);
    response.status(500).json({ error: "Failed to create report" });
  }
});
// ▲ end of Piece 3 ▲

// ... app.listen(...) — already in your file, stays last ...
```

| Line                                                       | What it does                                                                                           |
| :--------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| `app.post('/api/reports', ...)`                            | A `POST` — create something — arriving at this path                                                    |
| `const { location, description, agencyId } = request.body` | Pulls three fields out of the JSON the citizen sent. Works only because `express.json()` ran first     |
| The `if` check                                             | If any of the three fields is missing or empty, stop here                                              |
| `return response.status(400).json(...)`                    | Answers `400` — the client's mistake — and **returns**, so nothing below runs                          |
| `prisma.report.create({ data: ... })`                      | Inserts the new row. PostgreSQL fills in `id`, `status` and `createdAt` itself                         |
| `response.status(201).json(newReport)`                     | `201 Created`, with the report as the database stored it — including the fields the citizen never sent |
| `error.code === 'P2003'`                                   | PostgreSQL refused the insert, because `agencyId` points at no agency                                  |

**Why the `return` matters.** Without it, the `400` is sent — and then the code carries on, reaches the database, and tries to answer a second time. Node refuses:

```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

One request, one response. `return` is how you keep that promise.

Two separate defences run in this piece, and they are easy to confuse:

| Check                    | Who does the checking         | Catches                              |
| :----------------------- | :---------------------------- | :----------------------------------- |
| The `if` at the top      | Your JavaScript               | A field the citizen left out         |
| `error.code === 'P2003'` | PostgreSQL, then your `catch` | A well-formed but **fake** agency id |

Your JavaScript cannot know whether an agency id is real without asking the database. So it asks — and the foreign key you declared in part `03` answers.

### Piece 4 — One agency and all its reports

```javascript
// index.js

// ... Piece 1 — imports and setup (already in your file) ...
// ... Piece 2 — GET /api/agencies (already in your file) ...
// ... Piece 3 — POST /api/reports (already in your file) ...

// ▼ NEW — Piece 4 ▼
/**
 * 3. ONE AGENCY AND ALL ITS REPORTS
 * GET /api/agencies/:id/reports
 */
app.get('/api/agencies/:id/reports', async (request, response) => {
  const { id } = request.params;

  try {
    const dashboard = await prisma.agency.findUnique({
      where:   { id: id },
      include: { reports: true }   // <-- this is the JOIN
    });

    if (!dashboard) {
      return response.status(404).json({ error: "Agency not found" });
    }

    response.json(dashboard);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Failed to load dashboard data" });
  }
});
// ▲ end of Piece 4 ▲

// ... app.listen(...) — already in your file, stays last ...
```

| Line                                       | What it does                                                                                                                                    |
| :----------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------- |
| `'/api/agencies/:id/reports'`              | `:id` is a **placeholder**. A request to `/api/agencies/3f2a91b4-.../reports` matches, and Express puts `3f2a91b4-...` into `request.params.id` |
| `const { id } = request.params`            | Takes the id out of the path                                                                                                                    |
| `prisma.agency.findUnique({ where: ... })` | Finds exactly one agency, by its primary key                                                                                                    |
| `include: { reports: true }`               | Brings that agency's reports along, nested inside it — see §5.4                                                                                 |
| `if (!dashboard)`                          | `findUnique` returns `null` when nothing matches. It does **not** throw                                                                         |
| `return response.status(404).json(...)`    | Not found — that agency does not exist                                                                                                          |
| `response.json(dashboard)`                 | `200`, with the agency and its reports nested inside                                                                                            |

Three things worth noticing:

- **`body` or `params`?** Piece 3 read `request.body`, because the citizen was sending data. This piece reads `request.params`, because the id is part of the address. What you *send* travels in the body; what you are *pointing at* travels in the path.
- **An agency with no reports is not a `404`.** It exists, so the answer is `200` with `"reports": []`. Part `06` tests exactly that difference.
- **Missing records behave differently by method.** `findUnique` quietly returns `null`; `update` throws an error with code `P2025`. You will meet the second one in part `07`.

---

## 5.3 Check your finished file

Four pieces, one file. Compare against this before you run anything:

```javascript
// index.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());          // <-- middleware: ABOVE every route

// 1. LIST ALL AGENCIES
app.get('/api/agencies', async (request, response) => { 
	/* Piece 2 */
});

// 2. FILE A REPORT
app.post('/api/reports', async (request, response) => { 
	/* Piece 3 */
});

// 3. ONE AGENCY AND ALL ITS REPORTS
app.get('/api/agencies/:id/reports', async (request, response) => { 
	/* Piece 4 */
});

app.listen(PORT, () => {          // <-- start the server: last, by convention
  console.log(`Sunu Gox API running on http://localhost:${PORT}`);
});
```

| Line                      | Where                 | Why                                                                                                                                            |
| :------------------------ | :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `app.use(express.json())` | **Above** every route | **Required.** A route registered above it receives `request.body` as `undefined`                                                               |
| `app.listen(...)`         | Last                  | **Convention.** Express would still register a route written below it, but a file that reads in the order things happen is far easier to check |

> [!warning] Order matters for middleware, and nothing warns you
> Express runs middleware and routes in the order you register them. Put a route above `express.json()` and nothing complains when the server starts — the failure only appears when the first `POST` arrives.

---

## 5.4 The line that matters

```javascript
include: { reports: true }
```

In Database I you would have written this:

```sql
SELECT *
FROM "Agency"
LEFT JOIN "Report" ON "Report"."agencyId" = "Agency"."id"
WHERE "Agency"."id" = $1;
```

And then you would have had to reassemble the flat rows that came back into a nested object in JavaScript — because SQL returns a table, but an API needs to return a tree.

Prisma does both steps. You get this shape straight out:

```json
{
  "id": "3f2a91b4-...",
  "name": "NAWEC (Water & Electricity)",
  "reports": [
    { "id": "...", "location": "Serrekunda Market", "status": "PENDING" },
    { "id": "...", "location": "Latrikunda",        "status": "PENDING" }
  ]
}
```

Remember from part `03`: `reports` is not a column. Prisma knows the relationship exists because you declared `reports Report[]` in the schema, and it issues the query for you.

**This is the whole lesson.** Everything else today is scaffolding around this one line.

---

## 5.5 Start the server

```bash
npm run dev
```

Expected:

```
Sunu Gox API running on h... 
```

Leave it running. `node --watch` reloads it every time you save.

> [!success] Checkpoint
> The message appears and the terminal does **not** return to your prompt — it stays occupied, because the server is running and waiting for requests. That is correct. Press `Ctrl + C` to stop it.

Confirm it actually answers. Open your browser and go to:

```
http://localhost:3000/api/agencies
```

You should see the three agencies you seeded in part `04`, as JSON. Right now **your browser is the client and your `index.js` is the server** — the conversation from §5.1, happening on your own machine.

> [!info] A browser can only take you so far
> Typing an address into a browser always sends a `GET`. That is enough to check this endpoint, but a browser cannot easily send a `POST` with a JSON body. In part `06` you install a proper tool for sending any request you like.

---

## Try this

Break it on purpose, so the failure is familiar when it happens for real. (A second experiment, which needs to send a `POST`, waits for part `06`.)

### Watch middleware work — and hang

Add this directly below `app.use(express.json())` and before the endpoints:

```javascript
app.use((request, response, next) => {
  console.log(`${request.method} ${request.path}`);
  next();
});
```

Refresh `http://localhost:3000/api/agencies` in your browser, and watch your server terminal print `GET /api/agencies` as the request passes through.

You may also see `GET /favicon.ico`. Your browser asked for the site's icon on its own — clients send requests you never typed, and a logger is how you find out.

Now delete the `next();` line, save, and refresh the browser. **The page keeps loading and never arrives.** The request reached your middleware and nobody passed it on. Stop the page loading, then put `next();` back.

Keep the logger if you like it — it is useful in part `06`, where you will want to see each request arrive.

---

## Common errors

| Error                                                                                     | Cause                                                                  | Fix                                                            |
| :---------------------------------------------------------------------------------------- | :--------------------------------------------------------------------- | :------------------------------------------------------------- |
| `TypeError: Cannot destructure property 'location' of 'request.body' as it is undefined.` | `express.json()` is missing, or registered below your routes           | Put `app.use(express.json())` above every route                |
| `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client`     | Two responses to one request — usually a missing `return`              | Add `return` before the early `response.status(...)`           |
| `Cannot GET /api/agency` in a 404 page                                                    | No endpoint with that method and path — often a typo                   | Compare the method and path with your routes, letter by letter |
| The request hangs and never answers                                                       | A middleware that never calls `next()`, or a route that never responds | Every path through your code must end in exactly one response  |
| `EADDRINUSE: address already in use :::3000`                                              | An old server is still running                                         | Close the other Git Bash or Terminal window, or change `PORT`  |
| An error mentioning `prisma.agency` or `findMany` just after a schema change              | The Prisma client was not regenerated                                  | Run `npx prisma generate`                                      |
| `SyntaxError`, and the server stops                                                       | A typo — often a missing bracket                                       | The error names the file and line. Start there                 |

---

## Checklist before moving on

- [ ] You can explain what an endpoint is, using one of your three
- [ ] You can say which status code each endpoint returns, and why
- [ ] `index.js` has all three endpoints, written with `request` and `response`
- [ ] `app.use(express.json())` sits **above** the routes, and you can say why
- [ ] `npm run dev` prints the running message and stays running
- [ ] `http://localhost:3000/api/agencies` in your browser shows your three agencies
- [ ] You watched a request hang when `next()` was removed
- [ ] You can explain what `include: { reports: true }` replaces

## Commit your work

Use this message exactly — see part `02` §2.14 for why.

```bash
git add . && git commit -m "feat: add agencies, reports and dashboard endpoints"
```

```bash
git push
```

**Next:** part `06` — Testing your API.

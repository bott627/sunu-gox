---
title: "Seeding the agencies"
sidebar: "04 · Seeding the agencies"
description: "put the three real Gambian agencies into your database automatically."
---
A Kamariana - BotT627

# Seeding the agencies

**Goal:** put the three real Gambian agencies into your database automatically.
**You are done when:** `node seed.js` prints three UUIDs and you have copied them somewhere safe.

---

## 4.1 Why seed?

Before a citizen can report a burst pipe to NAWEC, NAWEC has to exist in the database. Agencies are not user-generated — they are fixed reference data that ships with the application.

Typing them in by hand every time you reset the database would waste your time. A **seed script** does it in one command.

---

## 4.2 Write the script in four pieces

Create a file called `seed.js` in your project root, beside `package.json`. Build it a piece at a time — the middle piece contains the only real decision in this part.

### Piece 1 — Connect to the database

```javascript
// seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
```

This is the client Prisma generated for you when you ran the migration in part `03`. It already knows about `Agency` and `Report`, because it was built from your schema.

### Piece 2 — Add the first agency

```javascript
async function main() {
  console.log("Seeding database with Gambian agencies...");

  const nawec = await prisma.agency.upsert({
    where:  { name: 'NAWEC (Water & Electricity)' },
    update: {},
    create: { name: 'NAWEC (Water & Electricity)' },
  });
}
```

**`upsert` = up**date **+ in**sert. 

Read it as: 
1. *find a row matching `where`. —> `where:  { name: 'NAWEC (Water & Electricity)' }`
2. If it exists, apply `update`. —> `update: {}`
3. If it does not, apply `create`. —> `create: { name: 'NAWEC (Water & Electricity)' }`

Here `update: {}` is deliberately empty — if NAWEC is already there, change nothing.

**Why not `create`?** Because `create` would work the first time and fail every time after, on the `@unique` constraint you put on `name` in part `03`. `upsert` lets you run this script ten times and still have exactly three agencies.

A script that is safe to re-run is called **idempotent**.

> [!mta] Safe to run twice
> Idempotence is one of those words that sounds academic until the night it saves you. A script you can re-run without fear is a script you will actually re-run — to recover from a half-finished deploy, to reset a broken environment, to onboard the next person.
>
> A script you can only run once is a script nobody dares touch, and it rots.
>
> You will meet this again in every deployment tool, every migration, and every queue that might deliver the same message twice. **Ask of anything you automate: what happens if this runs a second time?**

> [!warning] This is a favourite place for generated code to be subtly wrong
> `create` and `upsert` both look correct, both run cleanly the first time, and only one of them survives a second run.
>
> If you ask a tool for a seed script, this is exactly the kind of difference it will not think to ask you about — and exactly the kind you will not notice until a demo. You will audit code with this shape in part `07`.

### Piece 3 — The other two, and print the IDs

Inside the same `main()` function, below the NAWEC block:

```javascript
async function main() {
  
	// ... Previous code
	  
	const kmc = await prisma.agency.upsert({
		where:  { name: 'Kanifing Municipal Council (KMC)' },
		update: {},
		create: { name: 'Kanifing Municipal Council (KMC)' },
	});

	const bac = await prisma.agency.upsert({
		where:  { name: 'Brikama Area Council (BAC)' },
		update: {},
		create: { name: 'Brikama Area Council (BAC)' },
	});
	
	console.log("Seeding complete.\n");
	console.log("Copy these IDs — you need them to test your API:");
	console.log(`${nawec.name}\n    ${nawec.id}`);
	console.log(`${kmc.name}\n    ${kmc.id}`);
	console.log(`${bac.name}\n    ${bac.id}`);
}
```

`upsert` returns the row it found or created, so `nawec.id` is the UUID PostgreSQL generated. You need those three IDs in part `06`, which is why the script prints them rather than making you go looking.

> [!info] Use these names exactly
> `NAWEC (Water & Electricity)`, `Kanifing Municipal Council (KMC)` and `Brikama Area Council (BAC)` are the canonical names for this project. They appear in later parts and in the marking. Do not shorten or reword them.

### Piece 4 — Make it run

At the very bottom of the file, outside `main()`:

```javascript
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

This is the most unfamiliar-looking code you have written so far, and every line of it earns its place:

| Line | Why it is there |
| :--- | :--- |
| `main()` | Talking to a database is asynchronous, so the work has to live inside an `async` function. This is the line that actually calls it |
| `.catch(...)` | If anything inside `main()` throws, print the real error instead of a silent failure |
| `process.exit(1)` | Exit with a failure code. `0` means success; anything else means failure, and that is how other scripts know something went wrong |
| `.finally(...)` | Runs **whether it succeeded or failed** |
| `prisma.$disconnect()` | Closes the database connection. Without this your terminal can hang after the script finishes, because Node is still holding an open connection |

> [!mta] Always close what you opened
> `.finally()` runs on success *and* on failure. That is the whole point — a connection left open by a crashed script is still open.
>
> Files, connections, locks: whatever you open, arrange to close it on the failure path too, not just the happy one. Most resource leaks are not written deliberately. They are written by someone who only tested the case where nothing went wrong.

---

## 4.3 Check your finished file

Your `seed.js` should now read exactly like this:

```javascript
// seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with Gambian agencies...");

  const nawec = await prisma.agency.upsert({
    where:  { name: 'NAWEC (Water & Electricity)' },
    update: {},
    create: { name: 'NAWEC (Water & Electricity)' },
  });

  const kmc = await prisma.agency.upsert({
    where:  { name: 'Kanifing Municipal Council (KMC)' },
    update: {},
    create: { name: 'Kanifing Municipal Council (KMC)' },
  });

  const bac = await prisma.agency.upsert({
    where:  { name: 'Brikama Area Council (BAC)' },
    update: {},
    create: { name: 'Brikama Area Council (BAC)' },
  });

  console.log("Seeding complete.\n");
  console.log("Copy these IDs — you need them to test your API:");
  console.log(`${nawec.name}\n    ${nawec.id}`);
  console.log(`${kmc.name}\n    ${kmc.id}`);
  console.log(`${bac.name}\n    ${bac.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 4.4 Run it, and keep the IDs

```bash
node seed.js
```

Expected output:

```
Seeding database with Gambian agencies...
Seeding complete.

Copy these IDs — you need them to test your API:
  NAWEC (Water & Electricity)
    3f2a91b4-8c7d-4e1a-9b2f-6d5e4c3b2a10
  Kanifing Municipal Council (KMC)
    7b1e0d92-4a3f-4c8b-8e6d-1f2a3b4c5d6e
  Brikama Area Council (BAC)
    c4d5e6f7-8a9b-4c0d-9e1f-2a3b4c5d6e7f
```

Your UUIDs will be different. They are random, and they are different again on every machine.

> [!warning] Paste those three IDs somewhere now
> Open a text file and keep it beside you. You will type these repeatedly in part `06`, and digging them back out of terminal scrollback is a waste of lab time you will not get back.

> [!success] Checkpoint
> Three agencies, three UUIDs printed, no errors, and the terminal returns to your prompt rather than hanging. If it hangs, check `prisma.$disconnect()` in Piece 4.

---

## 4.5 See it in the database

Open **Beekeeper Studio**, connect to `sunu_gox_db`, and click the `Agency` table.

Three rows, each with a `name` and a UUID `id` you did not type. `Report` is still empty — no citizen has filed anything yet.

> [!tip] The quick alternative
> `npx prisma studio` opens Prisma's own browser and needs no configuration, since it reads your `.env` directly. `Ctrl + C` in the terminal closes it.

---

## Try this

Run `node seed.js` a second time. Nothing breaks, and you still have three agencies — that is `upsert` doing its job.

Now open `seed.js`, change `upsert` to `create` on the NAWEC block, and run it again. Read the error carefully. That is your `@unique` constraint from part `03` rejecting a duplicate — PostgreSQL protecting your data integrity, exactly as designed.

**Change it back to `upsert` before continuing.**

---

## Checklist before moving on

- [ ] `seed.js` exists in the project root
- [ ] `node seed.js` ran without errors
- [ ] Three UUIDs are saved somewhere you can copy from
- [ ] Beekeeper Studio or Prisma Studio shows three agencies in `Agency` table
- [ ] You understand why `upsert` is used instead of `create`

## Commit your work

Use this message exactly — see part `02` §2.14 for why.

```bash
git add . && git commit -m "feat: add seed script for Gambian agencies"
```

```bash
git push
```

**Next:** part `05` — Building the API.

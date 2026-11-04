---
title: "Designing the database"
sidebar: "03 · Designing the database"
description: "describe your two tables in Prisma, then let Prisma build them in PostgreSQL."
---
A Kamariana - BotT627

# Designing the database

**Goal:** describe your two tables in Prisma, then let Prisma build them in PostgreSQL.
**You are done when:** `npx prisma migrate dev` completes without errors and both tables exist.

---

## 3.1 Build the schema in four pieces

Open `prisma/schema.prisma`, delete everything in it, and build it up a piece at a time. **Type each piece and read the explanation before adding the next.** Pasting the whole file at once teaches you nothing — the decisions are the lesson here, not the typing.

### Piece 1 — Tell Prisma what it is talking to

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

Two settings, and neither describes your data:

- **`datasource`** — which kind of database, and where to find it. `env("DATABASE_URL")` reads the line you wrote in part `02` §2.10, so your password stays out of this file.
- **`generator`** — what Prisma should *produce* from your models. `prisma-client-js` means "a JavaScript object I can call from `index.js`".

### Piece 2 — The Agency table

```prisma
// The agencies responsible for fixing things
model Agency {
  id   String @id @default(uuid())
  name String @unique   // e.g. "NAWEC (Water & Electricity)"
}
```

Two fields, two decisions worth understanding:

**`@id @default(uuid())`** — the primary key. Instead of an auto-incrementing integer, we use a UUID: a long random string like `3f2a91b4-8c7d-...`. With integers, anyone who can see report `47` can guess that `46` exists. UUIDs cannot be guessed or counted.

**`@unique` on `name`** — a constraint. PostgreSQL will physically refuse to store two agencies with the same name. You will watch this fire in part `04`.

### Piece 3 — The Report table

```prisma
// The civic issues filed by citizens
model Report {
  id          String   @id @default(uuid())
  location    String   // e.g. "Traffic lights, near the bank"
  description String   // e.g. "Major pipe burst wasting water"
  status      String   @default("PENDING")  // PENDING or RESOLVED
  createdAt   DateTime @default(now())
}
```

**`@default(...)` means the database fills it in**, not your code. When you create a report in part `05` you will never write `status` or `createdAt` — and they will still be there. That is PostgreSQL doing it.

> [!info] Notice what is missing
> Nothing here connects a report to an agency. Right now you have two tables that know nothing about each other — any report could belong to anyone, or to no one.
>
> That is deliberate. The relationship is the whole point of this lab, so it gets its own step rather than being buried in a paste.

### Piece 4 — Connect them

This is the piece that matters. Add **one line** to `Agency`:

```prisma
model Agency {
  id      String   @id @default(uuid())
  name    String   @unique
  reports Report[]          // <-- add this line
}
```

And **two lines** to `Report`:

```prisma
model Report {
  id          String   @id @default(uuid())
  location    String
  description String
  status      String   @default("PENDING")
  createdAt   DateTime @default(now())

  agencyId String                                            // <-- add
  agency   Agency @relation(fields: [agencyId], references: [id])   // <-- add
}
```

Those three lines are not equal. **Only one of them becomes a column.**

| Line | Becomes a column? | What it is |
| :--- | :--- | :--- |
| `agencyId String` | **Yes** | The foreign key. A real column in the `Report` table holding an agency's `id` |
| `agency Agency @relation(...)` | No | Wiring. It tells Prisma *which* field is the foreign key and what it points at |
| `reports Report[]` on Agency | No | A convenience. It lets you travel from an agency to its reports |

Read the `@relation` line as a sentence: *the `agencyId` field here refers to the `id` field over on `Agency`.*

> [!mta] The virtual field is for you; the foreign key is the truth
> `Agency.reports` does not exist in your database. Open the table in Beekeeper Studio after the migration and look — there is no `reports` column, and there never will be.
>
> `Report.agencyId` **is** the database's truth. One column, holding one id. Everything else is Prisma making that column pleasant to work with.
>
> This distinction survives every ORM you will ever use, in any language. The convenience is generated; the foreign key is real.

---

## 3.2 Check your finished file

Your `schema.prisma` should now read exactly like this. Compare line by line before running anything:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// The agencies responsible for fixing things
model Agency {
  id      String   @id @default(uuid())
  name    String   @unique
  reports Report[]
}

// The civic issues filed by citizens
model Report {
  id          String   @id @default(uuid())
  location    String
  description String
  status      String   @default("PENDING")
  createdAt   DateTime @default(now())

  agencyId String
  agency   Agency @relation(fields: [agencyId], references: [id])
}
```

Read it out loud one last time: **an Agency has many Reports; a Report belongs to one Agency.** That sentence is the spine of everything you build from here.

---

## 3.3 Run the migration

```bash
npx prisma migrate dev --name init_civic_reports
```

This does three things at once:

1. Creates the `sunu_gox_db` database if it does not already exist
2. Generates SQL `CREATE TABLE` statements and runs them
3. Generates the Prisma Client — the JavaScript object you will use in part `05`

You should see output ending in something like `Your database is now in sync with your schema.`

### What you would have typed in Introduction to Database

Nothing new happened to your database that you could not have done yourself. It is worth seeing the two side by side.

In **Introduction to Database** you would have opened MySQL and typed all of this by hand:

```sql
CREATE DATABASE sunu_gox_db;

USE sunu_gox_db;

CREATE TABLE Agency (
  id   VARCHAR(36)  NOT NULL,
  name VARCHAR(191) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY Agency_name_key (name)
);

CREATE TABLE Report (
  id          VARCHAR(36)  NOT NULL,
  location    VARCHAR(191) NOT NULL,
  description VARCHAR(191) NOT NULL,
  status      VARCHAR(191) NOT NULL DEFAULT 'PENDING',
  createdAt   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  agencyId    VARCHAR(36)  NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT Report_agencyId_fkey
    FOREIGN KEY (agencyId) REFERENCES Agency(id)
);
```

In this **lab** you described the same thing once, in `schema.prisma`, and ran one command.

Line up what matches:

| In your Prisma schema                             | What it became in SQL                          |
| :------------------------------------------------ | :--------------------------------------------- |
| `model Agency`                                    | `CREATE TABLE Agency (...)`                    |
| `id String @id`                                   | `PRIMARY KEY (id)`                             |
| `name String @unique`                             | `UNIQUE KEY Agency_name_key (name)`            |
| `status String @default("PENDING")`               | `status ... NOT NULL DEFAULT 'PENDING'`        |
| `createdAt DateTime @default(now())`              | `createdAt ... DEFAULT CURRENT_TIMESTAMP`      |
| `agencyId String`                                 | `agencyId VARCHAR(36) NOT NULL`                |
| `@relation(fields: [agencyId], references: [id])` | `FOREIGN KEY (agencyId) REFERENCES Agency(id)` |
| `reports Report[]`                                | **nothing** — it is not a column               |

That last row is the one to remember. `reports Report[]` produces no SQL at all. It exists only so Prisma knows the two tables are related, which is what makes `include` work in part `05`.

> [!info] Two differences you will notice
> You used **MySQL** in Introduction to Database; we use **PostgreSQL** here. Two things look different but mean the same:
>
> - PostgreSQL quotes names with `"double quotes"` where MySQL uses `` `backticks` `` — both preserve capital letters in table names.
> - PostgreSQL writes `TEXT` where MySQL writes `VARCHAR(191)`. PostgreSQL does not need a length limit on text.
>
> The concepts — primary key, unique constraint, default value, foreign key — are identical. Only the dialect changed.

Nothing was hidden from you here. Prisma saved the SQL it generated, and in the next section you will open that file and read it yourself.

---

## 3.4 See what Prisma actually wrote

Prisma did not hide the SQL from you. It saved it. Open:

```
prisma/migrations/<timestamp>_init_civic_reports/migration.sql
```

Inside is exactly this:

```sql
-- CreateTable
CREATE TABLE "Agency" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "agencyId" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Agency_name_key" ON "Agency"("name");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_agencyId_fkey"
    FOREIGN KEY ("agencyId") REFERENCES "Agency"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
```

Compare it with the MySQL you saw in 3.3. Same primary keys, same unique constraint, same foreign key — written in PostgreSQL's dialect instead of MySQL's.

One line is new. `ON DELETE RESTRICT` means PostgreSQL will **refuse to delete an Agency that still has Reports**, rather than leaving those reports pointing at nothing. Prisma added that for you. It is the safe default, and it is the kind of detail that is easy to forget when writing foreign keys by hand.

> [!mta] Prisma is not magic, and it is not a replacement for SQL
> This is worth two minutes of your attention.
>
> Prisma is a **generator**. You describe the result you want; it writes the statements you already know how to write. The SQL did not go away — you stopped typing it.
>
> This matters on the day something breaks. When a migration fails or a query runs slowly, the error comes back to you **in SQL**. The student who understands what was generated fixes it in minutes. The student who only knows `schema.prisma` is stuck, because the error is written in a language they decided not to learn.
>
> Everything from Database I is still the foundation. You are simply building on it faster.

> [!mta] You already know how to work with a generator — this is the same relationship
> Prisma writes SQL for you. Something else is writing JavaScript for you. **These are the same arrangement, and they fail the same way.**
>
> In both cases: the tool produces something faster than you could, in a language that still exists underneath, and hands you the result. In both cases the output is usually right. And in both cases, **when it is wrong, the error arrives in the underlying language** — SQL from the database, a stack trace from Node — not in the convenient one you typed.
>
> That is the whole reason this lab makes you read the generated SQL in the next section rather than trusting that it worked.
>
> Ask it of every tool you are ever handed: *what is it generating, what language does that come back in when it breaks, and can I read that language?* If the answer to the last part is no, you do not control the tool — you are hoping.

---

## 3.5 Confirm the tables exist

Open **Beekeeper Studio** and connect using the connection you saved in part `02` §2.5.

> [!warning] Change the database, or you will see nothing
> That saved connection points at the `postgres` database — the one you used to prove the server was alive. Your tables are in **`sunu_gox_db`**, which did not exist when you saved it.
>
> Edit the connection and set **Default Database** to `sunu_gox_db`, then connect again.

You should now see three tables:

| Table | What it is |
| :--- | :--- |
| `Agency` | Yours. Empty — you seed it in part `04` |
| `Report` | Yours. Empty |
| `_prisma_migrations` | Prisma's own record of which migrations have run. Leave it alone |

Click `Report` and look at the columns. **There is no `reports` column on `Agency`, and no `agency` column on `Report`** — only `agencyId`. That is the MTA from 3.1, visible in your own database.

> [!success] Checkpoint
> Both tables exist, both are empty, and `Report` has an `agencyId` column. If `sunu_gox_db` does not appear in Beekeeper's database list, your migration did not run — go back to 2.3 and read the error.

> [!tip] A second way to look
> Prisma ships its own browser, which needs no configuration:
>
> ```bash
> npx prisma studio
> ```
>
> It opens in your browser and reads the database in your `.env` directly, so there is nothing to point at `sunu_gox_db`. Press `Ctrl + C` in the terminal to close it.
>
> Use whichever you prefer. Beekeeper shows you the database as it really is, columns and all; Prisma Studio shows it the way Prisma sees it.

---

## Common errors

| Error                                                          | What it means                                  | Fix                                                                                                                                      |
| :------------------------------------------------------------- | :--------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `Can't reach database server at localhost:5432`                | PostgreSQL is not running                      | `brew services start postgresql@18` (Mac), `sudo systemctl start postgresql` (Linux), or Services panel (Windows) — see part `02` §2.5 |
| `Authentication failed for user "..."`                         | Wrong username or password in `.env`           | Re-do §2.11 in part `02`                                                                                                          |
| `Environment variable not found: DATABASE_URL`                 | `.env` is missing or in the wrong folder       | It belongs in the project root, beside `package.json`                                                                                    |
| `P1012 — The datasource property 'url' is no longer supported` | You installed **Prisma 7** instead of Prisma 6 | Reinstall with the `@6` pin — see `02` 1.7                                                                                               |

---

## Checklist before moving on

- [ ] `schema.prisma` has both models with no red underlines
- [ ] `npx prisma migrate dev` finished successfully
- [ ] A folder exists under `prisma/migrations/`
- [ ] Beekeeper Studio shows `Agency` and `Report`, both empty
- [ ] You have opened `migration.sql` and seen the generated SQL

## Commit your work

Use this message exactly — see part `02` §2.14 for why.

```bash
git add . && git commit -m "feat: add Agency and Report models with 1:N relation"
```

```bash
git push
```

**Next:** part `04` — Seeding the agencies.

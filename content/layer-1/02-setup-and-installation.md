---
title: "Setup & installation"
sidebar: "02 · Setup & installation"
description: "Node.js and PostgreSQL installed and running, a Node project created, Prisma initialised."
---
A Kamariana - BotT627

# Setup & installation

**Goal:** Node.js and PostgreSQL installed and running, a Node project created, Prisma initialised.
**You are done when:** `npx prisma init` has run and your `.env` holds a connection string that matches your own machine.

> [!warning] Do this before the lab
> Installing Node and PostgreSQL over shared wifi takes time. Arriving with sections 1.1 and 1.2 already done means you spend the lab building, not downloading.

---

## 2.0 What you need

| Tool             | Minimum version    | What it does                             |
| :--------------- | :----------------- | :--------------------------------------- |
| Node.js          | **24 or newer**    | Runs your JavaScript outside the browser |
| npm              | ships with Node    | Installs packages                        |
| PostgreSQL       | 16 or newer        | Stores your data                         |
| Git              | any recent version | Saves snapshots of your work             |
| A GitHub account | —                  | Hosts your repository online             |
| Beekeeper Studio | any recent version | Lets you see inside your database        |
| VS Code          | any recent version | Where you write code, and send test requests with REST Client |

Before installing anything, check what you already have. If a tool is already there, you can skip its installation section.

You will type these commands into a **terminal**. Open one now:

| OS          | How to open a terminal **right now**                                                                 |
| :---------- | :--------------------------------------------------------------------------------------------------- |
| **Windows** | Press the **Start** button, type `cmd`, and open **Command Prompt**. That is enough for these checks |
| **macOS**   | Open **Terminal** (press `Cmd+Space`, type `terminal`, press Enter)                                  |
| **Linux**   | Open **Terminal** from your applications menu, or press `Ctrl+Alt+T`                                 |

Run them one at a time.

> [!info] Windows: Command Prompt now, Git Bash later
> Git Bash is the terminal the rest of this lab uses — but it arrives **with Git**, which you may not have installed yet. That is why this first check uses Command Prompt, which is already on every Windows machine.
>
> Once you finish §2.4, switch to **Git Bash** and stay there. The commands in later parts assume it, and several of them behave differently in Command Prompt.

```bash
node --version
```

```bash
npm --version
```

```bash
git --version
```

```bash
psql --version
```

**If a command prints a version number**, that tool is installed — move on to the next one. **If it says `command not found`**, install that tool using the matching section below.

When all four print a version, skip ahead to **2.5**.

> [!warning] Node 24 is the minimum
> Node 20 has reached end of life and no longer receives security updates, so we do not build on it. If `node --version` prints anything below `v24`, upgrade before continuing — the installers in 2.1 replace an older version in place.

> [!warning] Create your GitHub account first
> Go to **[github.com](https://github.com)** and sign up; it is free. You must also click the verification link GitHub emails you, or you will not be able to sign in later. Doing this during the session, on shared wifi, costs you lab time you cannot get back.

---

## 2.1 Install Node.js

### Windows

**Option A — the installer (recommended)**

1. Go to **nodejs.org** and download the **LTS** `.msi` installer.
2. Run it. Accept the defaults.
3. Make sure **"Add to PATH"** stays checked — it is checked by default. Do not uncheck it.
4. Close and reopen your terminal afterwards, or `node` will not be found.

**Option B — winget** (Windows 10/11, one command)

```powershell
winget install OpenJS.NodeJS.LTS
```

### macOS

**Option A — Homebrew (recommended)**

If you do not have Homebrew, install it first from **brew.sh**, then:

```bash
brew install node
```

**Option B — the installer**

Download the **LTS** `.pkg` from **nodejs.org** and run it.

### Linux

**Ubuntu / Debian / Linux Mint**

The version in the default Ubuntu repository is often several years old. Use NodeSource instead:

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
```

**Fedora / RHEL / CentOS**

```bash
sudo dnf install nodejs npm
```

**Arch / Manjaro**

```bash
sudo pacman -S nodejs npm
```

---

## 2.2 Install PostgreSQL

### Windows

1. Go to **postgresql.org/download/windows** and run the **EDB installer**.
2. During installation you will be asked to **set a password for the `postgres` user**.
   **Write this password down.** You cannot recover it later, and you need it in §2.10.
3. Leave the port as **5432**.
4. When offered "Stack Builder" at the end, you can skip it.

The installer also gives you **pgAdmin** (a graphical database browser) and **SQL Shell (psql)** in your Start menu. We will use Beekeeper Studio rather than pgAdmin — it is simpler. You will connect to your database with it in §2.5.

PostgreSQL installs as a Windows service and starts automatically.

### macOS

**Option A — Homebrew (recommended)**

```bash
brew install postgresql@18
```

Then start it, and set it to start on login:

```bash
brew services start postgresql@18
```

If `psql` is still not found afterwards, Homebrew keeps versioned formulas off your PATH. Add it:

```bash
echo 'export PATH="/opt/homebrew/opt/postgresql@18/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

> [!info] Intel Macs
> On an Intel Mac, that path is `/usr/local/opt/...` instead of `/opt/homebrew/opt/...`.

**Option B — Postgres.app**

Download from **postgresapp.com**. It is a normal Mac app with a start/stop button — the simplest option if the terminal is not yet comfortable for you.

### Linux

**Ubuntu / Debian / Linux Mint**

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
```

Start it and enable it at boot:

```bash
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Fedora / RHEL / CentOS**

```bash
sudo dnf install -y postgresql-server postgresql-contrib
```

Fedora requires one extra step that Ubuntu does not — you must initialise the data directory yourself:

```bash
sudo postgresql-setup --initdb
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Arch / Manjaro**

```bash
sudo pacman -S postgresql
```

Then, as the `postgres` user:

```bash
sudo -u postgres initdb -D /var/lib/postgres/data
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## 2.3 Install Beekeeper Studio

Beekeeper Studio is a free program that lets you *look inside* your database — tables, rows, columns — without writing SQL. You will use it throughout this lab to check that your code actually did what you think it did.

Download the free Community edition from **[beekeeperstudio.io](https://www.beekeeperstudio.io/get)** and install it like any other program.

| OS | How |
| :--- | :--- |
| **Windows** | Download the `.exe` installer and run it |
| **macOS** | Download the `.dmg`, open it, drag Beekeeper Studio into Applications |
| **Linux** | Download the `.deb` or `.AppImage`, or `sudo snap install beekeeper-studio` |

You will connect it to your database in §2.5. There is nothing to configure yet.

---

## 2.4 Install Git

Most systems already have it. Check with `git --version` before installing.

| OS                  | How to install                                                                                                                                                                                                     |
| :------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Windows**         | Download **Git for Windows** from **[git-scm.com/download/win](https://git-scm.com/download/win)** and accept every default. This also installs **Git Bash** — the terminal you will use for the rest of this lab. |
| **macOS**           | `brew install git` — or simply run `git --version`, which prompts macOS to install its own copy                                                                                                                    |
| **Ubuntu / Debian** | `sudo apt install -y git`                                                                                                                                                                                          |
| **Fedora / RHEL**   | `sudo dnf install -y git`                                                                                                                                                                                          |
| **Arch**            | `sudo pacman -S git`                                                                                                                                                                                               |

### Tell Git who you are

Git records a name and email on every snapshot you save. Until you set them, it refuses to save anything.

Open **Git Bash** (Windows) or **Terminal** (macOS/Linux) and run these two commands, one at a time. Replace the text inside the quotes with your own details, and **keep the quotation marks**.

```bash
git config --global user.name "Your Full Name"
```

```bash
git config --global user.email "your@email.com"
```

Two rules for what you type:

- **`user.name` is the name you want shown on your work.** Write it normally, with spaces — for example `Fatou Ceesay`. It appears next to every commit you make, so use the name you would want a future employer to read.
- **`user.email` must be the same email address you used to open your GitHub account.** If it is different, your commits will not be linked to your GitHub profile.

**`user.name` is *not* your GitHub username.** These are two different things, and mixing them up is the most common mistake in this section.

| Setting | What it is | Where it shows | Example |
| :-------------------- | :--------------------------------------------- | :------------------------- | :-------------- |
| **`user.name`** | Your **display name** — how you sign your work  | Next to each commit        | `Fatou Ceesay`  |
| **GitHub username**   | Your **account handle** — one word, no spaces   | In your repository address | `fceesay`       |

You set `user.name` here. You will need your GitHub username in §2.6.

### Check that Git got it

Running the same commands *without* a value prints back what is currently set:

```bash
git config --global user.name
```

```bash
git config --global user.email
```

Each should print exactly what you typed. **If either prints nothing at all, it did not save** — run the command above again and check your quotation marks.

To see everything Git has configured at once:

```bash
git config --global --list
```

### Connect Git to GitHub

Setting your name is not the same as proving who you are. GitHub stopped accepting account passwords from Git in 2021, so you need a proper connection before you can download or upload code.

**Do this before §2.6**, or your first `git clone` will fail.

### Option A — GitHub CLI (recommended)

`gh` is a small program that handles the whole login for you. Install it for your system:

**Windows** — in Git Bash or PowerShell:

```bash
winget install GitHub.cli
```

> [!tip] If winget asks Y or N
> If winget asks you to agree to terms with **`[Y] Yes  [N] No`**, type **`y`** and press **Enter**. `Y` means yes, `N` means no.

**macOS:**

```bash
brew install gh
```

**Ubuntu / Debian:**

```bash
sudo apt install -y gh
```

If none of those work, download the installer directly from **[cli.github.com](https://cli.github.com)**.

### Close your terminal and open it again

**This step is not optional.** A terminal only learns about newly installed programs when it starts.

If you skip it, the next command will say `gh: command not found` — and that message is misleading, because `gh` *is* installed. Close the Git Bash or Terminal window completely, open a new one, and carry on.

### Log in

```bash
gh auth login
```

`gh` now asks you a series of questions. Use the **arrow keys** to move between options and **Enter** to choose. Answer them like this:

| Question                                            | Your answer                  |
| :-------------------------------------------------- | :--------------------------- |
| What account do you want to log into?               | **GitHub.com**               |
| What is your preferred protocol for Git operations? | **HTTPS**                    |
| Authenticate Git with your GitHub credentials?      | **Yes**                      |
| How would you like to authenticate GitHub CLI?      | **Login with a web browser** |

Then you will see something like this:

```
! First copy your one-time code: A1B2-C3D4
Press Enter to open https://github.com/login/device in your browser...
```

**Read this part carefully — most people get stuck here.**

1. **Copy the one-time code** shown in your terminal (`A1B2-C3D4` in the example — yours will differ). Write it down if copying from the terminal is awkward.
2. **Press Enter.**
3. **A browser window should open** at `https://github.com/login/device`. If nothing opens, your terminal cannot launch a browser — that is normal on some machines. Open your browser yourself and type that address in.
4. **GitHub may ask you to sign in first**, even if you think you are already signed in. It may also send a verification code to your email, or ask for your two-factor code. Complete that first — this is GitHub protecting your account, not an error.
5. **Paste the one-time code** into the box and confirm.
6. **Authorise** when GitHub asks for permission.
7. **Return to your terminal.** You should see a green tick and `Logged in as YOUR_USERNAME`.

That is done once. Git and GitHub stay connected on this machine from now on.

### Option B — Personal Access Token

Use this only if Option A will not work on your machine.

On github.com: **Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token**. Tick the **`repo`** scope, then generate it. Copy the token — GitHub shows it **once and never again**.

When Git later asks for a **password**, paste this token instead. Your GitHub account password will not work.

> [!warning] You only see the token once
> Save the token somewhere safe, like a password manager. If you lose it you cannot view it again — you can only delete it and make a new one.

---

## 2.5 Verify everything is installed

Run these one at a time. Each should print a version number.

```bash
node --version
```

```bash
npm --version
```

```bash
git --version
```

```bash
psql --version
```

**Check the Node one specifically — it must start with `v24` or higher.**

If Node still shows an old version after installing, your terminal is using a copy it found earlier. Close **every** terminal window, open a fresh one, and check again. On macOS or Linux, `which node` tells you which copy is being found.

### Now check that PostgreSQL is actually running

Installed and running are not the same thing. A database that is installed but stopped will fail in part `03` with a confusing error, so confirm it now.

Open **Beekeeper Studio** and set up your connection:

1. Click **New Connection**.
2. Set **Connection Type** to **Postgres**.
3. Fill in the fields:

| Field                | What to enter                                                              |
| :------------------- | :------------------------------------------------------------------------- |
| **Host**             | `localhost`                                                                |
| **Port**             | `5432`                                                                     |
| **User**             | `postgres` on Windows and Linux. On macOS with Homebrew, your Mac username |
| **Password**         | The password you set in 2.2. On macOS with Homebrew, leave it **empty**    |
| **Default Database** | `postgres`                                                                 |

4. Click **Test Connection**.
5. If it reports success, click **Connect**. If it fails, see the table below.

> [!info] Why the postgres database?
> You are connecting to the `postgres` database — the one PostgreSQL creates for itself. Your own `sunu_gox_db` database does not exist yet; Prisma creates it in part `03`. Connecting here only proves the server is alive and your password is right.

**Save this connection.** You will reopen it after every migration to check your tables.

### If the connection fails

| Message | What it means | Fix |
| :--- | :--- | :--- |
| `Connection refused` | PostgreSQL is not running | Start it — see the table below |
| `password authentication failed` | Wrong user or password | Windows: the password from 2.2. macOS Homebrew: your Mac username, empty password |
| `database "postgres" does not exist` | Unusual install | Try your own username as the database name instead |

Starting PostgreSQL if it is stopped:

| OS | Command |
| :--- | :--- |
| **macOS** (Homebrew) | `brew services start postgresql@18` |
| **Linux** | `sudo systemctl start postgresql` |
| **Windows** | Press `Win+R`, type `services.msc`, find `postgresql-x64-…`, click **Start** |

---

## 2.6 Create your repository, then clone it

We do this **before** writing any code. The repository is the project, not something added at the end.

### Create it on GitHub

1. Go to **[github.com](https://github.com)** and click **New repository** (the green button, or the `+` menu at the top right).
2. Name it exactly **`sunu-gox-api`**.
3. Set it to **Private**.
4. Tick **Add a README file**.
5. Under **Add .gitignore**, start typing `Node` and select **Node** from the list.
6. Click **Create repository**.

Step 5 matters. It tells GitHub to create a file that keeps `node_modules` and your passwords out of your repository. You will check it in §2.12.

### Add your lecturer as a collaborator

Your repository is private, so nobody can see it — including the person marking it. Give your lecturer access now, or your work cannot be graded.

1. On your repository page, click **Settings** (the tab along the top).
2. In the left sidebar, click **Collaborators**.
3. GitHub may ask you to confirm your password or 2FA code. That is normal.
4. Click **Add people**.
5. Enter your lecturer's GitHub username: **`kamariana`**
6. Choose the **Write** role, then click **Add**.

Your lecturer receives an invitation by email and must accept it. **Do this on the day you create the repository** — not the night before submission.

### Decide where the project will live

Before cloning, choose a sensible folder. Do not clone into Downloads.

1. Create a folder called **`gox-lab`** somewhere sensible — inside **Documents** is a good choice.
2. Open the `gox-lab` folder.
3. Open a terminal *inside that folder*:
   - **Windows:** right-click on the empty space inside the folder and choose **Git Bash Here**. On Windows 11 you may first need to click **Show more options** to see it.
   - **macOS:** right-click the folder, then **Services → New Terminal at Folder**. If that is missing, open Terminal and type `cd ` (with a space), then drag the folder onto the window and press Enter.
   - **Linux:** right-click inside the folder and choose **Open in Terminal**.

Your terminal is now "in" the `gox-lab` folder, so whatever you download next lands there.

### Clone it to your machine

On your repository page, click the green **Code** button and copy the **HTTPS** address. Then run:

```bash
git clone https://github.com/YOUR_USERNAME/sunu-gox-api.git
```

**Copy the address from the Code button rather than typing it.** One mistyped character produces a `repository not found` error that looks like a permissions problem but is not.

> [!tip] Forgotten your GitHub username?
> Sign in at github.com and click your **avatar at the top right** — your username appears under your display name. It is also the last part of your profile address, `github.com/YOUR_USERNAME`.
>
> It is one word with no spaces. It is **not** the `user.name` you set in §2.4 — that was your display name. If your clone address has a space in it, you have used the wrong one.

Move into the folder you just downloaded:

```bash
cd sunu-gox-api
```

Confirm Git is watching it:

```bash
git status
```

> [!success] Checkpoint
> You should see `On branch main` and `nothing to commit, working tree clean`. That means Git is tracking this folder and it is connected to GitHub.

> [!warning] If clone asks for a password
> Your connection to GitHub is not set up. Go back to §2.4. Your GitHub account password will not work — it must be the `gh` login or a Personal Access Token.

### Start the Node project

A Node project needs a file called `package.json`. It is the project's record card: its name, and the list of packages it depends on. Every command you run later — `npm install`, `npm run dev` — reads this file.

Still inside `sunu-gox-api/`, run:

```bash
npm init -y
```

The `-y` means "yes to every question", so npm fills in sensible defaults instead of interviewing you. You now have a `package.json`.

---

## 2.7 Install the dependencies

Your project needs two kinds of package: ones the server uses **when it runs**, and ones you only need **while building**.

Packages the server needs to run:

```bash
npm install express @prisma/client@6
```

Note: The above command is installing two packages at the same time: `express` and `@prisma/client@6`

The tool you only need while developing:

```bash
npm install prisma@6 --save-dev
```

> [!danger] The `@6` is required — do not leave it off
> Prisma 7 was released recently and **changes how the database connection is declared**. In version 7 the line `url = env("DATABASE_URL")` is no longer allowed in `schema.prisma`; it requires an extra configuration file and a database adapter instead.
>
> Every example in this lab uses the version 6 style. If you install Prisma 7 by accident, part `03` fails immediately with:
>
> ```
> Error code: P1012
> error: The datasource property `url` is no longer supported in schema files.
> ```
>
> If you see that error, you installed the wrong version. Fix it by running both commands above again, `@6` included.

> [!info] Why version 6 when version 7 exists?
> A fair question, and the answer is not "because the notes are old".
>
> Prisma 7 changed how a project is *wired up*. It did not change how databases, tables or relationships work. Specifically, version 7 requires:
>
> | What version 7 adds | What it costs a beginner |
> | :--- | :--- |
> | A `prisma.config.ts` file | A **TypeScript** file, in a lab written in plain JavaScript |
> | `import "dotenv/config"` | A second module system (`import`) alongside the `require()` we use |
> | An extra `dotenv` package | One more dependency to download and explain |
> | The client generated into `generated/prisma` | `require('@prisma/client')` stops working |
>
> Every one of those is about **project configuration** — the plumbing that connects your code to your database. None of it is what you are here to learn.
>
> This lab is a quick start to designing and building a real API, end to end, on a problem that actually exists in this country: turning a real situation into a data model, generating a database from that model, exposing it over HTTP, choosing the right status code for each outcome, letting the database defend its own integrity, and working in version control the way a team does. Prisma is one tool inside that. Its configuration file is a detail of the tool, not of the craft.
>
> So we pin to version 6 deliberately, and spend the session on the work rather than the wiring. Everything you learn here — `findMany`, `include`, `where`, `orderBy`, migrations, status codes, validation — is unchanged in version 7. Only the plumbing differs.

`--save-dev` records `prisma` as a *development* dependency. The Prisma command-line tool builds and migrates your database, but your running server never calls it — so it does not belong in the list of things needed in production.

> [!mta] Choosing a version is an engineering decision, not a race
> The instinct to install the newest version of everything is a natural one, and it is wrong often enough to be worth unlearning now.
>
> Professional teams **pin** their dependencies to specific versions on purpose. They upgrade when they have a reason and time to test — not on the day a new release appears. An upgrade that breaks a working system on a deadline costs far more than the features it delivers.
>
> When you meet a new version, ask: *what does this change for me, what does it cost to move, and do I need it today?* Here the answers are "the wiring", "a rewrite of six files", and "no".

> [!tip] On slow connections
> This is the heaviest download in the lab — Prisma fetches a query engine binary built for your specific operating system. If the wifi is struggling, ask your lecturer for the offline `node_modules` copy rather than downloading it yourself.

### About the security warning — read this before you act

When the second command finishes, npm will very likely tell you:

```
3 high severity vulnerabilities

To address all issues, run:
  npm audit fix
```

And if you run `npm audit`, it goes further:

```
To address all issues (including breaking changes), run:
  npm audit fix --force
```

**npm is telling you to run a command that will break your project.** That is not a typo in these notes. Read on before you touch it — this is worth understanding, because you will meet it again in real work.

### First, what the warning is about

`npm audit` checks every package *underneath* your packages against a database of published security reports. It found one in `deepmerge-ts`, a small library that merges configuration objects together.

Follow the chain of who depends on whom:

```
prisma (the command-line tool)  ->  @prisma/config  ->  deepmerge-ts
```

So it is not in your server. It is inside the **Prisma command-line tool** — the thing you run on your own laptop to build and migrate your database. You installed it with `--save-dev` for exactly this reason.

### Why it cannot affect you

The reported problem is *stack exhaustion when merging recursive object graphs*. In plain terms: feed the library an object that contains itself, deeply enough, and the program crashes.

Now ask the question that matters: **who feeds it that object?** The Prisma CLI uses it to merge *your own Prisma configuration file*, on *your own machine*.

To be harmed by this, you would have to write a deliberately malicious config file and then run Prisma against it yourself. There is no attacker. Nothing here is reachable from the internet, and your running server never loads this code at all.

> [!mta] Judge a vulnerability by reachability, not by severity
> "High severity" describes how bad the flaw is **if an attacker can reach it**. It says nothing about whether one can.
>
> Before reacting to any security warning, trace the path: *who could feed malicious input to this code, and how would it get to them?* If there is no path, the severity label does not matter. If there is one, even a "low" rating deserves your attention.
>
> This one question separates engineers who panic at red text from engineers who fix what actually matters.

### What each command actually does

Both were tested on npm 11.6.2 before these notes were written. They do very different things:

| Command                 | What happens                                       | Safe?                           |
| :---------------------- | :------------------------------------------------- | :------------------------------ |
| `npm audit fix`         | Nothing at all. The warning is reprinted unchanged | Harmless, but pointless         |
| `npm audit fix --force` | **Downgrades the Prisma CLI to 6.12.0**            | **No — it breaks your project** |

> [!danger] Never run `npm audit fix --force` on this project
> It leaves you with two halves of Prisma that do not match:
>
> ```
> prisma          : 6.12.0     <-- silently downgraded
> @prisma/client  : 6.19.3      <-- untouched
> npm error ELSPROBLEMS  invalid: "^6.19.3" from the root project
> ```
>
> npm itself calls that state *invalid*. Your migrations in part `03` will then fail with errors that are very hard to trace back to this moment.

> [!info] There is no safe fix — that is the whole point
> Look closely at npm's wording: *"fix available via `npm audit fix --force`"*. When npm can only offer a `--force` fix, it is telling you that **no non-breaking fix exists**.
>
> So your real choice is not "fix it" versus "ignore it". It is **live with a warning** or **break the project**. For this lab, and for this advisory, living with the warning is the correct engineering decision.
>
> Prisma will publish a proper fix in a future release. Until then the warning stays.

### So what do you do?

**Nothing. Carry on to 1.8.**

There is no safe fix available. When npm says *"fix available via `npm audit fix --force`"*, it means the only route to silencing this warning is a breaking downgrade. Prisma will publish a proper fix in a future release; until then the warning stays, and that is fine.

> [!info] Why does npm give bad advice?
> Because npm's job is narrow: clear the advisory. It does not know that this package only ever runs on your laptop, that no attacker can reach it, or that the "fix" is a two-version downgrade of the main tool you are here to learn.


 >[!mta] A warning is information, not an instruction
> Before running any suggested fix, ask two questions: *can this code actually be reached by an attacker?* and *what will the fix change?* Here the answers are "no" and "it breaks everything" — so you leave it alone. Engineers who run every suggested fix without reading it cause more outages than the vulnerabilities do.
                                                                                               
> [!success] Checkpoint
> The `prisma` and `@prisma/client` lines should show the **same major version** — both starting with `6.`. If they do, you are fixed.
>
> The security warning will come back. You now know to leave it alone.

---

## 2.8 Add a dev script

Open `package.json` and add a `scripts` block:

```json
"scripts": {
  "dev": "node --watch index.js"
}
```

`node --watch` restarts the server automatically whenever you save. It is built into Node, so there is nothing extra to install.

> [!info] What about nodemon?
> Older tutorials install a package called `nodemon` for this. It does the same job. We skip it because modern Node does it for free — one less download.

---

## 2.9 Initialise Prisma

Prisma needs two things before it can talk to your database: somewhere to **describe your tables**, and somewhere to keep your **connection details**. One command creates both.

In **Git Bash** (or Terminal), inside your `sunu-gox-api` folder:

```bash
npx prisma init
```

> [!info] What is `npx`?
> `npm` **installs** a package. `npx` **runs** one.
>
> You installed Prisma into this project rather than onto your whole machine, so it is not on your system path — typing `prisma init` alone would give you `command not found`. `npx` looks inside `node_modules` and runs the local copy.
>
> This is why every Prisma command in these labs starts with `npx`.

### What it created

Your project folder now looks like this. The two new entries are marked:

```
sunu-gox-api/
├── node_modules/
├── prisma/
│   └── schema.prisma      <-- NEW: where you describe your tables
├── .env                   <-- NEW: where your database password lives
├── .gitignore
├── package.json
└── package-lock.json
```

Open the folder in **VS Code** and you will see them in the file list on the left: a new **`prisma`** folder containing **`schema.prisma`**, and a new **`.env`** file sitting beside `package.json`.

| What | What it is for |
| :--- | :--- |
| `prisma/schema.prisma` | Your tables, written as models. You fill this in in part `03` |
| `.env` | Your database username and password. **Never committed** — see §2.12 |

> [!warning] Cannot see `.env`?
> Files whose names begin with a dot are hidden by the operating system. **VS Code shows them anyway**, so if you are looking in VS Code and it is not there, `prisma init` did not run where you thought it did.
>
> Check you are in the right folder — run `pwd` in Git Bash, and confirm it ends in `sunu-gox-api`.

> [!success] Checkpoint
> `prisma/schema.prisma` and `.env` both exist, both are inside `sunu-gox-api/`, and neither is inside `node_modules/`.

---

## 2.10 Write your `.env`

`prisma init` created a `.env` file with a placeholder in it. Replace that placeholder with a line that describes **your** database.

### What a connection string is made of

Every part of this line is a separate piece of information. Read it before you write yours:

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

| Part             | What it means                                                              | Yours will be                     |
| :--------------- | :------------------------------------------------------------------------- | :-------------------------------- |
| `postgresql://`  | Which kind of database. Prisma supports several; this says use PostgreSQL  | always `postgresql://`            |
| `USER`           | The database role you log in as — **not** your GitHub or computer login    | `postgres`, or your Mac username  |
| `:PASSWORD`      | That role's password. **Omitted entirely** if the role has none            | your install password, or nothing |
| `@HOST`          | Which machine the database is on. `localhost` means *this computer*        | `localhost`                       |
| `:PORT`          | Which door on that machine. PostgreSQL uses 5432 unless told otherwise     | `5432`                            |
| `/DATABASE`      | Which database on that server                                              | `sunu_gox_db`                     |
| `?schema=public` | Which section inside that database. PostgreSQL creates `public` by default | `?schema=public`                  |

> [!info] The database does not exist yet — that is expected
> `sunu_gox_db` appears at the end of the line, but you have not created it. You do not need to. **Prisma creates it for you** the first time you run a migration, in part `03`.
>
> You are describing where the database *will* live, not where it already is.

### Your line

| Your setup                           | Put this in `.env`                                                                            |
| :----------------------------------- | :-------------------------------------------------------------------------------------------- |
| **Windows** (EDB installer)          | `DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/sunu_gox_db?schema=public"` |
| **macOS** (Homebrew or Postgres.app) | `DATABASE_URL="postgresql://YOUR_MAC_USERNAME@localhost:5432/sunu_gox_db?schema=public"`      |
| **Linux**                            | `DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/sunu_gox_db?schema=public"` |

Replace `YOUR_PASSWORD` with the password you set when you installed PostgreSQL, and `YOUR_MAC_USERNAME` with your Mac account name.

> [!warning] macOS: there is no colon and no password
> On a default Homebrew install the role has **no password at all**, so the `:PASSWORD` part is left out completely:
>
> ```
> postgresql://fatou@localhost:5432/sunu_gox_db?schema=public
> ```
>
> Not `fatou:@localhost` and not `fatou:password@localhost`. Just the username, then `@`.

> [!success] Checkpoint
> Open `.env`. There should be exactly one uncommented line, it should start `DATABASE_URL="postgresql://`, and it should contain **your** username — not `USER`, not `johndoe`, not a name copied from these notes.

### If you do not know your username or password

That is common, and it is not a problem. **§1.11** walks through finding them on each operating system.

If your line looks right, skip 1.11 and go straight to 1.12.

---

## 2.11 Finding your PostgreSQL login — if you are stuck

**Skip this section if your `.env` is already working.** Come back to it if you do not know your username or password, or if you get an authentication error later.

Your login depends on how PostgreSQL was installed on *your* machine, which is why you cannot copy a connection string from a tutorial.

### Windows

Your role/user is `postgres` and the password is the one you set during installation (§2.2).

Confirm it by opening **SQL Shell (psql)** and pressing Enter at every prompt except the password. If you reach `postgres=#`, the password is correct.

```
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/sunu_gox_db?schema=public"
```

### macOS (Homebrew)

Homebrew creates a role named after your Mac username, usually with **no password**. Check:

```bash
psql -l
```

A table of databases means you are connected. Your username is in the "Owner" column.

```
DATABASE_URL="postgresql://YOUR_MAC_USERNAME@localhost:5432/sunu_gox_db?schema=public"
```

Note there is no `:password` — that is correct for a default Homebrew install.

> [!info] Using Postgres.app?
> Using **Postgres.app** instead? Same as above; the role is your Mac username.

### Linux

A fresh install has a `postgres` role with **no password**, reachable only by switching to the `postgres` system user. Give it a password so Prisma can connect over TCP:

```bash
sudo -u postgres psql
```

Then, at the `postgres=#` prompt:

```sql
ALTER USER postgres WITH PASSWORD 'choose_a_password';
\q
```

```
DATABASE_URL="postgresql://postgres:choose_a_password@localhost:5432/sunu_gox_db?schema=public"
```

> [!info] Why the extra step on Linux only?
> Ubuntu ships PostgreSQL with *peer authentication*: it trusts your operating system identity rather than a password. That works for `psql` at the terminal, but Prisma connects over the network, where there is no OS identity to check — so it needs a real password.

---

## 2.12 Protect your password

Your `.env` now contains a real password. It must never be shared, committed, or submitted.

The file that prevents this is called **`.gitignore`** — a list of things Git should pretend it cannot see. You already have one: GitHub created it when you ticked **Node** in §2.6.

### Check that it covers what matters

Open `.gitignore` in your editor. It is long — GitHub's Node template covers many tools. Search it for two entries:

- **`node_modules`** — hundreds of megabytes that anyone can recreate with `npm install`. Never store it.
- **`.env`** — your actual password. Committing this is how real credentials end up published on the internet.

Both should already be there. **If either is missing, add it on its own line at the bottom of the file:**

```
node_modules
.env
```

> [!warning] Did you skip the .gitignore step?
> Then you have no such file. Create one called exactly `.gitignore` — leading dot, no file extension — in your project root, beside `package.json`, containing the two lines above.

### Create the safe version to share

Your teammates and your lecturer need to know *which* settings your project expects, without seeing your password. That is what `.env.example` is for.

Create a file called `.env.example` containing the shape but not the secret:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sunu_gox_db?schema=public"
```

Unlike `.env`, this file **is** committed — it contains no real password.

> [!danger] Never commit your .env
> You will submit `.env.example` with your exercise. You will **not** submit `.env`.

---

## 2.13 Your first commit

Check what Git proposes to save:

```bash
git status
```

**Read that list carefully.** You should see `package.json`, `.gitignore`, `.env.example`, `prisma/` — and you should **not** see `node_modules` or `.env`. If either of those appears, your `.gitignore` is missing, misspelled, or in the wrong folder. Fix it before you commit.

Now save and publish your first snapshot:

```bash
git add .
```

```bash
git commit -m "chore: set up Express, Prisma and PostgreSQL"
```

```bash
git push
```

> [!success] Checkpoint
> Refresh your repository page on github.com. Your files are there — and `node_modules` and `.env` are not. Your first commit is published.

---

## 2.14 How to write your commit messages

**You will commit at the end of every step in this lab, using the exact message given in that file.** Do not invent your own wording. There are two reasons, and both matter.

**It is how professionals write commits.** The format below is called **Conventional Commits**, and it is used across the software industry. Each message starts with a type:

| Prefix   | Means                       | Example from this lab                               |
| :------- | :-------------------------- | :-------------------------------------------------- |
| `feat:`  | A new feature               | `feat: add seed script for Gambian agencies`        |
| `fix:`   | A bug fix                   | `fix: return 404 for unknown report id`             |
| `chore:` | Setup, config, housekeeping | `chore: set up Express, Prisma and PostgreSQL`      |
| `test:`  | Adding or running tests     | `test: verify all endpoints against local database` |
| `docs:`  | Documentation only          | `docs: add API usage notes to README`               |

Read the type, and you know what a commit did without opening it. Teams rely on this to generate changelogs and to find when something broke.

**It is your evidence of work.** Your commit history shows the project being built in stages — schema, then seed, then endpoints. A single commit at midnight containing everything shows nothing, and cannot be distinguished from work that was not your own.

### Your commit checklist for this lab

Each of these appears at the end of its own part. Use them **exactly**:

| After finishing         | Commit message                                         |
| :---------------------- | :----------------------------------------------------- |
| `02` Setup              | `chore: set up Express, Prisma and PostgreSQL`         |
| `03` Schema & migration | `feat: add Agency and Report models with 1:N relation` |
| `04` Seeding            | `feat: add seed script for Gambian agencies`           |
| `05` Building the API   | `feat: add agencies, reports and dashboard endpoints`  |
| `06` Testing            | `test: verify all endpoints against local database`    |
| `07` Auditing AI code   | `feat: audit and fix AI-generated status endpoint`     |
| `08` Challenge 1        | `feat: add priority field to reports`                  |
| `08` Challenge 2        | `feat: add endpoint to update report status`           |
| `08` Challenge 3        | `feat: add active reports feed`                        |
| `09` Task 1             | `feat: add input validation to report creation`        |
| `09` Task 2             | `feat: add atomic upvote endpoint`                     |

Every step is the same two commands — commit, then push:

```bash
git add . && git commit -m "the message for that step"
```

```bash
git push
```

> [!info] Committing does not need the internet
> `git add` and `git commit` are **local**. They write to the `.git` folder on your own laptop, and they work with the wifi off, with no data bundle, and in a power cut if your battery holds.
>
> Only `git push` needs a connection. So commit the moment you finish a part, online or not, and push when you are next connected — several commits go up together, each keeping the time you actually made it.
>
> This is why **"I had no internet" does not explain one large commit at the end.** It explains a late push, and a late push is fine.

> [!mta] Commit small, commit often
> Because when you break something in part `05` and cannot remember what you changed, `git diff` tells you exactly, and `git checkout .` throws the mess away and returns you to the last thing that worked. Students who commit as they go recover in seconds. Students who do not, retype everything.

---

## Checklist before moving on

- [ ] `node --version` prints `v24` or higher
- [ ] `npm --version`, `git --version` and `psql --version` all print a version
- [ ] Beekeeper Studio connects to PostgreSQL and the connection is saved
- [ ] Your `sunu-gox-api` repository exists on github.com, set to **Private**
- [ ] Your lecturer is added as a collaborator
- [ ] The repository is cloned into your `gox-lab` folder
- [ ] `sunu-gox-api/` contains `package.json`, `prisma/`, `.env`
- [ ] `package.json` has the `dev` script
- [ ] `.env` has *your* username and password, not a placeholder
- [ ] `.gitignore` lists both `node_modules` and `.env`
- [ ] `npx prisma --version` shows the same major version for `prisma` and `@prisma/client`
- [ ] `git status` does **not** show `.env` or `node_modules`
- [ ] Your first commit is pushed and visible on github.com

**Next:** part `03` — Designing the database.

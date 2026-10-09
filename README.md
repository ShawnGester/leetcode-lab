# LeetLab — Local Java LeetCode Practice

Offline practice lab for writing **Java** solutions, running custom tests via local `javac`/`java`, and reviewing optimal / brute-force references.

## Problems

1. **33** Search in Rotated Sorted Array
2. **153** Find Minimum in Rotated Sorted Array
3. **200** Number of Islands
4. **417** Pacific Atlantic Water Flow

## Requirements

- Node.js 20+
- JDK with `javac` and `java` on PATH (OpenJDK 21)

## Run

```bash
npm install
npm run dev
```

Open http://127.0.0.1:4317

Navbar tabs: **Practice** | **Optimal** | **Brute Force**. Everything is local — no LeetCode API.

- **Practice**: edit `Solution.java` in the editor, edit/add JSON test cases, click **Run Java**. The server compiles your code with `javac`, runs each case with `java`, and shows a pass summary (e.g. `3/4 passed`), actual outputs, and compiler errors.
- **Optimal / Brute Force**: read-only reference solutions with complexity notes, plus a per-problem **My notes / LeetCode Premium editorial** box (shared by both tabs) for pasting editorial text or your own notes.
- Your code and notes are saved per problem in the browser's `localStorage` only. Notes are never sent to the server or written to the repo, so pasted Premium content stays out of git.

### Offline use

Run `npm install` once while online. After that, the app runs with no network: the Monaco editor is bundled from `node_modules` (not loaded from a CDN), and Java runs through your local JDK.

## WSL (Ubuntu) dev environment setup

LeetLab is meant to live **inside WSL Ubuntu**, not on the Windows side. Don't clone it to `C:\...` or work from `/mnt/c/...`. `scripts/setup-wsl.sh` refuses to run from `/mnt/...` unless you pass `--allow-windows-path`.

1. **Install WSL + Ubuntu** from an admin PowerShell on Windows, then reboot if asked:

   ```powershell
   wsl --install -d Ubuntu
   ```

   Open "Ubuntu" from the Start menu and create your Linux user. Run every command below in that Ubuntu (WSL) terminal.

2. **Install the Origin CLI and sign in:**

   ```bash
   curl -fsSL https://downloads.cursor.com/origin/install.sh | sh
   origin auth login
   ```

   If you then get `origin: command not found`, add `~/.local/bin` to your PATH and reload your shell:

   ```bash
   echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
   source ~/.bashrc
   ```

3. **Clone into your Ubuntu home folder**, e.g. a `dev` folder under `repositories`:

   ```bash
   mkdir -p ~/repositories/dev && cd ~/repositories/dev
   origin repo clone shawn-ge/leetcode-lab
   cd leetcode-lab
   pwd    # must print /home/<you>/repositories/dev/leetcode-lab, NOT /mnt/c/...
   git checkout cursor/leetcode-practice-3908
   ```

4. **Run the setup script** from the project folder. It installs `build-essential`, `git`, `curl`, `unzip`, OpenJDK 21 (`javac`), and Node.js 22 via [nvm](https://github.com/nvm-sh/nvm), sets `JAVA_HOME`, prints installed versions, and shows next steps. It is safe to re-run. It stops with an error if it's run from a Windows drive (`/mnt/...`) or from a Windows shell such as Git Bash, and it warns if it's on plain Linux instead of WSL.

   ```bash
   bash scripts/setup-wsl.sh            # core tools
   bash scripts/setup-wsl.sh --maven    # also Maven
   bash scripts/setup-wsl.sh --gradle   # also Gradle (via SDKMAN)
   ```

5. **Configure git** (the script does this for you if you pass `GIT_NAME`/`GIT_EMAIL`):

   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "you@example.com"
   git config --global core.autocrlf input
   git config --global init.defaultBranch main
   ```

6. **Open it in VS Code or Cursor through WSL.** Install the "WSL" extension (by Microsoft), then run `code .` (or `cursor .`) from the project folder in Ubuntu, or use *WSL: Connect to WSL* from the command palette and open `~/repositories/dev/leetcode-lab`. The window's bottom-left corner should say `WSL: Ubuntu`, which means terminals, extensions, `javac`, and `npm` all run inside Ubuntu.

7. **Run the app:** `npm install` (once, while online), then `npm run dev`, and open http://127.0.0.1:4317 in your Windows browser. WSL forwards localhost automatically.

**Seeing the files from Windows:** in File Explorer, go to `\\wsl$\Ubuntu\home\<you>\repositories\dev\leetcode-lab` (it also shows up under *Linux > Ubuntu* in the sidebar). That's a live view into the Ubuntu filesystem, not a Windows copy, so edits there change the same files. Do your git, npm, and Java work from the WSL terminal or the WSL-connected editor.

**Mirroring your other PC:** the script covers a general Java + Node setup. If you share the dotfiles (`.bashrc`, `.gitconfig`, editor settings) or the list of tools from your other machine, the script can be extended to match it.

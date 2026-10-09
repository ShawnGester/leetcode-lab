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

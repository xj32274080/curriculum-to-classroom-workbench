// Installs dependencies for client/ and server/ subprojects.
// Runs as the root `postinstall` so a single `npm install` at the repo root
// prepares everything. Uses cwd (no `cd`/`&&`) for Windows safety.
const { execSync } = require("node:child_process");
const path = require("node:path");

const dirs = ["client", "server"];
for (const dir of dirs) {
  const cwd = path.join(__dirname, "..", dir);
  console.log(`\n[install-deps] installing ${dir} ...`);
  try {
    execSync("npm install", { stdio: "inherit", cwd });
  } catch (err) {
    console.error(`[install-deps] failed installing ${dir}:`, err.message);
    process.exit(1);
  }
}
console.log("\n[install-deps] all subproject deps installed.");

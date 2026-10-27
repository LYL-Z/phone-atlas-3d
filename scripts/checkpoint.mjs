import { mkdir, cp, writeFile } from "node:fs/promises";
const stage = process.argv[2];
if (!/^M[0-4]$/.test(stage || "")) throw Error("Use M0..M4");
const dest = `checkpoints/${stage}`;
await mkdir(dest, { recursive: true });
for (const p of [
  "index.html",
  "styles.css",
  "src",
  "vendor",
  "scripts/serve.mjs",
  "package.json",
  "package-lock.json",
]) {
  try {
    await cp(p, `${dest}/${p}`, { recursive: true });
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
}
await writeFile(
  `${dest}/CHECKPOINT.md`,
  `# ${stage}\nRunnable preserved snapshot. Run: node scripts/serve.mjs from this directory.\n`,
);
console.log(dest);

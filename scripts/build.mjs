import { mkdir, cp, writeFile } from "node:fs/promises";
await mkdir("dist", { recursive: true });
for (const p of [
  "index.html",
  "styles.css",
  "favicon.svg",
  "src",
  "vendor",
  "README.md",
  "SOURCE_NOTES.md",
  "TEST_CHECKLIST.md",
])
  await cp(p, `dist/${p}`, { recursive: true });
await mkdir("dist/tests", { recursive: true });
await cp("tests/browser.html", "dist/tests/browser.html");
await writeFile("dist/.nojekyll", "");
console.log(
  "Static site prepared in dist/ (references and original photos excluded).",
);

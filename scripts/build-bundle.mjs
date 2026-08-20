#!/usr/bin/env node
// Assembles dist/codegate-content.json from the bundle-src/ sources.
// Empty sections are omitted so the bundle only carries real content.
//
// Usage: node scripts/build-bundle.mjs [--version YYYY.MM.DD]
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = join(root, "bundle-src");
const distDir = join(root, "dist");

const versionFlag = process.argv.indexOf("--version");
const contentVersion =
  versionFlag !== -1 && process.argv[versionFlag + 1]
    ? process.argv[versionFlag + 1]
    : new Date().toISOString().slice(0, 10).replaceAll("-", ".");

function readSource(name) {
  const path = join(srcDir, name);
  return existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : undefined;
}

function nonEmpty(value) {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value.length > 0 ? value : undefined;
  if (typeof value === "object") {
    const kept = Object.fromEntries(
      Object.entries(value).filter(([, entry]) => nonEmpty(entry) !== undefined),
    );
    return Object.keys(kept).length > 0 ? kept : undefined;
  }
  return value;
}

const bundle = {
  schema_version: "1",
  content_version: contentVersion,
  released_at: new Date().toISOString(),
};

const sections = {
  kb_entries: readSource("kb-entries.json"),
  rules: readSource("rules.json"),
  override_phrases: readSource("override-phrases.json"),
  popular_packages: readSource("popular-packages.json"),
  known_bad: readSource("known-bad.json"),
};
for (const [key, value] of Object.entries(sections)) {
  const kept = nonEmpty(value);
  if (kept !== undefined) bundle[key] = kept;
}

mkdirSync(distDir, { recursive: true });
const outPath = join(distDir, "codegate-content.json");
writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
console.log(`Bundle ${contentVersion} written to ${outPath}`);
console.log(`Sections included: ${Object.keys(bundle).filter((k) => k in sections).join(", ") || "(none)"}`);

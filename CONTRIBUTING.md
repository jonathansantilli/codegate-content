# Contributing

The most valuable contributions are **known-bad indicators**: hashes, package
names, and URLs of confirmed-malicious AI-agent content (skills, MCP server
packages, rule files).

## Adding indicators

1. Edit [`bundle-src/known-bad.json`](bundle-src/known-bad.json) and open a PR.
   The format is documented in
   [codegate's docs/known-bad-format.md](https://github.com/jonathansantilli/codegate/blob/main/docs/known-bad-format.md):
   - `file_sha256` — SHA-256 of the malicious file's UTF-8 content (with or
     without a `sha256:` prefix)
   - `package_names` — exact npm/PyPI package names launched by MCP configs
   - `url_patterns` — case-insensitive substrings matched against URLs found
     in scanned content
   - `finding_fingerprints` — `fingerprint` values from a codegate JSON report
2. In the PR description, include:
   - where the malicious content was observed (registry link, repository,
     campaign write-up), and
   - enough context for a maintainer to verify the entry independently.
3. A maintainer verifies every entry before it ships; indicators reach users
   only through signed releases (see [RELEASING.md](RELEASING.md)).

Entries that could match legitimate content (generic URLs, common package
names) are rejected — every indicator match is a CRITICAL finding, so false
positives are expensive.

## Other content

- `bundle-src/override-phrases.json` — instruction-override phrases
  (`[{ "phrase": "...", "language": "xx" }]`), normalized/lowercased; useful
  for languages the bundled list does not cover yet.
- `bundle-src/popular-packages.json` — well-known MCP package names
  (`{ "npm": [], "pypi": [] }`) that extend typosquat detection.
- `bundle-src/kb-entries.json` / `bundle-src/rules.json` (optional files) —
  knowledge-base entries and detection rules, validated against codegate's
  schemas at load time.

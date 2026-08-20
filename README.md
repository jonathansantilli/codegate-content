# codegate-content

Signed detection-content feed for [CodeGate](https://github.com/jonathansantilli/codegate),
the pre-flight security scanner for AI coding tool configurations.

CodeGate installs ship with bundled detection content. This repository publishes
**content bundles** — knowledge-base entries, detection rules, instruction-override
phrases, popular-package lists for typosquat detection, and known-bad indicators —
so detection content can improve between npm releases of the scanner.

## How it works

- Each release attaches two assets: `codegate-content.json` (the bundle) and
  `codegate-content.json.sig` (a detached Ed25519 signature over the exact bundle bytes).
- CodeGate only downloads content when a user explicitly runs
  `codegate update-kb` or `codegate update-rules` — never during scans.
- The client verifies the signature against a publisher public key pinned in the
  CodeGate npm package **before parsing a single byte**. Tampered, unsigned, or
  wrongly-keyed bundles are rejected and the scanner keeps using bundled content.
- The last two installed versions are kept locally (`~/.codegate/content/`);
  `--rollback` reverts to the previous one.

Bundle format, verification details, and key-custody guidance live in the main repo:
[docs/content-feed.md](https://github.com/jonathansantilli/codegate/blob/main/docs/content-feed.md).

## Contributing indicators

Known-bad indicators (malicious file hashes, package names, URL patterns, finding
fingerprints) are the most valuable contributions. See
[docs/known-bad-format.md](https://github.com/jonathansantilli/codegate/blob/main/docs/known-bad-format.md)
for the format. Open an issue or PR here including:

- the indicator value and which key it belongs under,
- where the malicious content was observed (registry link, repo, campaign write-up), and
- enough context to verify the entry independently.

Indicators ship only through signed releases; maintainers verify every entry before
it is signed.

## Status

No releases yet — the first signed bundle will be published once publisher-key
setup completes in the main repo. Until then, CodeGate installs use their bundled
content (the scanner's default, fail-closed behavior).

# Releasing a content bundle

Maintainers only. Requires the Ed25519 **private** signing key, which lives
offline with the repository owner and must never enter this repository, its
CI secrets, or any log. The matching public key is pinned inside the
`codegate-ai` npm package (`src/content/publisher-key.ts`); clients reject
anything not signed with this key.

## Steps

```bash
# 1. Merge the content changes into main (bundle-src/*.json).

# 2. Build the bundle (version defaults to today's UTC date, e.g. 2026.08.20):
node scripts/build-bundle.mjs

# 3. Sign it with the offline private key:
node scripts/sign-bundle.mjs dist/codegate-content.json /path/to/private-key.pem

# 4. Publish a GitHub release with BOTH files as assets:
gh release create "v$(date -u +%Y.%m.%d)" \
  dist/codegate-content.json dist/codegate-content.json.sig \
  --title "Content $(date -u +%Y.%m.%d)" \
  --notes "See commit history for what changed."

# 5. Verify end to end from any machine:
codegate update-rules --check   # should report the new version
codegate update-rules           # fetch, verify, install, activate
```

CodeGate always downloads from `releases/latest/download/`, so publishing the
release is what makes it live. Users fetch only when they explicitly run the
update commands — never during scans — and every download is
signature-verified before parsing; a bad or unsigned bundle is rejected and
clients keep their previous content.

## Key notes

- **Never** commit `*.pem` files here (ignored by `.gitignore` as a backstop).
- Losing the key: generate a new pair and ship the new public key in a
  codegate patch release; old clients then only accept newly-signed bundles.
- Rotating the key is the same operation, which is why custody matters more
  than recoverability.

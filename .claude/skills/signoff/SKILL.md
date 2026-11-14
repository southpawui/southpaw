---
name: signoff
description: Southpaw UI only. George signs off a component ("sign off", "signoff", "I sign off X", or a coordinator relaying "execute signoff"). In one pass, run /improve on the component, fix every finding, re-verify, commit, push, report to the coordinator, and start the lane's next item. The sign-off is George's approval to commit and push.
---

# signoff: improve → fix all → verify → commit → push → hand over

Run this in the **lane thread** that owns the component. If George says it in the coordinator thread, the coordinator relays it to that lane as "execute signoff for <Component>". Until the skill is committed and restacked into the lane branches, the relay also gives the main repo's absolute path to this file so the lane can read it. The coordinator does not do the work itself.

George's sign-off covers the rest of this flow, including the commit and the push (his rule, 2026-11-13). Don't stop to ask again unless step 3 hits a genuine design question.

## 1. Confirm the target

- The component, its Linear ticket, the current branch and the base branch/SHA.
- `git status`: what's uncommitted. The commit must contain only that component's folder, plus any shared change George already approved (for example tokens). Anything else gets flagged, not committed.

## 2. Run /improve, scoped to the component

Invoke the `improve` skill on `packages/ui/src/components/<Component>/` (plus any approved shared files touched). Ask for an audit of correctness, a11y, API consistency with sibling components, test gaps and story coverage.

- Read the component's LOG.md first. Findings that contradict a "Considered and rejected" entry or a decision George made are discarded, with a note.
- `/improve` only writes plans. You implement them yourself in step 3, not through its `execute` variant.

## 3. Fix everything it finds

Implement **every** valid finding in one pass:

- Each bug fix gets a regression test.
- Trace each finding before fixing it. If it turns out to be false, reject it and log why.
- **Only exception:** a finding that would change a design decision George made, or add a public API or visible behaviour he hasn't seen. Don't decide that alone. Implement the uncontroversial part, log the question in LOG.md, and put it in the handover in step 6. Everything else gets fixed without asking.

## 4. Check again

All of these must pass. Fix and re-run until they do:

- `pnpm test`, the full suite (not just the component)
- `pnpm verify <component>`, with zero a11y violations and inconclusives either fixed or explained in LOG.md
- lint and type-check (`pnpm lint`, `pnpm typecheck`, or whatever the repo's scripts are)
- if the fixes changed anything visual, re-screenshot the affected stories and look at them

Run each command on its own. Never chain `commit && push`: a failed commit must not push.

## 5. LOG.md, commit, push

1. Add a LOG.md entry with the sign-off date, each /improve finding and its fix (or why it was rejected), any open question, and the test count.
2. Stage only the component folder and approved shared files.
3. Commit with a conventional message: `feat(<component>): ...`, a bullet body, `Refs GEO-###`, and the `Co-Authored-By` trailer.
4. **Check the commit landed** (`git log -1`), then `git push -u origin <branch>`.

Hooks: the verify and LOG.md hooks must pass. Never use `--no-verify`.

## 6. Hand over to the coordinator

`ListAgents`, then `SendMessage` to the coordinator session with:

- the component, ticket, branch, base branch @ SHA, and commit SHA;
- check results (test count, verify, lint);
- `/improve` findings fixed, findings rejected, and any **open question for George**;
- the next item.

Don't open a PR; the coordinator does that, and also renames this thread to the next item (see "Thread titles" in the afk skill). Move the Linear ticket to In Review if you can; otherwise say so in the handover.

## 7. Start the next item

Branch off the commit you just pushed, using the next ticket in the lane's queue. Respect its blockedBy relations. Research comes first, then pause for George's approval of scope.

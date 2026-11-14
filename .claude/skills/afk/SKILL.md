---
name: afk
description: George is stepping away ("execute afk", "afk", "I gotta go"). Tell every parallel lane thread to finish its current task then pause, stop the local Storybooks to free memory, and leave a pending-decisions summary for when he's back. Coordinator-session only.
---

# afk: pause the parallel lanes

Run this from the **coordinator** session (the one that raises PRs), not from a lane.

## 1. Find the live lanes

Call `ListAgents`. The lanes are the peer sessions named `Lane N — ...`.

- **Live (idle or busy):** message it with `SendMessage`, using the name exactly as listed.
- **Not listed:** the session has ended, so it's already paused. Don't wake it; the T3 thread keeps its context.

## 2. Send each live lane the AFK notice

Start from this text and fill in that lane's pending decisions:

> AFK: George is away. Finish whatever task you're on, then pause. No need to stop mid-task.
>
> - Don't start new items that need his approval.
> - Leave uncommitted work and a resume note in your component's LOG.md.
> - Your pending decisions (<list>) are already with the coordinator.
> - The coordinator is stopping the Storybooks to save memory. Stop yours too if you started one, and restart it on your port when you resume.

Don't treat the AFK as a sign-off. Lanes still need George's explicit approval to commit or push.

## 3. Stop the Storybooks

- Stop any Storybook this session started (`TaskStop` on its background task id).
- A lane's own Storybook (6007–6009): leave it running if that lane is **busy**, because it may be mid-`pnpm verify`. The notice tells the lane to stop it.
- If George asks to "kill all localhosts", first check which processes hold ports 6006–6009 (`lsof -nP -iTCP:6006-6009 -sTCP:LISTEN`). Confirm they're Storybook/node, then kill them.

## 4. Report to George

Give a short summary:

- what each lane is doing or has paused on;
- PRs raised this session;
- **every decision waiting on him**, grouped by lane, with recommendations, so he can answer in one line when he's back (e.g. "all recs, Toast subtle").

Also write the summary to the session scratchpad as `afk-status.md`, so it survives context compaction.

## Resuming ("I'm back")

1. Re-read the pending decisions.
2. Start the Storybooks the review needs, on the lane worktree paths from `git worktree list`: `cd <worktree> && STORYBOOK_PORT=<port> pnpm --filter @southpawui/storybook dev`. Run it in the background with a long timeout.
3. Relay George's answers to each lane. A lane with no live session is woken with T3 `t3_thread_send` on its thread id.

## Thread titles (coordinator keeps these current)

Every time a lane reports (a handover, a pause or a status update), the coordinator renames that lane's T3 thread with `t3_thread_update` (`action: "rename"`):

`L<n> · <Component> (GEO-###) — <state>`

| State                  | When                                                 |
| ---------------------- | ---------------------------------------------------- |
| `researching`          | doing the 9-library research                         |
| `needs your decisions` | paused on scope questions for George                 |
| `building`             | implementing, stories, tests, verify                 |
| `ready for review`     | verify passes; waiting for George's Storybook review |
| `signing off`          | running the signoff skill                            |
| `paused`               | AFK, nothing pending for George                      |
| `done`                 | lane queue finished                                  |

On AFK, a lane with nothing pending becomes `— paused`, and a lane waiting on George keeps `— needs your decisions` or `— ready for review`, so the sidebar shows what needs him. The coordinator thread stays `Coordinator · Phase 2 lanes + PRs`.

Lane thread ids are in the parallel-lanes memory and in the T3 links.

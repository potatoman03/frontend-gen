# frontend-studio

A [skills.sh](https://skills.sh) skill for building tasteful, production-grade frontends. Installed via `npx skills add <user>/frontend-workflow`.

## Repo structure

```
SKILL.md                       # The skill — decision framework + technique library
assets/
  mood-board-viewer.html       # Interactive workbench template (served on localhost)
  serve-workbench.mjs          # Node server for static files + spec saving
CLAUDE.md                      # This file — dev instructions for the skill repo
README.md                      # GitHub / skills.sh listing
```

## What this is

This is a **skill**, not an app. It contains no runtime code, no dependencies, no build step. The `SKILL.md` file is the entire product — it's a structured prompt that gets loaded into Claude's context when activated. The `assets/` directory contains templates the agent uses during execution.

## How to test locally

1. Symlink into your Claude skills directory:
   ```bash
   ln -s /path/to/frontend-workflow ~/.claude/skills/frontend-studio
   ```

2. The skill should appear when you type `/` in Claude Code. Invoke it with a brief like:
   ```
   /frontend-studio Build a landing page for a coffee roastery
   ```

3. Verify the mood board flow: the agent should generate 3 design directions, serve them on localhost, and wait for your selection before building.

## How it works

1. User invokes the skill with a frontend brief
2. Agent reads `SKILL.md` for the decision framework and technique library
3. Agent generates 3 distinct design directions (Phase 0)
4. Agent injects specs into `assets/mood-board-viewer.html`, starts `assets/serve-workbench.mjs` on localhost
5. User customizes in the workbench (mix tokens, reorder sections, add comments) and clicks Confirm
6. Workbench PUTs the confirmed spec to `.mood-boards-spec.json` via the server
7. User says "confirmed" — agent reads the spec file and builds the frontend
8. Agent self-reviews against quality rules before presenting output

## Docs

- skills.sh: https://skills.sh
- Claude Code skills: https://docs.anthropic.com/en/docs/claude-code/skills

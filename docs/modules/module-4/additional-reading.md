# Module 4 Additional Reading

## Source
- <a href="../../assets/pdf/module-4-additional-readings.pdf" target="_blank" rel="noopener noreferrer">Module 4 Additional Readings (PDF)</a>

Use this reading pack to deepen CI/CD, Docker, documentation, and workflow governance practices.

## Extracted reference digest
From the source PDF, Module 4 reading is structured around:

1. Core-first reading: minimum references that directly map to module demos.
2. Verification-first behavior when docs and tutorials disagree: trust your repo, inspect diffs, run commands, verify outputs, then refine.
3. Terminal-agent workflow understanding (repo-wide context, multi-file tasks, plan-before-editing).
4. Project memory and instruction hygiene using `CLAUDE.md` conventions.
5. Practical Docker and CI quality patterns: multi-stage builds, `.dockerignore`, smaller images, non-root user guidance, and human-reviewed AI code review.

## Core references called out in the source
The source explicitly emphasizes:

- Claude Code overview and common workflows
- Claude project memory / `CLAUDE.md` guidance
- Docker build best practices
- Responsible AI code review guidance

## How to apply this in your repo
1. Treat generated workflow/docker/docs artifacts as draft proposals until verified by command output and behavior evidence.
2. Keep `CLAUDE.md` updated with stack, commands, and boundaries before repo-level AI tasks.
3. For CI and Docker, capture green -> red -> green and container `/health` verification as documented evidence.

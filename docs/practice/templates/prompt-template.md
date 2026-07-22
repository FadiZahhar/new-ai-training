# Prompt Template

## Context
Give concrete repo/module context so AI works from reality, not assumptions.

- Repository:
- Module/feature area:
- Relevant files:
- Current behavior:

## Objective
State one specific outcome.

- Desired result:
- Why this matters:
- Success condition:

## Constraints
- Do not change unrelated files.
- Preserve existing behavior unless explicitly required.
- Surface uncertainty instead of guessing.
- Follow project conventions and naming.
- Keep output scoped and reviewable.

Add task-specific constraints:
- 
- 

## Inputs
- Requirement text:
- Existing code snippet or file references:
- Known edge cases:
- Test expectations:

## Output Format
Request structured output:

1. Plan (short and scoped)
2. Files to change
3. Step-by-step implementation
4. Verification checklist
5. Risks/assumptions

## Quality guardrails
Ask the assistant to:
- Cite which files were used.
- Explain tradeoffs.
- Call out missing context.
- Propose smallest safe change first.

## Prompt examples

### Example 1: feature implementation
```text
You are a senior engineer working in <repo>.
Context:
- Feature area: <module/feature>
- Files: <file1>, <file2>, <file3>
- Current behavior: <summary>

Objective:
Implement <feature> with minimal safe changes.

Constraints:
- Do not edit unrelated files
- Keep behavior backward-compatible unless stated
- If uncertain, state assumptions first

Output format:
1) scoped plan
2) exact files to edit
3) implementation steps
4) test/verification steps
5) risks and fallback
```

### Example 2: code review and correction
```text
Review this diff for correctness, edge cases, security, and test gaps.
For each issue include:
- severity
- exact location
- why it matters
- concrete fix suggestion
If no issue, explain what was checked.
```

### Example 3: debugging
```text
Given failing behavior: <describe failure>
Use this context:
- logs/errors: <paste>
- relevant files: <list>
- expected behavior: <describe>

Return:
1) likely root causes ranked
2) fastest safe diagnostic steps
3) minimal fix proposal
4) regression tests to add
```

## Final ownership note
Always review and verify AI output before accepting changes.

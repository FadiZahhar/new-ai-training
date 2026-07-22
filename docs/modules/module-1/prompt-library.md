# Module 1 Prompt Library Reference

This page captures the Module 1 prompt-library guidance as a reusable reference for the team.

## How to use these prompts
1. Copy one prompt pattern.
2. Fill the placeholders with your repo context and task goal.
3. Run the prompt, inspect the output, then refine using evidence from code/tests.

## Prompt pattern 1: task framing
Use this when starting a feature or bug fix.

```text
You are a senior <stack> engineer working in <repo-name>.
Goal: <what needs to be built/fixed>
Constraints:
- Do not change unrelated files
- Keep existing behavior unless explicitly asked
- Explain assumptions
Output:
1) Implementation plan
2) Files to modify
3) Step-by-step changes
```

## Prompt pattern 2: code review and risk scan
Use this before merging AI-generated code.

```text
Review the following diff for:
1) correctness bugs
2) missing edge cases
3) security/performance risks
4) test gaps

For each issue provide:
- severity
- exact location
- why it matters
- suggested fix
```

## Prompt pattern 3: test-first iteration
Use this to keep delivery grounded in verification.

```text
Given this requirement: <requirement>
Propose:
1) test cases first (happy path + edge cases)
2) minimal implementation steps
3) validation checklist

Only include changes needed for this requirement.
```

## Prompt pattern 4: documentation handoff
Use this when converting implementation into team knowledge.

```text
Summarize this change for team handoff:
1) problem statement
2) solution approach
3) files changed and why
4) tradeoffs/known limitations
5) how to verify locally
```

## Usage rule
Treat prompts as starting points, not source of truth. Keep ownership by validating every accepted output.

## Generate module prompt files
Use the tool to generate downloadable `.md` prompts for Module 1 examples:

- [Mindset Reflection Generator](../../practice/prompt-generator.md?module=module-1&topic=Mindset+Reflection)
- [Prompt Structure Practice Generator](../../practice/prompt-generator.md?module=module-1&topic=Prompt+Structure+Practice)
- [Prompt Refinement Generator](../../practice/prompt-generator.md?module=module-1&topic=Prompt+Refinement+Exercise)

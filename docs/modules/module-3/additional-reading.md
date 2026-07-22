# Module 3 Additional Reading

## Source
- <a href="https://fadizahhar.github.io/new-ai-training/assets/pdf/module-3-additional-readings.pdf" target="_blank" rel="noopener noreferrer">Module 3 Additional Readings (PDF)</a>

Use this reading pack to deepen frontend implementation, testing, and debugging practices.

## Extracted reference digest
From the source PDF, Module 3 additional readings focus on:

1. Using Copilot in IDE with scoped prompts (selected code/files) instead of vague repo-wide requests.
2. Building frontend behavior incrementally and validating with evidence, not visual assumptions.
3. Native drag-and-drop fundamentals (draggable item, transferred data, drop target, drag events).
4. Fetch API behavior details, especially that non-2xx responses do not auto-throw and must be checked explicitly.
5. AI-assisted test drafting with explicit test requirements and manual verification.

## Core references called out in the source
The source highlights these practical references:

- GitHub Copilot best-practice guidance
- GitHub Copilot IDE question workflows
- VS Code inline chat for selected-block edits
- MDN HTML Drag and Drop API
- MDN Fetch API
- Copilot-assisted testing guidance

## How to apply this in your repo
1. Ask AI for small targeted edits on selected handlers/functions instead of full-file rewrites.
2. In frontend networking code, always branch on `response.ok` (or status) and handle server 404/422 explicitly.
3. Use devtools evidence (status, payload, console, network) in debugging notes for each bug fix.

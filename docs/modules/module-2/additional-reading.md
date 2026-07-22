# Module 2 Additional Reading

## Source
- <a href="https://fadizahhar.github.io/new-ai-training/assets/pdf/module-2-additional-readings.pdf" target="_blank" rel="noopener noreferrer">Module 2 Additional Readings (PDF)</a>

Use this reading pack to deepen backend implementation and verification practices.

## Extracted reference digest
Based on the source PDF, Module 2 additional reading is intentionally scoped to:

1. Turn the Module 1 skeleton into a verified backend with strict Pydantic v2 models, in-memory storage, CRUD endpoints, status-transition rules, and pytest plus Break Test evidence.
2. Use editor-based AI with real file context, review before apply, and avoid autonomous-agent/platform setup topics in this module.
3. Map FastAPI fundamentals directly to Task Tracker behavior: request body models, response models, route status codes, path/query usage, and explicit error handling.
4. Treat partial updates carefully (`PATCH` and `exclude_unset`) and separate value validation from state-transition validation.
5. Keep tests practical: TestClient basics, fixture setup, status assertions, and proving tests fail when code is intentionally broken.

## Core references called out in the source
The source specifically points learners to these reference categories:

- Editor AI prompting in IDE (file-aware context)
- FastAPI request/response/status code docs
- FastAPI path/query/error handling docs
- Pydantic v2 models/validators/config/serialization docs
- FastAPI PATCH behavior docs
- FastAPI testing + pytest fixtures docs

## How to apply this in your repo
1. Before asking AI to write backend code, attach `app/main.py`, `app/models.py`, and `app/storage.py` in the prompt context.
2. For each endpoint, capture expected status codes and failure cases in tests before accepting generated code.
3. Add at least one deliberate break in backend logic to prove tests catch regressions.

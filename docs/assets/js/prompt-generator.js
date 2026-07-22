(() => {
  const root = document.getElementById("module-prompt-generator");
  if (!root) return;

  const moduleTopics = {
    "module-1": [
      "Mindset Reflection",
      "Prompt Structure Practice",
      "Prompt Refinement Exercise",
      "FastAPI Skeleton Planning"
    ],
    "module-2": [
      "Pydantic Model Design",
      "CRUD Endpoint Step Plan",
      "Business Rules Validation",
      "Break Test Strategy"
    ],
    "module-3": [
      "Kanban UI Build Plan",
      "Fetch/API Error Handling",
      "Debugging Evidence Workflow",
      "Frontend Refactor Safety"
    ],
    "module-4": [
      "CI Pipeline Validation",
      "Docker Hardening Checklist",
      "Docs Accuracy Review",
      "Repo-level Agent Guardrails"
    ],
    "module-5": [
      "Governance Prompt Design",
      "Security Review Prompt",
      "Context Engineering Plan",
      "AI Playbook Drafting"
    ]
  };

  const qs = new URLSearchParams(window.location.search);
  const initialModule = qs.get("module") || "module-1";
  const initialTopic = qs.get("topic") || moduleTopics[initialModule][0];

  root.innerHTML = `
    <div class="prompt-gen">
      <label>Module
        <select id="pg-module">
          ${Object.keys(moduleTopics).map((m) => `<option value="${m}" ${m === initialModule ? "selected" : ""}>${m}</option>`).join("")}
        </select>
      </label>
      <label>Topic
        <select id="pg-topic"></select>
      </label>
      <label>Objective
        <input id="pg-objective" placeholder="What should this prompt achieve?" />
      </label>
      <label>Context files
        <input id="pg-files" placeholder="app/main.py, app/models.py, ..." />
      </label>
      <label>Constraints
        <textarea id="pg-constraints" placeholder="Do not change unrelated files&#10;Provide uncertainty when missing context"></textarea>
      </label>
      <label>Output format
        <textarea id="pg-output" placeholder="1) Plan&#10;2) Files to change&#10;3) Verification checklist"></textarea>
      </label>
      <div class="card-actions">
        <button id="pg-generate">Generate Markdown</button>
        <button id="pg-copy">Copy</button>
        <button id="pg-download">Download .md</button>
      </div>
      <textarea id="pg-result" placeholder="Generated markdown will appear here..."></textarea>
    </div>
  `;

  const moduleEl = root.querySelector("#pg-module");
  const topicEl = root.querySelector("#pg-topic");
  const objectiveEl = root.querySelector("#pg-objective");
  const filesEl = root.querySelector("#pg-files");
  const constraintsEl = root.querySelector("#pg-constraints");
  const outputEl = root.querySelector("#pg-output");
  const resultEl = root.querySelector("#pg-result");

  function fillTopics() {
    const topics = moduleTopics[moduleEl.value] || [];
    topicEl.innerHTML = topics.map((t) => `<option value="${t}">${t}</option>`).join("");
    const match = topics.includes(initialTopic) ? initialTopic : topics[0];
    if (match) topicEl.value = match;
  }

  function buildMarkdown() {
    const mod = moduleEl.value;
    const topic = topicEl.value || "";
    const objective = objectiveEl.value.trim() || "Describe the task objective here.";
    const files = filesEl.value.trim() || "List file paths here.";
    const constraints = constraintsEl.value.trim() || "Do not edit unrelated files.\nState assumptions explicitly.";
    const output = outputEl.value.trim() || "1) Plan\n2) File changes\n3) Verification checklist";

    return [
      `# ${mod} - ${topic} Prompt`,
      "",
      "## Context",
      `- Module: ${mod}`,
      `- Topic: ${topic}`,
      `- Related files: ${files}`,
      "",
      "## Objective",
      objective,
      "",
      "## Constraints",
      ...constraints.split("\n").map((l) => `- ${l}`),
      "",
      "## Prompt",
      "```text",
      `You are a senior software engineer helping with ${mod} (${topic}).`,
      "Use the repository context and produce scoped, verifiable output.",
      "",
      `Objective: ${objective}`,
      `Files: ${files}`,
      "",
      "Constraints:",
      ...constraints.split("\n").map((l) => `- ${l}`),
      "",
      "Output format:",
      ...output.split("\n").map((l) => `- ${l}`),
      "```",
      "",
      "## Verification Notes",
      "- [ ] Output matches module objective",
      "- [ ] Constraints respected",
      "- [ ] Evidence and test steps included"
    ].join("\n");
  }

  function download(name, content) {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  fillTopics();
  moduleEl.addEventListener("change", fillTopics);

  root.querySelector("#pg-generate").addEventListener("click", () => {
    resultEl.value = buildMarkdown();
  });

  root.querySelector("#pg-copy").addEventListener("click", async () => {
    if (!resultEl.value.trim()) resultEl.value = buildMarkdown();
    try {
      await navigator.clipboard.writeText(resultEl.value);
    } catch {
      resultEl.select();
      document.execCommand("copy");
    }
  });

  root.querySelector("#pg-download").addEventListener("click", () => {
    if (!resultEl.value.trim()) resultEl.value = buildMarkdown();
    const file = `${moduleEl.value}-${(topicEl.value || "topic").toLowerCase().replace(/\s+/g, "-")}-prompt.md`;
    download(file, resultEl.value);
  });
})();

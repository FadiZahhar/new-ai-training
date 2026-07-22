(() => {
  const root = document.getElementById("certificate-generator-tool");
  if (!root) return;

  const key = "ai-training-progress-v5";
  let state = {};
  try {
    state = JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    state = {};
  }

  root.innerHTML = `
    <div class="prompt-gen">
      <label>Learner name
        <input id="cert-name" placeholder="Enter learner name" value="${state.playerName || ""}" />
      </label>
      <div class="card-actions">
        <button id="cert-generate">Generate Certificate Markdown</button>
        <button id="cert-copy">Copy</button>
        <button id="cert-download">Download .md</button>
      </div>
      <textarea id="cert-output" placeholder="Certificate markdown will appear here..."></textarea>
    </div>
  `;

  const nameEl = root.querySelector("#cert-name");
  const outputEl = root.querySelector("#cert-output");

  function count(obj) {
    return obj ? Object.keys(obj).length : 0;
  }

  function generate() {
    const name = nameEl.value.trim() || "Learner";
    const date = new Date().toISOString().slice(0, 10);
    const progress = state ? (
      count(state.moduleResults) +
      count(state.missionResults) +
      count(state.questStatus)
    ) : 0;
    const level = state.level || 1;
    const xp = state.xp || 0;
    const readiness = state.simulationScore || 0;
    const status = readiness >= 90 ? "Release Ready" : readiness >= 70 ? "Almost Ready" : "In Progress";

    return [
      "# Certificate of Completion (Draft)",
      "",
      `This certifies that **${name}** completed major milestones in the AI Training Program.`,
      "",
      `- Date: ${date}`,
      `- Level: ${level}`,
      `- XP: ${xp}`,
      `- Completed milestones: ${progress}`,
      `- Final readiness score: ${readiness}% (${status})`,
      "",
      "## Achievement statement",
      `${name} demonstrated evidence-driven AI-assisted development practices, including scoped prompting, verification-first execution, and ownership-focused review behavior.`,
      "",
      "## Facilitator signature",
      "- Name:",
      "- Date:",
      "- Notes:"
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

  root.querySelector("#cert-generate").addEventListener("click", () => {
    outputEl.value = generate();
  });

  root.querySelector("#cert-copy").addEventListener("click", async () => {
    if (!outputEl.value.trim()) outputEl.value = generate();
    try {
      await navigator.clipboard.writeText(outputEl.value);
    } catch {
      outputEl.select();
      document.execCommand("copy");
    }
  });

  root.querySelector("#cert-download").addEventListener("click", () => {
    if (!outputEl.value.trim()) outputEl.value = generate();
    const file = `${(nameEl.value.trim() || "learner").toLowerCase().replace(/\s+/g, "-")}-certificate.md`;
    download(file, outputEl.value);
  });
})();

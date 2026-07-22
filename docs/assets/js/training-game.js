(() => {
  const root = document.getElementById("interactive-training-app");
  if (!root) return;

  const STORAGE_KEY = "ai-training-progress-v3";
  const XP_PER_LEVEL = 120;

  const moduleQuizzes = [
    {
      id: "module-1",
      title: "Module 1: Foundations",
      notesUrl: "../../modules/module-1/lecture-notes/",
      recommendUrl: "../../modules/module-1/qa/",
      questions: [
        {
          prompt: "What is the safest assumption about AI-generated code?",
          options: ["It is production-ready if it compiles", "It is a draft that requires verification", "It is correct if the prompt is long", "It is reliable if copied from examples"],
          answer: 1,
          explanation: "Module 1 frames AI output as plausible draft code that still requires validation."
        },
        {
          prompt: "Which loop best represents disciplined AI-assisted delivery?",
          options: ["Ask -> Accept -> Merge", "Ask -> Inspect -> Run -> Test -> Refine", "Prompt -> Copy -> Ship", "Ask -> Rewrite everything manually"],
          answer: 1,
          explanation: "Verification is mandatory before acceptance."
        },
        {
          prompt: "Which output is expected in Module 1 evidence?",
          options: ["A fully deployed production app", "A reflection log with AI-right/AI-corrected assumptions", "A new microservice", "A database migration strategy"],
          answer: 1,
          explanation: "The module expects learning evidence, not feature expansion."
        }
      ]
    },
    {
      id: "module-2",
      title: "Module 2: Backend Build Discipline",
      notesUrl: "../../modules/module-2/lecture-notes/",
      recommendUrl: "../../modules/module-2/additional-reading/",
      questions: [
        {
          prompt: "What sequence aligns with Module 2 implementation flow?",
          options: ["UI -> tests -> model", "Model -> storage -> CRUD -> business rules -> tests", "Docs -> Docker -> CI", "Agent setup -> deployment"],
          answer: 1,
          explanation: "Module 2 is a connected staged backend build."
        },
        {
          prompt: "Why does Module 2 require a Break Test?",
          options: ["To speed development", "To prove tests fail when code is intentionally broken", "To reduce the number of tests", "To avoid manual review"],
          answer: 1,
          explanation: "A test suite must show fault-detection ability."
        },
        {
          prompt: "What is emphasized for editor AI usage in Module 2 readings?",
          options: ["Generic prompts with no files", "File-aware prompts against actual repository files", "Autonomous multi-repo agents", "Skipping review for generated models"],
          answer: 1,
          explanation: "Source readings explicitly prioritize file/context references."
        }
      ]
    },
    {
      id: "module-3",
      title: "Module 3: Frontend Confidence",
      notesUrl: "../../modules/module-3/lecture-notes/",
      recommendUrl: "../../modules/module-3/additional-reading/",
      questions: [
        {
          prompt: "What critical fetch behavior is highlighted in Module 3 readings?",
          options: ["Fetch retries by default", "Fetch requires explicit status handling for non-2xx", "Fetch bypasses CORS automatically", "Fetch never returns 422"],
          answer: 1,
          explanation: "Readings emphasize explicit response status checks."
        },
        {
          prompt: "What is the recommended AI edit style for Module 3?",
          options: ["Whole-file rewrites", "Selected-block scoped edits with review", "No diff inspection", "No tests after edit"],
          answer: 1,
          explanation: "Inline scoped edits reduce risk and improve review quality."
        },
        {
          prompt: "What evidence should drive debugging decisions?",
          options: ["UI intuition only", "Status codes, payloads, console/network traces, and tests", "AI confidence score", "Code length"],
          answer: 1,
          explanation: "Module 3 requires evidence-based debugging."
        }
      ]
    },
    {
      id: "module-4",
      title: "Module 4: Workflow and CI/CD",
      notesUrl: "../../modules/module-4/lecture-notes/",
      recommendUrl: "../../modules/module-4/additional-reading/",
      questions: [
        {
          prompt: "What is a required evidence pattern in CI validation?",
          options: ["One green run only", "Green -> intentional red -> restored green", "No run history needed", "Screenshot only"],
          answer: 1,
          explanation: "Source notes explicitly require this cycle."
        },
        {
          prompt: "Why is CLAUDE.md emphasized?",
          options: ["For branding", "To anchor project memory, commands, constraints, and boundaries", "To replace README", "To skip planning"],
          answer: 1,
          explanation: "Project memory improves repo-level agent reliability."
        },
        {
          prompt: "How should AI code review be used in Module 4 context?",
          options: ["As a full replacement for human review", "As triage input that still requires human validation", "Only for style", "Only before writing code"],
          answer: 1,
          explanation: "AI review supplements but does not replace ownership."
        }
      ]
    },
    {
      id: "module-5",
      title: "Module 5: Governance and Ownership",
      notesUrl: "../../modules/module-5/lecture-notes/",
      recommendUrl: "../../modules/module-5/additional-reading/",
      questions: [
        {
          prompt: "Which posture best describes Module 5?",
          options: ["AI proposes, developer grades and owns", "AI owns architecture choices", "Developer accepts all suggestions", "Speed over traceability"],
          answer: 0,
          explanation: "Governance requires explicit human grading decisions."
        },
        {
          prompt: "What does AGENTS.md provide in Module 5 setup?",
          options: ["Theme customization", "Repo-level operating constraints and expectations", "Dependency management", "A test runner replacement"],
          answer: 1,
          explanation: "Module 5 uses AGENTS.md to constrain and guide AI behavior."
        },
        {
          prompt: "How should security findings from AI be handled?",
          options: ["Merged directly", "Classified and validated with manual review lenses", "Ignored unless critical", "Converted to docs only"],
          answer: 1,
          explanation: "Module 5 additional reading stresses secure review accountability."
        }
      ]
    }
  ];

  const readingMissions = [
    { id: "reading-2", title: "Reading Mission: Module 2", sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-2-additional-readings.pdf", sourcePageUrl: "../../modules/module-2/additional-reading/", questions: [
      { prompt: "Module 2 additional reading is scoped to backend implementation verification, not production deployment architecture.", options: ["True", "False"], answer: 0, explanation: "The source limits scope intentionally." },
      { prompt: "Which topic is explicitly out-of-scope in Module 2 reading?", options: ["CRUD verification", "Pydantic validators", "Autonomous agents and enterprise setup", "FastAPI error basics"], answer: 2, explanation: "The reading tells students to skip autonomous/enterprise setup." }
    ] },
    { id: "reading-3", title: "Reading Mission: Module 3", sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-3-additional-readings.pdf", sourcePageUrl: "../../modules/module-3/additional-reading/", questions: [
      { prompt: "Module 3 reading recommends selected-code prompts over vague repo-wide prompts.", options: ["True", "False"], answer: 0, explanation: "Scoped prompts are emphasized." },
      { prompt: "Which API detail is critical in Module 3 reading?", options: ["Fetch always throws on 404", "Fetch requires explicit non-2xx handling", "Fetch ignores response status", "Fetch resolves CORS"], answer: 1, explanation: "Status handling must be explicit." }
    ] },
    { id: "reading-4", title: "Reading Mission: Module 4", sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-4-additional-readings.pdf", sourcePageUrl: "../../modules/module-4/additional-reading/", questions: [
      { prompt: "When docs and repo differ, what is recommended?", options: ["Trust docs first", "Trust repo evidence and verify output", "Skip verification", "Ask AI to choose"], answer: 1, explanation: "Repository evidence wins." },
      { prompt: "Which Docker guidance is highlighted?", options: ["Always run root", "Multi-stage + non-root runtime guidance", "Ignore dockerignore", "Single-stage only"], answer: 1, explanation: "The reading highlights safer image practices." }
    ] },
    { id: "reading-5", title: "Reading Mission: Module 5", sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-5-additional-readings.pdf", sourcePageUrl: "../../modules/module-5/additional-reading/", questions: [
      { prompt: "AGENTS.md in Module 5 is mainly for:", options: ["Theme layout", "AI instruction boundaries", "Database schema", "CI deployment"], answer: 1, explanation: "It provides operating constraints and guidance." },
      { prompt: "Security review in Module 5 should use:", options: ["Generic comments only", "Focused review lenses like input validation and data exposure", "No manual review", "Style checks only"], answer: 1, explanation: "OWASP/OpenSSF guidance is security-specific." }
    ] }
  ];

  const learningQuests = [
    {
      id: "quest-module2-backend",
      title: "Quest: Backend Integrity Sprint",
      xp: 45,
      tasks: [
        "Read Module 2 additional reading digest",
        "Draft one strict file-aware prompt",
        "Define one Break Test case"
      ]
    },
    {
      id: "quest-module3-debug",
      title: "Quest: Frontend Debug Detective",
      xp: 45,
      tasks: [
        "Capture one request/response evidence pair",
        "Write one root-cause hypothesis",
        "Write one verification step after fix"
      ]
    },
    {
      id: "quest-module4-release",
      title: "Quest: Release Evidence Builder",
      xp: 50,
      tasks: [
        "List one CI red->green scenario",
        "List one container /health verification command",
        "State one repo-level guardrail"
      ]
    }
  ];

  const scenarioSets = [
    {
      id: "scenario-backend-owner",
      role: "Backend Owner",
      prompt: "AI proposes a PATCH endpoint update but changed status transition rules silently.",
      choices: [
        { text: "Merge quickly because tests pass", score: 0, feedback: "Risky: business rule drift can hide behind partial tests." },
        { text: "Inspect diff, add transition tests, then accept/reject", score: 2, feedback: "Correct: protects integrity and ownership." },
        { text: "Rewrite everything manually without review notes", score: 1, feedback: "Safer than blind merge but misses team learning evidence." }
      ]
    },
    {
      id: "scenario-review-lead",
      role: "Review Lead",
      prompt: "AI review flags 12 issues; some are noisy and two look severe.",
      choices: [
        { text: "Reject all comments to save time", score: 0, feedback: "This drops potentially critical findings." },
        { text: "Classify useful/noise/wrong and verify severe findings manually", score: 2, feedback: "Correct: triage plus verification." },
        { text: "Accept all findings and open bulk fixes", score: 1, feedback: "Can introduce unnecessary churn and wrong fixes." }
      ]
    },
    {
      id: "scenario-release-owner",
      role: "Release Owner",
      prompt: "CI is green but Docker runs as root and docs mismatch API responses.",
      choices: [
        { text: "Ship now; CI is green", score: 0, feedback: "Green CI alone does not prove release readiness." },
        { text: "Block release, fix Docker user and docs evidence", score: 2, feedback: "Correct: release readiness includes security and accurate docs." },
        { text: "Disable Docker check for now", score: 0, feedback: "Disabling checks hides risk." }
      ]
    }
  ];

  const bossQuestions = [
    { prompt: "Final project success mainly proves:", options: ["Feature volume", "Release-readiness and AI ownership evidence", "UI animation quality", "No documentation"], answer: 1, explanation: "The brief prioritizes readiness and ownership evidence." },
    { prompt: "If AI cannot cite files for a claim, you should:", options: ["Accept anyway", "Mark uncertain and request evidence", "Ignore and continue", "Delete tests"], answer: 1, explanation: "Evidence-backed claims are required." },
    { prompt: "Additional readings are best used as:", options: ["A one-time full read", "Targeted lookup references while implementing", "A replacement for labs", "Optional noise"], answer: 1, explanation: "They are practical references for implementation decisions." },
    { prompt: "The safest cross-module AI habit is:", options: ["Big unbounded prompts", "Scoped prompts + inspect/run/test/refine", "Skip review when fast", "Trust generated infra by default"], answer: 1, explanation: "Course workflow is consistent across modules." }
  ];

  const simulatorChecks = [
    { id: "sim-readme", label: "README includes clear setup + run + test + docker steps", weight: 20 },
    { id: "sim-ci", label: "CI workflow evidence includes green -> red -> green chain", weight: 20 },
    { id: "sim-docker", label: "Docker evidence includes build, run, /health, non-root rationale", weight: 20 },
    { id: "sim-ai", label: "AI governance evidence includes accepted/rejected reasoning", weight: 20 },
    { id: "sim-scope", label: "Scope control proved (no unrelated feature creep)", weight: 20 }
  ];

  const initialState = () => ({
    xp: 0,
    level: 1,
    coins: 0,
    badges: [],
    moduleResults: {},
    missionResults: {},
    sourceReviewed: {},
    questStatus: {},
    scenarioScores: {},
    simulationChecks: {},
    simulationScore: 0,
    simulationReady: false,
    bossCleared: false,
    currentStreak: 0,
    lastActiveDate: null,
    playerName: "",
    teamSnapshots: []
  });

  const state = loadState();
  let activeFlow = null;
  let activeIndex = 0;
  let activeCorrect = 0;
  let activeStartedAt = 0;
  let activeTab = "dashboard";

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && typeof parsed === "object" ? { ...initialState(), ...parsed } : initialState();
    } catch {
      return initialState();
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore local storage write failures.
    }
  }

  function updateLevel() {
    state.level = Math.max(1, Math.floor(state.xp / XP_PER_LEVEL) + 1);
  }

  function gainXp(amount) {
    state.xp += amount;
    state.coins += Math.max(1, Math.round(amount / 8));
    updateLevel();
  }

  function awardBadge(name) {
    if (!state.badges.includes(name)) state.badges.push(name);
  }

  function updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (!state.lastActiveDate) {
      state.currentStreak = 1;
      state.lastActiveDate = today;
      return;
    }
    if (state.lastActiveDate === today) return;
    const current = new Date(today);
    const previous = new Date(state.lastActiveDate);
    const diffDays = Math.floor((current - previous) / (1000 * 60 * 60 * 24));
    state.currentStreak = diffDays === 1 ? state.currentStreak + 1 : 1;
    state.lastActiveDate = today;
  }

  function completedCount(obj) {
    return Object.keys(obj).length;
  }

  function bossUnlocked() {
    return completedCount(state.moduleResults) >= 3 && completedCount(state.missionResults) >= 3;
  }

  function readinessFromSimulator() {
    if (state.simulationScore >= 90) return "Release Ready";
    if (state.simulationScore >= 70) return "Almost Ready";
    return "Not Ready";
  }

  function getOverallProgress() {
    const total = moduleQuizzes.length + readingMissions.length + learningQuests.length + scenarioSets.length + 2;
    const done =
      completedCount(state.moduleResults) +
      completedCount(state.missionResults) +
      completedCount(state.questStatus) +
      completedCount(state.scenarioScores) +
      (state.bossCleared ? 1 : 0) +
      (state.simulationReady ? 1 : 0);
    return Math.round((done / total) * 100);
  }

  function render() {
    root.innerHTML = `
      <div class="game-shell">
        ${renderHeader()}
        ${renderTabs()}
        <div id="game-panel">${renderPanel()}</div>
        <div id="challenge-stage"></div>
      </div>
    `;
    bindGlobalActions();
  }

  function renderHeader() {
    const progress = getOverallProgress();
    return `
      <div class="game-header">
        <h2>Interactive Challenge Hub</h2>
        <p>Quests, scenarios, adaptive quizzes, team mode, and release simulator. Progress is saved in this browser.</p>
      </div>
      <div class="game-stats">
        <div class="stat-card"><span>XP</span><strong>${state.xp}</strong></div>
        <div class="stat-card"><span>Level</span><strong>${state.level}</strong></div>
        <div class="stat-card"><span>Coins</span><strong>${state.coins}</strong></div>
        <div class="stat-card"><span>Streak</span><strong>${state.currentStreak} day(s)</strong></div>
      </div>
      <div class="progress-wrap">
        <div class="progress-label">Training progress: ${progress}%</div>
        <div class="progress-bar"><span style="width:${progress}%"></span></div>
      </div>
      <div class="badge-wrap">
        <h3>Badges</h3>
        ${state.badges.length ? `<div class="badge-grid">${state.badges.map((badge) => `<span class="badge-item">${badge}</span>`).join("")}</div>` : "<p>No badges yet. Complete any activity to begin.</p>"}
      </div>
    `;
  }

  function renderTabs() {
    const tabs = [
      { id: "dashboard", label: "Dashboard" },
      { id: "quiz", label: "Quiz Arena" },
      { id: "missions", label: "Reading Missions" },
      { id: "quests", label: "Learning Quests" },
      { id: "scenario", label: "Scenario Mode" },
      { id: "boss", label: "Boss Arena" },
      { id: "simulator", label: "Final Simulator" },
      { id: "team", label: "Team Mode" }
    ];
    return `<div class="tab-row">${tabs.map((tab) => `<button class="tab-btn ${activeTab === tab.id ? "active" : ""}" data-action="tab" data-tab="${tab.id}">${tab.label}</button>`).join("")}</div>`;
  }

  function renderPanel() {
    if (activeTab === "quiz") return renderQuizPanel();
    if (activeTab === "missions") return renderMissionPanel();
    if (activeTab === "quests") return renderQuestPanel();
    if (activeTab === "scenario") return renderScenarioPanel();
    if (activeTab === "boss") return renderBossPanel();
    if (activeTab === "simulator") return renderSimulatorPanel();
    if (activeTab === "team") return renderTeamPanel();
    return renderDashboardPanel();
  }

  function renderDashboardPanel() {
    return `
      <div class="panel-card">
        <h3>Progress dashboard</h3>
        <p><strong>Module quizzes:</strong> ${completedCount(state.moduleResults)}/${moduleQuizzes.length}</p>
        <p><strong>Reading missions:</strong> ${completedCount(state.missionResults)}/${readingMissions.length}</p>
        <p><strong>Learning quests:</strong> ${completedCount(state.questStatus)}/${learningQuests.length}</p>
        <p><strong>Scenarios solved:</strong> ${completedCount(state.scenarioScores)}/${scenarioSets.length}</p>
        <p><strong>Final simulator:</strong> ${state.simulationReady ? `${readinessFromSimulator()} (${state.simulationScore}%)` : "Not attempted"}</p>
      </div>
      <div class="actions">
        <button class="reset-btn" data-action="reset-progress">Reset saved progress</button>
      </div>
    `;
  }

  function renderQuizPanel() {
    return `
      <div class="panel-card">
        <h3>Quiz Arena</h3>
        <p>Module mastery quizzes with adaptive recommendations for missed topics.</p>
        <div class="module-grid">
          ${moduleQuizzes.map((quiz) => `
            <div class="module-card">
              <h4>${quiz.title}</h4>
              <p>${quiz.questions.length} questions</p>
              <p>Best score: ${typeof state.moduleResults[quiz.id] === "number" ? `${state.moduleResults[quiz.id]}%` : "Not attempted"}</p>
              <div class="card-actions">
                <button data-action="start-quiz" data-id="${quiz.id}">Start quiz</button>
                <a href="${quiz.notesUrl}" target="_blank" rel="noopener noreferrer">Open notes</a>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderMissionPanel() {
    return `
      <div class="panel-card">
        <h3>Reading Missions</h3>
        <p>Use extracted additional-reading references and validate retention.</p>
        <div class="module-grid">
          ${readingMissions.map((mission) => `
            <div class="module-card">
              <h4>${mission.title}</h4>
              <p>Mission score: ${typeof state.missionResults[mission.id] === "number" ? `${state.missionResults[mission.id]}%` : "Not attempted"}</p>
              <p>Source reviewed: ${state.sourceReviewed[mission.id] ? "Yes" : "No"}</p>
              <div class="card-actions">
                <a href="${mission.sourcePageUrl}" target="_blank" rel="noopener noreferrer">Open extracted page</a>
                <a href="${mission.sourceUrl}" target="_blank" rel="noopener noreferrer">Open source PDF</a>
                <button data-action="mark-reviewed" data-id="${mission.id}" ${state.sourceReviewed[mission.id] ? "disabled" : ""}>Mark reviewed (+15 XP)</button>
                <button data-action="start-mission" data-id="${mission.id}">Start mission</button>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderQuestPanel() {
    return `
      <div class="panel-card">
        <h3>Learning Quests</h3>
        <p>Short practical missions that transform reading into delivery habits.</p>
        <div class="module-grid">
          ${learningQuests.map((quest) => `
            <div class="module-card">
              <h4>${quest.title}</h4>
              <ul class="quest-list">${quest.tasks.map((task) => `<li>${task}</li>`).join("")}</ul>
              <p>Reward: ${quest.xp} XP</p>
              <button data-action="complete-quest" data-id="${quest.id}" ${state.questStatus[quest.id] ? "disabled" : ""}>
                ${state.questStatus[quest.id] ? "Completed" : "Mark completed"}
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderScenarioPanel() {
    return `
      <div class="panel-card">
        <h3>Scenario Mode</h3>
        <p>Role-based decisions with consequences to build judgment.</p>
        <div class="module-grid">
          ${scenarioSets.map((scenario) => `
            <div class="module-card">
              <h4>${scenario.role}</h4>
              <p>${scenario.prompt}</p>
              <p>Best scenario score: ${typeof state.scenarioScores[scenario.id] === "number" ? `${state.scenarioScores[scenario.id]}/2` : "Not attempted"}</p>
              <button data-action="start-scenario" data-id="${scenario.id}">Play scenario</button>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderBossPanel() {
    return `
      <div class="panel-card">
        <h3>Boss Arena</h3>
        <p>Mixed cross-module challenge.</p>
        <p>Status: ${state.bossCleared ? "Cleared" : bossUnlocked() ? "Unlocked" : "Locked (finish 3 module quizzes + 3 reading missions)"}</p>
        <button data-action="start-boss" ${bossUnlocked() ? "" : "disabled"}>Start boss challenge</button>
      </div>
    `;
  }

  function renderSimulatorPanel() {
    const checkItems = simulatorChecks
      .map((check) => `
        <label class="sim-check">
          <input type="checkbox" data-action="sim-check" data-id="${check.id}" ${state.simulationChecks[check.id] ? "checked" : ""}>
          <span>${check.label} <em>(${check.weight}%)</em></span>
        </label>
      `)
      .join("");
    return `
      <div class="panel-card">
        <h3>Final Project Readiness Simulator</h3>
        <p>Evaluate release readiness evidence before final submission.</p>
        <div class="sim-grid">${checkItems}</div>
        <div class="sim-score">
          <p><strong>Readiness score:</strong> ${state.simulationScore}%</p>
          <p><strong>Status:</strong> ${state.simulationReady ? readinessFromSimulator() : "Not calculated"}</p>
        </div>
        <button data-action="run-simulator">Calculate readiness</button>
      </div>
    `;
  }

  function renderTeamPanel() {
    const boardRows = state.teamSnapshots
      .slice()
      .sort((a, b) => (b.xp || 0) - (a.xp || 0))
      .map((entry, index) => `<tr><td>${index + 1}</td><td>${entry.name || "Unnamed"}</td><td>${entry.level}</td><td>${entry.xp}</td><td>${entry.progress}%</td></tr>`)
      .join("");
    return `
      <div class="panel-card">
        <h3>Team Mode</h3>
        <p>Export your progress JSON and import teammate files to build a workshop leaderboard.</p>
        <div class="team-controls">
          <input type="text" id="player-name" placeholder="Your name" value="${state.playerName || ""}">
          <button data-action="save-name">Save name</button>
          <button data-action="export-profile">Export my progress JSON</button>
          <label class="import-label">Import teammate JSON<input id="team-import" type="file" accept=".json" data-action="import-profile"></label>
        </div>
        <table class="team-table">
          <thead><tr><th>#</th><th>Name</th><th>Level</th><th>XP</th><th>Progress</th></tr></thead>
          <tbody>${boardRows || '<tr><td colspan="5">No imported profiles yet.</td></tr>'}</tbody>
        </table>
      </div>
    `;
  }

  function bindGlobalActions() {
    root.querySelectorAll('[data-action="tab"]').forEach((button) => {
      button.addEventListener("click", () => {
        activeTab = button.dataset.tab;
        render();
      });
    });

    const reset = root.querySelector('[data-action="reset-progress"]');
    if (reset) {
      reset.addEventListener("click", () => {
        if (!window.confirm("Reset all saved progress for this browser?")) return;
        Object.assign(state, initialState());
        activeFlow = null;
        saveState();
        render();
      });
    }

    root.querySelectorAll('[data-action="start-quiz"]').forEach((button) => button.addEventListener("click", () => startFlow("module", button.dataset.id)));
    root.querySelectorAll('[data-action="start-mission"]').forEach((button) => button.addEventListener("click", () => startFlow("mission", button.dataset.id)));
    root.querySelectorAll('[data-action="mark-reviewed"]').forEach((button) => button.addEventListener("click", () => markReviewed(button.dataset.id)));
    root.querySelectorAll('[data-action="complete-quest"]').forEach((button) => button.addEventListener("click", () => completeQuest(button.dataset.id)));
    root.querySelectorAll('[data-action="start-scenario"]').forEach((button) => button.addEventListener("click", () => openScenario(button.dataset.id)));
    const boss = root.querySelector('[data-action="start-boss"]');
    if (boss) boss.addEventListener("click", () => startFlow("boss", "boss"));
    root.querySelectorAll('[data-action="sim-check"]').forEach((checkbox) => checkbox.addEventListener("change", () => toggleSimulatorCheck(checkbox.dataset.id, checkbox.checked)));
    const simRun = root.querySelector('[data-action="run-simulator"]');
    if (simRun) simRun.addEventListener("click", runSimulator);

    const saveName = root.querySelector('[data-action="save-name"]');
    if (saveName) {
      saveName.addEventListener("click", () => {
        const input = root.querySelector("#player-name");
        state.playerName = input.value.trim();
        saveState();
        render();
      });
    }

    const exportBtn = root.querySelector('[data-action="export-profile"]');
    if (exportBtn) exportBtn.addEventListener("click", exportProfile);

    const importInput = root.querySelector("#team-import");
    if (importInput) importInput.addEventListener("change", importProfile);
  }

  function markReviewed(missionId) {
    if (state.sourceReviewed[missionId]) return;
    state.sourceReviewed[missionId] = true;
    gainXp(15);
    updateStreak();
    awardBadge("Reference Explorer");
    saveState();
    render();
  }

  function completeQuest(questId) {
    if (state.questStatus[questId]) return;
    const quest = learningQuests.find((item) => item.id === questId);
    state.questStatus[questId] = true;
    gainXp(quest.xp);
    updateStreak();
    awardBadge("Quest Runner");
    if (completedCount(state.questStatus) === learningQuests.length) awardBadge("All Quests Completed");
    saveState();
    render();
  }

  function openScenario(scenarioId) {
    const scenario = scenarioSets.find((item) => item.id === scenarioId);
    if (!scenario) return;
    const stage = root.querySelector("#challenge-stage");
    stage.innerHTML = `
      <div class="quiz-card">
        <h3>${scenario.role}</h3>
        <p>${scenario.prompt}</p>
        <div class="option-list">
          ${scenario.choices.map((choice, index) => `<button class="option-btn" data-action="scenario-choice" data-sid="${scenario.id}" data-index="${index}">${choice.text}</button>`).join("")}
        </div>
        <div id="quiz-feedback"></div>
      </div>
    `;
    stage.querySelectorAll('[data-action="scenario-choice"]').forEach((button) => {
      button.addEventListener("click", () => chooseScenario(scenario.id, Number(button.dataset.index)));
    });
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function chooseScenario(scenarioId, choiceIndex) {
    const scenario = scenarioSets.find((item) => item.id === scenarioId);
    if (!scenario) return;
    const selected = scenario.choices[choiceIndex];
    const points = selected.score * 20;
    gainXp(points);
    updateStreak();
    state.scenarioScores[scenarioId] = Math.max(selected.score, state.scenarioScores[scenarioId] || 0);
    if (selected.score === 2) awardBadge("Scenario Strategist");
    if (completedCount(state.scenarioScores) === scenarioSets.length) awardBadge("All Scenarios Solved");
    saveState();
    const feedback = root.querySelector("#quiz-feedback");
    feedback.innerHTML = `
      <p class="${selected.score >= 2 ? "ok" : "bad"}"><strong>Decision result:</strong> +${points} XP</p>
      <p>${selected.feedback}</p>
      <button id="back-btn">Back to hub</button>
    `;
    feedback.querySelector("#back-btn").addEventListener("click", () => render());
  }

  function toggleSimulatorCheck(checkId, checked) {
    state.simulationChecks[checkId] = checked;
    saveState();
  }

  function runSimulator() {
    let score = 0;
    simulatorChecks.forEach((check) => {
      if (state.simulationChecks[check.id]) score += check.weight;
    });
    state.simulationScore = score;
    state.simulationReady = true;
    gainXp(Math.max(10, Math.round(score / 4)));
    updateStreak();
    if (score >= 90) awardBadge("Release Ready Architect");
    else if (score >= 70) awardBadge("Readiness Builder");
    saveState();
    render();
  }

  function exportProfile() {
    const profile = {
      name: state.playerName || "Unnamed",
      level: state.level,
      xp: state.xp,
      progress: getOverallProgress(),
      badges: state.badges
    };
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${(state.playerName || "training-player").toLowerCase().replace(/\s+/g, "-")}-progress.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function importProfile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        if (typeof parsed !== "object" || parsed === null) return;
        const snapshot = {
          name: String(parsed.name || "Unnamed"),
          level: Number(parsed.level || 1),
          xp: Number(parsed.xp || 0),
          progress: Number(parsed.progress || 0)
        };
        state.teamSnapshots = [snapshot, ...state.teamSnapshots.filter((row) => row.name !== snapshot.name)].slice(0, 30);
        saveState();
        render();
      } catch {
        // Ignore invalid JSON file.
      }
    };
    reader.readAsText(file);
  }

  function getFlowData(flowType, flowId) {
    if (flowType === "module") return moduleQuizzes.find((item) => item.id === flowId);
    if (flowType === "mission") return readingMissions.find((item) => item.id === flowId);
    if (flowType === "boss") return { id: "boss", title: "Boss Arena", questions: bossQuestions, recommendUrl: "../../references/extracted-reference-map/" };
    return null;
  }

  function startFlow(flowType, flowId) {
    const data = getFlowData(flowType, flowId);
    if (!data) return;
    activeFlow = { type: flowType, id: flowId, title: data.title, questions: data.questions, recommendUrl: data.recommendUrl };
    activeIndex = 0;
    activeCorrect = 0;
    activeStartedAt = Date.now();
    renderQuestion();
  }

  function renderQuestion() {
    const stage = root.querySelector("#challenge-stage");
    const q = activeFlow.questions[activeIndex];
    stage.innerHTML = `
      <div class="quiz-card">
        <h3>${activeFlow.title}</h3>
        <p class="quiz-meta">Question ${activeIndex + 1} of ${activeFlow.questions.length}</p>
        <p class="quiz-prompt">${q.prompt}</p>
        <div class="option-list">
          ${q.options.map((option, idx) => `<button class="option-btn" data-action="answer" data-index="${idx}">${String.fromCharCode(65 + idx)}. ${option}</button>`).join("")}
        </div>
        <div id="quiz-feedback"></div>
      </div>
    `;
    stage.querySelectorAll('[data-action="answer"]').forEach((button) => {
      button.addEventListener("click", () => checkAnswer(Number(button.dataset.index)));
    });
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function checkAnswer(selected) {
    const q = activeFlow.questions[activeIndex];
    const correct = selected === q.answer;
    if (correct) activeCorrect += 1;
    const stage = root.querySelector("#challenge-stage");
    stage.querySelectorAll(".option-btn").forEach((button) => {
      button.disabled = true;
      const idx = Number(button.dataset.index);
      if (idx === q.answer) button.classList.add("correct");
      if (idx === selected && idx !== q.answer) button.classList.add("wrong");
    });
    const feedback = stage.querySelector("#quiz-feedback");
    feedback.innerHTML = `
      <p class="${correct ? "ok" : "bad"}"><strong>${correct ? "Correct." : "Not quite."}</strong></p>
      <p>${q.explanation}</p>
      <button id="next-step-btn">${activeIndex + 1 === activeFlow.questions.length ? "Finish" : "Next question"}</button>
    `;
    feedback.querySelector("#next-step-btn").addEventListener("click", () => {
      activeIndex += 1;
      if (activeIndex < activeFlow.questions.length) {
        renderQuestion();
        return;
      }
      finishFlow();
    });
  }

  function finishFlow() {
    const total = activeFlow.questions.length;
    const percent = Math.round((activeCorrect / total) * 100);
    const elapsedSec = Math.max(1, Math.round((Date.now() - activeStartedAt) / 1000));
    const speedBonus = elapsedSec <= total * 25 ? 10 : 0;
    const accuracyXp = activeCorrect * 15;
    const rankBonus = percent >= 80 ? 25 : 0;
    const earned = accuracyXp + rankBonus + speedBonus;

    gainXp(earned);
    updateStreak();

    if (activeFlow.type === "module") {
      state.moduleResults[activeFlow.id] = Math.max(percent, state.moduleResults[activeFlow.id] || 0);
      awardBadge("Quiz Starter");
      if (percent >= 80) awardBadge(`${activeFlow.title} Master`);
      if (completedCount(state.moduleResults) === moduleQuizzes.length) awardBadge("All Module Quizzes Cleared");
    } else if (activeFlow.type === "mission") {
      state.missionResults[activeFlow.id] = Math.max(percent, state.missionResults[activeFlow.id] || 0);
      awardBadge("Reading Scout");
      if (completedCount(state.missionResults) === readingMissions.length) awardBadge("All Reading Missions Cleared");
    } else if (activeFlow.type === "boss") {
      if (percent >= 70) {
        state.bossCleared = true;
        gainXp(40);
        awardBadge("Boss Arena Winner");
      }
    }

    if (state.currentStreak >= 3) awardBadge("3-Day Momentum");
    if (state.currentStreak >= 7) awardBadge("7-Day Consistency");
    if (state.level >= 5) awardBadge("Level 5 Achiever");

    saveState();

    const recommend = percent < 70 && activeFlow.recommendUrl
      ? `<p class="hint"><strong>Adaptive retry tip:</strong> Review <a href="${activeFlow.recommendUrl}" target="_blank" rel="noopener noreferrer">this source section</a> and retry.</p>`
      : "";

    const stage = root.querySelector("#challenge-stage");
    stage.innerHTML = `
      <div class="quiz-card">
        <h3>${activeFlow.title} complete</h3>
        <p><strong>Score:</strong> ${activeCorrect}/${total} (${percent}%)</p>
        <p><strong>Time:</strong> ${elapsedSec}s</p>
        <p><strong>XP earned:</strong> ${earned}${speedBonus ? ` (includes +${speedBonus} speed bonus)` : ""}</p>
        ${recommend}
        ${activeFlow.type === "boss" && percent < 70 ? "<p>Boss clear threshold is 70%. Complete more quests and references, then retry.</p>" : ""}
        <button id="back-btn">Back to hub</button>
      </div>
    `;
    stage.querySelector("#back-btn").addEventListener("click", () => {
      activeFlow = null;
      activeIndex = 0;
      activeCorrect = 0;
      render();
    });
    render();
  }

  render();
})();

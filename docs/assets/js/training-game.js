(() => {
  const root = document.getElementById("interactive-training-app");
  if (!root) return;

  const STORAGE_KEY = "ai-training-progress-v4";
  const XP_PER_LEVEL = 120;
  const app = { state: null, activeTab: "dashboard", activeFlow: null, activeIndex: 0, activeCorrect: 0, flowStartAt: 0, tabStartAt: Date.now(), keyboardBound: false };

  const moduleQuizzes = [
    { id: "module-1", title: "Module 1: Foundations", est: "45m", notesUrl: "../../modules/module-1/lecture-notes/", recommendUrl: "../../modules/module-1/qa/", questions: [
      { prompt: "What is the safest assumption about AI-generated code?", options: ["It is production-ready if it compiles", "It is a draft that requires verification", "It is correct if the prompt is long", "It is reliable if copied from examples"], answer: 1, explanation: "AI output is draft material until validated." },
      { prompt: "Which loop best represents disciplined AI-assisted delivery?", options: ["Ask -> Accept -> Merge", "Ask -> Inspect -> Run -> Test -> Refine", "Prompt -> Copy -> Ship", "Ask -> Rewrite everything manually"], answer: 1, explanation: "Verification remains mandatory before acceptance." },
      { prompt: "Which output is expected in Module 1 evidence?", options: ["Production deployment", "Reflection log with corrections", "Database migration plan", "Microservice split"], answer: 1, explanation: "Module 1 expects evidence of learning and correction habits." }
    ] },
    { id: "module-2", title: "Module 2: Backend Build Discipline", est: "60m", notesUrl: "../../modules/module-2/lecture-notes/", recommendUrl: "../../modules/module-2/additional-reading/", questions: [
      { prompt: "What sequence aligns with Module 2 implementation flow?", options: ["UI -> tests -> model", "Model -> storage -> CRUD -> business rules -> tests", "Docs -> Docker -> CI", "Agent setup -> deployment"], answer: 1, explanation: "Module 2 uses staged backend construction." },
      { prompt: "Why does Module 2 require a Break Test?", options: ["To speed development", "To prove tests fail on broken code", "To reduce tests", "To avoid manual review"], answer: 1, explanation: "Tests must prove they detect faults." },
      { prompt: "What is emphasized for editor AI usage?", options: ["Generic prompts without files", "File-aware prompts on actual repo files", "Autonomous enterprise setup", "Skipping generated model review"], answer: 1, explanation: "File-grounded context reduces hallucinations." }
    ] },
    { id: "module-3", title: "Module 3: Frontend Confidence", est: "60m", notesUrl: "../../modules/module-3/lecture-notes/", recommendUrl: "../../modules/module-3/additional-reading/", questions: [
      { prompt: "What fetch behavior is highlighted in Module 3 readings?", options: ["Fetch retries by default", "Fetch requires explicit non-2xx handling", "Fetch bypasses CORS", "Fetch never returns 422"], answer: 1, explanation: "You must check status explicitly." },
      { prompt: "What is the recommended AI edit style for Module 3?", options: ["Whole-file rewrites", "Selected-block scoped edits with review", "No diff inspection", "No tests after edit"], answer: 1, explanation: "Small scoped edits improve control." },
      { prompt: "What evidence should drive debugging decisions?", options: ["UI intuition only", "Status/payload/console/network/tests", "Model confidence score", "Code length"], answer: 1, explanation: "Evidence-first debugging is the module habit." }
    ] },
    { id: "module-4", title: "Module 4: Workflow and CI/CD", est: "70m", notesUrl: "../../modules/module-4/lecture-notes/", recommendUrl: "../../modules/module-4/additional-reading/", questions: [
      { prompt: "What is a required evidence pattern in CI validation?", options: ["One green run only", "Green -> intentional red -> restored green", "No run history needed", "Screenshot only"], answer: 1, explanation: "The course expects explicit red/green proof." },
      { prompt: "Why is CLAUDE.md emphasized?", options: ["Branding", "Project memory and guardrails", "README replacement", "Skip planning"], answer: 1, explanation: "It anchors repo-level instructions." },
      { prompt: "How should AI code review be used?", options: ["Replace human review", "Triage input + human verification", "Style only", "Only before coding"], answer: 1, explanation: "Human ownership remains mandatory." }
    ] },
    { id: "module-5", title: "Module 5: Governance and Ownership", est: "70m", notesUrl: "../../modules/module-5/lecture-notes/", recommendUrl: "../../modules/module-5/additional-reading/", questions: [
      { prompt: "Which posture best describes Module 5?", options: ["AI proposes, developer grades and owns", "AI owns architecture", "Accept all suggestions", "Speed over traceability"], answer: 0, explanation: "Governance means explicit acceptance decisions." },
      { prompt: "What does AGENTS.md provide in Module 5 setup?", options: ["Theme customization", "Repo-level operating constraints", "Dependency management", "Test runner replacement"], answer: 1, explanation: "AGENTS.md defines guardrails." },
      { prompt: "How should security findings from AI be handled?", options: ["Merge directly", "Classify and validate manually", "Ignore unless critical", "Convert to docs only"], answer: 1, explanation: "Security review requires human confirmation." }
    ] }
  ];

  const readingMissions = [
    { id: "reading-2", title: "Reading Mission: Module 2", sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-2-additional-readings.pdf", sourcePageUrl: "../../modules/module-2/additional-reading/", questions: [
      { prompt: "Module 2 reading is scoped to backend verification, not full production architecture.", options: ["True", "False"], answer: 0, explanation: "True; scope is intentionally constrained." },
      { prompt: "Which topic is explicitly out-of-scope for Module 2 reading?", options: ["CRUD verification", "Pydantic validators", "Autonomous enterprise setup", "FastAPI error basics"], answer: 2, explanation: "Autonomous/enterprise setup is skipped for this module." }
    ] },
    { id: "reading-3", title: "Reading Mission: Module 3", sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-3-additional-readings.pdf", sourcePageUrl: "../../modules/module-3/additional-reading/", questions: [
      { prompt: "Module 3 recommends selected-code prompts over vague repo-wide prompts.", options: ["True", "False"], answer: 0, explanation: "Scoped prompts improve reliability." },
      { prompt: "What fetch detail is critical in Module 3 reading?", options: ["Fetch always throws on 404", "Fetch needs explicit non-2xx handling", "Fetch resolves CORS", "Fetch ignores response status"], answer: 1, explanation: "Non-2xx is not auto-thrown." }
    ] },
    { id: "reading-4", title: "Reading Mission: Module 4", sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-4-additional-readings.pdf", sourcePageUrl: "../../modules/module-4/additional-reading/", questions: [
      { prompt: "When docs and repo differ, you should trust:", options: ["Docs first", "Repo evidence with command/output checks", "AI only", "Neither"], answer: 1, explanation: "Repository truth plus verification." },
      { prompt: "Which Docker guidance is highlighted?", options: ["Always root runtime", "Multi-stage + non-root guidance", "Ignore .dockerignore", "Single-stage only"], answer: 1, explanation: "Safer image patterns are emphasized." }
    ] },
    { id: "reading-5", title: "Reading Mission: Module 5", sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-5-additional-readings.pdf", sourcePageUrl: "../../modules/module-5/additional-reading/", questions: [
      { prompt: "AGENTS.md in Module 5 is mainly for AI instruction boundaries.", options: ["True", "False"], answer: 0, explanation: "True; it sets operational boundaries." },
      { prompt: "Security review in Module 5 should use focused lenses (validation/data exposure/etc).", options: ["True", "False"], answer: 0, explanation: "True; source references are security-focused." }
    ] }
  ];

  const learningQuests = [
    { id: "quest-module2-backend", title: "Quest: Backend Integrity Sprint", xp: 45, tasks: ["Read Module 2 digest", "Write one file-aware prompt", "Define one Break Test case"] },
    { id: "quest-module3-debug", title: "Quest: Frontend Debug Detective", xp: 45, tasks: ["Capture request/response evidence", "Write root-cause hypothesis", "Write post-fix verification step"] },
    { id: "quest-module4-release", title: "Quest: Release Evidence Builder", xp: 50, tasks: ["Define CI red->green proof", "Define container /health verification", "State one repo-level guardrail"] }
  ];

  const scenarioSets = [
    { id: "scenario-backend-owner", role: "Backend Owner", prompt: "AI changed PATCH transition rules silently.", choices: [
      { text: "Merge quickly because tests passed", score: 0, feedback: "Risky. Hidden rule drift can pass superficial tests." },
      { text: "Inspect diff, add transition tests, then accept/reject", score: 2, feedback: "Correct. Integrity and evidence protected." },
      { text: "Rewrite manually without review notes", score: 1, feedback: "Safer than blind merge, but poor team traceability." }
    ] },
    { id: "scenario-review-lead", role: "Review Lead", prompt: "AI review flagged 12 items; two look severe.", choices: [
      { text: "Reject all comments", score: 0, feedback: "Potentially misses severe issues." },
      { text: "Classify useful/noise/wrong and verify severe findings", score: 2, feedback: "Correct triage workflow." },
      { text: "Accept all findings and bulk-fix", score: 1, feedback: "Can add churn and wrong fixes." }
    ] },
    { id: "scenario-release-owner", role: "Release Owner", prompt: "CI is green but Docker runs as root and docs mismatch API.", choices: [
      { text: "Ship now", score: 0, feedback: "Green CI alone is insufficient." },
      { text: "Block release and fix Docker/docs evidence", score: 2, feedback: "Correct release-readiness posture." },
      { text: "Disable Docker checks", score: 0, feedback: "Hides risk rather than resolving it." }
    ] }
  ];

  const bossQuestions = [
    { prompt: "Final project success mainly proves:", options: ["Feature volume", "Release-readiness + AI ownership evidence", "UI polish", "No documentation"], answer: 1, explanation: "Final project measures readiness and ownership." },
    { prompt: "If AI cannot cite files for a claim:", options: ["Accept anyway", "Mark uncertain and request evidence", "Ignore and continue", "Delete tests"], answer: 1, explanation: "Evidence-backed claims are required." },
    { prompt: "Additional readings are best used as:", options: ["One-time full read", "Targeted implementation lookup references", "Replacement for labs", "Optional noise"], answer: 1, explanation: "Use them as practical lookup references." },
    { prompt: "Safest cross-module habit:", options: ["Unbounded prompts", "Scoped prompts + inspect/run/test/refine", "Skip reviews", "Trust infra generation"], answer: 1, explanation: "Consistent disciplined workflow." }
  ];

  const simulatorChecks = [
    { id: "sim-readme", label: "README has setup + run + test + docker steps", weight: 20 },
    { id: "sim-ci", label: "CI evidence includes green -> red -> green", weight: 20 },
    { id: "sim-docker", label: "Docker evidence includes build/run/health/non-root rationale", weight: 20 },
    { id: "sim-ai", label: "AI governance evidence shows accepted/rejected rationale", weight: 20 },
    { id: "sim-scope", label: "Scope control proved (no unrelated feature creep)", weight: 20 }
  ];

  const evidenceFields = [
    { id: "adr", title: "Mini ADR", placeholder: "Decision, options considered, tradeoff, final choice..." },
    { id: "promptLog", title: "Prompt Log", placeholder: "Prompt used, expected output, what was corrected..." },
    { id: "verification", title: "Verification Log", placeholder: "Commands run, expected/actual result, fixes..." },
    { id: "releaseEvidence", title: "Release Evidence", placeholder: "CI proof, Docker proof, readiness notes..." }
  ];

  const facilitatorSteps = [
    "Kickoff: restate module objective and expected evidence artifacts.",
    "Midpoint: ask each learner to show one correction they made to AI output.",
    "Checkpoint: run one quick scenario and discuss decision quality.",
    "Wrap-up: each learner writes one team rule for future AI-assisted work."
  ];

  const dailyChallenges = [
    { id: "dc-scope", title: "Daily: Scope Guard", prompt: "You see AI editing unrelated files. Best action?", options: ["Accept for speed", "Stop and constrain scope with file boundaries", "Merge then revert later"], answer: 1, explanation: "Boundaries first." },
    { id: "dc-evidence", title: "Daily: Evidence Habit", prompt: "A generated fix looks correct. Next step?", options: ["Ship", "Verify with run/test evidence", "Ask for prettier output"], answer: 1, explanation: "Evidence beats appearance." },
    { id: "dc-review", title: "Daily: Review Quality", prompt: "AI review gives 15 comments. Best handling?", options: ["Accept all", "Classify and verify high-risk comments", "Ignore all"], answer: 1, explanation: "Triage + verify." }
  ];

  function initialState() {
    return {
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
      teamSnapshots: [],
      evidenceDocs: {},
      facilitator: { index: 0, notes: "" },
      settings: { reducedMotion: false, highContrast: false, compactMode: false },
      daily: { completedDate: "", score: 0, challengeId: "" },
      analytics: {
        tabSeconds: {},
        tabVisits: {},
        quizAttempts: {},
        missionAttempts: {},
        scenarioAttempts: {},
        retries: 0,
        actions: 0,
        startedAt: new Date().toISOString()
      }
    };
  }

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(app.state));
    } catch {
      // Ignore localStorage errors.
    }
  }

  function countCompleted(obj) {
    return Object.keys(obj || {}).length;
  }

  function updateLevel() {
    app.state.level = Math.max(1, Math.floor(app.state.xp / XP_PER_LEVEL) + 1);
  }

  function gainXp(amount) {
    app.state.xp += amount;
    app.state.coins += Math.max(1, Math.round(amount / 8));
    updateLevel();
  }

  function awardBadge(name) {
    if (!app.state.badges.includes(name)) app.state.badges.push(name);
  }

  function trackAction() {
    app.state.analytics.actions += 1;
  }

  function updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    if (!app.state.lastActiveDate) {
      app.state.currentStreak = 1;
      app.state.lastActiveDate = today;
      return;
    }
    if (app.state.lastActiveDate === today) return;
    const now = new Date(today);
    const prev = new Date(app.state.lastActiveDate);
    const diff = Math.floor((now - prev) / (1000 * 60 * 60 * 24));
    app.state.currentStreak = diff === 1 ? app.state.currentStreak + 1 : 1;
    app.state.lastActiveDate = today;
  }

  function isModuleUnlocked(moduleId) {
    const idx = moduleQuizzes.findIndex((m) => m.id === moduleId);
    if (idx <= 0) return true;
    const prevId = moduleQuizzes[idx - 1].id;
    return typeof app.state.moduleResults[prevId] === "number";
  }

  function bossUnlocked() {
    return countCompleted(app.state.moduleResults) >= 3 && countCompleted(app.state.missionResults) >= 3;
  }

  function readinessLabel(score) {
    if (score >= 90) return "Release Ready";
    if (score >= 70) return "Almost Ready";
    return "Not Ready";
  }

  function getOverallProgress() {
    const total = moduleQuizzes.length + readingMissions.length + learningQuests.length + scenarioSets.length + 4;
    const done = countCompleted(app.state.moduleResults) +
      countCompleted(app.state.missionResults) +
      countCompleted(app.state.questStatus) +
      countCompleted(app.state.scenarioScores) +
      (app.state.bossCleared ? 1 : 0) +
      (app.state.simulationReady ? 1 : 0) +
      (dailyDoneToday() ? 1 : 0) +
      (Object.values(app.state.evidenceDocs || {}).some(Boolean) ? 1 : 0);
    return Math.round((done / total) * 100);
  }

  function currentDailyChallenge() {
    const dayIndex = Math.floor(Date.now() / 86400000) % dailyChallenges.length;
    return dailyChallenges[dayIndex];
  }

  function dailyDoneToday() {
    const today = new Date().toISOString().slice(0, 10);
    return app.state.daily.completedDate === today && app.state.daily.challengeId === currentDailyChallenge().id;
  }

  function recordTabTime(nextTab) {
    const now = Date.now();
    const seconds = Math.max(0, Math.round((now - app.tabStartAt) / 1000));
    const current = app.activeTab;
    app.state.analytics.tabSeconds[current] = (app.state.analytics.tabSeconds[current] || 0) + seconds;
    app.tabStartAt = now;
    app.activeTab = nextTab;
    app.state.analytics.tabVisits[nextTab] = (app.state.analytics.tabVisits[nextTab] || 0) + 1;
  }

  function switchTab(nextTab) {
    recordTabTime(nextTab);
    saveState();
    render();
  }

  function appClassNames() {
    const cls = ["game-shell"];
    if (app.state.settings.highContrast) cls.push("high-contrast");
    if (app.state.settings.compactMode) cls.push("compact-mode");
    if (app.state.settings.reducedMotion) cls.push("reduced-motion");
    return cls.join(" ");
  }

  function render() {
    const daily = currentDailyChallenge();
    root.innerHTML = `
      <div class="${appClassNames()}">
        ${renderHeader()}
        ${renderTabs()}
        ${renderDailyStrip(daily)}
        <div id="game-panel">${renderPanel(daily)}</div>
        <div id="challenge-stage"></div>
      </div>
    `;
    bindGlobalActions();
    bindKeyboardShortcuts();
  }

  function renderHeader() {
    return `
      <div class="game-header">
        <h2>Interactive Challenge Hub</h2>
        <p>Roadmap, study planner, quests, scenarios, evidence workspace, facilitator mode, and local analytics.</p>
      </div>
      <div class="game-stats">
        <div class="stat-card"><span>XP</span><strong>${app.state.xp}</strong></div>
        <div class="stat-card"><span>Level</span><strong>${app.state.level}</strong></div>
        <div class="stat-card"><span>Coins</span><strong>${app.state.coins}</strong></div>
        <div class="stat-card"><span>Streak</span><strong>${app.state.currentStreak} day(s)</strong></div>
      </div>
      <div class="progress-wrap">
        <div class="progress-label">Training progress: ${getOverallProgress()}%</div>
        <div class="progress-bar"><span style="width:${getOverallProgress()}%"></span></div>
      </div>
      <div class="badge-wrap">
        <h3>Badges</h3>
        ${app.state.badges.length ? `<div class="badge-grid">${app.state.badges.map((b) => `<span class="badge-item">${b}</span>`).join("")}</div>` : "<p>No badges yet. Complete any activity to begin.</p>"}
      </div>
    `;
  }

  function renderTabs() {
    const tabs = [
      ["dashboard", "Dashboard"],
      ["roadmap", "Roadmap"],
      ["study", "Study Plan"],
      ["quiz", "Quiz Arena"],
      ["missions", "Reading Missions"],
      ["quests", "Learning Quests"],
      ["scenario", "Scenario Mode"],
      ["boss", "Boss Arena"],
      ["simulator", "Final Simulator"],
      ["evidence", "Evidence Workspace"],
      ["facilitator", "Facilitator Mode"],
      ["team", "Team Mode"],
      ["analytics", "Analytics"],
      ["settings", "Accessibility"]
    ];
    return `<div class="tab-row">${tabs.map(([id, label]) => `<button class="tab-btn ${app.activeTab === id ? "active" : ""}" data-action="tab" data-tab="${id}">${label}</button>`).join("")}</div>`;
  }

  function renderDailyStrip(daily) {
    return `
      <div class="daily-strip">
        <div>
          <strong>${daily.title}</strong>
          <span>${dailyDoneToday() ? "Completed today" : "Not completed yet"}</span>
        </div>
        <button data-action="open-daily">${dailyDoneToday() ? "Review daily challenge" : "Start daily challenge (+25 XP)"}</button>
      </div>
    `;
  }

  function renderPanel(daily) {
    if (app.activeTab === "roadmap") return renderRoadmap();
    if (app.activeTab === "study") return renderStudyPlan();
    if (app.activeTab === "quiz") return renderQuiz();
    if (app.activeTab === "missions") return renderMissions();
    if (app.activeTab === "quests") return renderQuests();
    if (app.activeTab === "scenario") return renderScenarios();
    if (app.activeTab === "boss") return renderBoss();
    if (app.activeTab === "simulator") return renderSimulator();
    if (app.activeTab === "evidence") return renderEvidence();
    if (app.activeTab === "facilitator") return renderFacilitator();
    if (app.activeTab === "team") return renderTeam();
    if (app.activeTab === "analytics") return renderAnalytics();
    if (app.activeTab === "settings") return renderSettings();
    return renderDashboard(daily);
  }

  function renderDashboard(daily) {
    return `
      <div class="panel-card">
        <h3>Progress dashboard</h3>
        <p><strong>Module quizzes:</strong> ${countCompleted(app.state.moduleResults)}/${moduleQuizzes.length}</p>
        <p><strong>Reading missions:</strong> ${countCompleted(app.state.missionResults)}/${readingMissions.length}</p>
        <p><strong>Quests:</strong> ${countCompleted(app.state.questStatus)}/${learningQuests.length}</p>
        <p><strong>Scenarios solved:</strong> ${countCompleted(app.state.scenarioScores)}/${scenarioSets.length}</p>
        <p><strong>Final simulator:</strong> ${app.state.simulationReady ? `${readinessLabel(app.state.simulationScore)} (${app.state.simulationScore}%)` : "Not attempted"}</p>
        <p><strong>Daily challenge:</strong> ${dailyDoneToday() ? "Completed today" : "Pending"}</p>
      </div>
      <div class="actions">
        <button class="reset-btn" data-action="reset-progress">Reset saved progress</button>
      </div>
    `;
  }

  function renderRoadmap() {
    return `
      <div class="panel-card">
        <h3>Module roadmap</h3>
        <p>Follow this path from foundations to governance. Modules unlock progressively as you complete quizzes.</p>
        <div class="roadmap-grid">
          ${moduleQuizzes.map((m, i) => {
            const complete = typeof app.state.moduleResults[m.id] === "number";
            const unlocked = isModuleUnlocked(m.id);
            return `<div class="roadmap-card ${complete ? "done" : unlocked ? "open" : "locked"}">
              <div class="roadmap-step">Step ${i + 1}</div>
              <h4>${m.title}</h4>
              <p>Estimated time: ${m.est}</p>
              <p>Status: ${complete ? `Completed (${app.state.moduleResults[m.id]}%)` : unlocked ? "Ready" : "Locked"}</p>
              <a href="${m.notesUrl}" target="_blank" rel="noopener noreferrer">Open module notes</a>
            </div>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderStudyPlan() {
    const tasks = [];
    moduleQuizzes.forEach((m) => {
      const score = app.state.moduleResults[m.id];
      if (typeof score !== "number") tasks.push(`Start ${m.title} quiz to establish baseline.`);
      else if (score < 70) tasks.push(`Retry ${m.title} quiz (current ${score}%). Review ${m.recommendUrl}.`);
    });
    readingMissions.forEach((m) => {
      const score = app.state.missionResults[m.id];
      if (typeof score !== "number") tasks.push(`Complete ${m.title} mission and mark source reviewed.`);
      else if (score < 70) tasks.push(`Revisit ${m.title} extracted page and retake mission.`);
    });
    if (!app.state.simulationReady) tasks.push("Run Final Project Simulator and close missing evidence checks.");
    if (!app.state.bossCleared) tasks.push("Clear Boss Arena after completing 3 module quizzes and 3 reading missions.");
    if (tasks.length === 0) tasks.push("Great work. Run one scenario replay and update Evidence Workspace for team handoff.");

    return `
      <div class="panel-card">
        <h3>Personalized study plan</h3>
        <p>Generated from your scores and completion history.</p>
        <ol class="plan-list">${tasks.map((t) => `<li>${t}</li>`).join("")}</ol>
        <button data-action="refresh-plan">Refresh plan</button>
      </div>
    `;
  }

  function renderQuiz() {
    return `
      <div class="panel-card">
        <h3>Quiz Arena</h3>
        <p>Keyboard support: press 1/2/3/4 while answering.</p>
        <div class="module-grid">
          ${moduleQuizzes.map((m) => {
            const locked = !isModuleUnlocked(m.id);
            return `<div class="module-card">
              <h4>${m.title}</h4>
              <p>Best score: ${typeof app.state.moduleResults[m.id] === "number" ? `${app.state.moduleResults[m.id]}%` : "Not attempted"}</p>
              <div class="card-actions">
                <button data-action="start-quiz" data-id="${m.id}" ${locked ? "disabled" : ""}>${locked ? "Locked" : "Start quiz"}</button>
                <a href="${m.notesUrl}" target="_blank" rel="noopener noreferrer">Open notes</a>
              </div>
            </div>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  function renderMissions() {
    return `
      <div class="panel-card">
        <h3>Reading Missions</h3>
        <p>Tie reading references to retention checks.</p>
        <div class="module-grid">
          ${readingMissions.map((m) => `<div class="module-card">
            <h4>${m.title}</h4>
            <p>Mission score: ${typeof app.state.missionResults[m.id] === "number" ? `${app.state.missionResults[m.id]}%` : "Not attempted"}</p>
            <p>Source reviewed: ${app.state.sourceReviewed[m.id] ? "Yes" : "No"}</p>
            <div class="card-actions">
              <a href="${m.sourcePageUrl}" target="_blank" rel="noopener noreferrer">Extracted page</a>
              <a href="${m.sourceUrl}" target="_blank" rel="noopener noreferrer">Source PDF</a>
              <button data-action="mark-reviewed" data-id="${m.id}" ${app.state.sourceReviewed[m.id] ? "disabled" : ""}>Mark reviewed (+15 XP)</button>
              <button data-action="start-mission" data-id="${m.id}">Start mission</button>
            </div>
          </div>`).join("")}
        </div>
      </div>
    `;
  }

  function renderQuests() {
    return `
      <div class="panel-card">
        <h3>Learning Quests</h3>
        <div class="module-grid">
          ${learningQuests.map((q) => `<div class="module-card">
            <h4>${q.title}</h4>
            <ul class="quest-list">${q.tasks.map((t) => `<li>${t}</li>`).join("")}</ul>
            <p>Reward: ${q.xp} XP</p>
            <button data-action="complete-quest" data-id="${q.id}" ${app.state.questStatus[q.id] ? "disabled" : ""}>${app.state.questStatus[q.id] ? "Completed" : "Mark completed"}</button>
          </div>`).join("")}
        </div>
      </div>
    `;
  }

  function renderScenarios() {
    return `
      <div class="panel-card">
        <h3>Scenario Mode</h3>
        <div class="module-grid">
          ${scenarioSets.map((s) => `<div class="module-card">
            <h4>${s.role}</h4>
            <p>${s.prompt}</p>
            <p>Best score: ${typeof app.state.scenarioScores[s.id] === "number" ? `${app.state.scenarioScores[s.id]}/2` : "Not attempted"}</p>
            <button data-action="start-scenario" data-id="${s.id}">Play scenario</button>
          </div>`).join("")}
        </div>
      </div>
    `;
  }

  function renderBoss() {
    return `
      <div class="panel-card">
        <h3>Boss Arena</h3>
        <p>Status: ${app.state.bossCleared ? "Cleared" : bossUnlocked() ? "Unlocked" : "Locked (finish 3 module quizzes + 3 reading missions)"}</p>
        <button data-action="start-boss" ${bossUnlocked() ? "" : "disabled"}>Start boss challenge</button>
      </div>
    `;
  }

  function renderSimulator() {
    return `
      <div class="panel-card">
        <h3>Final Project Readiness Simulator</h3>
        <div class="sim-grid">
          ${simulatorChecks.map((c) => `<label class="sim-check"><input type="checkbox" data-action="sim-check" data-id="${c.id}" ${app.state.simulationChecks[c.id] ? "checked" : ""}><span>${c.label} <em>(${c.weight}%)</em></span></label>`).join("")}
        </div>
        <div class="sim-score">
          <p><strong>Score:</strong> ${app.state.simulationScore}%</p>
          <p><strong>Status:</strong> ${app.state.simulationReady ? readinessLabel(app.state.simulationScore) : "Not calculated"}</p>
        </div>
        <button data-action="run-simulator">Calculate readiness</button>
      </div>
    `;
  }

  function renderEvidence() {
    return `
      <div class="panel-card">
        <h3>Evidence Workspace</h3>
        <p>Write core artifacts here and export as markdown for repository docs.</p>
        <div class="evidence-grid">
          ${evidenceFields.map((f) => `<label class="evidence-field"><span>${f.title}</span><textarea data-action="evidence-input" data-id="${f.id}" placeholder="${f.placeholder}">${app.state.evidenceDocs[f.id] || ""}</textarea></label>`).join("")}
        </div>
        <div class="card-actions">
          <button data-action="export-evidence">Export evidence markdown</button>
          <button data-action="clear-evidence">Clear evidence workspace</button>
        </div>
      </div>
    `;
  }

  function renderFacilitator() {
    return `
      <div class="panel-card">
        <h3>Facilitator Mode</h3>
        <p>Use this flow to run a live cohort session.</p>
        <ol class="plan-list">${facilitatorSteps.map((s, i) => `<li class="${i < app.state.facilitator.index ? "done-step" : ""}">${s}</li>`).join("")}</ol>
        <p><strong>Live checkpoint prompt:</strong> ${facilitatorSteps[Math.min(app.state.facilitator.index, facilitatorSteps.length - 1)]}</p>
        <div class="card-actions">
          <button data-action="next-facilitator-step">Next checkpoint</button>
          <button data-action="reset-facilitator-step">Reset flow</button>
        </div>
        <label class="evidence-field"><span>Facilitator notes</span><textarea data-action="facilitator-notes" placeholder="Record workshop decisions and common learner blockers...">${app.state.facilitator.notes || ""}</textarea></label>
      </div>
    `;
  }

  function renderTeam() {
    const rows = app.state.teamSnapshots.slice().sort((a, b) => (b.xp || 0) - (a.xp || 0)).map((s, i) => `<tr><td>${i + 1}</td><td>${s.name || "Unnamed"}</td><td>${s.level}</td><td>${s.xp}</td><td>${s.progress}%</td></tr>`).join("");
    return `
      <div class="panel-card">
        <h3>Team Mode</h3>
        <div class="team-controls">
          <input type="text" id="player-name" placeholder="Your name" value="${app.state.playerName || ""}">
          <button data-action="save-name">Save name</button>
          <button data-action="export-profile">Export progress JSON</button>
          <label class="import-label">Import teammate JSON<input id="team-import" type="file" accept=".json"></label>
        </div>
        <table class="team-table">
          <thead><tr><th>#</th><th>Name</th><th>Level</th><th>XP</th><th>Progress</th></tr></thead>
          <tbody>${rows || '<tr><td colspan="5">No imported profiles yet.</td></tr>'}</tbody>
        </table>
      </div>
    `;
  }

  function renderAnalytics() {
    const tabRows = Object.keys(app.state.analytics.tabSeconds).sort().map((k) => `<tr><td>${k}</td><td>${app.state.analytics.tabVisits[k] || 0}</td><td>${app.state.analytics.tabSeconds[k] || 0}s</td></tr>`).join("");
    const quizRows = Object.entries(app.state.analytics.quizAttempts).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("");
    const missionRows = Object.entries(app.state.analytics.missionAttempts).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join("");
    return `
      <div class="panel-card">
        <h3>Local analytics (browser only)</h3>
        <p>No server tracking. Data stays in local storage.</p>
        <p><strong>Total actions:</strong> ${app.state.analytics.actions} | <strong>Retries:</strong> ${app.state.analytics.retries}</p>
        <h4>Time by tab</h4>
        <table class="team-table"><thead><tr><th>Tab</th><th>Visits</th><th>Time</th></tr></thead><tbody>${tabRows || '<tr><td colspan="3">No data yet.</td></tr>'}</tbody></table>
        <h4>Quiz attempts</h4>
        <table class="team-table"><thead><tr><th>Quiz</th><th>Attempts</th></tr></thead><tbody>${quizRows || '<tr><td colspan="2">No attempts yet.</td></tr>'}</tbody></table>
        <h4>Mission attempts</h4>
        <table class="team-table"><thead><tr><th>Mission</th><th>Attempts</th></tr></thead><tbody>${missionRows || '<tr><td colspan="2">No attempts yet.</td></tr>'}</tbody></table>
      </div>
    `;
  }

  function renderSettings() {
    return `
      <div class="panel-card">
        <h3>Accessibility and UX settings</h3>
        <label class="sim-check"><input type="checkbox" data-action="setting-toggle" data-id="reducedMotion" ${app.state.settings.reducedMotion ? "checked" : ""}><span>Reduced motion</span></label>
        <label class="sim-check"><input type="checkbox" data-action="setting-toggle" data-id="highContrast" ${app.state.settings.highContrast ? "checked" : ""}><span>High contrast mode</span></label>
        <label class="sim-check"><input type="checkbox" data-action="setting-toggle" data-id="compactMode" ${app.state.settings.compactMode ? "checked" : ""}><span>Compact mobile-friendly mode</span></label>
        <p>Keyboard shortcuts in quizzes: press 1 / 2 / 3 / 4 to choose answers.</p>
      </div>
    `;
  }

  function bindGlobalActions() {
    root.querySelectorAll('[data-action="tab"]').forEach((el) => el.addEventListener("click", () => switchTab(el.dataset.tab)));
    const dailyBtn = root.querySelector('[data-action="open-daily"]');
    if (dailyBtn) dailyBtn.addEventListener("click", () => openDailyChallenge());

    const reset = root.querySelector('[data-action="reset-progress"]');
    if (reset) reset.addEventListener("click", () => {
      if (!window.confirm("Reset all saved progress for this browser?")) return;
      app.state = initialState();
      app.activeFlow = null;
      app.activeIndex = 0;
      app.activeCorrect = 0;
      trackAction();
      saveState();
      render();
    });

    root.querySelectorAll('[data-action="start-quiz"]').forEach((el) => el.addEventListener("click", () => startFlow("module", el.dataset.id)));
    root.querySelectorAll('[data-action="start-mission"]').forEach((el) => el.addEventListener("click", () => startFlow("mission", el.dataset.id)));
    root.querySelectorAll('[data-action="mark-reviewed"]').forEach((el) => el.addEventListener("click", () => markReviewed(el.dataset.id)));
    root.querySelectorAll('[data-action="complete-quest"]').forEach((el) => el.addEventListener("click", () => completeQuest(el.dataset.id)));
    root.querySelectorAll('[data-action="start-scenario"]').forEach((el) => el.addEventListener("click", () => openScenario(el.dataset.id)));
    const boss = root.querySelector('[data-action="start-boss"]');
    if (boss) boss.addEventListener("click", () => startFlow("boss", "boss"));
    root.querySelectorAll('[data-action="sim-check"]').forEach((el) => el.addEventListener("change", () => {
      app.state.simulationChecks[el.dataset.id] = el.checked;
      trackAction();
      saveState();
    }));
    const simBtn = root.querySelector('[data-action="run-simulator"]');
    if (simBtn) simBtn.addEventListener("click", runSimulator);

    root.querySelectorAll('[data-action="evidence-input"]').forEach((el) => el.addEventListener("input", () => {
      app.state.evidenceDocs[el.dataset.id] = el.value;
      saveState();
    }));
    const expEvidence = root.querySelector('[data-action="export-evidence"]');
    if (expEvidence) expEvidence.addEventListener("click", exportEvidence);
    const clearEvidence = root.querySelector('[data-action="clear-evidence"]');
    if (clearEvidence) clearEvidence.addEventListener("click", () => {
      if (!window.confirm("Clear evidence workspace fields?")) return;
      app.state.evidenceDocs = {};
      trackAction();
      saveState();
      render();
    });

    const nextStep = root.querySelector('[data-action="next-facilitator-step"]');
    if (nextStep) nextStep.addEventListener("click", () => {
      app.state.facilitator.index = Math.min(facilitatorSteps.length - 1, app.state.facilitator.index + 1);
      trackAction();
      saveState();
      render();
    });
    const resetStep = root.querySelector('[data-action="reset-facilitator-step"]');
    if (resetStep) resetStep.addEventListener("click", () => {
      app.state.facilitator.index = 0;
      trackAction();
      saveState();
      render();
    });
    const fNotes = root.querySelector('[data-action="facilitator-notes"]');
    if (fNotes) fNotes.addEventListener("input", () => {
      app.state.facilitator.notes = fNotes.value;
      saveState();
    });

    const saveName = root.querySelector('[data-action="save-name"]');
    if (saveName) saveName.addEventListener("click", () => {
      const input = root.querySelector("#player-name");
      app.state.playerName = (input.value || "").trim();
      trackAction();
      saveState();
      render();
    });
    const exportProfileBtn = root.querySelector('[data-action="export-profile"]');
    if (exportProfileBtn) exportProfileBtn.addEventListener("click", exportProfile);
    const importInput = root.querySelector("#team-import");
    if (importInput) importInput.addEventListener("change", importProfile);

    root.querySelectorAll('[data-action="setting-toggle"]').forEach((el) => el.addEventListener("change", () => {
      app.state.settings[el.dataset.id] = el.checked;
      trackAction();
      saveState();
      render();
    }));

    const refreshPlan = root.querySelector('[data-action="refresh-plan"]');
    if (refreshPlan) refreshPlan.addEventListener("click", () => {
      trackAction();
      render();
    });
  }

  function bindKeyboardShortcuts() {
    if (app.keyboardBound) return;
    app.keyboardBound = true;
    document.addEventListener("keydown", (e) => {
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const key = (e.key || "").toLowerCase();
      if (!(key in map)) return;
      const answerButton = root.querySelector(`.option-btn[data-index="${map[key]}"]`);
      if (answerButton && !answerButton.disabled) {
        answerButton.click();
      }
    });
  }

  function markReviewed(id) {
    if (app.state.sourceReviewed[id]) return;
    app.state.sourceReviewed[id] = true;
    gainXp(15);
    updateStreak();
    awardBadge("Reference Explorer");
    trackAction();
    saveState();
    render();
  }

  function completeQuest(id) {
    if (app.state.questStatus[id]) return;
    const quest = learningQuests.find((q) => q.id === id);
    app.state.questStatus[id] = true;
    gainXp(quest.xp);
    updateStreak();
    awardBadge("Quest Runner");
    if (countCompleted(app.state.questStatus) === learningQuests.length) awardBadge("All Quests Completed");
    trackAction();
    saveState();
    render();
  }

  function openScenario(id) {
    const scenario = scenarioSets.find((s) => s.id === id);
    if (!scenario) return;
    app.state.analytics.scenarioAttempts[id] = (app.state.analytics.scenarioAttempts[id] || 0) + 1;
    trackAction();
    saveState();
    const stage = root.querySelector("#challenge-stage");
    stage.innerHTML = `
      <div class="quiz-card">
        <h3>${scenario.role}</h3>
        <p>${scenario.prompt}</p>
        <div class="option-list">
          ${scenario.choices.map((c, i) => `<button class="option-btn" data-action="scenario-choice" data-id="${id}" data-index="${i}">${c.text}</button>`).join("")}
        </div>
        <div id="quiz-feedback"></div>
      </div>`;
    stage.querySelectorAll('[data-action="scenario-choice"]').forEach((el) => el.addEventListener("click", () => chooseScenario(id, Number(el.dataset.index))));
    scrollStageIntoView();
  }

  function chooseScenario(id, choiceIndex) {
    const scenario = scenarioSets.find((s) => s.id === id);
    const selected = scenario.choices[choiceIndex];
    gainXp(selected.score * 20);
    updateStreak();
    app.state.scenarioScores[id] = Math.max(selected.score, app.state.scenarioScores[id] || 0);
    if (selected.score === 2) awardBadge("Scenario Strategist");
    if (countCompleted(app.state.scenarioScores) === scenarioSets.length) awardBadge("All Scenarios Solved");
    trackAction();
    saveState();
    const feedback = root.querySelector("#quiz-feedback");
    feedback.innerHTML = `<p class="${selected.score >= 2 ? "ok" : "bad"}"><strong>Decision result:</strong> +${selected.score * 20} XP</p><p>${selected.feedback}</p><button id="back-btn">Back to hub</button>`;
    feedback.querySelector("#back-btn").addEventListener("click", () => render());
  }

  function runSimulator() {
    let score = 0;
    simulatorChecks.forEach((c) => { if (app.state.simulationChecks[c.id]) score += c.weight; });
    app.state.simulationScore = score;
    app.state.simulationReady = true;
    gainXp(Math.max(10, Math.round(score / 4)));
    updateStreak();
    if (score >= 90) awardBadge("Release Ready Architect");
    else if (score >= 70) awardBadge("Readiness Builder");
    trackAction();
    saveState();
    render();
  }

  function exportEvidence() {
    const section = (id, title) => `## ${title}\n\n${(app.state.evidenceDocs[id] || "").trim() || "_No notes yet._"}\n`;
    const content = [
      "# Training Evidence Workspace Export",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      section("adr", "Mini ADR"),
      section("promptLog", "Prompt Log"),
      section("verification", "Verification Log"),
      section("releaseEvidence", "Release Evidence")
    ].join("\n");
    downloadText(content, "training-evidence-export.md");
    trackAction();
  }

  function exportProfile() {
    const profile = {
      name: app.state.playerName || "Unnamed",
      level: app.state.level,
      xp: app.state.xp,
      progress: getOverallProgress(),
      badges: app.state.badges,
      exportedAt: new Date().toISOString()
    };
    downloadText(JSON.stringify(profile, null, 2), `${(app.state.playerName || "training-player").toLowerCase().replace(/\s+/g, "-")}-progress.json`);
    trackAction();
  }

  function importProfile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        const snap = { name: String(parsed.name || "Unnamed"), level: Number(parsed.level || 1), xp: Number(parsed.xp || 0), progress: Number(parsed.progress || 0) };
        app.state.teamSnapshots = [snap, ...app.state.teamSnapshots.filter((s) => s.name !== snap.name)].slice(0, 30);
        trackAction();
        saveState();
        render();
      } catch {
        // Ignore invalid JSON.
      }
    };
    reader.readAsText(file);
  }

  function openDailyChallenge() {
    const daily = currentDailyChallenge();
    const stage = root.querySelector("#challenge-stage");
    stage.innerHTML = `
      <div class="quiz-card">
        <h3>${daily.title}</h3>
        <p>${daily.prompt}</p>
        <div class="option-list">
          ${daily.options.map((o, i) => `<button class="option-btn" data-action="daily-answer" data-index="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`).join("")}
        </div>
        <div id="quiz-feedback"></div>
      </div>`;
    stage.querySelectorAll('[data-action="daily-answer"]').forEach((el) => el.addEventListener("click", () => submitDailyAnswer(daily, Number(el.dataset.index))));
    scrollStageIntoView();
  }

  function submitDailyAnswer(daily, idx) {
    const feedback = root.querySelector("#quiz-feedback");
    const correct = idx === daily.answer;
    if (correct && !dailyDoneToday()) {
      app.state.daily = { completedDate: new Date().toISOString().slice(0, 10), score: 1, challengeId: daily.id };
      gainXp(25);
      updateStreak();
      awardBadge("Daily Momentum");
    }
    trackAction();
    saveState();
    feedback.innerHTML = `<p class="${correct ? "ok" : "bad"}"><strong>${correct ? "Correct." : "Not correct."}</strong></p><p>${daily.explanation}</p><button id="back-btn">Back to hub</button>`;
    feedback.querySelector("#back-btn").addEventListener("click", () => render());
  }

  function getFlowData(type, id) {
    if (type === "module") return moduleQuizzes.find((m) => m.id === id);
    if (type === "mission") return readingMissions.find((m) => m.id === id);
    if (type === "boss") return { id: "boss", title: "Boss Arena", recommendUrl: "../../references/extracted-reference-map/", questions: bossQuestions };
    return null;
  }

  function startFlow(type, id) {
    const data = getFlowData(type, id);
    if (!data) return;
    if (type === "module" && !isModuleUnlocked(id)) return;
    if (type === "module") app.state.analytics.quizAttempts[id] = (app.state.analytics.quizAttempts[id] || 0) + 1;
    if (type === "mission") app.state.analytics.missionAttempts[id] = (app.state.analytics.missionAttempts[id] || 0) + 1;
    app.activeFlow = { type, id, title: data.title, questions: data.questions, recommendUrl: data.recommendUrl };
    app.activeIndex = 0;
    app.activeCorrect = 0;
    app.flowStartAt = Date.now();
    trackAction();
    saveState();
    renderQuestion();
  }

  function renderQuestion() {
    const stage = root.querySelector("#challenge-stage");
    const q = app.activeFlow.questions[app.activeIndex];
    stage.innerHTML = `
      <div class="quiz-card">
        <h3>${app.activeFlow.title}</h3>
        <p class="quiz-meta">Question ${app.activeIndex + 1} of ${app.activeFlow.questions.length}</p>
        <p class="quiz-prompt">${q.prompt}</p>
        <div class="option-list">
          ${q.options.map((o, i) => `<button class="option-btn" data-index="${i}" data-action="answer">${String.fromCharCode(65 + i)}. ${o}</button>`).join("")}
        </div>
        <div id="quiz-feedback"></div>
      </div>`;
    stage.querySelectorAll('[data-action="answer"]').forEach((el) => el.addEventListener("click", () => checkAnswer(Number(el.dataset.index))));
    scrollStageIntoView();
  }

  function checkAnswer(selected) {
    const q = app.activeFlow.questions[app.activeIndex];
    const ok = selected === q.answer;
    if (ok) app.activeCorrect += 1;
    const stage = root.querySelector("#challenge-stage");
    stage.querySelectorAll(".option-btn").forEach((btn) => {
      btn.disabled = true;
      const idx = Number(btn.dataset.index);
      if (idx === q.answer) btn.classList.add("correct");
      if (idx === selected && idx !== q.answer) btn.classList.add("wrong");
    });
    const feedback = stage.querySelector("#quiz-feedback");
    feedback.innerHTML = `<p class="${ok ? "ok" : "bad"}"><strong>${ok ? "Correct." : "Not quite."}</strong></p><p>${q.explanation}</p><button id="next-step-btn">${app.activeIndex + 1 === app.activeFlow.questions.length ? "Finish" : "Next question"}</button>`;
    feedback.querySelector("#next-step-btn").addEventListener("click", () => {
      app.activeIndex += 1;
      if (app.activeIndex < app.activeFlow.questions.length) {
        renderQuestion();
        return;
      }
      finishFlow();
    });
  }

  function finishFlow() {
    const total = app.activeFlow.questions.length;
    const percent = Math.round((app.activeCorrect / total) * 100);
    const elapsed = Math.max(1, Math.round((Date.now() - app.flowStartAt) / 1000));
    const speedBonus = elapsed <= total * 25 ? 10 : 0;
    const earned = app.activeCorrect * 15 + (percent >= 80 ? 25 : 0) + speedBonus;

    gainXp(earned);
    updateStreak();
    if (app.activeFlow.type === "module") {
      app.state.moduleResults[app.activeFlow.id] = Math.max(percent, app.state.moduleResults[app.activeFlow.id] || 0);
      awardBadge("Quiz Starter");
      if (percent >= 80) awardBadge(`${app.activeFlow.title} Master`);
      if (countCompleted(app.state.moduleResults) === moduleQuizzes.length) awardBadge("All Module Quizzes Cleared");
    } else if (app.activeFlow.type === "mission") {
      app.state.missionResults[app.activeFlow.id] = Math.max(percent, app.state.missionResults[app.activeFlow.id] || 0);
      awardBadge("Reading Scout");
      if (countCompleted(app.state.missionResults) === readingMissions.length) awardBadge("All Reading Missions Cleared");
    } else if (app.activeFlow.type === "boss") {
      if (percent >= 70) {
        app.state.bossCleared = true;
        gainXp(40);
        awardBadge("Boss Arena Winner");
      }
    }
    if (percent < 70) app.state.analytics.retries += 1;
    if (app.state.currentStreak >= 3) awardBadge("3-Day Momentum");
    if (app.state.currentStreak >= 7) awardBadge("7-Day Consistency");
    if (app.state.level >= 5) awardBadge("Level 5 Achiever");
    trackAction();
    saveState();

    const recommend = percent < 70 && app.activeFlow.recommendUrl
      ? `<p class="hint"><strong>Adaptive retry tip:</strong> Review <a href="${app.activeFlow.recommendUrl}" target="_blank" rel="noopener noreferrer">this source section</a> then retry.</p>`
      : "";

    const stage = root.querySelector("#challenge-stage");
    stage.innerHTML = `<div class="quiz-card">
      <h3>${app.activeFlow.title} complete</h3>
      <p><strong>Score:</strong> ${app.activeCorrect}/${total} (${percent}%)</p>
      <p><strong>Time:</strong> ${elapsed}s</p>
      <p><strong>XP earned:</strong> ${earned}${speedBonus ? ` (includes +${speedBonus} speed bonus)` : ""}</p>
      ${recommend}
      <button id="back-btn">Back to hub</button>
    </div>`;
    stage.querySelector("#back-btn").addEventListener("click", () => {
      app.activeFlow = null;
      app.activeIndex = 0;
      app.activeCorrect = 0;
      render();
    });
    render();
  }

  function downloadText(content, filename) {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function scrollStageIntoView() {
    const stage = root.querySelector("#challenge-stage");
    if (!stage) return;
    if (app.state.settings.reducedMotion) {
      stage.scrollIntoView({ block: "start" });
      return;
    }
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  app.state = loadState();
  app.state.analytics.tabVisits[app.activeTab] = (app.state.analytics.tabVisits[app.activeTab] || 0) + 1;
  render();
})();

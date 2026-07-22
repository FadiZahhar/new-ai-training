(() => {
  const root = document.getElementById("interactive-training-app");
  if (!root) return;

  const STORAGE_KEY = "ai-training-progress-v5";
  const XP_PER_LEVEL = 120;
  const app = {
    state: null,
    activeTab: "dashboard",
    activeFlow: null,
    activeIndex: 0,
    activeCorrect: 0,
    flowStartAt: 0,
    tabStartAt: Date.now(),
    keyboardBound: false
  };

  const moduleQuizzes = [
    { id: "module-1", title: "Module 1: Foundations", est: "45m", notesUrl: "../../modules/module-1/lecture-notes/", recommendUrl: "../../modules/module-1/qa/", questions: [
      { prompt: "What is the safest assumption about AI-generated code?", options: ["It is production-ready if it compiles", "It is a draft that requires verification", "It is correct if the prompt is long", "It is reliable if copied from examples"], answer: 1, explanation: "AI output is draft material until validated." },
      { prompt: "Which loop best represents disciplined AI-assisted delivery?", options: ["Ask -> Accept -> Merge", "Ask -> Inspect -> Run -> Test -> Refine", "Prompt -> Copy -> Ship", "Ask -> Rewrite everything manually"], answer: 1, explanation: "Verification is mandatory before acceptance." },
      { prompt: "Which output is expected in Module 1 evidence?", options: ["Production deployment", "Reflection log with corrections", "Database migration plan", "Microservice split"], answer: 1, explanation: "Module 1 expects correction-driven learning evidence." }
    ] },
    { id: "module-2", title: "Module 2: Backend Build Discipline", est: "60m", notesUrl: "../../modules/module-2/lecture-notes/", recommendUrl: "../../modules/module-2/additional-reading/", questions: [
      { prompt: "What sequence aligns with Module 2 implementation flow?", options: ["UI -> tests -> model", "Model -> storage -> CRUD -> business rules -> tests", "Docs -> Docker -> CI", "Agent setup -> deployment"], answer: 1, explanation: "Module 2 uses staged backend construction." },
      { prompt: "Why does Module 2 require a Break Test?", options: ["To speed development", "To prove tests fail on broken code", "To reduce tests", "To avoid manual review"], answer: 1, explanation: "Tests must prove fault-detection ability." },
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
      { prompt: "Module 2 reading is scoped to backend verification, not full production architecture.", options: ["True", "False"], answer: 0, explanation: "Scope is intentionally constrained." },
      { prompt: "Which topic is explicitly out-of-scope for Module 2 reading?", options: ["CRUD verification", "Pydantic validators", "Autonomous enterprise setup", "FastAPI error basics"], answer: 2, explanation: "Autonomous/enterprise setup is skipped." }
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
      { prompt: "AGENTS.md in Module 5 is mainly for AI instruction boundaries.", options: ["True", "False"], answer: 0, explanation: "It sets operational boundaries." },
      { prompt: "Security review in Module 5 should use focused lenses (validation/data exposure/etc).", options: ["True", "False"], answer: 0, explanation: "References are security-focused." }
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

  const cohortPacks = [
    { id: "week-1", title: "Week 1 Pack: Foundations + Backend", agenda: [
      { label: "Context reset and outcomes", minutes: 10 },
      { label: "Module 1 review sprint", minutes: 20 },
      { label: "Module 2 implementation clinic", minutes: 35 },
      { label: "Break Test and evidence wrap", minutes: 15 }
    ] },
    { id: "week-2", title: "Week 2 Pack: Frontend + Workflow", agenda: [
      { label: "Module 3 bughunt warm-up", minutes: 15 },
      { label: "Frontend scenario lab", minutes: 25 },
      { label: "Module 4 CI/Docker verification", minutes: 35 },
      { label: "Release-readiness checkpoint", minutes: 15 }
    ] },
    { id: "week-3", title: "Week 3 Pack: Governance + Capstone", agenda: [
      { label: "Module 5 governance drill", minutes: 20 },
      { label: "Peer review pairing", minutes: 25 },
      { label: "Capstone evidence drafting", minutes: 30 },
      { label: "Final simulator and go/no-go", minutes: 20 }
    ] }
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
      daily: { completedDate: "", challengeId: "" },
      cohort: { packId: cohortPacks[0].id, stepIndex: 0, startedAt: null, notes: "", completed: {} },
      coachFeed: [],
      rubricScores: {},
      peerReviews: [],
      snapshots: [],
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
    return typeof app.state.moduleResults[moduleQuizzes[idx - 1].id] === "number";
  }

  function bossUnlocked() {
    return countCompleted(app.state.moduleResults) >= 3 && countCompleted(app.state.missionResults) >= 3;
  }

  function readinessLabel(score) {
    if (score >= 90) return "Release Ready";
    if (score >= 70) return "Almost Ready";
    return "Not Ready";
  }

  function currentDailyChallenge() {
    const dayIndex = Math.floor(Date.now() / 86400000) % dailyChallenges.length;
    return dailyChallenges[dayIndex];
  }

  function dailyDoneToday() {
    const today = new Date().toISOString().slice(0, 10);
    return app.state.daily.completedDate === today && app.state.daily.challengeId === currentDailyChallenge().id;
  }

  function calcRubricScores() {
    const prompting = Math.min(100, 20 + Math.round((countCompleted(app.state.questStatus) / learningQuests.length) * 80));
    const verification = Math.min(100, Math.round(((app.state.simulationScore || 0) * 0.6) + ((countCompleted(app.state.missionResults) / readingMissions.length) * 40)));
    const review = Math.min(100, Math.round((countCompleted(app.state.scenarioScores) / scenarioSets.length) * 100));
    const release = app.state.simulationReady ? app.state.simulationScore : Math.round((countCompleted(app.state.moduleResults) / moduleQuizzes.length) * 50);
    const ownership = Math.min(100, Math.round(((countCompleted(app.state.moduleResults) / moduleQuizzes.length) * 50) + ((countCompleted(app.state.scenarioScores) / scenarioSets.length) * 50)));
    const overall = Math.round((prompting + verification + review + release + ownership) / 5);
    app.state.rubricScores = { prompting, verification, review, release, ownership, overall };
  }

  function getOverallProgress() {
    const total = moduleQuizzes.length + readingMissions.length + learningQuests.length + scenarioSets.length + 6;
    const done =
      countCompleted(app.state.moduleResults) +
      countCompleted(app.state.missionResults) +
      countCompleted(app.state.questStatus) +
      countCompleted(app.state.scenarioScores) +
      (app.state.bossCleared ? 1 : 0) +
      (app.state.simulationReady ? 1 : 0) +
      (dailyDoneToday() ? 1 : 0) +
      (Object.values(app.state.evidenceDocs || {}).some(Boolean) ? 1 : 0) +
      (app.state.peerReviews.length > 0 ? 1 : 0) +
      (Object.keys(app.state.cohort.completed || {}).length > 0 ? 1 : 0);
    return Math.round((done / total) * 100);
  }

  function ensureDailySnapshot() {
    const today = new Date().toISOString().slice(0, 10);
    if (app.state.snapshots.some((s) => s.date === today)) return;
    calcRubricScores();
    app.state.snapshots.push({
      date: today,
      progress: getOverallProgress(),
      xp: app.state.xp,
      readiness: app.state.simulationScore || 0,
      rubric: app.state.rubricScores.overall || 0
    });
    app.state.snapshots = app.state.snapshots.slice(-21);
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
    calcRubricScores();
    ensureDailySnapshot();
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
        <p>Cohort packs, coaching, rubrics, capstone prep, peer review, facilitator tools, and trend tracking.</p>
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
      ["cohort", "Cohort Packs"],
      ["quiz", "Quiz Arena"],
      ["missions", "Reading Missions"],
      ["quests", "Learning Quests"],
      ["scenario", "Scenario Mode"],
      ["coach", "AI Coach"],
      ["rubric", "Rubric Engine"],
      ["boss", "Boss Arena"],
      ["simulator", "Final Simulator"],
      ["capstone", "Capstone Generator"],
      ["evidence", "Evidence Workspace"],
      ["peer", "Peer Review Mode"],
      ["facilitator", "Facilitator Kit"],
      ["broadcast", "Broadcast Cards"],
      ["team", "Team Mode"],
      ["trends", "Trends"],
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

  function renderPanel() {
    switch (app.activeTab) {
      case "roadmap": return renderRoadmap();
      case "study": return renderStudyPlan();
      case "cohort": return renderCohort();
      case "quiz": return renderQuiz();
      case "missions": return renderMissions();
      case "quests": return renderQuests();
      case "scenario": return renderScenarios();
      case "coach": return renderCoach();
      case "rubric": return renderRubric();
      case "boss": return renderBoss();
      case "simulator": return renderSimulator();
      case "capstone": return renderCapstone();
      case "evidence": return renderEvidence();
      case "peer": return renderPeer();
      case "facilitator": return renderFacilitator();
      case "broadcast": return renderBroadcast();
      case "team": return renderTeam();
      case "trends": return renderTrends();
      case "analytics": return renderAnalytics();
      case "settings": return renderSettings();
      default: return renderDashboard();
    }
  }

  function renderDashboard() {
    return `
      <div class="panel-card">
        <h3>Progress dashboard</h3>
        <p><strong>Module quizzes:</strong> ${countCompleted(app.state.moduleResults)}/${moduleQuizzes.length}</p>
        <p><strong>Reading missions:</strong> ${countCompleted(app.state.missionResults)}/${readingMissions.length}</p>
        <p><strong>Quests:</strong> ${countCompleted(app.state.questStatus)}/${learningQuests.length}</p>
        <p><strong>Scenarios solved:</strong> ${countCompleted(app.state.scenarioScores)}/${scenarioSets.length}</p>
        <p><strong>Rubric overall:</strong> ${app.state.rubricScores.overall || 0}%</p>
        <p><strong>Final simulator:</strong> ${app.state.simulationReady ? `${readinessLabel(app.state.simulationScore)} (${app.state.simulationScore}%)` : "Not attempted"}</p>
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
        <div class="roadmap-grid">
          ${moduleQuizzes.map((m, i) => {
            const done = typeof app.state.moduleResults[m.id] === "number";
            const unlocked = isModuleUnlocked(m.id);
            return `<div class="roadmap-card ${done ? "done" : unlocked ? "open" : "locked"}">
              <div class="roadmap-step">Step ${i + 1}</div>
              <h4>${m.title}</h4>
              <p>Estimated time: ${m.est}</p>
              <p>Status: ${done ? `Completed (${app.state.moduleResults[m.id]}%)` : unlocked ? "Ready" : "Locked"}</p>
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
      else if (score < 70) tasks.push(`Retry ${m.title} quiz (${score}%). Review ${m.recommendUrl}.`);
    });
    readingMissions.forEach((m) => {
      const score = app.state.missionResults[m.id];
      if (typeof score !== "number") tasks.push(`Complete ${m.title} mission and mark source reviewed.`);
      else if (score < 70) tasks.push(`Revisit ${m.title} extracted page and retake mission.`);
    });
    if (!app.state.simulationReady) tasks.push("Run Final Project Simulator and close missing evidence checks.");
    if (!app.state.bossCleared) tasks.push("Clear Boss Arena after 3 quiz + 3 mission completions.");
    if (tasks.length === 0) tasks.push("Excellent progress. Run one scenario replay and update capstone evidence bundle.");

    return `
      <div class="panel-card">
        <h3>Personalized study plan</h3>
        <ol class="plan-list">${tasks.map((t) => `<li>${t}</li>`).join("")}</ol>
        <button data-action="refresh-plan">Refresh plan</button>
      </div>
    `;
  }

  function renderCohort() {
    const pack = cohortPacks.find((p) => p.id === app.state.cohort.packId) || cohortPacks[0];
    const current = pack.agenda[Math.min(app.state.cohort.stepIndex, pack.agenda.length - 1)];
    return `
      <div class="panel-card">
        <h3>Cohort session packs</h3>
        <label class="sim-check">
          <span>Pack</span>
          <select data-action="cohort-pack">
            ${cohortPacks.map((p) => `<option value="${p.id}" ${p.id === pack.id ? "selected" : ""}>${p.title}</option>`).join("")}
          </select>
        </label>
        <ul class="plan-list">${pack.agenda.map((a, i) => `<li class="${i < app.state.cohort.stepIndex ? "done-step" : ""}">${a.label} (${a.minutes}m)</li>`).join("")}</ul>
        <p><strong>Current block:</strong> ${current.label} (${current.minutes}m)</p>
        <div class="card-actions">
          <button data-action="cohort-next">Next block</button>
          <button data-action="cohort-reset">Reset pack</button>
          <button data-action="cohort-export">Export runbook markdown</button>
        </div>
        <label class="evidence-field"><span>Cohort notes</span><textarea data-action="cohort-notes" placeholder="Capture workshop observations and blockers...">${app.state.cohort.notes || ""}</textarea></label>
      </div>
    `;
  }

  function renderQuiz() {
    return `
      <div class="panel-card">
        <h3>Quiz Arena</h3>
        <p>Keyboard support: press 1/2/3/4 while answering.</p>
        <div class="module-grid">
          ${moduleQuizzes.map((m) => `<div class="module-card">
            <h4>${m.title}</h4>
            <p>Best score: ${typeof app.state.moduleResults[m.id] === "number" ? `${app.state.moduleResults[m.id]}%` : "Not attempted"}</p>
            <div class="card-actions">
              <button data-action="start-quiz" data-id="${m.id}" ${!isModuleUnlocked(m.id) ? "disabled" : ""}>${isModuleUnlocked(m.id) ? "Start quiz" : "Locked"}</button>
              <a href="${m.notesUrl}" target="_blank" rel="noopener noreferrer">Open notes</a>
            </div>
          </div>`).join("")}
        </div>
      </div>
    `;
  }

  function renderMissions() {
    return `
      <div class="panel-card">
        <h3>Reading Missions</h3>
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

  function renderCoach() {
    return `
      <div class="panel-card">
        <h3>Auto feedback coach</h3>
        <p>Generated coaching feedback from quiz/mission/scenario results.</p>
        <div class="coach-list">
          ${(app.state.coachFeed || []).map((item) => `<div class="coach-card">
            <p><strong>${item.title}</strong> — ${item.score}%</p>
            <p>${item.feedback}</p>
            <p class="coach-meta">${item.time}</p>
          </div>`).join("") || "<p>No coaching feedback yet. Complete an activity.</p>"}
        </div>
      </div>
    `;
  }

  function renderRubric() {
    const rs = app.state.rubricScores;
    const metric = (name, value) => `<div class="metric-card"><p><strong>${name}</strong> ${value}%</p><div class="score-bar"><span style="width:${value}%"></span></div></div>`;
    return `
      <div class="panel-card">
        <h3>Competency rubric engine</h3>
        <div class="metric-grid">
          ${metric("Prompting quality", rs.prompting || 0)}
          ${metric("Verification rigor", rs.verification || 0)}
          ${metric("Review judgment", rs.review || 0)}
          ${metric("Release readiness", rs.release || 0)}
          ${metric("Ownership discipline", rs.ownership || 0)}
        </div>
        <p><strong>Overall rubric score:</strong> ${rs.overall || 0}%</p>
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
        <div class="sim-grid">${simulatorChecks.map((c) => `<label class="sim-check"><input type="checkbox" data-action="sim-check" data-id="${c.id}" ${app.state.simulationChecks[c.id] ? "checked" : ""}><span>${c.label} <em>(${c.weight}%)</em></span></label>`).join("")}</div>
        <div class="sim-score">
          <p><strong>Score:</strong> ${app.state.simulationScore}%</p>
          <p><strong>Status:</strong> ${app.state.simulationReady ? readinessLabel(app.state.simulationScore) : "Not calculated"}</p>
        </div>
        <button data-action="run-simulator">Calculate readiness</button>
      </div>
    `;
  }

  function renderCapstone() {
    return `
      <div class="panel-card">
        <h3>Capstone workspace generator</h3>
        <p>Generate final-project evidence docs from your current progress.</p>
        <div class="card-actions">
          <button data-action="gen-capstone-release">Generate release-evidence.md</button>
          <button data-action="gen-capstone-review">Generate final-ai-review.md</button>
          <button data-action="gen-capstone-playbook">Generate ai-playbook.md</button>
          <button data-action="gen-capstone-bundle">Generate full capstone bundle</button>
        </div>
      </div>
    `;
  }

  function renderEvidence() {
    return `
      <div class="panel-card">
        <h3>Evidence Workspace</h3>
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

  function renderPeer() {
    return `
      <div class="panel-card">
        <h3>Peer review mode</h3>
        <p>Import teammate profile and run structured review checklist.</p>
        <label class="import-label">Import teammate JSON<input id="peer-import" type="file" accept=".json"></label>
        <div class="evidence-grid">
          <label class="evidence-field"><span>Scope control notes</span><textarea data-action="peer-note" data-id="scope">${(app.state.peerDraft || {}).scope || ""}</textarea></label>
          <label class="evidence-field"><span>Verification quality notes</span><textarea data-action="peer-note" data-id="verification">${(app.state.peerDraft || {}).verification || ""}</textarea></label>
          <label class="evidence-field"><span>Security/review notes</span><textarea data-action="peer-note" data-id="security">${(app.state.peerDraft || {}).security || ""}</textarea></label>
          <label class="evidence-field"><span>Final recommendation</span><textarea data-action="peer-note" data-id="recommendation">${(app.state.peerDraft || {}).recommendation || ""}</textarea></label>
        </div>
        <div class="card-actions">
          <button data-action="peer-save">Save peer review snapshot</button>
          <button data-action="peer-export">Export peer review markdown</button>
        </div>
        <div class="coach-list">
          ${(app.state.peerReviews || []).map((r) => `<div class="coach-card"><p><strong>${r.name}</strong> (${r.progress}% progress)</p><p>${r.recommendation || "No recommendation provided."}</p></div>`).join("") || "<p>No peer reviews saved yet.</p>"}
        </div>
      </div>
    `;
  }

  function renderFacilitator() {
    return `
      <div class="panel-card">
        <h3>Facilitator mode</h3>
        <ol class="plan-list">${facilitatorSteps.map((s, i) => `<li class="${i < app.state.facilitator.index ? "done-step" : ""}">${s}</li>`).join("")}</ol>
        <p><strong>Current prompt:</strong> ${facilitatorSteps[Math.min(app.state.facilitator.index, facilitatorSteps.length - 1)]}</p>
        <div class="card-actions">
          <button data-action="facilitator-next">Next checkpoint</button>
          <button data-action="facilitator-reset">Reset flow</button>
        </div>
        <label class="evidence-field"><span>Facilitator notes</span><textarea data-action="facilitator-notes">${app.state.facilitator.notes || ""}</textarea></label>
      </div>
    `;
  }

  function renderBroadcast() {
    const cards = [
      "Common mistake: accepting AI fixes without a break test or negative-path proof.",
      "Trigger question: Which file evidence convinced you this change is correct?",
      "Discussion prompt: What did AI get wrong and how did you detect it?",
      "Exit ticket: Write one team rule that will reduce hidden regressions."
    ];
    return `
      <div class="panel-card">
        <h3>Facilitator broadcast kit</h3>
        <div class="coach-list">${cards.map((c) => `<div class="coach-card"><p>${c}</p></div>`).join("")}</div>
        <button data-action="broadcast-print">Print broadcast cards</button>
      </div>
    `;
  }

  function renderTeam() {
    const rows = app.state.teamSnapshots.slice().sort((a, b) => (b.xp || 0) - (a.xp || 0)).map((s, i) => `<tr><td>${i + 1}</td><td>${s.name || "Unnamed"}</td><td>${s.level}</td><td>${s.xp}</td><td>${s.progress}%</td></tr>`).join("");
    return `
      <div class="panel-card">
        <h3>Team mode</h3>
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

  function renderTrends() {
    const bars = app.state.snapshots.map((s) => {
      const filled = Math.round((s.progress || 0) / 5);
      return `<tr><td>${s.date}</td><td>${s.progress}%</td><td>${s.xp}</td><td>${s.readiness}%</td><td>${s.rubric}%</td><td><span class="trend-bar">${"█".repeat(Math.max(1, filled))}</span></td></tr>`;
    }).join("");
    return `
      <div class="panel-card">
        <h3>Progress snapshots over time</h3>
        <p>Local trend history (saved in browser only).</p>
        <button data-action="snapshot-now">Capture snapshot now</button>
        <table class="team-table">
          <thead><tr><th>Date</th><th>Progress</th><th>XP</th><th>Readiness</th><th>Rubric</th><th>Trend</th></tr></thead>
          <tbody>${bars || '<tr><td colspan="6">No snapshots yet.</td></tr>'}</tbody>
        </table>
      </div>
    `;
  }

  function renderAnalytics() {
    const tabRows = Object.keys(app.state.analytics.tabSeconds).sort().map((k) => `<tr><td>${k}</td><td>${app.state.analytics.tabVisits[k] || 0}</td><td>${app.state.analytics.tabSeconds[k] || 0}s</td></tr>`).join("");
    return `
      <div class="panel-card">
        <h3>Local analytics (browser only)</h3>
        <p><strong>Total actions:</strong> ${app.state.analytics.actions} | <strong>Retries:</strong> ${app.state.analytics.retries}</p>
        <table class="team-table">
          <thead><tr><th>Tab</th><th>Visits</th><th>Time</th></tr></thead>
          <tbody>${tabRows || '<tr><td colspan="3">No data yet.</td></tr>'}</tbody>
        </table>
      </div>
    `;
  }

  function renderSettings() {
    return `
      <div class="panel-card">
        <h3>Accessibility and UX settings</h3>
        <label class="sim-check"><input type="checkbox" data-action="setting-toggle" data-id="reducedMotion" ${app.state.settings.reducedMotion ? "checked" : ""}><span>Reduced motion</span></label>
        <label class="sim-check"><input type="checkbox" data-action="setting-toggle" data-id="highContrast" ${app.state.settings.highContrast ? "checked" : ""}><span>High contrast mode</span></label>
        <label class="sim-check"><input type="checkbox" data-action="setting-toggle" data-id="compactMode" ${app.state.settings.compactMode ? "checked" : ""}><span>Compact mobile mode</span></label>
        <p>Keyboard shortcuts in quizzes: press 1 / 2 / 3 / 4 to choose answers.</p>
      </div>
    `;
  }

  function bindGlobalActions() {
    root.querySelectorAll('[data-action="tab"]').forEach((el) => el.addEventListener("click", () => switchTab(el.dataset.tab)));
    const dailyBtn = root.querySelector('[data-action="open-daily"]');
    if (dailyBtn) dailyBtn.addEventListener("click", openDailyChallenge);

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
    const sim = root.querySelector('[data-action="run-simulator"]');
    if (sim) sim.addEventListener("click", runSimulator);

    root.querySelectorAll('[data-action="evidence-input"]').forEach((el) => el.addEventListener("input", () => {
      app.state.evidenceDocs[el.dataset.id] = el.value;
      saveState();
    }));
    const evExp = root.querySelector('[data-action="export-evidence"]');
    if (evExp) evExp.addEventListener("click", exportEvidence);
    const evClear = root.querySelector('[data-action="clear-evidence"]');
    if (evClear) evClear.addEventListener("click", () => {
      if (!window.confirm("Clear evidence workspace fields?")) return;
      app.state.evidenceDocs = {};
      trackAction();
      saveState();
      render();
    });

    const cPack = root.querySelector('[data-action="cohort-pack"]');
    if (cPack) cPack.addEventListener("change", () => {
      app.state.cohort.packId = cPack.value;
      app.state.cohort.stepIndex = 0;
      trackAction();
      saveState();
      render();
    });
    const cNext = root.querySelector('[data-action="cohort-next"]');
    if (cNext) cNext.addEventListener("click", () => {
      const pack = cohortPacks.find((p) => p.id === app.state.cohort.packId) || cohortPacks[0];
      app.state.cohort.stepIndex = Math.min(pack.agenda.length - 1, app.state.cohort.stepIndex + 1);
      app.state.cohort.completed[`${app.state.cohort.packId}-${app.state.cohort.stepIndex}`] = true;
      gainXp(10);
      trackAction();
      saveState();
      render();
    });
    const cReset = root.querySelector('[data-action="cohort-reset"]');
    if (cReset) cReset.addEventListener("click", () => {
      app.state.cohort.stepIndex = 0;
      trackAction();
      saveState();
      render();
    });
    const cExport = root.querySelector('[data-action="cohort-export"]');
    if (cExport) cExport.addEventListener("click", exportCohortRunbook);
    const cNotes = root.querySelector('[data-action="cohort-notes"]');
    if (cNotes) cNotes.addEventListener("input", () => {
      app.state.cohort.notes = cNotes.value;
      saveState();
    });

    const facNext = root.querySelector('[data-action="facilitator-next"]');
    if (facNext) facNext.addEventListener("click", () => {
      app.state.facilitator.index = Math.min(facilitatorSteps.length - 1, app.state.facilitator.index + 1);
      trackAction();
      saveState();
      render();
    });
    const facReset = root.querySelector('[data-action="facilitator-reset"]');
    if (facReset) facReset.addEventListener("click", () => {
      app.state.facilitator.index = 0;
      trackAction();
      saveState();
      render();
    });
    const facNotes = root.querySelector('[data-action="facilitator-notes"]');
    if (facNotes) facNotes.addEventListener("input", () => {
      app.state.facilitator.notes = facNotes.value;
      saveState();
    });

    const bPrint = root.querySelector('[data-action="broadcast-print"]');
    if (bPrint) bPrint.addEventListener("click", () => window.print());

    const saveName = root.querySelector('[data-action="save-name"]');
    if (saveName) saveName.addEventListener("click", () => {
      const input = root.querySelector("#player-name");
      app.state.playerName = (input.value || "").trim();
      trackAction();
      saveState();
      render();
    });
    const exProfile = root.querySelector('[data-action="export-profile"]');
    if (exProfile) exProfile.addEventListener("click", exportProfile);
    const teamImport = root.querySelector("#team-import");
    if (teamImport) teamImport.addEventListener("change", importTeamProfile);

    const pImport = root.querySelector("#peer-import");
    if (pImport) pImport.addEventListener("change", importPeerProfile);
    root.querySelectorAll('[data-action="peer-note"]').forEach((el) => el.addEventListener("input", () => {
      if (!app.state.peerDraft) app.state.peerDraft = {};
      app.state.peerDraft[el.dataset.id] = el.value;
      saveState();
    }));
    const peerSave = root.querySelector('[data-action="peer-save"]');
    if (peerSave) peerSave.addEventListener("click", savePeerReview);
    const peerExport = root.querySelector('[data-action="peer-export"]');
    if (peerExport) peerExport.addEventListener("click", exportPeerReview);

    const genRelease = root.querySelector('[data-action="gen-capstone-release"]');
    if (genRelease) genRelease.addEventListener("click", () => downloadText(buildCapstoneRelease(), "release-evidence.md"));
    const genReview = root.querySelector('[data-action="gen-capstone-review"]');
    if (genReview) genReview.addEventListener("click", () => downloadText(buildCapstoneReview(), "final-ai-review.md"));
    const genPlaybook = root.querySelector('[data-action="gen-capstone-playbook"]');
    if (genPlaybook) genPlaybook.addEventListener("click", () => downloadText(buildCapstonePlaybook(), "ai-playbook.md"));
    const genBundle = root.querySelector('[data-action="gen-capstone-bundle"]');
    if (genBundle) genBundle.addEventListener("click", () => downloadText([buildCapstoneRelease(), buildCapstoneReview(), buildCapstonePlaybook()].join("\n\n---\n\n"), "capstone-bundle.md"));

    const snapNow = root.querySelector('[data-action="snapshot-now"]');
    if (snapNow) snapNow.addEventListener("click", () => {
      app.state.snapshots.push({
        date: `${new Date().toISOString().slice(0, 10)}-${new Date().toTimeString().slice(0, 5)}`,
        progress: getOverallProgress(),
        xp: app.state.xp,
        readiness: app.state.simulationScore || 0,
        rubric: app.state.rubricScores.overall || 0
      });
      app.state.snapshots = app.state.snapshots.slice(-30);
      trackAction();
      saveState();
      render();
    });

    root.querySelectorAll('[data-action="setting-toggle"]').forEach((el) => el.addEventListener("change", () => {
      app.state.settings[el.dataset.id] = el.checked;
      trackAction();
      saveState();
      render();
    }));

    const refresh = root.querySelector('[data-action="refresh-plan"]');
    if (refresh) refresh.addEventListener("click", () => render());
  }

  function bindKeyboardShortcuts() {
    if (app.keyboardBound) return;
    app.keyboardBound = true;
    document.addEventListener("keydown", (e) => {
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const key = (e.key || "").toLowerCase();
      if (!(key in map)) return;
      const btn = root.querySelector(`.option-btn[data-index="${map[key]}"]`);
      if (btn && !btn.disabled) btn.click();
    });
  }

  function openDailyChallenge() {
    const d = currentDailyChallenge();
    const stage = root.querySelector("#challenge-stage");
    stage.innerHTML = `
      <div class="quiz-card">
        <h3>${d.title}</h3>
        <p>${d.prompt}</p>
        <div class="option-list">${d.options.map((o, i) => `<button class="option-btn" data-action="daily-answer" data-index="${i}">${String.fromCharCode(65 + i)}. ${o}</button>`).join("")}</div>
        <div id="quiz-feedback"></div>
      </div>
    `;
    stage.querySelectorAll('[data-action="daily-answer"]').forEach((el) => el.addEventListener("click", () => submitDailyAnswer(d, Number(el.dataset.index))));
    scrollStageIntoView();
  }

  function submitDailyAnswer(daily, idx) {
    const correct = idx === daily.answer;
    if (correct && !dailyDoneToday()) {
      app.state.daily = { completedDate: new Date().toISOString().slice(0, 10), challengeId: daily.id };
      gainXp(25);
      updateStreak();
      awardBadge("Daily Momentum");
    }
    trackAction();
    saveState();
    const feedback = root.querySelector("#quiz-feedback");
    feedback.innerHTML = `<p class="${correct ? "ok" : "bad"}"><strong>${correct ? "Correct." : "Not correct."}</strong></p><p>${daily.explanation}</p><button id="back-btn">Back to hub</button>`;
    feedback.querySelector("#back-btn").addEventListener("click", () => render());
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
        <div class="option-list">${scenario.choices.map((c, i) => `<button class="option-btn" data-action="scenario-choice" data-id="${id}" data-index="${i}">${c.text}</button>`).join("")}</div>
        <div id="quiz-feedback"></div>
      </div>
    `;
    stage.querySelectorAll('[data-action="scenario-choice"]').forEach((el) => el.addEventListener("click", () => chooseScenario(id, Number(el.dataset.index))));
    scrollStageIntoView();
  }

  function chooseScenario(id, idx) {
    const s = scenarioSets.find((x) => x.id === id);
    const selected = s.choices[idx];
    gainXp(selected.score * 20);
    updateStreak();
    app.state.scenarioScores[id] = Math.max(selected.score, app.state.scenarioScores[id] || 0);
    if (selected.score === 2) awardBadge("Scenario Strategist");
    if (countCompleted(app.state.scenarioScores) === scenarioSets.length) awardBadge("All Scenarios Solved");
    addCoachEntry(`${s.role} scenario`, Math.round((selected.score / 2) * 100), selected.feedback);
    trackAction();
    saveState();
    const feedback = root.querySelector("#quiz-feedback");
    feedback.innerHTML = `<p class="${selected.score >= 2 ? "ok" : "bad"}"><strong>Decision result:</strong> +${selected.score * 20} XP</p><p>${selected.feedback}</p><button id="back-btn">Back to hub</button>`;
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
        <div class="option-list">${q.options.map((o, i) => `<button class="option-btn" data-index="${i}" data-action="answer">${String.fromCharCode(65 + i)}. ${o}</button>`).join("")}</div>
        <div id="quiz-feedback"></div>
      </div>
    `;
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

    addCoachEntry(app.activeFlow.title, percent, coachFeedback(app.activeFlow.type, percent));
    trackAction();
    saveState();

    const recommend = percent < 70 && app.activeFlow.recommendUrl
      ? `<p class="hint"><strong>Adaptive retry tip:</strong> Review <a href="${app.activeFlow.recommendUrl}" target="_blank" rel="noopener noreferrer">this source section</a> then retry.</p>`
      : "";

    const stage = root.querySelector("#challenge-stage");
    stage.innerHTML = `
      <div class="quiz-card">
        <h3>${app.activeFlow.title} complete</h3>
        <p><strong>Score:</strong> ${app.activeCorrect}/${total} (${percent}%)</p>
        <p><strong>Time:</strong> ${elapsed}s</p>
        <p><strong>XP earned:</strong> ${earned}${speedBonus ? ` (includes +${speedBonus} speed bonus)` : ""}</p>
        ${recommend}
        <button id="back-btn">Back to hub</button>
      </div>
    `;
    stage.querySelector("#back-btn").addEventListener("click", () => {
      app.activeFlow = null;
      app.activeIndex = 0;
      app.activeCorrect = 0;
      render();
    });
    render();
  }

  function coachFeedback(type, score) {
    if (score >= 85) return "Strong result. Keep documenting why you accepted each AI suggestion.";
    if (score >= 70) return "Good baseline. Improve by adding one stronger verification or rejection rationale.";
    if (type === "mission") return "Re-read the extracted reference section, then retry with note-taking on key constraints.";
    if (type === "module") return "Replay with smaller scoped prompts and explicit verification checkpoints.";
    return "Pause and reframe: what evidence would prove this decision is safe?";
  }

  function addCoachEntry(title, score, feedback) {
    app.state.coachFeed = [{ title, score, feedback, time: new Date().toLocaleString() }, ...(app.state.coachFeed || [])].slice(0, 30);
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
    addCoachEntry("Final simulator", score, score >= 90 ? "Release posture is strong. Preserve evidence quality for handoff." : "Close missing evidence checks before final submission.");
    trackAction();
    saveState();
    render();
  }

  function buildCapstoneRelease() {
    return `# Release Evidence\n\n## Current readiness\n- Score: ${app.state.simulationScore}%\n- Status: ${readinessLabel(app.state.simulationScore)}\n\n## CI evidence\n- Green -> red -> green proof: _Add run links here_\n\n## Docker evidence\n- Build and run checks: _Add commands and outputs_\n\n## Verification notes\n${(app.state.evidenceDocs.verification || "_Add verification notes_")}`;
  }

  function buildCapstoneReview() {
    return `# Final AI Review\n\n## Accepted AI outputs\n- _List accepted suggestions with reasons_\n\n## Rejected AI outputs\n- _List rejected suggestions with reasons_\n\n## Governance summary\n${(app.state.evidenceDocs.promptLog || "_Add prompt governance notes_")}`;
  }

  function buildCapstonePlaybook() {
    return `# AI Playbook\n\n## Team operating rules\n- Scope boundaries first\n- Evidence before acceptance\n- Explicit review ownership\n\n## Personal rules from training\n${(app.state.evidenceDocs.adr || "_Add your rules_")}`;
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

  function exportCohortRunbook() {
    const pack = cohortPacks.find((p) => p.id === app.state.cohort.packId) || cohortPacks[0];
    const content = [
      `# ${pack.title} Runbook`,
      "",
      "## Agenda",
      ...pack.agenda.map((a, i) => `${i + 1}. ${a.label} (${a.minutes}m)`),
      "",
      "## Facilitator notes",
      app.state.cohort.notes || "_No notes yet._"
    ].join("\n");
    downloadText(content, `${pack.id}-runbook.md`);
    trackAction();
  }

  function exportProfile() {
    const profile = {
      name: app.state.playerName || "Unnamed",
      level: app.state.level,
      xp: app.state.xp,
      progress: getOverallProgress(),
      badges: app.state.badges,
      rubric: app.state.rubricScores,
      exportedAt: new Date().toISOString()
    };
    downloadText(JSON.stringify(profile, null, 2), `${(app.state.playerName || "training-player").toLowerCase().replace(/\s+/g, "-")}-progress.json`);
    trackAction();
  }

  function importTeamProfile(event) {
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

  function importPeerProfile(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        app.state.peerDraftProfile = {
          name: String(parsed.name || "Unnamed"),
          level: Number(parsed.level || 1),
          xp: Number(parsed.xp || 0),
          progress: Number(parsed.progress || 0)
        };
        trackAction();
        saveState();
        render();
      } catch {
        // Ignore invalid JSON.
      }
    };
    reader.readAsText(file);
  }

  function savePeerReview() {
    const p = app.state.peerDraftProfile || { name: "Unnamed", progress: 0 };
    const d = app.state.peerDraft || {};
    const snapshot = {
      name: p.name,
      progress: p.progress,
      recommendation: d.recommendation || "",
      scope: d.scope || "",
      verification: d.verification || "",
      security: d.security || "",
      savedAt: new Date().toISOString()
    };
    app.state.peerReviews = [snapshot, ...(app.state.peerReviews || [])].slice(0, 20);
    gainXp(20);
    awardBadge("Peer Reviewer");
    trackAction();
    saveState();
    render();
  }

  function exportPeerReview() {
    const latest = (app.state.peerReviews || [])[0];
    if (!latest) return;
    const content = [
      "# Peer Review Summary",
      "",
      `Peer: ${latest.name}`,
      `Progress: ${latest.progress}%`,
      "",
      "## Scope control notes",
      latest.scope || "_No notes_",
      "",
      "## Verification notes",
      latest.verification || "_No notes_",
      "",
      "## Security/review notes",
      latest.security || "_No notes_",
      "",
      "## Recommendation",
      latest.recommendation || "_No recommendation_"
    ].join("\n");
    downloadText(content, "peer-review-summary.md");
    trackAction();
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

  function bindKeyboardShortcuts() {
    if (app.keyboardBound) return;
    app.keyboardBound = true;
    document.addEventListener("keydown", (e) => {
      const map = { "1": 0, "2": 1, "3": 2, "4": 3, a: 0, b: 1, c: 2, d: 3 };
      const key = (e.key || "").toLowerCase();
      if (!(key in map)) return;
      const btn = root.querySelector(`.option-btn[data-index="${map[key]}"]`);
      if (btn && !btn.disabled) btn.click();
    });
  }

  app.state = loadState();
  app.state.analytics.tabVisits[app.activeTab] = (app.state.analytics.tabVisits[app.activeTab] || 0) + 1;
  render();
})();

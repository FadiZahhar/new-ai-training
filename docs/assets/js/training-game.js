(() => {
  const root = document.getElementById("interactive-training-app");
  if (!root) return;

  const STORAGE_KEY = "ai-training-progress-v2";
  const XP_PER_LEVEL = 120;

  const moduleQuizzes = [
    {
      id: "module-1",
      title: "Module 1: Foundations",
      notesUrl: "../../modules/module-1/lecture-notes/",
      questions: [
        {
          prompt: "What is the safest assumption about AI-generated code?",
          options: [
            "It is production-ready if it compiles",
            "It is a draft that requires verification",
            "It is correct if the prompt is long",
            "It is reliable if copied from examples"
          ],
          answer: 1,
          explanation: "Module 1 frames AI output as plausible draft code that still requires validation."
        },
        {
          prompt: "Which loop best represents disciplined AI-assisted delivery?",
          options: [
            "Ask -> Accept -> Merge",
            "Ask -> Inspect -> Run -> Test -> Refine",
            "Prompt -> Copy -> Ship",
            "Ask -> Rewrite everything manually"
          ],
          answer: 1,
          explanation: "Verification is mandatory before acceptance."
        },
        {
          prompt: "Which output is expected in Module 1 evidence?",
          options: [
            "A fully deployed production app",
            "A reflection log with AI-right/AI-corrected assumptions",
            "A new microservice",
            "A database migration strategy"
          ],
          answer: 1,
          explanation: "The module expects learning evidence, not feature expansion."
        },
        {
          prompt: "What improves prompt reliability most?",
          options: [
            "Strict scope constraints and output format",
            "Longer conversation history only",
            "More adjectives",
            "Using only one-shot prompts"
          ],
          answer: 0,
          explanation: "Constrained prompts reduce drift and hallucinated assumptions."
        }
      ]
    },
    {
      id: "module-2",
      title: "Module 2: Backend Build Discipline",
      notesUrl: "../../modules/module-2/lecture-notes/",
      questions: [
        {
          prompt: "What sequence aligns with Module 2 implementation flow?",
          options: [
            "UI -> tests -> model",
            "Model -> storage -> CRUD -> business rules -> tests",
            "Docs -> Docker -> CI",
            "Agent setup -> deployment"
          ],
          answer: 1,
          explanation: "Module 2 is a connected staged backend build."
        },
        {
          prompt: "Why does Module 2 require a Break Test?",
          options: [
            "To speed development",
            "To prove tests fail when code is intentionally broken",
            "To reduce the number of tests",
            "To avoid manual review"
          ],
          answer: 1,
          explanation: "A test suite must show fault-detection ability."
        },
        {
          prompt: "What is emphasized for editor AI usage in Module 2 readings?",
          options: [
            "Generic prompts with no files",
            "File-aware prompts against actual repository files",
            "Autonomous multi-repo agents",
            "Skipping review for generated models"
          ],
          answer: 1,
          explanation: "Source readings explicitly prioritize file/context references."
        },
        {
          prompt: "In partial updates, what is a key concept in the reading pack?",
          options: [
            "Always send full object",
            "Use PATCH semantics and exclude_unset behavior correctly",
            "Bypass validation for speed",
            "Only validate in frontend"
          ],
          answer: 1,
          explanation: "Module 2 links PATCH behavior to correct backend validation boundaries."
        }
      ]
    },
    {
      id: "module-3",
      title: "Module 3: Frontend Confidence",
      notesUrl: "../../modules/module-3/lecture-notes/",
      questions: [
        {
          prompt: "What does Module 3 convert the project into?",
          options: [
            "A deployment pipeline",
            "A browser-facing product surface",
            "A mobile app",
            "A CLI-only workflow"
          ],
          answer: 1,
          explanation: "Module 3 transitions backend API into an interactive frontend."
        },
        {
          prompt: "What critical fetch behavior is highlighted in Module 3 readings?",
          options: [
            "Fetch throws on every 4xx automatically",
            "Fetch must be checked explicitly for non-2xx responses",
            "Fetch should be replaced with WebSockets",
            "Fetch handles validation errors silently"
          ],
          answer: 1,
          explanation: "Readings emphasize explicit response status checks."
        },
        {
          prompt: "What is the recommended AI edit style for Module 3?",
          options: [
            "Whole-file rewrites",
            "Selected-block scoped edits with review",
            "No diff inspection",
            "No tests after edit"
          ],
          answer: 1,
          explanation: "Inline scoped edits reduce risk and improve review quality."
        },
        {
          prompt: "What evidence should drive debugging decisions?",
          options: [
            "UI intuition only",
            "Status codes, payloads, console/network traces, and tests",
            "AI confidence score",
            "Code length"
          ],
          answer: 1,
          explanation: "Module 3 requires evidence-based debugging."
        }
      ]
    },
    {
      id: "module-4",
      title: "Module 4: Workflow and CI/CD",
      notesUrl: "../../modules/module-4/lecture-notes/",
      questions: [
        {
          prompt: "What changes in Module 4 compared to earlier modules?",
          options: [
            "No verification needed",
            "Scope expands to repo-level engineering artifacts",
            "Only frontend edits continue",
            "Tests are optional"
          ],
          answer: 1,
          explanation: "Module 4 broadens to CI, Docker, docs, and team workflow."
        },
        {
          prompt: "What is a required evidence pattern in CI validation?",
          options: [
            "One green run only",
            "Green -> intentional red -> restored green",
            "No run history needed",
            "Screenshot only"
          ],
          answer: 1,
          explanation: "Source notes explicitly require this cycle."
        },
        {
          prompt: "Why is CLAUDE.md emphasized?",
          options: [
            "For marketing text",
            "To anchor project memory, commands, constraints, and boundaries",
            "To replace README",
            "To skip planning"
          ],
          answer: 1,
          explanation: "Project memory improves repo-level agent reliability."
        },
        {
          prompt: "How should AI code review be used in Module 4 context?",
          options: [
            "As a full replacement for human review",
            "As triage input that still requires human validation",
            "Only for style",
            "Only before writing code"
          ],
          answer: 1,
          explanation: "AI review supplements but does not replace ownership."
        }
      ]
    },
    {
      id: "module-5",
      title: "Module 5: Governance and Ownership",
      notesUrl: "../../modules/module-5/lecture-notes/",
      questions: [
        {
          prompt: "Which posture best describes Module 5?",
          options: [
            "AI proposes, developer grades and owns",
            "AI owns architecture choices",
            "Developer accepts all suggestions",
            "Speed over traceability"
          ],
          answer: 0,
          explanation: "Governance requires explicit human grading decisions."
        },
        {
          prompt: "What does AGENTS.md provide in Module 5 setup?",
          options: [
            "A branding guideline",
            "Repo-level operating constraints and expectations",
            "A dependency lockfile",
            "A test runner replacement"
          ],
          answer: 1,
          explanation: "Module 5 uses AGENTS.md to constrain and guide AI behavior."
        },
        {
          prompt: "What should strong governance prompts demand?",
          options: [
            "Unbounded creativity",
            "File-cited claims and explicit boundaries",
            "No constraints",
            "No uncertainty disclosure"
          ],
          answer: 1,
          explanation: "Evidence-backed claims reduce unsupported output."
        },
        {
          prompt: "How should security findings from AI be handled?",
          options: [
            "Merged directly",
            "Classified and validated with manual review lenses",
            "Ignored unless critical",
            "Converted to docs only"
          ],
          answer: 1,
          explanation: "Module 5 additional reading stresses secure review accountability."
        }
      ]
    }
  ];

  const readingMissions = [
    {
      id: "reading-2",
      title: "Reading Mission: Module 2 Additional Reading",
      sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-2-additional-readings.pdf",
      sourcePageUrl: "../../modules/module-2/additional-reading/",
      questions: [
        {
          prompt: "Module 2 additional reading is scoped mainly to backend implementation verification, not production deployment architecture.",
          options: ["True", "False"],
          answer: 0,
          explanation: "The source explicitly limits scope to module backend outcomes."
        },
        {
          prompt: "Which topic is explicitly listed as lower priority for Module 2 reading scope?",
          options: [
            "CRUD endpoint verification",
            "Pydantic v2 model validation",
            "Autonomous agents and enterprise setup",
            "FastAPI error handling basics"
          ],
          answer: 2,
          explanation: "The reading says to skip autonomous/enterprise topics for this module."
        },
        {
          prompt: "Why are practical references included in this source?",
          options: [
            "For end-to-end memorization",
            "As lookup references while coding/reviewing",
            "To replace module lectures",
            "To avoid tests"
          ],
          answer: 1,
          explanation: "The PDF frames them as quick lookup references."
        }
      ]
    },
    {
      id: "reading-3",
      title: "Reading Mission: Module 3 Additional Reading",
      sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-3-additional-readings.pdf",
      sourcePageUrl: "../../modules/module-3/additional-reading/",
      questions: [
        {
          prompt: "Module 3 reading recommends vague repo-wide Copilot questions over selected-code prompts.",
          options: ["True", "False"],
          answer: 1,
          explanation: "It recommends scoped prompts with selected code or files."
        },
        {
          prompt: "Which web API detail is marked as critical in Module 3 readings?",
          options: [
            "fetch retries by default",
            "fetch throws on all 4xx",
            "fetch requires explicit status handling for non-2xx",
            "fetch can bypass CORS in dev mode"
          ],
          answer: 2,
          explanation: "The reading highlights explicit response status checks."
        },
        {
          prompt: "The drag-and-drop reading focus is based on:",
          options: [
            "Native browser Drag and Drop API concepts",
            "A required third-party drag framework",
            "No event handling needed",
            "Server-side drag computation"
          ],
          answer: 0,
          explanation: "The source points to native MDN DnD concepts."
        }
      ]
    },
    {
      id: "reading-4",
      title: "Reading Mission: Module 4 Additional Reading",
      sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-4-additional-readings.pdf",
      sourcePageUrl: "../../modules/module-4/additional-reading/",
      questions: [
        {
          prompt: "When tutorials conflict with your repository behavior, what does the source recommend?",
          options: [
            "Trust tutorial examples first",
            "Trust repo evidence: inspect diff, run command, verify output",
            "Ask AI to decide without checks",
            "Skip conflicting steps"
          ],
          answer: 1,
          explanation: "Verification against your repo is explicitly prioritized."
        },
        {
          prompt: "Which practice is highlighted from Docker best-practice references?",
          options: [
            "Single-stage image only",
            "Multi-stage builds and non-root runtime guidance",
            "Running container as root always",
            "Ignoring .dockerignore"
          ],
          answer: 1,
          explanation: "The reading mentions multi-stage and non-root principles."
        },
        {
          prompt: "How should AI code review be treated in this module?",
          options: [
            "As replacement for human review",
            "As supporting triage that still requires manual review/testing",
            "As optional style suggestion only",
            "As deployment approval automation"
          ],
          answer: 1,
          explanation: "Human ownership remains required."
        }
      ]
    },
    {
      id: "reading-5",
      title: "Reading Mission: Module 5 Additional Reading",
      sourceUrl: "https://fadizahhar.github.io/new-ai-training/assets/pdf/module-5-additional-readings.pdf",
      sourcePageUrl: "../../modules/module-5/additional-reading/",
      questions: [
        {
          prompt: "What is the purpose of AGENTS.md in Module 5 context?",
          options: [
            "Theme customization",
            "Project-level AI instruction boundaries and expectations",
            "Dependency management",
            "Replacing tests"
          ],
          answer: 1,
          explanation: "The source ties AGENTS.md to governance setup."
        },
        {
          prompt: "Which secure review lens is explicitly emphasized?",
          options: [
            "Input validation and data exposure checks",
            "Only naming conventions",
            "UI spacing consistency",
            "Commit message formatting"
          ],
          answer: 0,
          explanation: "OWASP/OpenSSF references emphasize security-specific review lenses."
        },
        {
          prompt: "How does context engineering help in Module 5 activities?",
          options: [
            "By increasing prompt length only",
            "By focusing context and reusing precise instructions",
            "By removing boundaries",
            "By disabling uncertainty reporting"
          ],
          answer: 1,
          explanation: "Focused context improves reliability and traceability."
        }
      ]
    }
  ];

  const bossQuestions = [
    {
      prompt: "Which statement best aligns with the final project source?",
      options: [
        "Add as many new features as possible",
        "Demonstrate release-readiness and AI ownership evidence without feature creep",
        "Skip CI and focus on visuals",
        "Use a new repository"
      ],
      answer: 1,
      explanation: "Final project guidance emphasizes release-readiness and ownership evidence."
    },
    {
      prompt: "What should happen if AI claims something about repo state without evidence?",
      options: [
        "Accept if phrased confidently",
        "Request file-cited evidence or treat as uncertain",
        "Ignore and proceed",
        "Delete all docs"
      ],
      answer: 1,
      explanation: "Module governance rules require evidence-backed claims."
    },
    {
      prompt: "A safe team-scale AI habit across modules is:",
      options: [
        "One large prompt, one large merge",
        "Small scoped tasks with inspect/run/test loops",
        "Skipping review for docs files",
        "Trusting generated pipelines immediately"
      ],
      answer: 1,
      explanation: "Scoped iteration and verification are consistent course habits."
    },
    {
      prompt: "Why are additional readings valuable in this program?",
      options: [
        "They replace labs",
        "They provide targeted lookup depth for implementation and governance decisions",
        "They remove need for prompts",
        "They avoid debugging"
      ],
      answer: 1,
      explanation: "They extend module outcomes with focused practical references."
    },
    {
      prompt: "What is the expected relationship between AI review and human review?",
      options: [
        "AI review replaces manual review",
        "AI review supports, human review decides",
        "Manual review only for UI",
        "No review needed after tests pass"
      ],
      answer: 1,
      explanation: "Human ownership is a repeated program rule."
    }
  ];

  const initialState = () => ({
    xp: 0,
    level: 1,
    badges: [],
    moduleResults: {},
    missionResults: {},
    sourceReviewed: {},
    currentStreak: 0,
    lastActiveDate: null,
    bossCleared: false,
    coins: 0
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
      // Ignore localStorage write failures in restricted browsing contexts.
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

  function getProgress() {
    const moduleDone = Object.keys(state.moduleResults).length;
    const missionDone = Object.keys(state.missionResults).length;
    const totalItems = moduleQuizzes.length + readingMissions.length + 1;
    const doneItems = moduleDone + missionDone + (state.bossCleared ? 1 : 0);
    return Math.round((doneItems / totalItems) * 100);
  }

  function bossUnlocked() {
    return Object.keys(state.moduleResults).length >= 3 && Object.keys(state.missionResults).length >= 3;
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
    const progress = getProgress();
    return `
      <div class="game-header">
        <h2>Interactive Challenge Hub</h2>
        <p>Play through quizzes and reading missions extracted from module sources. Progress is saved in this browser.</p>
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
        ${
          state.badges.length
            ? `<div class="badge-grid">${state.badges.map((badge) => `<span class="badge-item">${badge}</span>`).join("")}</div>`
            : "<p>No badges yet. Complete your first activity.</p>"
        }
      </div>
    `;
  }

  function renderTabs() {
    const tabs = [
      { id: "dashboard", label: "Dashboard" },
      { id: "quiz", label: "Quiz Arena" },
      { id: "missions", label: "Reading Missions" },
      { id: "boss", label: "Boss Arena" }
    ];
    return `
      <div class="tab-row">
        ${tabs
          .map(
            (tab) =>
              `<button class="tab-btn ${activeTab === tab.id ? "active" : ""}" data-action="tab" data-tab="${tab.id}">${tab.label}</button>`
          )
          .join("")}
      </div>
    `;
  }

  function renderPanel() {
    if (activeTab === "quiz") return renderQuizPanel();
    if (activeTab === "missions") return renderMissionsPanel();
    if (activeTab === "boss") return renderBossPanel();
    return renderDashboardPanel();
  }

  function renderDashboardPanel() {
    const modulesDone = Object.keys(state.moduleResults).length;
    const missionsDone = Object.keys(state.missionResults).length;
    return `
      <div class="panel-card">
        <h3>Progress dashboard</h3>
        <p><strong>Module quizzes complete:</strong> ${modulesDone}/${moduleQuizzes.length}</p>
        <p><strong>Reading missions complete:</strong> ${missionsDone}/${readingMissions.length}</p>
        <p><strong>Boss arena:</strong> ${state.bossCleared ? "Cleared" : bossUnlocked() ? "Unlocked" : "Locked"}</p>
        <p><strong>Next unlock:</strong> ${
          bossUnlocked() ? "Boss challenge available" : "Complete at least 3 module quizzes and 3 reading missions"
        }</p>
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
        <p>Complete module quizzes to earn XP, coins, and mastery badges.</p>
        <div class="module-grid">
          ${moduleQuizzes
            .map((quiz) => {
              const best = state.moduleResults[quiz.id];
              return `
                <div class="module-card">
                  <h4>${quiz.title}</h4>
                  <p>${quiz.questions.length} questions</p>
                  <p>Best score: ${typeof best === "number" ? `${best}%` : "Not attempted"}</p>
                  <div class="card-actions">
                    <button data-action="start-quiz" data-id="${quiz.id}">Start quiz</button>
                    <a href="${quiz.notesUrl}" target="_blank" rel="noopener noreferrer">Open notes</a>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderMissionsPanel() {
    return `
      <div class="panel-card">
        <h3>Reading Missions</h3>
        <p>Use extracted additional-reading references and complete mission checks.</p>
        <div class="module-grid">
          ${readingMissions
            .map((mission) => {
              const best = state.missionResults[mission.id];
              const reviewed = state.sourceReviewed[mission.id];
              return `
                <div class="module-card">
                  <h4>${mission.title}</h4>
                  <p>Reference mission + ${mission.questions.length} checks</p>
                  <p>Mission score: ${typeof best === "number" ? `${best}%` : "Not attempted"}</p>
                  <p>Source reviewed: ${reviewed ? "Yes" : "No"}</p>
                  <div class="card-actions">
                    <a href="${mission.sourcePageUrl}" target="_blank" rel="noopener noreferrer">Open extracted page</a>
                    <a href="${mission.sourceUrl}" target="_blank" rel="noopener noreferrer">Open source PDF</a>
                    <button data-action="mark-reviewed" data-id="${mission.id}" ${reviewed ? "disabled" : ""}>Mark source reviewed (+15 XP)</button>
                    <button data-action="start-mission" data-id="${mission.id}">Start mission quiz</button>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }

  function renderBossPanel() {
    return `
      <div class="panel-card">
        <h3>Boss Arena</h3>
        <p>Mixed challenge across modules and extracted references.</p>
        <p>Status: ${
          state.bossCleared
            ? "Cleared"
            : bossUnlocked()
              ? "Unlocked - ready to start"
              : "Locked - complete 3 module quizzes and 3 reading missions"
        }</p>
        <button data-action="start-boss" ${bossUnlocked() ? "" : "disabled"}>Start boss challenge</button>
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
        if (!window.confirm("Reset all saved game progress for this browser?")) return;
        Object.assign(state, initialState());
        activeFlow = null;
        saveState();
        render();
      });
    }

    root.querySelectorAll('[data-action="start-quiz"]').forEach((button) => {
      button.addEventListener("click", () => startFlow("module", button.dataset.id));
    });
    root.querySelectorAll('[data-action="start-mission"]').forEach((button) => {
      button.addEventListener("click", () => startFlow("mission", button.dataset.id));
    });
    root.querySelectorAll('[data-action="mark-reviewed"]').forEach((button) => {
      button.addEventListener("click", () => markReviewed(button.dataset.id));
    });

    const boss = root.querySelector('[data-action="start-boss"]');
    if (boss) {
      boss.addEventListener("click", () => startFlow("boss", "boss"));
    }
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

  function getFlowData(flowType, flowId) {
    if (flowType === "module") return moduleQuizzes.find((item) => item.id === flowId);
    if (flowType === "mission") return readingMissions.find((item) => item.id === flowId);
    if (flowType === "boss") return { id: "boss", title: "Boss Arena", questions: bossQuestions };
    return null;
  }

  function startFlow(flowType, flowId) {
    const data = getFlowData(flowType, flowId);
    if (!data) return;
    activeFlow = { type: flowType, id: flowId, title: data.title, questions: data.questions };
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
          ${q.options
            .map((option, idx) => `<button class="option-btn" data-action="answer" data-index="${idx}">${String.fromCharCode(65 + idx)}. ${option}</button>`)
            .join("")}
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
    const fastBonus = elapsedSec <= total * 25 ? 10 : 0;
    const accuracyXp = activeCorrect * 15;
    const rankBonus = percent >= 80 ? 25 : 0;
    const earned = accuracyXp + rankBonus + fastBonus;

    gainXp(earned);
    updateStreak();

    if (activeFlow.type === "module") {
      state.moduleResults[activeFlow.id] = Math.max(percent, state.moduleResults[activeFlow.id] || 0);
      awardBadge("Quiz Starter");
      if (percent >= 80) awardBadge(`${activeFlow.title} Master`);
      if (Object.keys(state.moduleResults).length === moduleQuizzes.length) awardBadge("All Module Quizzes Cleared");
    } else if (activeFlow.type === "mission") {
      state.missionResults[activeFlow.id] = Math.max(percent, state.missionResults[activeFlow.id] || 0);
      awardBadge("Reading Scout");
      if (Object.keys(state.missionResults).length === readingMissions.length) awardBadge("All Reading Missions Cleared");
    } else if (activeFlow.type === "boss") {
      if (percent >= 70) {
        state.bossCleared = true;
        awardBadge("Boss Arena Winner");
        gainXp(40);
      }
    }

    if (state.currentStreak >= 3) awardBadge("3-Day Momentum");
    if (state.currentStreak >= 7) awardBadge("7-Day Consistency");
    if (state.level >= 5) awardBadge("Level 5 Achiever");

    saveState();

    const stage = root.querySelector("#challenge-stage");
    stage.innerHTML = `
      <div class="quiz-card">
        <h3>${activeFlow.title} complete</h3>
        <p><strong>Score:</strong> ${activeCorrect}/${total} (${percent}%)</p>
        <p><strong>Time:</strong> ${elapsedSec}s</p>
        <p><strong>XP earned:</strong> ${earned}${fastBonus ? ` (includes +${fastBonus} speed bonus)` : ""}</p>
        ${
          activeFlow.type === "boss" && percent < 70
            ? "<p>Boss clear threshold is 70%. Review modules and try again.</p>"
            : ""
        }
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

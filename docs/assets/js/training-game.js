(() => {
  const root = document.getElementById("interactive-training-app");
  if (!root) return;

  const STORAGE_KEY = "ai-training-progress-v1";

  const modules = [
    {
      id: "module-1",
      title: "Module 1: Foundations",
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
          explanation: "AI output should be treated as a draft until validated by tests and review."
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
          explanation: "The quality loop includes inspection and verification before acceptance."
        },
        {
          prompt: "What is the strongest prompt element for reducing hallucinations?",
          options: [
            "Broad role definition only",
            "Strict scope and file-level constraints",
            "Maximum token budget",
            "Asking for more creativity"
          ],
          answer: 1,
          explanation: "Constrained prompts anchored to real files reduce fabricated assumptions."
        }
      ]
    },
    {
      id: "module-2",
      title: "Module 2: Backend Build Discipline",
      questions: [
        {
          prompt: "What is the best sequence for backend changes?",
          options: [
            "UI first, then tests, then model",
            "Model -> storage -> CRUD -> business rules -> tests",
            "Business rules first, then endpoints, then model",
            "Generate all files at once"
          ],
          answer: 1,
          explanation: "Incremental backend layering keeps behavior understandable and testable."
        },
        {
          prompt: "Why do break tests matter?",
          options: [
            "They speed up CI pipelines",
            "They prove tests can detect bad behavior",
            "They reduce code review time",
            "They remove the need for manual testing"
          ],
          answer: 1,
          explanation: "A test that never fails may not protect you from regressions."
        },
        {
          prompt: "When should you move to the next implementation stage?",
          options: [
            "After AI returns code",
            "After local checks pass for current stage",
            "After adding documentation only",
            "After opening a PR"
          ],
          answer: 1,
          explanation: "Stage-gate validation prevents hidden issues from accumulating."
        }
      ]
    },
    {
      id: "module-3",
      title: "Module 3: Frontend Confidence",
      questions: [
        {
          prompt: "What is a good debugging evidence source for frontend/backend sync issues?",
          options: [
            "Visual guesswork",
            "Status codes and response payloads",
            "Renaming components",
            "Changing CSS first"
          ],
          answer: 1,
          explanation: "Inspecting API status/payloads narrows root causes quickly."
        },
        {
          prompt: "Which testing strategy is strongest for UI changes?",
          options: [
            "Manual click-through only",
            "Client + server validation with edge cases",
            "Snapshot updates only",
            "Skipping tests to move faster"
          ],
          answer: 1,
          explanation: "UI reliability needs both client behavior checks and backend contract checks."
        },
        {
          prompt: "What helps keep refactors safe?",
          options: [
            "Silent broad rewrites",
            "Small changes plus explicit verification checklist",
            "Removing old tests",
            "Merging without review"
          ],
          answer: 1,
          explanation: "Small, validated refactors reduce regression risk."
        }
      ]
    },
    {
      id: "module-4",
      title: "Module 4: Workflow and CI/CD",
      questions: [
        {
          prompt: "How should AI-generated pipeline files be treated?",
          options: [
            "Trusted defaults",
            "Drafts requiring intentional review",
            "Optional extras",
            "Immediate merge artifacts"
          ],
          answer: 1,
          explanation: "Workflow files affect delivery safety and must be reviewed carefully."
        },
        {
          prompt: "What is the best use of tool scope?",
          options: [
            "Use the same tool for every change",
            "Pick line/file/repo tools based on task size",
            "Avoid tools and edit blindly",
            "Only use AI chat without code context"
          ],
          answer: 1,
          explanation: "Right-sized tooling improves speed and quality."
        },
        {
          prompt: "Why maintain ADR-style decisions?",
          options: [
            "To increase file count",
            "To preserve rationale for team handoff",
            "To avoid writing tests",
            "To bypass code review"
          ],
          answer: 1,
          explanation: "Decision records improve explainability and onboarding."
        }
      ]
    },
    {
      id: "module-5",
      title: "Module 5: Governance and Ownership",
      questions: [
        {
          prompt: "What is the core mindset in Module 5?",
          options: [
            "AI owns architecture choices",
            "Developer grades and owns every accepted change",
            "Speed over quality",
            "Documentation over execution"
          ],
          answer: 1,
          explanation: "Ownership remains with the engineer, not the model."
        },
        {
          prompt: "What makes a strong review prompt?",
          options: [
            "Open-ended text only",
            "Guardrails, bounded scope, and evidence requests",
            "No constraints for creativity",
            "Single-sentence requirements"
          ],
          answer: 1,
          explanation: "Explicit review criteria produce more actionable AI output."
        },
        {
          prompt: "Which outcome shows mature AI usage?",
          options: [
            "Accepting all suggestions",
            "Rejecting weak output with clear reasoning",
            "Skipping tests",
            "Ignoring edge cases"
          ],
          answer: 1,
          explanation: "Mature use includes rejecting poor suggestions and documenting why."
        }
      ]
    }
  ];

  const initialState = () => ({
    xp: 0,
    badges: [],
    completedModules: {},
    bestScores: {},
    currentStreak: 0,
    lastActiveDate: null
  });

  const loadState = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && typeof parsed === "object" ? { ...initialState(), ...parsed } : initialState();
    } catch {
      return initialState();
    }
  };

  const saveState = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage write errors in private mode or blocked storage contexts.
    }
  };

  const awardBadge = (name) => {
    if (!state.badges.includes(name)) {
      state.badges.push(name);
    }
  };

  const updateStreak = () => {
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

    if (diffDays === 1) {
      state.currentStreak += 1;
    } else {
      state.currentStreak = 1;
    }
    state.lastActiveDate = today;
  };

  const progressPercent = () => {
    const done = Object.keys(state.completedModules).length;
    return Math.round((done / modules.length) * 100);
  };

  const getModuleById = (id) => modules.find((item) => item.id === id);

  const state = loadState();
  let activeModule = null;
  let activeIndex = 0;
  let activeCorrect = 0;

  const render = () => {
    const progress = progressPercent();
    const completedCount = Object.keys(state.completedModules).length;

    root.innerHTML = `
      <div class="game-shell">
        <div class="game-header">
          <h2>Interactive Challenge Hub</h2>
          <p>Earn points, unlock badges, and track your learning progress in this browser.</p>
        </div>

        <div class="game-stats">
          <div class="stat-card"><span>XP</span><strong>${state.xp}</strong></div>
          <div class="stat-card"><span>Completed</span><strong>${completedCount}/${modules.length}</strong></div>
          <div class="stat-card"><span>Streak</span><strong>${state.currentStreak} day(s)</strong></div>
          <div class="stat-card"><span>Badges</span><strong>${state.badges.length}</strong></div>
        </div>

        <div class="progress-wrap">
          <div class="progress-label">Progress: ${progress}%</div>
          <div class="progress-bar"><span style="width:${progress}%"></span></div>
        </div>

        <div class="badge-wrap">
          <h3>Badges</h3>
          ${state.badges.length ? `<div class="badge-grid">${state.badges.map((badge) => `<span class="badge-item">${badge}</span>`).join("")}</div>` : "<p>No badges yet. Complete your first module challenge.</p>"}
        </div>

        <div class="module-grid">
          ${modules
            .map((module) => {
              const best = state.bestScores[module.id];
              const done = state.completedModules[module.id];
              return `
                <div class="module-card">
                  <h4>${module.title}</h4>
                  <p>${module.questions.length} challenge questions</p>
                  <p>Best score: ${typeof best === "number" ? `${best}%` : "Not attempted"}</p>
                  <button data-action="start" data-module="${module.id}">${done ? "Replay challenge" : "Start challenge"}</button>
                </div>
              `;
            })
            .join("")}
        </div>

        <div class="actions">
          <button class="reset-btn" data-action="reset">Reset saved progress</button>
        </div>

        <div id="quiz-stage"></div>
      </div>
    `;

    root.querySelectorAll('button[data-action="start"]').forEach((button) => {
      button.addEventListener("click", () => startQuiz(button.dataset.module));
    });

    root.querySelector('button[data-action="reset"]').addEventListener("click", () => {
      if (!window.confirm("Reset all saved progress for this browser?")) return;
      Object.assign(state, initialState());
      activeModule = null;
      saveState();
      render();
    });
  };

  const renderQuestion = () => {
    const stage = document.getElementById("quiz-stage");
    const question = activeModule.questions[activeIndex];

    stage.innerHTML = `
      <div class="quiz-card">
        <h3>${activeModule.title}</h3>
        <p class="quiz-meta">Question ${activeIndex + 1} of ${activeModule.questions.length}</p>
        <p class="quiz-prompt">${question.prompt}</p>
        <div class="option-list">
          ${question.options
            .map(
              (option, index) =>
                `<button class="option-btn" data-index="${index}">${String.fromCharCode(65 + index)}. ${option}</button>`
            )
            .join("")}
        </div>
        <div id="quiz-feedback"></div>
      </div>
    `;

    stage.querySelectorAll(".option-btn").forEach((button) => {
      button.addEventListener("click", () => checkAnswer(Number(button.dataset.index)));
    });
    stage.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const checkAnswer = (selectedIndex) => {
    const question = activeModule.questions[activeIndex];
    const correct = selectedIndex === question.answer;
    if (correct) activeCorrect += 1;

    const stage = document.getElementById("quiz-stage");
    stage.querySelectorAll(".option-btn").forEach((button) => {
      button.disabled = true;
      const value = Number(button.dataset.index);
      if (value === question.answer) button.classList.add("correct");
      if (value === selectedIndex && value !== question.answer) button.classList.add("wrong");
    });

    const feedback = stage.querySelector("#quiz-feedback");
    feedback.innerHTML = `
      <p class="${correct ? "ok" : "bad"}"><strong>${correct ? "Correct." : "Not quite."}</strong></p>
      <p>${question.explanation}</p>
      <button id="next-question-btn">${activeIndex + 1 === activeModule.questions.length ? "Finish challenge" : "Next question"}</button>
    `;

    feedback.querySelector("#next-question-btn").addEventListener("click", () => {
      activeIndex += 1;
      if (activeIndex < activeModule.questions.length) {
        renderQuestion();
        return;
      }
      finishQuiz();
    });
  };

  const finishQuiz = () => {
    const total = activeModule.questions.length;
    const percent = Math.round((activeCorrect / total) * 100);
    const moduleId = activeModule.id;

    updateStreak();
    state.completedModules[moduleId] = true;
    state.bestScores[moduleId] = Math.max(percent, state.bestScores[moduleId] || 0);

    let awarded = activeCorrect * 10;
    if (percent >= 80) awarded += 20;
    state.xp += awarded;

    awardBadge("Starter");
    if (percent >= 80) awardBadge(`${activeModule.title} Master`);
    if (Object.keys(state.completedModules).length >= 3) awardBadge("Consistency Builder");
    if (Object.keys(state.completedModules).length === modules.length) awardBadge("AI Training Champion");
    if (state.currentStreak >= 3) awardBadge("3-Day Momentum");

    saveState();

    const stage = document.getElementById("quiz-stage");
    stage.innerHTML = `
      <div class="quiz-card">
        <h3>Challenge complete</h3>
        <p><strong>Score:</strong> ${activeCorrect}/${total} (${percent}%)</p>
        <p><strong>XP earned this run:</strong> ${awarded}</p>
        <button id="back-to-dashboard">Back to dashboard</button>
      </div>
    `;
    stage.querySelector("#back-to-dashboard").addEventListener("click", () => {
      activeModule = null;
      activeIndex = 0;
      activeCorrect = 0;
      render();
    });
  };

  const startQuiz = (moduleId) => {
    activeModule = getModuleById(moduleId);
    activeIndex = 0;
    activeCorrect = 0;
    renderQuestion();
  };

  render();
})();

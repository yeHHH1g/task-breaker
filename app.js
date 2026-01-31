(() => {
  const DEMO_EXAMPLES = [
    {
      key: "clean apartment",
      prompt: "Clean the apartment for guests this weekend",
      title: "Clean the apartment for guests",
      steps: [
        { title: "Walk through rooms and list priorities", time: "10 min", difficulty: "easy", quickWin: true },
        { title: "Gather supplies and start laundry", time: "20 min", difficulty: "easy" },
        { title: "Declutter visible surfaces", time: "25 min", difficulty: "medium" },
        { title: "Vacuum and sweep all floors", time: "25 min", difficulty: "medium" },
        { title: "Wipe kitchen counters and appliances", time: "20 min", difficulty: "medium" },
        { title: "Clean bathroom surfaces", time: "25 min", difficulty: "hard" },
        { title: "Set out fresh towels and final touch-ups", time: "10 min", difficulty: "easy" },
      ],
    },
    {
      key: "write essay",
      prompt: "Write a persuasive essay for class",
      title: "Write a persuasive essay",
      steps: [
        { title: "Clarify the prompt and pick a stance", time: "15 min", difficulty: "easy", quickWin: true },
        { title: "List 3 supporting arguments", time: "20 min", difficulty: "easy" },
        { title: "Gather 2 sources per argument", time: "35 min", difficulty: "medium" },
        { title: "Outline intro, body, and conclusion", time: "25 min", difficulty: "medium" },
        { title: "Draft the introduction", time: "20 min", difficulty: "medium" },
        { title: "Draft body paragraph 1", time: "25 min", difficulty: "medium" },
        { title: "Draft body paragraph 2", time: "25 min", difficulty: "medium" },
        { title: "Draft body paragraph 3", time: "25 min", difficulty: "medium" },
        { title: "Draft conclusion", time: "15 min", difficulty: "easy" },
        { title: "Edit for clarity and flow", time: "30 min", difficulty: "hard" },
        { title: "Proofread and format", time: "15 min", difficulty: "easy" },
      ],
    },
    {
      key: "start project",
      prompt: "Start a new side project",
      title: "Start a new project",
      steps: [
        { title: "Define the project outcome", time: "20 min", difficulty: "easy", quickWin: true },
        { title: "List must-have features", time: "25 min", difficulty: "medium" },
        { title: "Sketch a quick plan", time: "30 min", difficulty: "medium" },
        { title: "Set up the workspace", time: "20 min", difficulty: "easy" },
        { title: "Build a tiny prototype", time: "45 min", difficulty: "hard" },
        { title: "Review what works", time: "20 min", difficulty: "medium" },
        { title: "Plan the next milestone", time: "20 min", difficulty: "easy" },
        { title: "Schedule the first work session", time: "10 min", difficulty: "easy" },
      ],
    },
    {
      key: "default",
      prompt: "Plan a big task",
      title: "Plan a big task",
      steps: [
        { title: "Define the desired outcome", time: "15 min", difficulty: "easy", quickWin: true },
        { title: "List the major phases", time: "20 min", difficulty: "easy" },
        { title: "Break the first phase into tasks", time: "25 min", difficulty: "medium" },
        { title: "Estimate time for each task", time: "20 min", difficulty: "medium" },
        { title: "Identify blockers", time: "15 min", difficulty: "easy" },
        { title: "Gather needed resources", time: "30 min", difficulty: "medium" },
        { title: "Schedule focused work blocks", time: "20 min", difficulty: "medium" },
        { title: "Start the first quick win", time: "15 min", difficulty: "easy" },
        { title: "Review progress and adjust", time: "20 min", difficulty: "hard" },
      ],
    },
  ];

  const ENCOURAGEMENT_MESSAGES = [
    { threshold: 25, message: "Nice start! You just cleared the first hurdle." },
    { threshold: 50, message: "Halfway there. Momentum looks good!" },
    { threshold: 75, message: "So close! Keep the pace and finish strong." },
    { threshold: 90, message: "Final stretch. You are almost done." },
  ];

  const state = {
    currentTask: null,
    settings: {
      mode: "demo",
      apiKey: "",
    },
  };

  const storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
      } catch (err) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (err) {
        return false;
      }
    },
  };

  const elements = {
    taskInput: document.getElementById("taskInput"),
    breakButton: document.getElementById("breakButton"),
    exampleButton: document.getElementById("exampleButton"),
    stepsList: document.getElementById("stepsList"),
    taskTitle: document.getElementById("taskTitle"),
    taskMeta: document.getElementById("taskMeta"),
    progressBar: document.getElementById("progressBar"),
    progressText: document.getElementById("progressText"),
    encouragementMessage: document.getElementById("encouragementMessage"),
    celebrationMessage: document.getElementById("celebrationMessage"),
    openSettings: document.getElementById("openSettings"),
    closeSettings: document.getElementById("closeSettings"),
    settingsModal: document.getElementById("settingsModal"),
    demoToggle: document.getElementById("demoToggle"),
    apiKeyInput: document.getElementById("apiKeyInput"),
    newTaskButton: document.getElementById("newTaskButton"),
  };

  let lastFocusedElement = null;

  function saveState() {
    storage.set("task-breaker-state", state);
  }

  function loadState() {
    const saved = storage.get("task-breaker-state", null);
    if (!saved) return;
    if (saved.settings) {
      state.settings = {
        ...state.settings,
        ...saved.settings,
      };
    }
    if (saved.currentTask) {
      state.currentTask = saved.currentTask;
    }
  }

  function normalizeDifficulty(value) {
    const lower = String(value || "").toLowerCase();
    if (lower === "easy" || lower === "medium" || lower === "hard") return lower;
    return "medium";
  }

  function buildTaskFromSteps(title, steps) {
    const safeTitle = title && String(title).trim() ? String(title).trim() : "Your task";
    const normalized = steps.map((step, index) => ({
      id: `step-${Date.now()}-${index}`,
      title: String(step.title || `Step ${index + 1}`),
      time: String(step.time || "15 min"),
      difficulty: normalizeDifficulty(step.difficulty),
      quickWin: Boolean(step.quickWin),
      completed: Boolean(step.completed),
    }));

    if (!normalized.some((step) => step.quickWin)) {
      normalized[0].quickWin = true;
    }

    return {
      title: safeTitle,
      steps: normalized,
    };
  }

  function getDemoTask(input) {
    const text = String(input || "").toLowerCase();
    const match = DEMO_EXAMPLES.find((example) => example.key !== "default" && text.includes(example.key));
    const chosen = match || DEMO_EXAMPLES.find((example) => example.key === "default");
    return buildTaskFromSteps(chosen.title, chosen.steps);
  }

  function randomDemoExample() {
    const pool = DEMO_EXAMPLES.filter((example) => example.key !== "default");
    return pool[Math.floor(Math.random() * pool.length)];
  }

  async function fetchAiBreakdown(taskText) {
    const apiKey = state.settings.apiKey.trim();
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content:
              "You are Task Breaker. Respond only with JSON: {title: string, steps: [{title, time, difficulty, quickWin}]}. Use 6-12 steps.",
          },
          { role: "user", content: taskText },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || "";
    const jsonText = extractJson(content);
    const parsed = JSON.parse(jsonText);
    if (!parsed || !Array.isArray(parsed.steps)) {
      throw new Error("Invalid AI response");
    }
    return buildTaskFromSteps(parsed.title || taskText, parsed.steps);
  }

  function extractJson(content) {
    const trimmed = content.trim();
    if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (match) return match[0];
    throw new Error("No JSON found");
  }

  function setLoading(isLoading) {
    elements.breakButton.disabled = isLoading;
    elements.breakButton.textContent = isLoading ? "Breaking..." : "Break It Down";
  }

  function updateProgress() {
    if (!state.currentTask) {
      elements.progressBar.style.width = "0%";
      elements.progressText.textContent = "0% complete";
      elements.encouragementMessage.textContent =
        "Start a task to unlock encouragement milestones.";
      elements.celebrationMessage.textContent = "Finish every step to celebrate your win.";
      return;
    }

    const total = state.currentTask.steps.length;
    const completed = state.currentTask.steps.filter((step) => step.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    elements.progressBar.style.width = `${percent}%`;
    elements.progressText.textContent = `${percent}% complete`;

    const encouragement = ENCOURAGEMENT_MESSAGES.filter((item) => percent >= item.threshold).pop();
    if (encouragement) {
      elements.encouragementMessage.textContent = encouragement.message;
    } else {
      elements.encouragementMessage.textContent = "Start with a quick win to build momentum.";
    }

    if (percent === 100) {
      elements.celebrationMessage.textContent = "You did it! Every step is complete.";
      launchConfetti();
    } else {
      elements.celebrationMessage.textContent = "Finish every step to celebrate your win.";
    }
  }

  function difficultyClass(difficulty) {
    if (difficulty === "easy") return "bg-emerald-500/20 text-emerald-300";
    if (difficulty === "hard") return "bg-rose-500/20 text-rose-300";
    return "bg-amber-500/20 text-amber-300";
  }

  function renderSteps() {
    while (elements.stepsList.firstChild) {
      elements.stepsList.removeChild(elements.stepsList.firstChild);
    }

    if (!state.currentTask) return;

    const total = state.currentTask.steps.length;
    const nextIndex = state.currentTask.steps.findIndex((step) => !step.completed);

    state.currentTask.steps.forEach((step, index) => {
      const card = document.createElement("div");
      card.className =
        "bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col gap-3 animate-slideIn";
      if (index === nextIndex) {
        card.classList.add("animate-pulseBorder");
      }

      const header = document.createElement("div");
      header.className = "flex items-start justify-between gap-4";

      const left = document.createElement("div");
      left.className = "flex items-start gap-3";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = step.completed;
      checkbox.className = "mt-1 h-5 w-5 rounded border-gray-600 text-primary focus:ring-primary";
      checkbox.setAttribute("aria-label", `Mark step ${index + 1} complete: ${step.title}`);
      checkbox.addEventListener("change", () => toggleStep(index));

      const textWrap = document.createElement("div");

      const stepTitle = document.createElement("p");
      stepTitle.className = "font-semibold";
      stepTitle.textContent = step.title;

      const stepMeta = document.createElement("p");
      stepMeta.className = "text-sm text-gray-400";
      stepMeta.textContent = `Step ${index + 1} of ${total} · ${step.time}`;

      textWrap.append(stepTitle, stepMeta);
      left.append(checkbox, textWrap);

      const status = document.createElement("span");
      status.className =
        "inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-gray-800";
      status.textContent = step.completed ? "Done" : "Pending";

      header.append(left, status);

      const badges = document.createElement("div");
      badges.className = "flex flex-wrap gap-2 text-xs";

      const difficulty = document.createElement("span");
      difficulty.className = `px-2 py-1 rounded-full ${difficultyClass(step.difficulty)}`;
      difficulty.textContent = step.difficulty.toUpperCase();

      badges.appendChild(difficulty);

      if (step.quickWin) {
        const quickWin = document.createElement("span");
        quickWin.className = "px-2 py-1 rounded-full bg-primary/20 text-primary";
        quickWin.textContent = "⚡ Quick Win";
        badges.appendChild(quickWin);
      }

      const checkmark = document.createElement("span");
      checkmark.className = "text-primary text-lg";
      checkmark.textContent = "✓";
      if (step.completed) {
        checkmark.classList.add("animate-checkmark");
      } else {
        checkmark.classList.add("opacity-20");
      }

      const footer = document.createElement("div");
      footer.className = "flex items-center justify-between";
      footer.append(badges, checkmark);

      card.append(header, footer);
      elements.stepsList.appendChild(card);
    });
  }

  function renderTask() {
    if (!state.currentTask) {
      elements.taskTitle.textContent = "Your plan will appear here";
      elements.taskMeta.textContent = "";
      renderSteps();
      updateProgress();
      return;
    }

    const total = state.currentTask.steps.length;
    elements.taskTitle.textContent = state.currentTask.title;
    elements.taskMeta.textContent = `${total} steps ready`;
    renderSteps();
    updateProgress();
  }

  function toggleStep(index) {
    if (!state.currentTask) return;
    const step = state.currentTask.steps[index];
    step.completed = !step.completed;
    saveState();
    renderTask();
  }

  function setTask(task) {
    state.currentTask = task;
    saveState();
    renderTask();
  }

  function resetTask() {
    state.currentTask = null;
    elements.taskInput.value = "";
    saveState();
    renderTask();
  }

  function updateSettingsUi() {
    elements.demoToggle.textContent = state.settings.mode === "demo" ? "On" : "Off";
    elements.demoToggle.setAttribute("aria-checked", state.settings.mode === "demo" ? "true" : "false");
    elements.apiKeyInput.value = state.settings.apiKey;
  }

  function openModal() {
    lastFocusedElement = document.activeElement;
    elements.settingsModal.classList.remove("hidden");
    elements.settingsModal.classList.add("flex");
    updateSettingsUi();
    setTimeout(() => {
      elements.demoToggle.focus();
    }, 0);
  }

  function closeModal() {
    elements.settingsModal.classList.add("hidden");
    elements.settingsModal.classList.remove("flex");
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function toggleDemo() {
    state.settings.mode = state.settings.mode === "demo" ? "ai" : "demo";
    saveState();
    updateSettingsUi();
  }

  function launchConfetti() {
    if (typeof window.confetti !== "function") return;
    window.confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }

  async function breakdownTask(inputText) {
    const text = String(inputText || "").trim();
    if (!text) {
      elements.encouragementMessage.textContent = "Add a task description to get started.";
      return;
    }

    setLoading(true);
    try {
      let task;
      if (state.settings.mode === "demo" || !state.settings.apiKey.trim()) {
        task = getDemoTask(text);
      } else {
        task = await fetchAiBreakdown(text);
      }
      setTask(task);
    } catch (err) {
      elements.encouragementMessage.textContent =
        "We had trouble generating the plan. Try demo mode or check your API key.";
    } finally {
      setLoading(false);
    }
  }

  function handleExample() {
    const example = randomDemoExample();
    elements.taskInput.value = example.prompt;
    breakdownTask(example.prompt);
  }

  function handleSettingsKeydown(event) {
    if (event.key === "Escape") {
      closeModal();
    }
  }

  function bindEvents() {
    elements.openSettings.addEventListener("click", openModal);
    elements.closeSettings.addEventListener("click", closeModal);
    elements.settingsModal.addEventListener("click", (event) => {
      if (event.target === elements.settingsModal) {
        closeModal();
      }
    });
    document.addEventListener("keydown", (event) => {
      if (!elements.settingsModal.classList.contains("hidden")) {
        handleSettingsKeydown(event);
      }
    });
    elements.demoToggle.addEventListener("click", toggleDemo);
    elements.apiKeyInput.addEventListener("input", (event) => {
      state.settings.apiKey = event.target.value;
      saveState();
    });
    elements.breakButton.addEventListener("click", () => breakdownTask(elements.taskInput.value));
    elements.exampleButton.addEventListener("click", handleExample);
    elements.newTaskButton.addEventListener("click", resetTask);
  }

  function init() {
    loadState();
    updateSettingsUi();
    renderTask();
    bindEvents();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

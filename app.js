const LEARNING_STORAGE_KEY = "studyApp.learning.v1";
const GRADES = ["again", "hard", "good", "easy"];
const GRADE_LABELS = {
  again: "Again",
  hard: "Hard",
  good: "Good",
  easy: "Easy",
};
const GRADE_WEIGHT = {
  again: 8,
  hard: 5,
  good: 2,
  easy: 1,
};
const DEFAULT_CATEGORIES = [
  { id: "math", label: "算数" },
  { id: "math-division", label: "算数（割り算）" },
  { id: "math-angles", label: "算数（角度）" },
  { id: "math-fractions", label: "算数（分数）" },
  { id: "math-decimals", label: "算数（小数）" },
  { id: "japanese", label: "国語" },
  { id: "science", label: "理科" },
  { id: "social-studies", label: "社会" },
  { id: "english", label: "英語" },
  { id: "review", label: "復習" },
];

const state = {
  deck: null,
  index: 0,
  mode: "sequential",
  selectedCategoryId: "",
  showingAnswer: false,
  hintOpen: false,
  hintViewed: false,
  explanationOpen: false,
  gradeRecorded: false,
  savedMessage: "",
  lastQuestionId: null,
  learning: createEmptyLearningData(),
};

const elements = {
  deckTitle: document.querySelector("#deckTitle"),
  questionTitle: document.querySelector("#questionTitle"),
  currentNumber: document.querySelector("#currentNumber"),
  totalNumber: document.querySelector("#totalNumber"),
  subjectBadge: document.querySelector("#subjectBadge"),
  pageMode: document.querySelector("#pageMode"),
  contentArea: document.querySelector("#contentArea"),
  hintPanel: document.querySelector("#hintPanel"),
  hintArea: document.querySelector("#hintArea"),
  explanationPanel: document.querySelector("#explanationPanel"),
  explanationArea: document.querySelector("#explanationArea"),
  gradingPanel: document.querySelector("#gradingPanel"),
  gradingNote: document.querySelector("#gradingNote"),
  gradeButtons: document.querySelector("#gradeButtons"),
  savedNote: document.querySelector("#savedNote"),
  prevButton: document.querySelector("#prevButton"),
  nextButton: document.querySelector("#nextButton"),
  hintButton: document.querySelector("#hintButton"),
  toggleAnswerButton: document.querySelector("#toggleAnswerButton"),
  explanationButton: document.querySelector("#explanationButton"),
  deckFileInput: document.querySelector("#deckFileInput"),
  questionSelect: document.querySelector("#questionSelect"),
  categoryList: document.querySelector("#categoryList"),
  currentCategoryLabel: document.querySelector("#currentCategoryLabel"),
  sequentialModeButton: document.querySelector("#sequentialModeButton"),
  adaptiveModeButton: document.querySelector("#adaptiveModeButton"),
  todayCount: document.querySelector("#todayCount"),
  historySummary: document.querySelector("#historySummary"),
  historyLog: document.querySelector("#historyLog"),
  exportLearningButton: document.querySelector("#exportLearningButton"),
  importLearningInput: document.querySelector("#importLearningInput"),
};

const fallbackDeck = window.DEFAULT_DECK || {
  title: "サンプル問題集",
  categories: DEFAULT_CATEGORIES,
  questions: [
    {
      id: "sample-1",
      title: "サンプル問題",
      subject: "使い方",
      category: "review",
      prompt: [
        { type: "text", value: "右上の「読み込み」から questions.json を選ぶと、問題集を差し替えられます。" },
        { type: "math", value: "例：864 ÷ 6 = ?" },
      ],
      hints: [{ type: "text", value: "GitHub Pagesでは、同じフォルダの questions.json が自動で読み込まれます。" }],
      answer: [{ type: "text", value: "この画面は予備表示です。" }],
      explanation: [{ type: "text", value: "DATA_FORMAT.md の形式でAIにJSONを作らせてください。" }],
    },
  ],
};

async function loadDeck() {
  state.learning = loadLearningData();

  try {
    const response = await fetch("questions.json");
    if (!response.ok) throw new Error("questions.jsonを読み込めませんでした");
    state.deck = await response.json();
  } catch (error) {
    state.deck = fallbackDeck;
  }

  prepareDeck(state.deck);
  selectInitialCategory();
  render();
}

function createEmptyLearningData() {
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    questions: {},
    attempts: [],
  };
}

function loadLearningData() {
  try {
    const raw = localStorage.getItem(LEARNING_STORAGE_KEY);
    if (!raw) return createEmptyLearningData();
    return normalizeLearningData(JSON.parse(raw));
  } catch (error) {
    return createEmptyLearningData();
  }
}

function normalizeLearningData(data) {
  if (!data || typeof data !== "object" || !Array.isArray(data.attempts)) {
    return createEmptyLearningData();
  }

  return {
    version: 1,
    updatedAt: data.updatedAt || new Date().toISOString(),
    questions: data.questions && typeof data.questions === "object" ? data.questions : {},
    attempts: data.attempts,
  };
}

function saveLearningData() {
  state.learning.updatedAt = new Date().toISOString();
  localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(state.learning));
}

function prepareDeck(deck) {
  deck.categories = normalizeCategories(deck.categories);
  deck.questions = deck.questions.map((question, index) => normalizeQuestion(question, index, deck.categories));
}

function normalizeCategories(categories) {
  const merged = new Map(DEFAULT_CATEGORIES.map((category) => [category.id, category]));

  if (Array.isArray(categories)) {
    for (const category of categories) {
      if (category && category.id && category.label) {
        merged.set(category.id, { id: String(category.id), label: String(category.label) });
      }
    }
  }

  return Array.from(merged.values());
}

function normalizeQuestion(question, index, categories) {
  const normalized = { ...question };
  normalized.id = normalized.id || `question-${index + 1}`;

  if (!Array.isArray(normalized.categories) || normalized.categories.length === 0) {
    normalized.categories = [inferCategory(normalized.subject, categories)];
  }

  if (!normalized.category) {
    normalized.category = normalized.categories[0];
  }

  if (!categories.some((category) => category.id === normalized.category)) {
    normalized.category = inferCategory(normalized.subject, categories);
  }

  normalized.categories = [normalized.category];
  return normalized;
}

function inferCategory(subject = "", categories) {
  const text = String(subject);
  if (text.includes("割り算") || text.includes("わり算") || text.includes("あまり") || text.includes("筆算")) return "math-division";
  if (text.includes("角")) return "math-angles";
  if (text.includes("分数")) return "math-fractions";
  if (text.includes("小数")) return "math-decimals";
  if (text.includes("算数")) return "math";
  if (text.includes("理科")) return "science";
  if (text.includes("社会")) return "social-studies";
  if (text.includes("国語")) return "japanese";
  if (text.includes("英語")) return "english";
  return categories.some((category) => category.id === "review") ? "review" : categories[0].id;
}

function selectInitialCategory() {
  const firstWithQuestions = state.deck.categories.find((category) => {
    return state.deck.questions.some((question) => question.category === category.id);
  });
  state.selectedCategoryId = firstWithQuestions ? firstWithQuestions.id : state.deck.categories[0].id;
}

function currentQuestion() {
  const questions = filteredQuestions();
  return questions[state.index] || questions[0] || null;
}

function filteredQuestions() {
  if (!state.deck) return [];
  return state.deck.questions.filter((question) => question.category === state.selectedCategoryId);
}

function resetReveals() {
  state.showingAnswer = false;
  state.hintOpen = false;
  state.hintViewed = false;
  state.explanationOpen = false;
  state.gradeRecorded = false;
  state.savedMessage = "";
}

function render() {
  if (!state.deck) return;

  const questions = filteredQuestions();
  if (state.index >= questions.length) state.index = Math.max(0, questions.length - 1);
  const question = currentQuestion();

  const category = currentCategory();
  elements.deckTitle.textContent = category ? `${category.label} / ${state.deck.title || "問題集"}` : state.deck.title || "問題集";
  elements.totalNumber.textContent = String(questions.length);
  elements.currentNumber.textContent = question ? String(state.index + 1) : "0";
  elements.questionTitle.textContent = question ? question.title || `問題 ${state.index + 1}` : "問題がありません";
  elements.subjectBadge.textContent = question ? category.label : "未分類";
  elements.pageMode.textContent = state.showingAnswer ? "解答" : "問題";

  renderModeButtons();
  renderCategoryList();
  renderQuestionOptions(questions);
  renderHistory();

  if (!question) {
    renderEmptyQuestion();
    return;
  }

  renderBlocks(elements.contentArea, state.showingAnswer ? question.answer : question.prompt);
  renderBlocks(elements.hintArea, question.hints);
  renderBlocks(elements.explanationArea, question.explanation);

  elements.hintPanel.hidden = !state.hintOpen;
  elements.explanationPanel.hidden = !state.explanationOpen;
  elements.gradingPanel.hidden = !state.showingAnswer;
  elements.savedNote.hidden = !state.savedMessage;
  elements.savedNote.textContent = state.savedMessage;

  const isAdaptive = state.mode === "adaptive";
  elements.prevButton.disabled = isAdaptive || state.index === 0;
  elements.nextButton.disabled = !isAdaptive && state.index === questions.length - 1;
  elements.nextButton.title = isAdaptive ? "次の復習問題" : "次の問題";
  elements.hintButton.disabled = !hasContent(question.hints) || state.showingAnswer;
  elements.explanationButton.disabled = !hasContent(question.explanation);
  elements.toggleAnswerButton.disabled = false;
  elements.toggleAnswerButton.textContent = state.showingAnswer ? "問題へ" : "解答へ";
  elements.hintButton.textContent = state.hintOpen ? "ヒントを隠す" : "ヒント";
  elements.explanationButton.textContent = state.explanationOpen ? "解説を隠す" : "解説";
  elements.gradingNote.textContent = state.hintViewed
    ? "ヒントを見たので、Good/Easyを選んでも習熟度はHardとして記録します。"
    : "紙に書いた答えを見直して、でき具合を選んでください。";
  for (const button of elements.gradeButtons.querySelectorAll ? elements.gradeButtons.querySelectorAll("[data-grade]") : []) {
    button.disabled = state.gradeRecorded;
  }
}

function renderEmptyQuestion() {
  elements.contentArea.replaceChildren();
  const empty = document.createElement("div");
  empty.className = "empty-state";
  empty.textContent = "選択中のカテゴリに問題がありません。";
  elements.contentArea.append(empty);

  elements.hintPanel.hidden = true;
  elements.explanationPanel.hidden = true;
  elements.gradingPanel.hidden = true;
  elements.prevButton.disabled = true;
  elements.nextButton.disabled = true;
  elements.hintButton.disabled = true;
  elements.toggleAnswerButton.disabled = true;
  elements.explanationButton.disabled = true;
}

function renderModeButtons() {
  for (const button of [elements.sequentialModeButton, elements.adaptiveModeButton]) {
    const active = button.dataset.mode === state.mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  }
}

function renderCategoryList() {
  const current = currentCategory();
  elements.currentCategoryLabel.textContent = current ? current.label : "未選択";

  const buttons = state.deck.categories.map((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-chip";
    button.dataset.categoryId = category.id;
    button.classList.toggle("active", category.id === state.selectedCategoryId);
    button.setAttribute("aria-pressed", String(category.id === state.selectedCategoryId));

    const text = document.createElement("span");
    const count = state.deck.questions.filter((question) => question.category === category.id).length;
    text.textContent = `${category.label} (${count})`;

    button.append(text);
    return button;
  });

  elements.categoryList.replaceChildren(...buttons);
}

function currentCategory() {
  if (!state.deck) return null;
  return state.deck.categories.find((category) => category.id === state.selectedCategoryId) || null;
}

function renderQuestionOptions(questions) {
  const options = questions.map((question, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${index + 1}. ${question.title || "問題"}`;
    return option;
  });

  elements.questionSelect.replaceChildren(...options);
  elements.questionSelect.value = String(state.index);
  elements.questionSelect.disabled = questions.length === 0;
}

function hasContent(blocks) {
  return Array.isArray(blocks) && blocks.length > 0;
}

function renderBlocks(container, blocks) {
  container.replaceChildren();

  if (!hasContent(blocks)) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "表示する内容がありません";
    container.append(empty);
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "rich-content";

  for (const block of blocks) {
    if (block.type === "image") {
      const image = document.createElement("img");
      image.className = "study-image";
      image.src = block.src;
      image.alt = block.alt || "問題画像";
      wrapper.append(image);

      if (block.caption) {
        const caption = document.createElement("p");
        caption.className = "image-caption";
        caption.textContent = block.caption;
        wrapper.append(caption);
      }
      continue;
    }

    if (block.type === "math") {
      const math = document.createElement("div");
      math.className = "math-block";
      math.textContent = block.value || "";
      wrapper.append(math);
      continue;
    }

    if (block.type === "division") {
      wrapper.append(renderDivision(block));
      continue;
    }

    const paragraph = document.createElement("p");
    paragraph.className = "text-block";
    paragraph.textContent = block.value || "";
    wrapper.append(paragraph);
  }

  container.append(wrapper);
}

function renderDivision(block) {
  const card = document.createElement("div");
  card.className = "division-block";

  if (block.expression) {
    const expression = document.createElement("div");
    expression.className = "division-expression";
    expression.textContent = block.expression;
    card.append(expression);
  }

  const layout = document.createElement("div");
  layout.className = "division-layout";

  const work = document.createElement("div");
  work.className = "long-division";

  const quotient = document.createElement("div");
  quotient.className = "division-quotient";
  quotient.textContent = block.quotient || "";

  const divisor = document.createElement("div");
  divisor.className = "division-divisor";
  divisor.textContent = block.divisor || "";

  const dividend = document.createElement("div");
  dividend.className = "division-dividend";
  dividend.textContent = block.dividend || "";

  const product = document.createElement("div");
  product.className = "division-product";
  product.textContent = block.product || "";

  const remainder = document.createElement("div");
  remainder.className = "division-remainder";
  remainder.textContent = block.remainder || "";

  work.append(quotient, divisor, dividend, product, remainder);
  layout.append(work);

  if (Array.isArray(block.notes) && block.notes.length > 0) {
    const notes = document.createElement("div");
    notes.className = "division-notes";
    for (const noteText of block.notes) {
      const note = document.createElement("div");
      note.textContent = noteText;
      notes.append(note);
    }
    layout.append(notes);
  }

  card.append(layout);
  return card;
}

function recordGrade(grade) {
  const question = currentQuestion();
  if (!question || !GRADES.includes(grade)) return;
  if (state.gradeRecorded) {
    state.savedMessage = "この問題はすでに記録しました。次の問題へ進んでください。";
    render();
    return;
  }

  const effectiveGrade = downgradeGradeIfHintUsed(grade);
  const now = new Date();
  const attempt = {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    questionId: question.id,
    questionTitle: question.title || "問題",
    category: question.category,
    categoryLabel: categoryLabel(question.category),
    mode: state.mode,
    grade,
    effectiveGrade,
    hintViewed: state.hintViewed,
    answeredAt: now.toISOString(),
    date: localDateString(now),
  };

  state.learning.attempts.push(attempt);
  updateQuestionStats(question.id, attempt);
  saveLearningData();

  state.gradeRecorded = true;
  state.savedMessage = state.hintViewed && grade !== effectiveGrade
    ? `${GRADE_LABELS[grade]} を選びました。ヒント使用のため ${GRADE_LABELS[effectiveGrade]} として記録しました。`
    : `${GRADE_LABELS[grade]} として記録しました。`;

  render();
  renderHistory();
}

function downgradeGradeIfHintUsed(grade) {
  if (!state.hintViewed) return grade;
  if (grade === "good" || grade === "easy") return "hard";
  return grade;
}

function updateQuestionStats(questionId, attempt) {
  const stats = state.learning.questions[questionId] || {
    category: attempt.category,
    attempts: 0,
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
    hintCount: 0,
    lastGrade: null,
    lastEffectiveGrade: null,
    lastSeenAt: null,
    lastHintUsed: false,
  };

  stats.attempts += 1;
  stats.category = attempt.category;
  stats[attempt.effectiveGrade] += 1;
  if (attempt.hintViewed) stats.hintCount += 1;
  stats.lastGrade = attempt.grade;
  stats.lastEffectiveGrade = attempt.effectiveGrade;
  stats.lastSeenAt = attempt.answeredAt;
  stats.lastHintUsed = attempt.hintViewed;
  state.learning.questions[questionId] = stats;
}

function localDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderHistory() {
  const today = localDateString(new Date());
  const attempts = state.learning.attempts.filter((attempt) => attempt.date === today);
  elements.todayCount.textContent = `${attempts.length}回`;

  renderHistorySummary(attempts);
  renderHistoryLog(attempts);
}

function renderHistorySummary(attempts) {
  const byCategory = new Map();

  for (const attempt of attempts) {
    const key = attempt.category || "review";
    const item = byCategory.get(key) || {
      title: attempt.categoryLabel || categoryLabel(key),
      count: 0,
      hints: 0,
      grades: { again: 0, hard: 0, good: 0, easy: 0 },
    };
    item.count += 1;
    item.grades[attempt.effectiveGrade] += 1;
    if (attempt.hintViewed) item.hints += 1;
    byCategory.set(key, item);
  }

  if (byCategory.size === 0) {
    elements.historySummary.innerHTML = '<p class="empty-history">今日の記録はまだありません。</p>';
    return;
  }

  const rows = Array.from(byCategory.values()).map((item) => {
    const row = document.createElement("div");
    row.className = "summary-row";
    row.innerHTML = `
      <strong>${escapeHtml(item.title)}</strong>
      <span>${item.count}回</span>
      <span>Again ${item.grades.again} / Hard ${item.grades.hard} / Good ${item.grades.good} / Easy ${item.grades.easy}</span>
      <span>ヒント ${item.hints}回</span>
    `;
    return row;
  });

  elements.historySummary.replaceChildren(...rows);
}

function renderHistoryLog(attempts) {
  if (attempts.length === 0) {
    elements.historyLog.replaceChildren();
    return;
  }

  const rows = attempts.slice().reverse().map((attempt) => {
    const time = new Date(attempt.answeredAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
    const row = document.createElement("div");
    row.className = "log-row";
    row.innerHTML = `
      <span>${time}</span>
      <strong>${escapeHtml(attempt.questionTitle)}</strong>
      <span>${escapeHtml(attempt.categoryLabel || categoryLabel(attempt.category))}</span>
      <span>${GRADE_LABELS[attempt.grade]}${attempt.grade !== attempt.effectiveGrade ? ` → ${GRADE_LABELS[attempt.effectiveGrade]}` : ""}</span>
      <span>${attempt.hintViewed ? "ヒントあり" : "ヒントなし"}</span>
    `;
    return row;
  });

  elements.historyLog.replaceChildren(...rows);
}

function categoryLabel(categoryId) {
  const category = state.deck && state.deck.categories.find((item) => item.id === categoryId);
  return category ? category.label : "未分類";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function goToNext() {
  const questions = filteredQuestions();
  if (questions.length === 0) return;

  if (state.mode === "adaptive") {
    const current = currentQuestion();
    if (current) state.lastQuestionId = current.id;
    state.index = pickAdaptiveIndex(questions);
  } else if (state.index < questions.length - 1) {
    state.index += 1;
  }

  resetReveals();
  render();
}

function pickAdaptiveIndex(questions) {
  const weighted = questions.map((question, index) => {
    const stats = state.learning.questions[question.id];
    let weight = 6;
    if (stats && stats.attempts > 0) {
      weight = GRADE_WEIGHT[stats.lastEffectiveGrade] || 3;
      if (stats.attempts <= 1) weight += 2;
    }
    if (questions.length > 1 && question.id === state.lastQuestionId) weight = 0;
    return { index, weight };
  });

  const total = weighted.reduce((sum, item) => sum + item.weight, 0);
  if (total <= 0) return Math.floor(Math.random() * questions.length);

  let cursor = Math.random() * total;
  for (const item of weighted) {
    cursor -= item.weight;
    if (cursor <= 0) return item.index;
  }
  return weighted[weighted.length - 1].index;
}

function exportLearningData() {
  const blob = new Blob([JSON.stringify(state.learning, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `study-app-learning-${localDateString(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function importLearningData(file) {
  try {
    const data = normalizeLearningData(JSON.parse(await file.text()));
    state.learning = data;
    saveLearningData();
    renderHistory();
    alert("学習データをインポートしました。");
  } catch (error) {
    alert("学習データをインポートできませんでした。JSON形式を確認してください。");
  }
}

elements.prevButton.addEventListener("click", () => {
  if (state.index > 0) {
    state.index -= 1;
    resetReveals();
    render();
  }
});

elements.nextButton.addEventListener("click", goToNext);

elements.hintButton.addEventListener("click", () => {
  state.hintOpen = !state.hintOpen;
  if (state.hintOpen) state.hintViewed = true;
  render();
});

elements.toggleAnswerButton.addEventListener("click", () => {
  state.showingAnswer = !state.showingAnswer;
  state.hintOpen = false;
  state.explanationOpen = false;
  render();
});

elements.explanationButton.addEventListener("click", () => {
  if (!state.showingAnswer) {
    state.showingAnswer = true;
    state.hintOpen = false;
  }
  state.explanationOpen = !state.explanationOpen;
  render();
});

elements.questionSelect.addEventListener("change", (event) => {
  state.index = Number(event.target.value);
  resetReveals();
  render();
});

elements.categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category-id]");
  if (!button) return;
  state.selectedCategoryId = button.dataset.categoryId;
  state.index = 0;
  resetReveals();
  render();
});

for (const button of [elements.sequentialModeButton, elements.adaptiveModeButton]) {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    state.index = 0;
    resetReveals();
    render();
  });
}

elements.gradeButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-grade]");
  if (!button) return;
  recordGrade(button.dataset.grade);
});

elements.exportLearningButton.addEventListener("click", exportLearningData);

elements.importLearningInput.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (file) await importLearningData(file);
  event.target.value = "";
});

elements.deckFileInput.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  try {
    const text = await file.text();
    const deck = JSON.parse(text);
    if (!Array.isArray(deck.questions) || deck.questions.length === 0) {
      throw new Error("questionsが空です");
    }
    state.deck = deck;
    prepareDeck(state.deck);
    selectInitialCategory();
    state.index = 0;
    resetReveals();
    render();
  } catch (error) {
    alert("問題データを読み込めませんでした。JSON形式を確認してください。");
  } finally {
    event.target.value = "";
  }
});

loadDeck();

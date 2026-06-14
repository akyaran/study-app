const STORAGE_KEYS = {
  catalog: "manageApp.catalog.v1",
  progress: "manageApp.progress.v1",
  history: "manageApp.history.v1"
};

const state = {
  catalog: [],
  progress: {},
  history: [],
  filters: {
    category: "all",
    source: "all",
    status: "all",
    search: ""
  },
  recommendations: []
};

const elements = {
  totalCount: document.querySelector("#totalCount"),
  wrongCount: document.querySelector("#wrongCount"),
  todayCount: document.querySelector("#todayCount"),
  recommendedCount: document.querySelector("#recommendedCount"),
  categoryFilter: document.querySelector("#categoryFilter"),
  sourceFilter: document.querySelector("#sourceFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  searchInput: document.querySelector("#searchInput"),
  problemGroups: document.querySelector("#problemGroups"),
  emptyState: document.querySelector("#emptyState"),
  recommendationList: document.querySelector("#recommendationList"),
  todayHistory: document.querySelector("#todayHistory"),
  rowTemplate: document.querySelector("#problemRowTemplate"),
  loadParentDeckButton: document.querySelector("#loadParentDeckButton"),
  importCatalogInput: document.querySelector("#importCatalogInput"),
  importBackupInput: document.querySelector("#importBackupInput"),
  exportButton: document.querySelector("#exportButton"),
  refreshRecommendationsButton: document.querySelector("#refreshRecommendationsButton"),
  markVisiblePlannedButton: document.querySelector("#markVisiblePlannedButton"),
  clearFiltersButton: document.querySelector("#clearFiltersButton"),
  clearTodayButton: document.querySelector("#clearTodayButton")
};

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEYS.catalog, JSON.stringify(state.catalog));
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(state.progress));
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
}

function normalizeId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9ぁ-んァ-ヶ一-龠ー]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function categoryLabelMap(deck) {
  return Object.fromEntries((deck.categories || []).map((category) => [category.id, category.label]));
}

function itemNumberFromTitle(title, index) {
  const match = String(title || "").match(/（(.+?)）/);
  if (match) return match[1];
  return `${index + 1}`;
}

function catalogFromDeck(deck) {
  const labels = categoryLabelMap(deck);
  return (deck.questions || []).map((question, index) => {
    const categoryId = question.category || question.subject || "uncategorized";
    const source = question.source || "出典未設定";
    return {
      id: question.id || normalizeId(`${categoryId}-${source}-${index + 1}`),
      categoryId,
      categoryLabel: labels[categoryId] || categoryId,
      source,
      itemNumber: itemNumberFromTitle(question.title, index),
      title: question.title || `問題 ${index + 1}`,
      note: question.subject || "",
      importedAt: new Date().toISOString()
    };
  });
}

function normalizeCatalogData(data) {
  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      id: item.id || normalizeId(`${item.categoryId || item.category || "category"}-${item.source || "source"}-${item.itemNumber || index + 1}`),
      categoryId: item.categoryId || item.category || "uncategorized",
      categoryLabel: item.categoryLabel || item.categoryName || item.category || "未分類",
      source: item.source || item.print || item.worksheet || "出典未設定",
      itemNumber: item.itemNumber || item.number || `${index + 1}`,
      title: item.title || item.question || `問題 ${index + 1}`,
      note: item.note || item.memo || "",
      importedAt: item.importedAt || new Date().toISOString()
    }));
  }

  if (data && Array.isArray(data.problems)) return normalizeCatalogData(data.problems);
  if (data && Array.isArray(data.questions)) return catalogFromDeck(data);
  return [];
}

async function loadParentDeck() {
  const response = await fetch("../questions.json?v=20260614-division-pages15-17");
  if (!response.ok) throw new Error("既存問題データを読み込めませんでした。");
  const deck = await response.json();
  state.catalog = catalogFromDeck(deck);
  saveState();
  renderAll();
  showToast("既存問題を読み込みました");
}

function progressFor(problemId) {
  if (!state.progress[problemId]) {
    state.progress[problemId] = {
      attempts: 0,
      wrongs: 0,
      corrects: 0,
      planned: false,
      lastResult: "",
      lastAt: "",
      score: 0
    };
  }
  return state.progress[problemId];
}

function record(problemId, result) {
  const problem = state.catalog.find((item) => item.id === problemId);
  if (!problem) return;

  const progress = progressFor(problemId);
  const now = new Date();
  progress.attempts += result === "planned" ? 0 : 1;
  progress.lastAt = now.toISOString();
  progress.lastResult = result;

  if (result === "wrong") {
    progress.wrongs += 1;
    progress.planned = true;
    progress.score += 4;
  }
  if (result === "correct") {
    progress.corrects += 1;
    progress.planned = false;
    progress.score = Math.max(0, progress.score - 2);
  }
  if (result === "planned") {
    progress.planned = true;
    progress.score += 1;
  }
  if (result === "reset") {
    delete state.progress[problemId];
  } else {
    state.history.unshift({
      problemId,
      title: problem.title,
      categoryLabel: problem.categoryLabel,
      source: problem.source,
      itemNumber: problem.itemNumber,
      result,
      date: todayKey(now),
      at: now.toISOString()
    });
  }

  state.history = state.history.slice(0, 500);
  refreshRecommendations();
  saveState();
  renderAll();
}

function problemWeight(problem) {
  const progress = progressFor(problem.id);
  if (progress.planned) return 10 + progress.score;
  if (progress.wrongs > progress.corrects) return 8 + progress.wrongs * 2;
  if (progress.attempts === 0) return 4;
  return Math.max(1, progress.score + progress.wrongs - progress.corrects);
}

function refreshRecommendations() {
  state.recommendations = [...state.catalog]
    .map((problem) => ({ problem, weight: problemWeight(problem) }))
    .filter((item) => item.weight >= 3)
    .sort((a, b) => b.weight - a.weight || a.problem.source.localeCompare(b.problem.source, "ja"))
    .slice(0, 12);
}

function filteredCatalog() {
  const query = state.filters.search.trim().toLowerCase();
  return state.catalog.filter((problem) => {
    const progress = progressFor(problem.id);
    const haystack = `${problem.categoryLabel} ${problem.source} ${problem.itemNumber} ${problem.title} ${problem.note}`.toLowerCase();
    const statusMatch =
      state.filters.status === "all" ||
      (state.filters.status === "wrong" && progress.wrongs > progress.corrects) ||
      (state.filters.status === "due" && problemWeight(problem) >= 3) ||
      (state.filters.status === "fresh" && progress.attempts === 0 && !progress.planned);

    return (
      (state.filters.category === "all" || problem.categoryId === state.filters.category) &&
      (state.filters.source === "all" || problem.source === state.filters.source) &&
      (!query || haystack.includes(query)) &&
      statusMatch
    );
  });
}

function groupBySource(problems) {
  const groups = new Map();
  for (const problem of problems) {
    const key = `${problem.categoryLabel}__${problem.source}`;
    if (!groups.has(key)) groups.set(key, { categoryLabel: problem.categoryLabel, source: problem.source, problems: [] });
    groups.get(key).problems.push(problem);
  }
  return [...groups.values()];
}

function renderFilters() {
  const categories = [...new Map(state.catalog.map((item) => [item.categoryId, item.categoryLabel])).entries()];
  elements.categoryFilter.innerHTML = `<option value="all">すべて</option>${categories.map(([id, label]) => `<option value="${escapeHtml(id)}">${escapeHtml(label)}</option>`).join("")}`;
  elements.categoryFilter.value = state.filters.category;

  const sources = [...new Set(state.catalog.filter((item) => state.filters.category === "all" || item.categoryId === state.filters.category).map((item) => item.source))];
  elements.sourceFilter.innerHTML = `<option value="all">すべて</option>${sources.map((source) => `<option value="${escapeHtml(source)}">${escapeHtml(source)}</option>`).join("")}`;
  if (!sources.includes(state.filters.source)) state.filters.source = "all";
  elements.sourceFilter.value = state.filters.source;
  elements.statusFilter.value = state.filters.status;
  elements.searchInput.value = state.filters.search;
}

function renderSummary() {
  const today = todayKey();
  const wrongs = state.catalog.filter((problem) => {
    const progress = progressFor(problem.id);
    return progress.wrongs > progress.corrects;
  }).length;
  elements.totalCount.textContent = state.catalog.length;
  elements.wrongCount.textContent = wrongs;
  elements.todayCount.textContent = state.history.filter((item) => item.date === today).length;
  elements.recommendedCount.textContent = state.recommendations.length;
}

function renderRecommendations() {
  if (!state.recommendations.length) {
    elements.recommendationList.innerHTML = `<li><strong>候補はありません</strong><span>間違いマークや「今日やる」を付けると表示されます。</span></li>`;
    return;
  }

  elements.recommendationList.innerHTML = "";
  for (const { problem, weight } of state.recommendations) {
    const progress = progressFor(problem.id);
    const item = document.createElement("li");
    item.innerHTML = `<strong>${escapeHtml(problem.itemNumber)} ${escapeHtml(problem.title)}</strong><span>${escapeHtml(problem.categoryLabel)} / ${escapeHtml(problem.source)} / 間違い ${progress.wrongs} / 優先度 ${weight}</span>`;
    item.addEventListener("click", () => {
      state.filters.category = problem.categoryId;
      state.filters.source = problem.source;
      state.filters.status = "all";
      state.filters.search = problem.itemNumber;
      renderAll();
    });
    elements.recommendationList.append(item);
  }
}

function renderProblems() {
  const problems = filteredCatalog();
  elements.emptyState.hidden = state.catalog.length > 0;
  elements.problemGroups.innerHTML = "";

  for (const group of groupBySource(problems)) {
    const groupElement = document.createElement("section");
    groupElement.className = "source-group";
    const groupWrongs = group.problems.filter((problem) => progressFor(problem.id).wrongs > progressFor(problem.id).corrects).length;
    groupElement.innerHTML = `
      <header class="source-header">
        <div>
          <h3>${escapeHtml(group.categoryLabel)}</h3>
          <p>${escapeHtml(group.source)}</p>
        </div>
        <span class="source-stats">${group.problems.length}問 / 間違い${groupWrongs}</span>
      </header>
    `;

    for (const problem of group.problems) {
      groupElement.append(renderProblemRow(problem));
    }
    elements.problemGroups.append(groupElement);
  }
}

function renderProblemRow(problem) {
  const row = elements.rowTemplate.content.firstElementChild.cloneNode(true);
  const progress = progressFor(problem.id);
  row.querySelector(".problem-number").textContent = problem.itemNumber;
  row.querySelector("h3").textContent = problem.title;
  row.querySelector(".problem-meta").textContent = `${problem.categoryLabel} / ${problem.source}`;
  row.querySelector(".problem-note").textContent = problem.note || "メモなし";
  row.querySelector(".attempts").textContent = `記録 ${progress.attempts}`;
  row.querySelector(".wrongs").textContent = `間違い ${progress.wrongs}`;
  row.querySelector(".score").textContent = progress.planned ? `今日やる` : `優先度 ${problemWeight(problem)}`;

  row.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => record(problem.id, button.dataset.action));
  });
  return row;
}

function renderHistory() {
  const today = todayKey();
  const items = state.history.filter((item) => item.date === today);
  if (!items.length) {
    elements.todayHistory.innerHTML = `<p class="problem-meta">今日のチェックはまだありません。</p>`;
    return;
  }
  elements.todayHistory.innerHTML = items
    .map((item) => {
      const time = new Date(item.at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
      return `<div class="history-item"><strong>${escapeHtml(item.itemNumber)} ${escapeHtml(item.title)}</strong><span>${time} / ${resultLabel(item.result)}</span></div>`;
    })
    .join("");
}

function renderAll() {
  renderFilters();
  renderSummary();
  renderRecommendations();
  renderProblems();
  renderHistory();
}

function resultLabel(result) {
  return {
    correct: "できた",
    wrong: "間違い",
    planned: "今日やる",
    reset: "リセット"
  }[result] || result;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.remove(), 1800);
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

async function readFileJson(file) {
  return JSON.parse(await file.text());
}

elements.loadParentDeckButton.addEventListener("click", () => {
  loadParentDeck().catch((error) => showToast(error.message));
});

elements.importCatalogInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const data = await readFileJson(file);
    const catalog = normalizeCatalogData(data);
    if (!catalog.length) throw new Error("問題リストが見つかりませんでした。");
    state.catalog = catalog;
    saveState();
    renderAll();
    showToast(`${catalog.length}問を読み込みました`);
  } catch (error) {
    showToast(error.message);
  } finally {
    event.target.value = "";
  }
});

elements.importBackupInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const data = await readFileJson(file);
    state.catalog = normalizeCatalogData(data.catalog || data.problems || data.questions || []);
    state.progress = data.progress || {};
    state.history = data.history || [];
    refreshRecommendations();
    saveState();
    renderAll();
    showToast("学習管理データを復元しました");
  } catch (error) {
    showToast(error.message);
  } finally {
    event.target.value = "";
  }
});

elements.exportButton.addEventListener("click", () => {
  downloadJson(`manage-app-backup-${todayKey()}.json`, {
    app: "manage-app",
    version: 1,
    exportedAt: new Date().toISOString(),
    catalog: state.catalog,
    progress: state.progress,
    history: state.history
  });
});

elements.categoryFilter.addEventListener("change", (event) => {
  state.filters.category = event.target.value;
  state.filters.source = "all";
  renderAll();
});

elements.sourceFilter.addEventListener("change", (event) => {
  state.filters.source = event.target.value;
  renderAll();
});

elements.statusFilter.addEventListener("change", (event) => {
  state.filters.status = event.target.value;
  renderAll();
});

elements.searchInput.addEventListener("input", (event) => {
  state.filters.search = event.target.value;
  renderAll();
});

elements.refreshRecommendationsButton.addEventListener("click", () => {
  refreshRecommendations();
  renderAll();
  showToast("候補を更新しました");
});

elements.markVisiblePlannedButton.addEventListener("click", () => {
  for (const problem of filteredCatalog()) {
    progressFor(problem.id).planned = true;
    progressFor(problem.id).score += 1;
  }
  refreshRecommendations();
  saveState();
  renderAll();
});

elements.clearFiltersButton.addEventListener("click", () => {
  state.filters = { category: "all", source: "all", status: "all", search: "" };
  renderAll();
});

elements.clearTodayButton.addEventListener("click", () => {
  const today = todayKey();
  state.history = state.history.filter((item) => item.date !== today);
  saveState();
  renderAll();
});

function init() {
  state.catalog = loadJson(STORAGE_KEYS.catalog, []);
  state.progress = loadJson(STORAGE_KEYS.progress, {});
  state.history = loadJson(STORAGE_KEYS.history, []);
  refreshRecommendations();
  renderAll();
  if (!state.catalog.length) {
    loadParentDeck().catch(() => renderAll());
  }
}

init();

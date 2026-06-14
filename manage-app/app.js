const STORAGE_KEY = "pageReview.progress.v1";
const HISTORY_KEY = "pageReview.history.v1";

const data = window.PAGE_REVIEW_DATA || { categories: [], pages: [] };
const state = {
  mode: "review",
  category: data.categories[0]?.id || "all",
  pageIndex: 0,
  phase: "list",
  progress: loadJson(STORAGE_KEY, {}),
  history: loadJson(HISTORY_KEY, [])
};

const elements = {
  categorySelect: document.querySelector("#categorySelect"),
  modeSelect: document.querySelector("#modeSelect"),
  homeButton: document.querySelector("#homeButton"),
  exportButton: document.querySelector("#exportButton"),
  importInput: document.querySelector("#importInput"),
  pageCount: document.querySelector("#pageCount"),
  itemCount: document.querySelector("#itemCount"),
  wrongCount: document.querySelector("#wrongCount"),
  todayCount: document.querySelector("#todayCount"),
  listView: document.querySelector("#listView"),
  pageList: document.querySelector("#pageList"),
  startButton: document.querySelector("#startButton"),
  studyView: document.querySelector("#studyView"),
  answerView: document.querySelector("#answerView"),
  studyCategory: document.querySelector("#studyCategory"),
  studyTitle: document.querySelector("#studyTitle"),
  studySource: document.querySelector("#studySource"),
  pageImage: document.querySelector("#pageImage"),
  pageCaption: document.querySelector("#pageCaption"),
  targetItems: document.querySelector("#targetItems"),
  sideItems: document.querySelector("#sideItems"),
  showAnswerButton: document.querySelector("#showAnswerButton"),
  prevButton: document.querySelector("#prevButton"),
  nextButton: document.querySelector("#nextButton"),
  backToProblemButton: document.querySelector("#backToProblemButton"),
  answerItems: document.querySelector("#answerItems"),
  historyList: document.querySelector("#historyList"),
  clearTodayButton: document.querySelector("#clearTodayButton")
};

function todayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history));
}

function categoryLabel(id) {
  return data.categories.find((category) => category.id === id)?.label || id;
}

function pagesForCategory() {
  return data.pages.filter((page) => state.category === "all" || page.category === state.category);
}

function itemKey(page, item) {
  return `${page.id}:${item.id}`;
}

function itemProgress(page, item) {
  const key = itemKey(page, item);
  if (!state.progress[key]) {
    state.progress[key] = {
      attempts: 0,
      correct: 0,
      wrong: 0,
      last: "",
      score: 0
    };
  }
  return state.progress[key];
}

function itemWeight(page, item) {
  const progress = itemProgress(page, item);
  if (progress.wrong > progress.correct) return 10 + progress.wrong * 3 + progress.score;
  if (progress.attempts === 0) return 4;
  return Math.max(0, progress.score + progress.wrong - progress.correct);
}

function targetItems(page) {
  if (state.mode === "sequential") return page.subitems;
  const due = page.subitems.filter((item) => itemWeight(page, item) >= 4);
  return due.length ? due : page.subitems.slice(0, Math.min(2, page.subitems.length));
}

function pageWeight(page) {
  return page.subitems.reduce((sum, item) => sum + itemWeight(page, item), 0);
}

function currentPages() {
  return pagesForCategory();
}

function currentPage() {
  const pages = currentPages();
  return pages[Math.min(state.pageIndex, Math.max(0, pages.length - 1))];
}

function chooseRecommendedPage() {
  const pages = currentPages();
  if (!pages.length) return 0;
  let bestIndex = 0;
  let bestWeight = -1;
  pages.forEach((page, index) => {
    const weight = pageWeight(page);
    if (weight > bestWeight) {
      bestWeight = weight;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function record(page, item, result) {
  const progress = itemProgress(page, item);
  progress.attempts += 1;
  progress.last = result;
  if (result === "wrong") {
    progress.wrong += 1;
    progress.score += 4;
  } else {
    progress.correct += 1;
    progress.score = Math.max(0, progress.score - 3);
  }
  state.history.unshift({
    pageId: page.id,
    pageTitle: page.title,
    itemId: item.id,
    itemLabel: item.label,
    itemTitle: item.title,
    result,
    at: new Date().toISOString(),
    date: todayKey()
  });
  state.history = state.history.slice(0, 400);
  save();
  render();
}

function renderSummary() {
  const pages = currentPages();
  const allItems = pages.flatMap((page) => page.subitems.map((item) => ({ page, item })));
  elements.pageCount.textContent = pages.length;
  elements.itemCount.textContent = allItems.length;
  elements.wrongCount.textContent = allItems.filter(({ page, item }) => itemProgress(page, item).wrong > itemProgress(page, item).correct).length;
  elements.todayCount.textContent = state.history.filter((entry) => entry.date === todayKey()).length;
}

function renderCategorySelect() {
  const options = data.categories.map((category) => `<option value="${escapeHtml(category.id)}">${escapeHtml(category.label)}</option>`);
  elements.categorySelect.innerHTML = options.join("");
  elements.categorySelect.value = state.category;
  elements.modeSelect.value = state.mode;
}

function renderPageList() {
  elements.pageList.innerHTML = "";
  for (const [index, page] of currentPages().entries()) {
    const wrong = page.subitems.filter((item) => itemProgress(page, item).wrong > itemProgress(page, item).correct).length;
    const due = targetItems(page).length;
    const card = document.createElement("article");
    card.className = "page-card";
    card.innerHTML = `
      <img src="${escapeHtml(page.image)}" alt="${escapeHtml(page.title)}">
      <div>
        <p class="eyebrow">${escapeHtml(categoryLabel(page.category))}</p>
        <h3>${escapeHtml(page.title)}</h3>
        <p class="card-meta">${escapeHtml(page.source)}</p>
      </div>
      <div class="badges">
        <span class="badge">${page.subitems.length}小問</span>
        <span class="badge ${wrong ? "wrong" : "clean"}">間違い ${wrong}</span>
        <span class="badge">今回 ${due}</span>
      </div>
      <button type="button" class="primary">このページを解く</button>
    `;
    card.querySelector("button").addEventListener("click", () => openPage(index));
    elements.pageList.append(card);
  }
}

function renderStudy() {
  const page = currentPage();
  if (!page) return;
  elements.studyCategory.textContent = categoryLabel(page.category);
  elements.studyTitle.textContent = page.title;
  elements.studySource.textContent = page.source;
  elements.pageImage.src = page.image;
  elements.pageImage.alt = page.title;
  elements.pageCaption.textContent = "写真1枚を1回分の問題セットとして扱います。";

  const targets = targetItems(page);
  elements.targetItems.innerHTML = targets.map((item) => {
    const progress = itemProgress(page, item);
    const hot = progress.wrong > progress.correct;
    return `<span class="target-chip ${hot ? "hot" : ""}">${escapeHtml(item.label)} ${escapeHtml(item.title)}</span>`;
  }).join("");

  elements.sideItems.innerHTML = page.subitems.map((item) => {
    const progress = itemProgress(page, item);
    return `<div class="side-item"><strong>${escapeHtml(item.label)} ${escapeHtml(item.title)}</strong><span class="muted">正解 ${progress.correct} / 不正解 ${progress.wrong}</span></div>`;
  }).join("");
}

function renderAnswer() {
  const page = currentPage();
  if (!page) return;
  elements.answerItems.innerHTML = page.subitems.map((item) => {
    const progress = itemProgress(page, item);
    const shouldDo = targetItems(page).some((target) => target.id === item.id);
    return `
      <article class="answer-item">
        <div>
          <h3>${escapeHtml(item.label)} ${escapeHtml(item.title)}</h3>
          <p class="answer-text">答え: ${escapeHtml(item.answer || "自分で答え合わせ")}</p>
          <p class="answer-text">${shouldDo ? "今回の対象" : "追加で確認してもOK"} / 正解 ${progress.correct} / 不正解 ${progress.wrong}</p>
        </div>
        <div class="answer-buttons">
          <button type="button" data-page="${escapeHtml(page.id)}" data-item="${escapeHtml(item.id)}" data-result="correct">正解</button>
          <button type="button" class="danger" data-page="${escapeHtml(page.id)}" data-item="${escapeHtml(item.id)}" data-result="wrong">不正解</button>
        </div>
      </article>
    `;
  }).join("");

  elements.answerItems.querySelectorAll("button[data-result]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = page.subitems.find((candidate) => candidate.id === button.dataset.item);
      record(page, item, button.dataset.result);
    });
  });
}

function renderHistory() {
  const entries = state.history.filter((entry) => entry.date === todayKey());
  if (!entries.length) {
    elements.historyList.innerHTML = `<p class="muted">今日の履歴はまだありません。</p>`;
    return;
  }
  elements.historyList.innerHTML = entries.map((entry) => {
    const time = new Date(entry.at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
    return `<div class="history-row"><strong>${escapeHtml(entry.pageTitle)} / ${escapeHtml(entry.itemLabel)}</strong><span class="muted">${time} ${entry.result === "correct" ? "正解" : "不正解"}</span></div>`;
  }).join("");
}

function render() {
  renderCategorySelect();
  renderSummary();
  renderPageList();
  renderStudy();
  renderAnswer();
  renderHistory();
  elements.listView.hidden = state.phase !== "list";
  elements.studyView.hidden = state.phase === "list";
  elements.answerView.hidden = state.phase !== "answer";
}

function openPage(index) {
  state.pageIndex = index;
  state.phase = "problem";
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function movePage(delta) {
  const pages = currentPages();
  if (!pages.length) return;
  state.pageIndex = (state.pageIndex + delta + pages.length) % pages.length;
  state.phase = "problem";
  render();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function downloadJson(filename, value) {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => toast.remove(), 1800);
}

elements.categorySelect.addEventListener("change", (event) => {
  state.category = event.target.value;
  state.pageIndex = 0;
  state.phase = "list";
  render();
});

elements.modeSelect.addEventListener("change", (event) => {
  state.mode = event.target.value;
  render();
});

elements.homeButton.addEventListener("click", () => {
  state.phase = "list";
  render();
});

elements.startButton.addEventListener("click", () => {
  state.pageIndex = state.mode === "review" ? chooseRecommendedPage() : 0;
  state.phase = "problem";
  render();
});

elements.showAnswerButton.addEventListener("click", () => {
  state.phase = "answer";
  render();
});

elements.backToProblemButton.addEventListener("click", () => {
  state.phase = "problem";
  render();
});

elements.prevButton.addEventListener("click", () => movePage(-1));
elements.nextButton.addEventListener("click", () => movePage(1));

elements.exportButton.addEventListener("click", () => {
  downloadJson(`page-review-progress-${todayKey()}.json`, {
    app: "page-review",
    exportedAt: new Date().toISOString(),
    progress: state.progress,
    history: state.history
  });
});

elements.importInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    state.progress = data.progress || {};
    state.history = data.history || [];
    save();
    render();
    showToast("記録を復元しました");
  } catch {
    showToast("読み込みに失敗しました");
  } finally {
    event.target.value = "";
  }
});

elements.clearTodayButton.addEventListener("click", () => {
  const today = todayKey();
  state.history = state.history.filter((entry) => entry.date !== today);
  save();
  render();
});

render();

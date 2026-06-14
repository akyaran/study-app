const state = {
  deck: null,
  index: 0,
  showingAnswer: false,
  hintOpen: false,
  explanationOpen: false,
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
  prevButton: document.querySelector("#prevButton"),
  nextButton: document.querySelector("#nextButton"),
  hintButton: document.querySelector("#hintButton"),
  toggleAnswerButton: document.querySelector("#toggleAnswerButton"),
  explanationButton: document.querySelector("#explanationButton"),
  deckFileInput: document.querySelector("#deckFileInput"),
  questionSelect: document.querySelector("#questionSelect"),
};

const fallbackDeck = window.DEFAULT_DECK || {
  title: "サンプル問題集",
  questions: [
    {
      id: "sample-1",
      title: "サンプル問題",
      subject: "使い方",
      prompt: [
        { type: "text", value: "右上の「読み込み」から questions.json を選ぶと、問題集を差し替えられます。" },
        { type: "math", value: "例：864 ÷ 6 = ?" }
      ],
      hints: [{ type: "text", value: "GitHub Pagesなどで公開する場合は、同じフォルダの questions.json が自動で読み込まれます。" }],
      answer: [{ type: "text", value: "この画面は予備表示です。" }],
      explanation: [{ type: "text", value: "DATA_FORMAT.md の形式でAIにJSONを作らせてください。" }]
    }
  ],
};

async function loadDeck() {
  try {
    const response = await fetch("questions.json");
    if (!response.ok) throw new Error("questions.jsonを読み込めませんでした");
    state.deck = await response.json();
  } catch (error) {
    state.deck = fallbackDeck;
  }

  render();
}

function currentQuestion() {
  return state.deck.questions[state.index];
}

function resetReveals() {
  state.showingAnswer = false;
  state.hintOpen = false;
  state.explanationOpen = false;
}

function render() {
  const question = currentQuestion();
  const total = state.deck.questions.length;

  elements.deckTitle.textContent = state.deck.title || "問題集";
  elements.questionTitle.textContent = question.title || `問題 ${state.index + 1}`;
  elements.currentNumber.textContent = String(state.index + 1);
  elements.totalNumber.textContent = String(total);
  elements.subjectBadge.textContent = question.subject || "未分類";
  elements.pageMode.textContent = state.showingAnswer ? "解答" : "問題";
  renderQuestionOptions();

  renderBlocks(elements.contentArea, state.showingAnswer ? question.answer : question.prompt);
  renderBlocks(elements.hintArea, question.hints);
  renderBlocks(elements.explanationArea, question.explanation);

  elements.hintPanel.hidden = !state.hintOpen;
  elements.explanationPanel.hidden = !state.explanationOpen;

  elements.prevButton.disabled = state.index === 0;
  elements.nextButton.disabled = state.index === total - 1;
  elements.hintButton.disabled = !hasContent(question.hints) || state.showingAnswer;
  elements.explanationButton.disabled = !hasContent(question.explanation);
  elements.toggleAnswerButton.textContent = state.showingAnswer ? "問題へ" : "解答へ";
  elements.hintButton.textContent = state.hintOpen ? "ヒントを隠す" : "ヒント";
  elements.explanationButton.textContent = state.explanationOpen ? "解説を隠す" : "解説";
}

function renderQuestionOptions() {
  const options = state.deck.questions.map((question, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${index + 1}. ${question.title || "問題"}`;
    return option;
  });

  elements.questionSelect.replaceChildren(...options);
  elements.questionSelect.value = String(state.index);
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

elements.prevButton.addEventListener("click", () => {
  if (state.index > 0) {
    state.index -= 1;
    resetReveals();
    render();
  }
});

elements.nextButton.addEventListener("click", () => {
  if (state.index < state.deck.questions.length - 1) {
    state.index += 1;
    resetReveals();
    render();
  }
});

elements.hintButton.addEventListener("click", () => {
  state.hintOpen = !state.hintOpen;
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

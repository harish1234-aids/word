const correctSound = new Audio(correctSoundUrl);
correctSound.volume = 0.6;

let score = 0;
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("finalScore");
const POINTS_PER_WORD = 10;

const gridLetters = [
  "OJVSYIZRZZQX",
  "OPWWVYCFCXMN",
  "RELILXGFAUUR",
  "FSVMARINANHP",
  "AMYMFVDKOJBK",
  "XIAISUNOOXPB",
  "VCSNGUMFPRTF",
  "YSNGGCNODOEM",
  "UMMJFOLWMKJM",
  "ZQSBNFUZJJLD",
  "QJAIRCOOLERX",
  "ZGVACATIONUK"
];

const words = ["MARINA", "SUN", "AIRCOOLER", "VACATION", "SWIMMING", "FAN", "MANGO"];
const size = 12;

const gridElement = document.getElementById("grid");
const winScreen = document.getElementById("winScreen");

let cells = [];
let isDragging = false;
let startIndex = null;
let currentWord = "";

function createGrid() {
  gridElement.innerHTML = "";
  cells = [];

  gridLetters.forEach((row, r) => {
    row.split("").forEach((letter, c) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = letter;
      cell.dataset.index = r * size + c;
      gridElement.appendChild(cell);
      cells.push(cell);
    });
  });
}

createGrid();

gridElement.addEventListener("mousedown", e => {
  e.preventDefault();
  const cell = e.target.closest(".cell");
  if (!cell || cell.classList.contains("found")) return;

  isDragging = true;
  startIndex = parseInt(cell.dataset.index);
  updateSelection(startIndex);
});

document.addEventListener("mousemove", e => {
  if (!isDragging) return;
  const cell = document.elementFromPoint(e.clientX, e.clientY)?.closest(".cell");
  if (cell) updateSelection(parseInt(cell.dataset.index));
});

document.addEventListener("mouseup", () => {
  if (!isDragging) return;
  isDragging = false;
  checkWord();
  clearSelection(true);
});

function updateSelection(endIndex) {
  clearSelection(false);

  const sr = Math.floor(startIndex / size);
  const sc = startIndex % size;
  const er = Math.floor(endIndex / size);
  const ec = endIndex % size;

  const rDiff = er - sr;
  const cDiff = ec - sc;

  const isHorizontal = rDiff === 0;
  const isVertical = cDiff === 0;
  const isDiagonal = Math.abs(rDiff) === Math.abs(cDiff);
  if (!isHorizontal && !isVertical && !isDiagonal) return;

  const rStep = Math.sign(rDiff);
  const cStep = Math.sign(cDiff);

  let r = sr, c = sc;
  currentWord = "";

  while (true) {
    const cell = cells[r * size + c];
    cell.classList.add("selected");
    currentWord += cell.textContent;
    if (r === er && c === ec) break;
    r += isHorizontal ? 0 : rStep;
    c += isVertical ? 0 : cStep;
  }
}

function checkWord() {
  const wordEl = document.querySelector(`.word[data-word="${currentWord}"]`);
  if (wordEl && !wordEl.classList.contains("found")) {

    correctSound.currentTime = 0;
    correctSound.play();

    score += POINTS_PER_WORD;
    scoreEl.textContent = score;

    document.querySelectorAll(".cell.selected").forEach(c => c.classList.add("found"));
    wordEl.classList.add("found");

    checkWin();
  }
}

function checkWin() {
  const foundWords = document.querySelectorAll(".word.found").length;
  if (foundWords === words.length) {
    finalScoreEl.textContent = score;
    winScreen.style.display = "flex";
  }
}

function restartGame() {
  score = 0;
  scoreEl.textContent = 0;
  currentWord = "";
  startIndex = null;

  document.querySelectorAll(".word").forEach(w => w.classList.remove("found"));
  winScreen.style.display = "none";

  createGrid();
}

function clearSelection(reset) {
  cells.forEach(c => c.classList.remove("selected"));
  if (reset) {
    currentWord = "";
    startIndex = null;
  }
}
const container = document.querySelector(".container");
const scoreDisplay = document.getElementById("score");
const highscoresList = document.getElementById("highscores");
const music = document.getElementById("music");

let sequence = [];
let playerSequence = [];
let score = 0;
let playing = false;
let buttonsCount = 4;
let delay = 800;
let soundEnabled = true;
let currentTheme = 'light';

const colors = ["red", "green", "blue", "yellow", "orange", "purple"];
let buttons = [];

function setDifficulty(level) {
  switch (level) {
    case 'easy': delay = 1000; break;
    case 'normal': delay = 800; break;
    case 'hard': delay = 500; break;
    case 'hell': delay = 300; break;
  }
}

document.getElementById("modeSelect").addEventListener("change", (e) => {
  setDifficulty(e.target.value);
});

document.getElementById("buttonSelect").addEventListener("change", (e) => {
  buttonsCount = parseInt(e.target.value);
  createButtons();
});

document.getElementById("soundToggle").addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  document.getElementById("soundStatus").textContent = soundEnabled ? "On" : "Off";
});

document.getElementById("themeToggle").addEventListener("click", () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.classList.toggle('dark');
  document.getElementById("themeStatus").textContent = currentTheme === 'light' ? "Light" : "Dark";
});

document.getElementById("startBtn").addEventListener("click", startGame);

function createButtons() {
  container.innerHTML = "";
  buttons = [];
  for (let i = 0; i < buttonsCount; i++) {
    const btn = document.createElement("button");
    btn.classList.add("button");
    btn.style.background = colors[i];
    btn.dataset.color = colors[i];
    btn.addEventListener("click", () => handleClick(colors[i]));
    container.appendChild(btn);
    buttons.push(btn);
  }
}

function playSound(color) {
  if (soundEnabled) {
    const audio = new Audio(`sounds/${color}.mp3`);
    audio.play();
  }
}

function flashButton(color) {
  const btn = buttons.find(b => b.dataset.color === color);
  if (!btn) return;
  btn.classList.add("active");
  playSound(color);
  setTimeout(() => btn.classList.remove("active"), delay / 2);
}

function playSequence() {
  let i = 0;
  const interval = setInterval(() => {
    flashButton(sequence[i]);
    i++;
    if (i >= sequence.length) clearInterval(interval);
  }, delay);
}

function nextRound() {
  const nextColor = colors[Math.floor(Math.random() * buttonsCount)];
  sequence.push(nextColor);
  playSequence();
  playerSequence = [];
}

function handleClick(color) {
  if (!playing) return;
  const expectedColor = sequence[playerSequence.length];
  playerSequence.push(color);
  flashButton(color);
  if (color !== expectedColor) {
    endGame();
    return;
  }
  if (playerSequence.length === sequence.length) {
    score++;
    scoreDisplay.textContent = score;
    setTimeout(nextRound, delay);
  }
}

function startGame() {
  playing = true;
  score = 0;
  sequence = [];
  playerSequence = [];
  scoreDisplay.textContent = score;
  if (soundEnabled) music.play();
  nextRound();
}

function endGame() {
  playing = false;
  alert("Game Over! Your score: " + score);
  music.pause();
  music.currentTime = 0;
  saveScore(score);
}

function saveScore(score) {
  fetch("save_score.php", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ score })
  })
  .then(() => loadHighScores());
}

function loadHighScores() {
  fetch("get_highscores.php")
    .then(res => res.json())
    .then(data => {
      highscoresList.innerHTML = "";
      data.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${item.score} points`;
        highscoresList.appendChild(li);
      });
    });
}

createButtons();
setDifficulty('normal');
loadHighScores();

let pattern = [];
let playerInput = [];
let score = 0;
const colors = ["red", "green", "blue", "yellow"];

function playPattern() {
  let i = 0;
  const interval = setInterval(() => {
    flashButton(pattern[i]);
    i++;
    if (i >= pattern.length) clearInterval(interval);
  }, 800);
}

function flashButton(color) {
  const btn = document.getElementById(color);
  btn.classList.add("active");
  setTimeout(() => btn.classList.remove("active"), 500);
}

function addToPattern() {
  const color = colors[Math.floor(Math.random() * 4)];
  pattern.push(color);
  playPattern();
}

function handleClick(color) {
  playerInput.push(color);
  const index = playerInput.length - 1;

  if (playerInput[index] !== pattern[index]) {
    alert("Game Over! Your score: " + score);
    saveScore(score);
    resetGame();
    return;
  }

  if (playerInput.length === pattern.length) {
    score++;
    document.getElementById("score").textContent = score;
    playerInput = [];
    setTimeout(addToPattern, 1000);
  }
}

function resetGame() {
  pattern = [];
  playerInput = [];
  score = 0;
  document.getElementById("score").textContent = 0;
}

function saveScore(score) {
  fetch("save_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "score=" + score
  }).then(loadHighScores);
}

function loadHighScores() {
  fetch("get_highscores.php")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("highscores");
      list.innerHTML = "";
      data.forEach(s => {
        const li = document.createElement("li");
        li.textContent = "Score: " + s.score;
        list.appendChild(li);
      });
    });
}

document.getElementById("startBtn").addEventListener("click", () => {
  resetGame();
  addToPattern();
});

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const color = btn.id;
    flashButton(color);
    handleClick(color);
  });
});

// 初始加载高分
loadHighScores();

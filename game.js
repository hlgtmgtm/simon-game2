// 获取元素
const startBtn = document.getElementById('startBtn');
const container = document.querySelector('.container');
const scoreDisplay = document.getElementById('score');
const soundToggle = document.getElementById('soundToggle');

let sequence = [];
let playerSequence = [];
let score = 0;
let buttonsCount = 4;
let soundOn = true;

// 颜色和对应音效文件名
const colors = ['red', 'green', 'blue', 'yellow'];

// 创建按钮
function createButtons() {
  container.innerHTML = ''; // 清空
  for (let i = 0; i < buttonsCount; i++) {
    const btn = document.createElement('button');
    btn.classList.add('button');
    btn.style.backgroundColor = colors[i];
    btn.id = colors[i];
    btn.addEventListener('click', () => handlePlayerClick(colors[i]));
    container.appendChild(btn);
  }
}

// 播放按钮高亮动画
function playButton(color) {
  const btn = document.getElementById(color);
  btn.classList.add('active');
  if (soundOn) {
    // 播放音效（需准备对应文件）
    const audio = new Audio(`sounds/${color}.mp3`);
    audio.play();
  }
  setTimeout(() => btn.classList.remove('active'), 500);
}

// 播放序列动画
function playSequence() {
  let i = 0;
  const interval = setInterval(() => {
    playButton(sequence[i]);
    i++;
    if (i >= sequence.length) clearInterval(interval);
  }, 700);
}

// 玩家点击事件处理
function handlePlayerClick(color) {
  playerSequence.push(color);
  playButton(color);

  // 检查玩家输入
  const currentIndex = playerSequence.length - 1;
  if (playerSequence[currentIndex] !== sequence[currentIndex]) {
    alert(`Game Over! Your score: ${score}`);
    resetGame();
    return;
  }

  if (playerSequence.length === sequence.length) {
    score++;
    scoreDisplay.textContent = score;
    playerSequence = [];
    addStepToSequence();
    setTimeout(playSequence, 1000);
  }
}

// 添加随机步骤
function addStepToSequence() {
  const randomColor = colors[Math.floor(Math.random() * buttonsCount)];
  sequence.push(randomColor);
}

// 开始游戏
function startGame() {
  score = 0;
  sequence = [];
  playerSequence = [];
  scoreDisplay.textContent = score;
  addStepToSequence();
  playSequence();
}

// 重置游戏
function resetGame() {
  score = 0;
  sequence = [];
  playerSequence = [];
  scoreDisplay.textContent = score;
}

// 音效开关
soundToggle.addEventListener('click', () => {
  soundOn = !soundOn;
  document.getElementById('soundStatus').textContent = soundOn ? 'On' : 'Off';
});

// 初始化按钮并绑定事件
createButtons();
startBtn.addEventListener('click', startGame);

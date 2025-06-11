let pattern = [];
let playerInput = [];
let score = 0;
+let colors = ["red", "green", "blue", "yellow"];
+let streak = 0;
+let startTime = 0;
+let timerInterval = null;
+let difficulty = "easy";
+let mode = "4";

+// 声音对象
+const sounds = {
+  red: document.getElementById("redSound"),
+  green: document.getElementById("greenSound"),
+  blue: document.getElementById("blueSound"),
+  yellow: document.getElementById("yellowSound"),
+  purple: document.getElementById("purpleSound"),
+  orange: document.getElementById("orangeSound"),
+  success: document.getElementById("successSound"),
+  fail: document.getElementById("failSound")
+};

+// 难度设置
+const difficultySettings = {
+  easy: { speed: 1000, addCount: 1 },
+  medium: { speed: 700, addCount: 2 },
+  hard: { speed: 400, addCount: 3 }
+};

+// 更新模式
+function updateMode() {
+  mode = document.getElementById("mode").value;
+  colors = mode === "6" 
+    ? ["red", "green", "blue", "yellow", "purple", "orange"] 
+    : ["red", "green", "blue", "yellow"];
+  
+  document.querySelectorAll(".btn").forEach(btn => {
+    if (colors.includes(btn.id)) {
+      btn.classList.remove("hidden");
+    } else {
+      btn.classList.add("hidden");
+    }
+  });
+  
+  resetGame();
+}

+// 更新难度
+function updateDifficulty() {
+  difficulty = document.getElementById("difficulty").value;
+}

+// 播放声音
+function playSound(color) {
+  if (sounds[color]) {
+    sounds[color].currentTime = 0;
+    sounds[color].play();
+  }
+}

+// 开始计时器
+function startTimer() {
+  clearInterval(timerInterval);
+  startTime = Date.now();
+  timerInterval = setInterval(() => {
+    const elapsed = (Date.now() - startTime) / 1000;
+    document.getElementById("timer").textContent = elapsed.toFixed(2) + "s";
+  }, 10);
+}

+// 停止计时器
+function stopTimer() {
+  clearInterval(timerInterval);
+}

+// 添加徽章
+function addBadge() {
+  const badgeContainer = document.getElementById("badgeContainer");
+  badgeContainer.innerHTML = "";
+  
+  const badge = document.createElement("div");
+  badge.className = "badge";
+  badge.textContent = "🏆 连续10关!";
+  badgeContainer.appendChild(badge);
+  
+  setTimeout(() => {
+    badge.style.opacity = "0.5";
+  }, 3000);
+}

function playPattern() {
+  stopTimer();
   let i = 0;
+  const speed = difficultySettings[difficulty].speed;
   const interval = setInterval(() => {
     flashButton(pattern[i]);
     i++;
     if (i >= pattern.length) clearInterval(interval);
-  }, 800);
+  }, speed);
+  
+  // 序列播放完成后开始计时
+  setTimeout(startTimer, speed * pattern.length);
 }

 function flashButton(color) {
   const btn = document.getElementById(color);
   btn.classList.add("active");
+  playSound(color);
   setTimeout(() => btn.classList.remove("active"), 500);
 }

 function addToPattern() {
+  streak++;
+  
+  // 每10关显示徽章
+  if (streak % 10 === 0) {
+    addBadge();
+    playSound("success");
+  }
+  
+  const addCount = difficultySettings[difficulty].addCount;
   const color = colors[Math.floor(Math.random() * colors.length)];
-  pattern.push(color);
+  
+  // 根据难度添加多个颜色
+  for (let i = 0; i < addCount; i++) {
+    pattern.push(colors[Math.floor(Math.random() * colors.length)]);
+  }
+  
   playPattern();
 }

 function handleClick(color) {
+  playSound(color);
   playerInput.push(color);
   const index = playerInput.length - 1;

   if (playerInput[index] !== pattern[index]) {
+    playSound("fail");
+    stopTimer();
     alert("Game Over! Your score: " + score);
     saveScore(score);
     resetGame();
     return;
   }

   if (playerInput.length === pattern.length) {
-    score++;
+    stopTimer();
+    const timeTaken = (Date.now() - startTime) / 1000;
+    score += Math.max(1, Math.floor(10 / timeTaken));
+    
     document.getElementById("score").textContent = score;
     playerInput = [];
     setTimeout(addToPattern, 1000);
   }
 }

 function resetGame() {
+  stopTimer();
+  document.getElementById("timer").textContent = "0.00s";
   pattern = [];
   playerInput = [];
   score = 0;
+  streak = 0;
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

+// 初始化游戏
+function initGame() {
+  updateMode();
+  updateDifficulty();
+  loadHighScores();
+}

 document.getElementById("startBtn").addEventListener("click", () => {
   resetGame();
   addToPattern();
 });

+document.getElementById("resetBtn").addEventListener("click", resetGame);
+document.getElementById("mode").addEventListener("change", updateMode);
+document.getElementById("difficulty").addEventListener("change", updateDifficulty);
+
 document.querySelectorAll(".btn").forEach(btn => {
   btn.addEventListener("click", () => {
     const color = btn.id;
     flashButton(color);
-    handleClick(color);
   });
 });

-// 初始加载高分
-loadHighScores();
+initGame();
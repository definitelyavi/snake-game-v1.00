/**
 * Snake Game v1.00
 * Author: Jashan
 * Description: Customizable Snake game built using HTML, CSS, JS (Canvas), and Howler.js.
 * Features: Wall mode toggle, speed scaling, theme switching, sound effects, high score tracking.
 * Last updated: May 24, 2025
 */

// 🎮 Get canvas and context
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// 🔊 Sound effects
const eatSound = new Howl({ src: ['assets/sounds/eat.mp3'] });
const gameOverSound = new Howl({ src: ['assets/sounds/gameover.mp3'] });
const moveSound = new Howl({ src: ['assets/sounds/move.mp3'] });

// 🧩 Game variables
let gridSize = 20;
let snake = [{ x: 160, y: 160 }];
let dx = gridSize;
let dy = 0;
let food = getRandomFoodPosition();
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;
let currentSpeed = 150;

// 🧱 Wall variables
let wallMode = false;
let wallCount = 5;
let walls = [];

// 🎨 Theme
let theme = 'classic';
let snakeColor = '#33ff33';
let foodColor = 'red';

// 🧼 UI setup
document.getElementById("high-score").innerText = highScore;

// 🍎 Food generator (avoids snake)
function getRandomFoodPosition() {
  for (let i = 0; i < 100; i++) {
    const foodX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const foodY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    const newFood = { x: foodX, y: foodY };

    const isOnSnake = snake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
    if (!isOnSnake) return newFood;
  }
  return { x: 0, y: 0 };
}

// 🧱 Generate random walls
function generateWalls() {
  walls = [];
  while (walls.length < wallCount) {
    const wallX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const wallY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    const newWall = { x: wallX, y: wallY };

    const isOnSnake = snake.some(seg => seg.x === newWall.x && seg.y === newWall.y);
    const isOnFood = food && food.x === newWall.x && food.y === newWall.y;
    const isDuplicate = walls.some(w => w.x === newWall.x && w.y === newWall.y);

    if (!isOnSnake && !isOnFood && !isDuplicate) {
      walls.push(newWall);
    }
  }
}

// 🔁 Game loop
function gameLoop() {
  moveSnake();
  drawGame();
}

// 💥 Game Over
function gameOver(message) {
  clearInterval(gameInterval);
  gameOverSound.play();
  canvas.classList.add("flash");

  setTimeout(() => {
    document.getElementById("game-over-message").innerText = message;
    document.getElementById("game-over-screen").style.display = "flex";
  }, 500);
}

// 🐍 Move the snake
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) return gameOver("💥 Game Over! You hit the wall.");

  if (snake.some(seg => seg.x === head.x && seg.y === head.y))
    return gameOver("💥 Game Over! You ran into yourself.");

  if (wallMode && walls.some(w => w.x === head.x && w.y === head.y))
    return gameOver("💥 Game Over! You hit a wall block.");

  snake.unshift(head);
  moveSound.play();

  if (head.x === food.x && head.y === food.y) {
    eatSound.play();
    score++;
    document.getElementById("current-score").innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.getElementById("high-score").innerText = highScore;
    }

    food = getRandomFoodPosition();
    if (score % 5 === 0) increaseSpeed();
  } else {
    snake.pop();
  }
}

// 🖌️ Draw everything
function drawGame() {
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (wallMode) {
    ctx.fillStyle = "#666";
    walls.forEach(w => ctx.fillRect(w.x, w.y, gridSize, gridSize));
  }

  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x, food.y, gridSize, gridSize);

  ctx.fillStyle = snakeColor;
  snake.forEach(part => ctx.fillRect(part.x, part.y, gridSize, gridSize));
}

// 🎮 Controls
document.addEventListener("keydown", changeDirection);
function changeDirection(event) {
  const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
  const key = event.keyCode;

  if (key === LEFT && dx === 0) { dx = -gridSize; dy = 0; }
  else if (key === UP && dy === 0) { dx = 0; dy = -gridSize; }
  else if (key === RIGHT && dx === 0) { dx = gridSize; dy = 0; }
  else if (key === DOWN && dy === 0) { dx = 0; dy = gridSize; }
}

// 🎨 Apply theme
function applyTheme(themeName) {
  theme = themeName;
  if (theme === 'classic') {
    document.body.style.backgroundColor = '#222';
    snakeColor = '#33ff33'; foodColor = 'red';
  } else if (theme === 'neon') {
    document.body.style.backgroundColor = '#000';
    snakeColor = '#ff00ff'; foodColor = '#00ffff';
  } else if (theme === 'ice') {
    document.body.style.backgroundColor = '#1e1e2f';
    snakeColor = '#00ccff'; foodColor = '#ffffff';
  }
}

// 🚀 Speed up every 5 points
function increaseSpeed() {
  if (currentSpeed <= 50) return;
  currentSpeed -= 10;
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, currentSpeed);
}

// ♻️ Reset game state
function restartGame() {
  clearInterval(gameInterval);
  snake = [{ x: 160, y: 160 }];
  dx = gridSize; dy = 0;
  score = 0;
  food = getRandomFoodPosition();
  if (wallMode) generateWalls();

  document.getElementById("current-score").innerText = 0;
  document.getElementById("high-score").innerText = highScore;
  canvas.classList.remove("flash");
  document.getElementById("game-over-screen").style.display = "none";

  gameInterval = setInterval(gameLoop, currentSpeed);
}

// 🟢 Start button
document.getElementById("start-btn").addEventListener("click", () => {
  const selectedSpeed = parseInt(document.getElementById("speed").value);
  const selectedGrid = parseInt(document.getElementById("grid").value);
  const selectedTheme = document.getElementById("theme").value;
  const wallSetting = document.getElementById("walls").value;

  gridSize = selectedGrid;
  dx = gridSize; dy = 0;
  snake = [{ x: 160, y: 160 }];
  score = 0;
  wallMode = wallSetting === "on";
  applyTheme(selectedTheme);
  food = getRandomFoodPosition();
  if (wallMode) generateWalls();

  currentSpeed = selectedSpeed;
  document.getElementById("current-score").innerText = 0;
  document.getElementById("high-score").innerText = highScore;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  gameInterval = setInterval(gameLoop, currentSpeed);
});

// 🔄 Restart & Menu buttons
document.getElementById("restart-btn").addEventListener("click", () => location.reload());
document.getElementById("play-again-btn").addEventListener("click", restartGame);
document.getElementById("main-menu-btn").addEventListener("click", () => location.reload());

// 🔁 Reset High Score (from button in HTML)
function resetHighScore() {
  localStorage.removeItem("highScore");
  highScore = 0;
  document.getElementById("high-score").innerText = "0";
}

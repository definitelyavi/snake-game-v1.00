// 1. Get the canvas and its drawing context
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// 🎵 Sound Effects
const eatSound = new Howl({ src: ['assets/sounds/eat.mp3'] });
const gameOverSound = new Howl({ src: ['assets/sounds/gameover.mp3'] });
const moveSound = new Howl({ src: ['assets/sounds/move.mp3'] });

// 2. Set up the size of each grid square
let gridSize = 20;

let wallMode = false;

// 3. Set the initial snake position (top-left corner)
let snake = [{ x: 160, y: 160 }];

// 4. Set the initial movement direction
let dx = gridSize; // move right by default
let dy = 0;

let wallCount = 5; // Number of walls to generate
let walls = [];    // Array to store wall positions

// 5. Function to place food safely on grid, not on snake
function getRandomFoodPosition() {
  for (let i = 0; i < 100; i++) {
    const foodX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const foodY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    const newFood = { x: foodX, y: foodY };

    const isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    if (!isOnSnake) {
      return newFood;
    }
  }

  // Fallback if loop fails
  console.warn("⚠️ Couldn't place safe food — using fallback at (0,0).");
  return { x: 0, y: 0 };
}

function generateWalls() {
  walls = [];
  while (walls.length < wallCount) {
    const wallX = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const wallY = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    const newWall = { x: wallX, y: wallY };

    const isOnSnake = snake.some(seg => seg.x === newWall.x && seg.y === newWall.y);
    const isOnFood = food && food.x === newWall.x && food.y === newWall.y;
    const isOnOtherWall = walls.some(w => w.x === newWall.x && w.y === newWall.y);

    if (!isOnSnake && !isOnFood && !isOnOtherWall) {
      walls.push(newWall);
    }
  }
}


// 6. Initial food + score
let food = getRandomFoodPosition();

let highScore = localStorage.getItem("highScore") || 0;
document.getElementById("high-score").innerText = highScore;

let score = 0;

function resetHighScore() {
  localStorage.removeItem("highScore");
  highScore = 0;
  document.getElementById("high-score").innerText = "0";
}

// 7. Game loop runs every 150ms
function gameLoop() {
  moveSnake();
  drawGame();
}

function gameOver(message) {
  clearInterval(gameInterval);
  gameOverSound.play();

  // Add flash effect to canvas
  canvas.classList.add("flash");

setTimeout(() => {
  document.getElementById("game-over-message").innerText = message;
  document.getElementById("game-over-screen").style.display = "flex";
}, 500);
}



// 8. Move snake & check for food
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // 🔴 WALL COLLISION
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height
  ) {
    gameOver("💥 Game Over! You hit the wall.");
    return;
  }

  // 🔴 SELF COLLISION
  const hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);
  if (hitSelf) {
    gameOver("💥 Game Over! You ran into yourself.");
    return;
  }

if (wallMode) {
  const hitWall = walls.some(w => w.x === head.x && w.y === head.y);
  if (hitWall) {
    gameOver("💥 Game Over! You hit a wall block.");
    return;
  }
}


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

  // ✅ NEW: increase speed every 5 points
  if (score % 5 === 0) {
    increaseSpeed();
  }

} else {
  snake.pop();
}

}



// 9. Draw snake and food
function drawGame() {
  // Clear canvas
  ctx.fillStyle = "#111";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw food
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x, food.y, gridSize, gridSize);

  // ✅ Draw walls only if wallMode is ON
  if (wallMode) {
    ctx.fillStyle = "#666";
    walls.forEach(w => {
      ctx.fillRect(w.x, w.y, gridSize, gridSize);
    });
  }

  // ✅ Always draw snake
  ctx.fillStyle = snakeColor;
  snake.forEach((part) => {
    ctx.fillRect(part.x, part.y, gridSize, gridSize);
  });
}



// 11. Controls
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;

  const keyPressed = event.keyCode;

  if (keyPressed === LEFT && dx === 0) {
    dx = -gridSize;
    dy = 0;
  } else if (keyPressed === UP && dy === 0) {
    dx = 0;
    dy = -gridSize;
  } else if (keyPressed === RIGHT && dx === 0) {
    dx = gridSize;
    dy = 0;
  } else if (keyPressed === DOWN && dy === 0) {
    dx = 0;
    dy = gridSize;
  }
}

let gameInterval;
let currentSpeed = 150; // Default speed in ms

// Theme variables
let theme = 'classic';
let snakeColor = '#33ff33';
let foodColor = 'red';

// Apply selected theme
function applyTheme(themeName) {
  theme = themeName;

  if (theme === 'classic') {
    document.body.style.backgroundColor = '#222';
    snakeColor = '#33ff33';
    foodColor = 'red';
  } else if (theme === 'neon') {
    document.body.style.backgroundColor = '#000';
    snakeColor = '#ff00ff';
    foodColor = '#00ffff';
  } else if (theme === 'ice') {
    document.body.style.backgroundColor = '#1e1e2f';
    snakeColor = '#00ccff';
    foodColor = '#ffffff';
  }
}

function restartGame() {
  clearInterval(gameInterval);
  snake = [{ x: 160, y: 160 }];
  dx = gridSize;
  dy = 0;
  score = 0;
  food = getRandomFoodPosition();
  generateWalls();

  document.getElementById("current-score").innerText = 0;
  document.getElementById("high-score").innerText = highScore;

  canvas.classList.remove("flash");
  document.getElementById("game-over-screen").style.display = "none";

  gameInterval = setInterval(gameLoop, parseInt(document.getElementById("speed").value));
}

function increaseSpeed() {
  // Avoid going too fast
  if (currentSpeed <= 50) return;

  currentSpeed -= 10; // Increase speed (lower interval)
  clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, currentSpeed);
}

document.getElementById("start-btn").addEventListener("click", () => {
  const selectedSpeed = parseInt(document.getElementById("speed").value);
  const selectedGrid = parseInt(document.getElementById("grid").value);
  const selectedTheme = document.getElementById("theme").value;
  const wallSetting = document.getElementById("walls").value;

  applyTheme(selectedTheme);
  wallMode = wallSetting === "on"; // ✅ Toggle wall mode

  gridSize = selectedGrid;
  snake = [{ x: 160, y: 160 }];
  dx = gridSize;
  dy = 0;
  score = 0;
  food = getRandomFoodPosition();

  if (wallMode) generateWalls(); // ✅ Only generate if walls are ON

  document.getElementById("current-score").innerText = 0;
  document.getElementById("high-score").innerText = highScore;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  currentSpeed = selectedSpeed;
  gameInterval = setInterval(gameLoop, currentSpeed);
});


document.getElementById("restart-btn").addEventListener("click", () => {
  location.reload(); // clean reset
});

document.getElementById("play-again-btn").addEventListener("click", restartGame);
 // just restart the game

document.getElementById("main-menu-btn").addEventListener("click", () => {
  document.location.reload(); // same for now, but can be changed later to return to #start-screen
});

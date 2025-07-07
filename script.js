const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [[snakeX, snakeY]];
let setIntervalId;
let score = 0;

// Get high score from localStorage or set to 0
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Game Over! Press OK to replay...");
  location.reload();
};

const changeDirection = e => {
  const key = e.key || e.target.dataset.key;
  if (key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

// Handle keyboard input
document.addEventListener("keydown", changeDirection);

// Handle touch controls
controls.forEach(button =>
  button.addEventListener("click", changeDirection)
);

const initGame = () => {
  if (gameOver) return handleGameOver();

  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // Move snake head
  snakeX += velocityX;
  snakeY += velocityY;

  // Game over conditions: wall collision
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }

  // Add new head to snake
  snakeBody.unshift([snakeX, snakeY]);

  // If snake eats food
  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    score++;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  } else {
    snakeBody.pop(); // Remove tail
  }

  // Draw snake
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // Snake eats itself
    if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
      gameOver = true;
    }
  }

  playBoard.innerHTML = html;
};

updateFoodPosition();
setIntervalId = setInterval(initGame, 150); // Game speed

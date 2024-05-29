const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
canvas.width = 600;
canvas.height = 400;

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: 0 };
let egg = getRandomPosition();
let gameOver = false;
let score = 0;
let highestScore = localStorage.getItem('highestScore') || 0;

const currentScoreElement = document.getElementById('currentScore');
const highestScoreElement = document.getElementById('highestScore');
const celebrationElement = document.getElementById('celebration');
const gameOverMessageElement = document.getElementById('gameOverMessage');

highestScoreElement.innerText = highestScore;

function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
        y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
    };
}

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, gridSize, gridSize);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function update() {
    if (gameOver) {
        ctx.fillStyle = 'red';
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', canvas.width / 4, canvas.height / 2);
        gameOverMessageElement.style.display = 'block';
        gameOverMessageElement.innerText="GAME OVER"
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === egg.x && head.y === egg.y) {
        egg = getRandomPosition();
        score += 4;
        currentScoreElement.innerText = score;
        celebrationElement.innerText = "🎉 Your score is " + score + "! 🎉";
        if (score > highestScore) {
            highestScore = score;
            highestScoreElement.innerText = highestScore;
            localStorage.setItem('highestScore', highestScore);
        }
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
        gameOver = true;
        return;
    }

    snake.unshift(head);

    drawRect(egg.x, egg.y, 'yellow');

    snake.forEach(segment => drawRect(segment.x, segment.y, 'lime'));

    drawScore();

    setTimeout(update, 100);
}

function collision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

window.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -gridSize };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: gridSize };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -gridSize, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: gridSize, y: 0 };
            break;
    }
});

update();

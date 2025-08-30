import {Player} from "./player.js";
import {Bullet} from "./bullet.js";
import {Target, BossTarget} from "./target.js";


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 650;

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

let player, bullets, targets, score;
let level, timeLeft, targetScore;
let gameRunning = false;
let timerInterval;

// Khởi tạo game
function initGame() {
    player = new Player(canvas);
    bullets = [];
    targets = [];
    score = 0;
    level = 1;
    timeLeft = 120;
    targetScore = 100;

    // spawn quái thường
    let targetCount = 5 + (level - 1) * 2;
    for (let i = 0; i < targetCount; i++) {
        targets.push(new Target(canvas));

    }
}

// Qua level
function nextLevel() {
    level++;
    score = 0; // reset điểm từng level
    targetScore = 100 * Math.pow(2, level - 1);
    timeLeft = Math.max(5, 120 - (level - 1) * 5);
    bullets = [];
    targets = [];

    // spawn quái thường
    let targetCount = 5 + (level - 1) * 2;
    for (let i = 0; i < targetCount; i++) {
        targets.push(new Target(canvas));
    }
// spawn 1 boss mỗi level
    for (let j = 0; j <= 2; j++) {
        targets.push(new BossTarget(canvas));
    }
}

// Đếm ngược
function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (!gameRunning) return;

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            if (score >= targetScore) {
                nextLevel();
            } else {
                gameOver();
            }
        }
    }, 1000);
}

// Thua
function gameOver() {
    gameRunning = false;
    clearInterval(timerInterval);
    restartBtn.style.display = "inline-block";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Chữ GAME OVER giữa màn
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.font = "bold 72px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 40);

    ctx.fillStyle = "white";
    ctx.font = "bold 32px Arial";
    ctx.fillText("Bạn thua ở level " + level + " với " + score + " điểm",
        canvas.width / 2, canvas.height / 2 + 20);

}


// Bắt đầu
startBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // xoá toàn bộ canvas
    initGame();
    gameRunning = true;
    startBtn.style.display = "none";
    restartBtn.style.display = "none";
    startTimer();
    update();
});

// Chơi lại
restartBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // xoá toàn bộ canvas
    initGame();
    gameRunning = true;
    restartBtn.style.display = "none";
    startTimer();
    update();
});

// Bắn bằng click
canvas.addEventListener("click", (e) => {
    if (!gameRunning) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    bullets.push(new Bullet(player.x, player.y, mouseX, mouseY));
});

// Kiểm tra va chạm
function detectCollision(bullet, target) {
    return (
        bullet.x + bullet.radius > target.x - target.radius &&
        bullet.x - bullet.radius < target.x + target.radius &&
        bullet.y + bullet.radius > target.y - target.radius &&
        bullet.y - bullet.radius < target.y + target.radius
    );
}


// Background
const background = new Image();
background.src = "Img/background0.jpg";

function update() {
    if (!gameRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Vẽ background
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Vẽ player
    player.draw(ctx);

    // Vẽ bullet
    bullets.forEach((b, bIndex) => {
        b.update();
        b.draw(ctx);

        // Xoá viên đạn bay ra ngoài khung
        if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
            bullets.splice(bIndex, 1);
            return; // tránh lỗi khi splice
        }

        // Check va chạm với target
        targets.forEach((t, tIndex) => {
            if (detectCollision(b, t)) {
                bullets.splice(bIndex, 1);
                targets.splice(tIndex, 1);

                if (t instanceof BossTarget) {
                    score *= 2;
                    timeLeft += 5;
                } else {
                    score += 20 * level;
                }

                // spawn lại target thường
                targets.push(new Target(canvas));

                if (score >= targetScore) {
                    nextLevel();
                }
            }
        });

// Cập nhật boss
        targets.forEach((t) => {
            if (t instanceof BossTarget) {
                t.update();
            }
            t.draw(ctx);
        });
    });

    // Vẽ target
    targets.forEach((t) => t.draw(ctx));

    // Hiển thị thông tin
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Level: " + level, 25, 30);
    ctx.fillText("Score: " + score + "/" + targetScore, 25, 60);
    ctx.fillText("Time: " + timeLeft + "s", 25, 90);

    requestAnimationFrame(update);
}

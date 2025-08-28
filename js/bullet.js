export class Bullet {
    constructor(startX, startY, targetX, targetY) {
        this.x = startX;
        this.y = startY;
        this.radius = 30;
        this.speed = 8;

        // Ảnh đạn
        this.image = new Image();
        this.image.src = "Img/bullet0.png";

        // Vector hướng
        let dx = targetX - startX;
        let dy = targetY - startY;
        let length = Math.sqrt(dx * dx + dy * dy) || 1; // tránh chia 0
        this.vx = (dx / length) * this.speed;
        this.vy = (dy / length) * this.speed;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        if (this.image.complete && this.image.naturalWidth > 0) {
            ctx.drawImage(
                this.image,
                this.x - this.radius,
                this.y - this.radius,
                this.radius * 2,
                this.radius * 2
            );
        } else {
            // fallback nếu ảnh chưa load
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "yellow";
            ctx.fill();
            ctx.closePath();
        }
    }
}

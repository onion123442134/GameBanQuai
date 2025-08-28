export class Target {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * (canvas.width - 50) + 25;
        this.y = Math.random() * (canvas.height / 2);
        this.radius = 25;

        this.image = new Image();
        this.image.src = "Img/target1.png";
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }
}
export class BossTarget {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = Math.random() * (canvas.width - 80) + 40;
        this.y = Math.random() * (canvas.height / 2);
        this.radius = 80;
        this.speed = 0.8;

        this.image = new Image();
        this.image.src = "Img/boss.png";
    }

    update() {
        // Boss di chuyển chậm sang 2 bên
        this.x += this.speed;
        if (this.x + this.radius > this.canvas.width || this.x - this.radius < 0) {
            this.speed *= -1;
        }
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.x - this.radius,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        );
    }
}

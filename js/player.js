export class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height - 60;
        this.image = new Image();
        this.image.src = "Img/player0.png";
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - 30, this.y - 100, 100, 100);
    }
}
var canvas = document.getElementById('myCanvas');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
window.onresize = () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
};
var ctx = canvas.getContext('2d');
function draw() {
    // Draw a rectangle
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(50, 50, 100, 50);
    // Draw a line
    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(300, 100);
    ctx.stroke();
    // ctx.bezierCurveTo()
    // Draw a circle
    ctx.beginPath();
    ctx.arc(window.innerWidth / 2, window.innerHeight / 2, 40, 0, 1 * Math.PI);
    ctx.fillStyle = '#0000FF';
    ctx.fill();
    requestAnimationFrame(draw);
}
draw();

var canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
window.onresize = () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
}
var ctx = canvas.getContext('2d');


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const clearButton = document.getElementById("clearButton");

ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = brushSize.value;

let isDrawing = false;
let lastX = 0;
let lastY = 0;

colorPicker.addEventListener("input", function () {
    ctx.strokeStyle = colorPicker.value;
});

brushSize.addEventListener("input", function () {
    ctx.lineWidth = brushSize.value;
});

clearButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

canvas.addEventListener("mousedown", function (event) {
    isDrawing = true;
    const pos = getMousePos(event);
    lastX = pos.x;
    lastY = pos.y;
});

canvas.addEventListener("mousemove", function (event) {
    if (!isDrawing) {
        return;
    }

    const pos = getMousePos(event);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastX = pos.x;
    lastY = pos.y;
});

canvas.addEventListener("mouseup", function () {
    isDrawing = false;
});

canvas.addEventListener("mouseleave", function () {
    isDrawing = false;
});

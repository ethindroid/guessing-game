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

function getPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function startDrawing(x, y) {
    isDrawing = true;
    lastX = x;
    lastY = y;
}

function drawTo(x, y) {
    if (!isDrawing) {
        return;
    }

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
}

function stopDrawing() {
    isDrawing = false;
}

canvas.addEventListener("mousedown", function (event) {
    const pos = getPos(event.clientX, event.clientY);
    startDrawing(pos.x, pos.y);
});

canvas.addEventListener("mousemove", function (event) {
    const pos = getPos(event.clientX, event.clientY);
    drawTo(pos.x, pos.y);
});

canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

canvas.addEventListener("touchstart", function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    const pos = getPos(touch.clientX, touch.clientY);
    startDrawing(pos.x, pos.y);
});

canvas.addEventListener("touchmove", function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    const pos = getPos(touch.clientX, touch.clientY);
    drawTo(pos.x, pos.y);
});

canvas.addEventListener("touchend", function (event) {
    event.preventDefault();
    stopDrawing();
});

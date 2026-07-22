const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const brushToolButton = document.getElementById("brushToolButton");
const bucketToolButton = document.getElementById("bucketToolButton");
const fillCanvasButton = document.getElementById("fillCanvasButton");
const clearButton = document.getElementById("clearButton");

ctx.lineCap = "round";
ctx.lineJoin = "round";
ctx.strokeStyle = colorPicker.value;
ctx.lineWidth = brushSize.value;

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let currentTool = "brush";

colorPicker.addEventListener("input", function () {
    ctx.strokeStyle = colorPicker.value;
});

brushSize.addEventListener("input", function () {
    ctx.lineWidth = brushSize.value;
});

brushToolButton.addEventListener("click", function () {
    currentTool = "brush";
    brushToolButton.classList.add("active");
    bucketToolButton.classList.remove("active");
});

bucketToolButton.addEventListener("click", function () {
    currentTool = "bucket";
    bucketToolButton.classList.add("active");
    brushToolButton.classList.remove("active");
});

fillCanvasButton.addEventListener("click", function () {
    ctx.fillStyle = colorPicker.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
});

clearButton.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

function getPos(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: Math.floor((clientX - rect.left) * scaleX),
        y: Math.floor((clientY - rect.top) * scaleY)
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

function hexToRgb(hex) {
    const value = parseInt(hex.slice(1), 16);
    return {
        r: (value >> 16) & 255,
        g: (value >> 8) & 255,
        b: value & 255
    };
}

function colorsMatch(data, index, target, tolerance) {
    const dr = data[index] - target.r;
    const dg = data[index + 1] - target.g;
    const db = data[index + 2] - target.b;
    const da = data[index + 3] - target.a;
    return (dr * dr + dg * dg + db * db + da * da) <= tolerance * tolerance;
}

function floodFill(startX, startY) {
    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const startIndex = (startY * width + startX) * 4;
    const targetColor = {
        r: data[startIndex],
        g: data[startIndex + 1],
        b: data[startIndex + 2],
        a: data[startIndex + 3]
    };

    const fillColor = hexToRgb(colorPicker.value);
    fillColor.a = 255;

    if (colorsMatch(data, startIndex, fillColor, 0)) {
        return;
    }

    const stack = [[startX, startY]];

    while (stack.length > 0) {
        const [x, y] = stack.pop();

        if (x < 0 || x >= width || y < 0 || y >= height) {
            continue;
        }

        const index = (y * width + x) * 4;

        if (!colorsMatch(data, index, targetColor, 60)) {
            continue;
        }

        data[index] = fillColor.r;
        data[index + 1] = fillColor.g;
        data[index + 2] = fillColor.b;
        data[index + 3] = fillColor.a;

        stack.push([x + 1, y]);
        stack.push([x - 1, y]);
        stack.push([x, y + 1]);
        stack.push([x, y - 1]);
    }

    ctx.putImageData(imageData, 0, 0);
}

canvas.addEventListener("mousedown", function (event) {
    const pos = getPos(event.clientX, event.clientY);
    if (currentTool === "bucket") {
        floodFill(pos.x, pos.y);
    } else {
        startDrawing(pos.x, pos.y);
    }
});

canvas.addEventListener("mousemove", function (event) {
    if (currentTool !== "brush") {
        return;
    }
    const pos = getPos(event.clientX, event.clientY);
    drawTo(pos.x, pos.y);
});

canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

canvas.addEventListener("touchstart", function (event) {
    event.preventDefault();
    const touch = event.touches[0];
    const pos = getPos(touch.clientX, touch.clientY);
    if (currentTool === "bucket") {
        floodFill(pos.x, pos.y);
    } else {
        startDrawing(pos.x, pos.y);
    }
});

canvas.addEventListener("touchmove", function (event) {
    event.preventDefault();
    if (currentTool !== "brush") {
        return;
    }
    const touch = event.touches[0];
    const pos = getPos(touch.clientX, touch.clientY);
    drawTo(pos.x, pos.y);
});

canvas.addEventListener("touchend", function (event) {
    event.preventDefault();
    stopDrawing();
});

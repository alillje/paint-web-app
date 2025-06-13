const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const brushSizeInput = document.getElementById("brushSize");
const brushValue = document.getElementById("brushValue");
let isPainting = false;
let brushSize = brushSizeInput.value;
let brushColor = "black";
let lastX = 0;
let lastY = 0;

// Set canvas actual size to match CSS size
function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function getTouchPos(touchEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

canvas.addEventListener("mousedown", (e) => {
  isPainting = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  drawDot(lastX, lastY);
});

canvas.addEventListener("mouseup", () => (isPainting = false));
canvas.addEventListener("mouseleave", () => (isPainting = false));
canvas.addEventListener("mousemove", draw);

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  isPainting = true;
  const pos = getTouchPos(e);
  [lastX, lastY] = [pos.x, pos.y];
  drawDot(lastX, lastY);
});

canvas.addEventListener("touchend", () => (isPainting = false));
canvas.addEventListener("touchcancel", () => (isPainting = false));
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!isPainting) return;
  const pos = getTouchPos(e);
  drawLine(pos.x, pos.y);
});

brushSizeInput.addEventListener("input", (e) => {
  brushSize = e.target.value;
  brushValue.textContent = brushSize;
});

document.querySelectorAll(".color-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    brushColor = btn.dataset.color;
  });
});

function draw(e) {
  if (!isPainting) return;
  drawLine(e.offsetX, e.offsetY);
}

function drawLine(x, y) {
  ctx.strokeStyle = brushColor;
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(x, y);
  ctx.stroke();

  [lastX, lastY] = [x, y];
}

function drawDot(x, y) {
  ctx.fillStyle = brushColor;
  ctx.beginPath();
  ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

document.getElementById("resetCanvas").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let painting = false;
let level = 1;
let painted = 0;
let total = 0;

let roller = { x: 200, y: 400 };

let mask;

function generateHouse() {
    ctx.clearRect(0, 0, 400, 500);

    // Wand
    ctx.fillStyle = "#ddd";
    ctx.fillRect(80, 150, 240, 250);

    // Dach
    ctx.fillStyle = "#8B0000";
    ctx.beginPath();
    ctx.moveTo(80, 150);
    ctx.lineTo(200, 60);
    ctx.lineTo(320, 150);
    ctx.fill();

    // Fenster
    ctx.fillStyle = "#87CEFA";
    ctx.fillRect(110, 200, 50, 50);
    ctx.fillRect(240, 200, 50, 50);

    // Tür
    ctx.fillStyle = "#654321";
    ctx.fillRect(170, 300, 60, 100);

    mask = ctx.getImageData(0, 0, 400, 500);

    total = 0;
    for (let i = 0; i < mask.data.length; i += 4) {
        if (mask.data[i] === 221) total++;
    }
}

generateHouse();

function paint(x, y) {
    let size = 15;

    ctx.fillStyle = "#4CAF50";
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();

    painted += size * 2;
}

canvas.addEventListener("mousedown", () => painting = true);
canvas.addEventListener("mouseup", () => painting = false);
canvas.addEventListener("mousemove", e => {
    if (!painting) return;
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    roller.x = x;
    roller.y = y;
    paint(x, y);
});

canvas.addEventListener("touchstart", () => painting = true);
canvas.addEventListener("touchend", () => painting = false);
canvas.addEventListener("touchmove", e => {
    let rect = canvas.getBoundingClientRect();
    let x = e.touches[0].clientX - rect.left;
    let y = e.touches[0].clientY - rect.top;
    roller.x = x;
    roller.y = y;
    paint(x, y);
});

function drawRoller() {
    ctx.fillStyle = "#333";
    ctx.fillRect(roller.x - 5, roller.y - 25, 10, 20);

    ctx.fillStyle = "#4CAF50";
    ctx.fillRect(roller.x - 15, roller.y - 10, 30, 10);
}

function update() {
    drawRoller();

    let progress = Math.min(100, Math.floor((painted / total) * 100));
    document.getElementById("progress").innerText = progress + "%";
    document.getElementById("fill").style.width = progress + "%";

    if (progress >= 90) {
        level++;
        document.getElementById("level").innerText = level;
        painted = 0;
        generateHouse();
    }

    requestAnimationFrame(update);
}

update();

"use strict";

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d", { alpha: false });

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}
const GRAVITY = 0.02;
const FRICTION = 0.99;

// Objects
class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
    }
    
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    
    update() {
        this.draw();

        // Multiply x and y velocities by friction
        this.velocity.x *= FRICTION;
        this.velocity.y *= FRICTION;
        // Add gravity to y velocity
        this.velocity.y += GRAVITY;
        // Update x and y positions
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        // Reduce alpha value continuously
        this.alpha -= 0.005;
        
    }
}

// Implementation
let particles;
const particleCount = 450;
const POWER = 20;
// Ring effect
const angleIncrement = Math.PI * 2 / particleCount;

function init() {
    // Reset val
    particles = [];
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    ctx.fillStyle = "rgba(0,0,0, .05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        // Remove particle if its alpha val is less than 0.
        if (particles[i].alpha < 0) {
            particles.splice(i, 1);
        } else {
            particles[i].update();
        }
    }
}

init();
animate();

// Event Listeners
document.addEventListener("click", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(
            mouse.x,
            mouse.y,
            3,
            `hsl(${Math.random() * 360}, 50%, 50%)`,
            {
                x: Math.cos(angleIncrement * i) * Math.random() * POWER,
                y: Math.sin(angleIncrement * i) * Math.random() * POWER
            }
        ));
    }
});

window.addEventListener("resize", () => {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;

    init();
});
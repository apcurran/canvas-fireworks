"use strict";

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d", { alpha: false });

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};
const GRAVITY = 0.02;
const FRICTION = 0.99;

class Particle {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.radius = 3;
        this.color = "#fff";
        this.velocity = { x: 0, y: 0 };
        this.alpha = 0;
        this.active = false;
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

    /**
     * @param {number} x 
     * @param {number} y 
     * @param {number} angle 
     */
    reset(x, y, angle) {
        this.x = x;
        this.y = y;
        this.radius = 3;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        this.velocity.x = Math.cos(angle) * Math.random() * POWER;
        this.velocity.y = Math.sin(angle) * Math.random() * POWER;
        this.alpha = 1;
        this.active = true;
    }

    update() {
        if (!this.active) {
            return;
        }

        this.draw();
        this.velocity.x *= FRICTION;
        this.velocity.y *= FRICTION;
        this.velocity.y += GRAVITY;
        // Update x and y positions
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        // Reduce alpha value continuously to cause fading
        this.alpha -= 0.005;

        // CULLING: mark faded OR offscreen particles to skip rendering
        if (
            this.alpha <= 0 ||
            this.x + this.radius < 0 ||
            this.x - this.radius > canvas.width ||
            this.y + this.radius < 0 ||
            this.y - this.radius > canvas.height
        ) {
            this.active = false;
        }
    }
}

// Global vars
let particles = [];
const particleCount = 450;
const POWER = 20;
const angleIncrement = Math.PI * 2 / particleCount; // Ring effect

function init() {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    // Reset val
    particles = [];
}

// Main animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = "rgba(0,0,0, .05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
}

/**
 * @param {MouseEvent} event 
 */
function handleClick(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    let createdParticles = 0;

    for (let i = 0; i < particles.length && createdParticles < particleCount; i++) {
        // if there is an inactive particle, re-use it
        // reset to the current mouse click's position
        if (!particles[i].active) {
            particles[i].reset(mouse.x, mouse.y, angleIncrement * createdParticles);
            // increment counter
            createdParticles++;
        }
    }

    // if there are not enough particles, create more
    while (createdParticles < particleCount) {
        const particle = new Particle();
        particle.reset(mouse.x, mouse.y, angleIncrement * createdParticles);
        particles.push(particle);
        // increment counter
        createdParticles++;
    }
}

init();
animate();

document.addEventListener("click", handleClick);
window.addEventListener("resize", init);
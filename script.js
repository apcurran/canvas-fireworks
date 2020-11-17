"use strict";

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

// Event Listeners

window.addEventListener("resize", () => {
  canvas.width = document.documentElement.clientWidth;
  canvas.height = document.documentElement.clientHeight;

  init();
})

// Objects
class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.draw();
  }
}

// Implementation
let particles;

function init() {
  particles = [];


}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particles.length; i++) {
      particles[i].update();
  }
}

init();
animate();

document.addEventListener("click", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    const particleCount = 400;

    // Ring effect
    const angleIncrement = Math.PI * 2 / particleCount;

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(
            mouse.x,
            mouse.y,
            5,
            "purple",
            { x: Math.cos(angleIncrement * i) * Math.random(), y: Math.sin(angleIncrement * i) * Math.random() }
        ));
    }

    console.log(particles);
});
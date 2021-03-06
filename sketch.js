let particleSize = 5;

let width = 400;
let height = 800;

let fr = 30;
let cnv;
let z = 0;

let totalParticles = 2000;

let particles = [];
let quadTree;

function setup() {
  frameRate(fr);

  // create dom
  cnv = createCanvas(width, height);
  quadTree = new QuadTree(0, 0, width, height);

  // let numberOfCircles = random(totalParticles);
  for (let i = 0; i < totalParticles; i++) {
    particles.push(
      new Particle(
        random(particleSize, width - particleSize),
        random(particleSize, height - particleSize),
        particleSize,
        random(100)
      )
    );
  }
}

function draw() {
  background(50);

  noStroke();
  for (let i = 0; i < totalParticles; i++) {
    quadTree.insert(particles[i]);
    particles[i].move();
    particles[i].show();
    // for (let j = i + 1; j < totalParticles; j++) {
    //   if (particles[i].collides(particles[j])) {
    //     particles[i].resolveCollision(particles[j]);
    //   }
    // }
  }
  quadTree.checkCollision();
  // quadTree.show();
  quadTree.empty();
}

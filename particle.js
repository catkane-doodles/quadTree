function mod(n, m) {
  return ((n % m) + m) % m;
}

class Particle {
  constructor(x, y, diameter, z) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.mass = 1;
    this.diameter = diameter;
    this.radius = diameter / 2;
    this.z = z;
  }

  collides(p) {
    return this.pos.dist(p.pos) < this.radius + p.radius;
  }

  rotate(velocity, angle) {
    const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
    };

    return rotatedVelocities;
  }

  resolveCollision(p) {
    const xVelocityDiff = this.vel.x - p.vel.x;
    const yVelocityDiff = this.vel.y - p.vel.y;

    const xDist = p.pos.x - this.pos.x;
    const yDist = p.pos.y - this.pos.y;

    // Prevent accidental overlap of thiss
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
      // Grab angle between the two colliding thiss
      const angle = -Math.atan2(p.pos.y - this.pos.y, p.pos.x - this.pos.x);

      // Store mass in var for better readability in collision equation
      const m1 = this.mass;
      const m2 = p.mass;

      // Velocity before equation
      const u1 = this.rotate(this.vel, angle);
      const u2 = this.rotate(p.vel, angle);

      // Velocity after 1d collision equation
      const v1 = {
        x: (u1.x * (m1 - m2)) / (m1 + m2) + (u2.x * 2 * m2) / (m1 + m2),
        y: u1.y,
      };

      const v2 = {
        x: (u2.x * (m1 - m2)) / (m1 + m2) + (u1.x * 2 * m2) / (m1 + m2),
        y: u2.y,
      };

      // Final vel after rotating axis back to original location
      const vFinal1 = this.rotate(v1, -angle);
      const vFinal2 = this.rotate(v2, -angle);

      // Swap this velocities for realistic bounce effect
      this.vel.x = vFinal1.x;
      this.vel.y = vFinal1.y;

      p.vel.x = vFinal2.x;
      p.vel.y = vFinal2.y;
    }
  }

  show() {
    fill(0);
    circle(this.pos.x, this.pos.y, this.diameter);
  }

  move() {
    this.pos.add(this.vel);
    this.z += 0.01;

    this.vel.x =
      this.pos.x + this.radius > width || this.pos.x - this.radius < 0
        ? -this.vel.x
        : this.vel.x;
    this.vel.y =
      this.pos.y + this.radius > height || this.pos.y - this.radius < 0
        ? -this.vel.y
        : this.vel.y;
  }
}

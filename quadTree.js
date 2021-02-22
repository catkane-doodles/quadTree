class QuadTree {
  constructor(x, y, width, height) {
    this.center = createVector(x + width / 2, y + width / 2);
    this.x = x;
    this.y = y;
    this.dim = createVector(width / 2, height / 2);
    this.width = width;
    this.height = height;

    this.points = [];
    this.divided = false;
    this.capacity = 4;
    this.subtrees = [];
  }

  show() {
    noFill();
    stroke(255);
    // rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);
    for (let tree of this.subtrees) {
      tree.show();
    }
  }

  // inside(p) {
  //   let relative_p_pos = p5.Vector.sub(this.center, p.pos);
  //   let q = vector_abs(relative_p_pos).sub(this.dim);
  //   let d = vector_max(q).mag() + min(vector_maxcomp(q), 0);
  //   return d < 0;
  // }
  inside(p) {
    let x = p.pos.x;
    let y = p.pos.y;

    let w = this.width;
    let h = this.height;

    return (
      x + p.radius < this.x + w &&
      x - p.radius >= this.x &&
      y + p.radius < this.y + h &&
      y - p.radius >= this.y
    );
  }

  insert(p) {
    // check if point belongs here
    if (!this.inside(p)) {
      return false;
    }
    if (!this.divided) {
      if (this.points.length < this.capacity) {
        this.points.push(p);
      } else {
        // create subtrees
        // top left
        this.subtrees.push(
          new QuadTree(this.x, this.y, this.width / 2, this.height / 2)
        );
        // top right
        this.subtrees.push(
          new QuadTree(
            this.x + this.width / 2,
            this.y,
            this.width / 2,
            this.height / 2
          )
        );
        // bottom left
        this.subtrees.push(
          new QuadTree(
            this.x,
            this.y + this.height / 2,
            this.width / 2,
            this.height / 2
          )
        );
        // bottom right
        this.subtrees.push(
          new QuadTree(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2,
            this.height / 2
          )
        );
        // becomes divided
        this.divided = true;
        // push current points into subtrees
        for (let existing_point of this.points) {
          for (let tree of this.subtrees) {
            if (tree.insert(existing_point)) {
              continue;
            }
          }
        }
        // empty out point array
        this.points.length = 0;
        // DO NOT push new point into subtree
      }
    }
    if (this.divided) {
      // push new point into subtrees
      for (let tree of this.subtrees) {
        if (tree.insert(p)) {
          continue;
        }
      }
    }
    return true;
  }
  empty() {
    this.points = [];
    this.divided = false;
    this.capacity = 4;
    this.subtrees = [];
  }
}

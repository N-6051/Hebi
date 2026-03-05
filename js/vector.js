class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(a) {
    return new Vector(this.x+a.x, this.y+a.y);
  }

  sub(a) {
    return new Vector(this.x-a.x, this.y-a.y);
  }

  mult(t) {
    return new Vector(this.x*t, this.y*t);
  }

  unit() {
    if (this.mag() == 0) {
      return new Vector(0, 0);
    }
    return this.mult(1/this.mag());
  }

  floor() {
    return new Vector(Math.floor(this.x), Math.floor(this.y));
  }

  normal() {
    return new Vector(-this.y, this.x).unit();
  }

  mag() {
    return Math.hypot(this.x, this.y);
  }

  angle() {
    return Math.atan(this.y/this.x);
  }

  rotate(angle) {
    let theta = this.angle() + angle;
    return new Vector(Math.cos(theta), Math.sin(theta)).mult(this.mag());
  }
  
  lerp(target, vel) {
    return target.sub(this).unit().mult(vel);
  }

  // displacement vector from a to b
  static disp(a, b) {
    return b.sub(a);
  }

  static angleBtw(a, b) {
    return Math.acos(Vector.dot(a, b)/(a.mag()*b.mag()));
  }

  static dot(a, b) {
    return a.x*b.x + a.y*b.y;
  }

  static dist(a, b) {
    return Vector.disp(a, b).mag();
  }

  draw(ctx, pos = new Vector(0, 0), len = this.mag(), color = "blue") {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(pos.x, pos.y);
    let v = this.unit().mult(len).add(pos);
    ctx.lineTo(v.x, v.y);
    ctx.stroke();
    ctx.closePath();
  }

  drawDot(ctx, r = 5, color = "blue") {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(this.x, this.y, r, 0, Math.PI*2);
    ctx.fill();
    ctx.closePath();
  }

}
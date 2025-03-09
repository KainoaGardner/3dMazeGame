import { pos } from "./global";

export class SpikeBall {
  x: number;
  y: number;
  angle: number = 0;
  length: number;
  speed: number;
  origin: pos;

  constructor(length: number, speed: number, origin: pos, angle: number = 0) {
    this.length = length;
    this.speed = speed;
    this.origin = origin;
    this.angle = (angle * Math.PI) / 180;
    this.x = this.origin.x + this.length * Math.sin(this.angle);
    this.y = this.origin.y + this.length * Math.cos(this.angle);
  }

  update() {
    this.x = this.origin.x + this.length * Math.sin(this.angle);
    this.y = this.origin.y + this.length * Math.cos(this.angle);

    this.angle += this.speed;
  }
}

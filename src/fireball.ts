import { levelSettings } from "./levels";
export class Fireball {
  x: number;
  y: number;
  velX: number;
  velY: number;
  alive: boolean = true;
  reflect: boolean = false;

  constructor(x: number, y: number, velX: number, velY: number) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }

  update(map: number[][]) {
    const blockY = Math.floor(this.x);
    const blockX = Math.floor(this.y);

    if (
      this.x >= 0 &&
      this.x < map.length &&
      this.y >= 0 &&
      this.y < map[0].length &&
      (map[blockY][blockX] === 0 || map[blockY][blockX] === 5)
    ) {
      this.x += this.velX;
      this.y += this.velY;
    } else {
      this.alive = false;
    }
  }
}

export class FireballWall {
  x: number;
  y: number;
  velX: number;
  velY: number;
  timer: number;
  counter: number;

  constructor(
    x: number,
    y: number,
    velX: number,
    velY: number,
    timer: number,
    counter: number = 0,
  ) {
    this.x = x;
    this.y = y;

    this.velX = velX;
    this.velY = velY;
    this.timer = timer;
    this.counter = counter;
  }

  update(ls: levelSettings) {
    if (this.counter == this.timer) {
      const fireball = new Fireball(this.x, this.y, this.velX, this.velY);
      const sprite = { x: this.x, y: this.y, texture: 0, type: fireball };
      ls.sprites.push(sprite);
      this.counter = 0;
    }
    this.counter++;
  }
}

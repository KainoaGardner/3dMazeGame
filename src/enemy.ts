import { levelSettings } from "./levels";
import { Fireball } from "./fireball";
// export class Skeleton {
//   x: number;
//   y: number;
//   velX: number;
//   velY: number;
//   alive: boolean = true;
//   reflect: boolean = false;
//
//   constructor(x: number, y: number, velX: number, velY: number) {
//     this.x = x;
//     this.y = y;
//     this.velX = velX;
//     this.velY = velY;
//   }
//
//   update(map: number[][]) {
//     const blockY = Math.floor(this.x);
//     const blockX = Math.floor(this.y);
//
//     if (
//       this.x >= 0 &&
//       this.x < map.length &&
//       this.y >= 0 &&
//       this.y < map[0].length &&
//       (map[blockY][blockX] === 0 || map[blockY][blockX] === 5)
//     ) {
//       this.x += this.velX;
//       this.y += this.velY;
//     } else {
//       this.alive = false;
//     }
//   }
// }

export class Mage {
  x: number;
  y: number;
  health: number;
  shootCount = 0;
  shootTimer;
  fireballSpeed: number;
  alive: boolean = true;

  constructor(
    x: number,
    y: number,
    health: number,
    fireballSpeed: number,
    shootTimer: number,
    shootCount: number = 0,
  ) {
    this.x = x;
    this.y = y;
    this.fireballSpeed = fireballSpeed;
    this.health = health;
    this.shootTimer = shootTimer;
    this.shootCount = shootCount;
  }

  update(ls: levelSettings) {
    // if (this.shootCount > this.shootTimer - 20){
    // }
    if (this.shootCount >= this.shootTimer) {
      const xDif = ls.player.posX - this.x + (Math.random() * 1 - 0.5);
      const yDif = ls.player.posY - this.y + Math.random() * 1 - 0.5;
      const angle = Math.atan2(yDif, xDif);
      const xVel = this.fireballSpeed * Math.cos(angle);
      const yVel = this.fireballSpeed * Math.sin(angle);

      const fireball = new Fireball(this.x, this.y, xVel, yVel);
      const sprite = { x: this.x, y: this.y, texture: 0, type: fireball };
      ls.sprites.push(sprite);
      this.shootCount = 0;
    }
    this.shootCount++;
  }
}

// export class Lurker {
//   x: number;
//   y: number;
//   velX: number;
//   velY: number;
//   alive: boolean = true;
//   reflect: boolean = false;
//
//   constructor(x: number, y: number, velX: number, velY: number) {
//     this.x = x;
//     this.y = y;
//     this.velX = velX;
//     this.velY = velY;
//   }
//
//   update(map: number[][]) {
//     const blockY = Math.floor(this.x);
//     const blockX = Math.floor(this.y);
//
//     if (
//       this.x >= 0 &&
//       this.x < map.length &&
//       this.y >= 0 &&
//       this.y < map[0].length &&
//       (map[blockY][blockX] === 0 || map[blockY][blockX] === 5)
//     ) {
//       this.x += this.velX;
//       this.y += this.velY;
//     } else {
//       this.alive = false;
//     }
//   }
// }

// export class Tank {
//   x: number;
//   y: number;
//
//   alive: boolean = true;
//
//   constructor(x: number, y: number) {
//     this.x = x;
//     this.y = y;
//   }
//
//   update(map: number[][]) {
//     const blockY = Math.floor(this.x);
//     const blockX = Math.floor(this.y);
//
//     if (
//       this.x >= 0 &&
//       this.x < map.length &&
//       this.y >= 0 &&
//       this.y < map[0].length &&
//       (map[blockY][blockX] === 0 || map[blockY][blockX] === 5)
//     ) {
//     } else {
//       this.alive = false;
//     }
//   }
// }

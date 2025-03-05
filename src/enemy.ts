import { levelSettings } from "./levels";
import { Fireball } from "./fireball";
import { pos } from "./global";

const dir: pos[] = [
  { x: 0, y: -1 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 1, y: 0 },
];

class Enemy {
  x: number;
  y: number;
  health: number;
  speed: number;
  agroDist: number;
  deadCounter = 0;
  alive: boolean = true;
  movePos: pos;
  moveCounter = 0;
  hurtCounter = 0;

  constructor(
    x: number,
    y: number,
    health: number,
    speed: number = 0,
    agroDist: number = 0,
  ) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.movePos = { x: x, y: x };
    this.health = health;
    this.agroDist = agroDist;
  }

  takeDamage(damage: number) {
    this.health -= damage;
    this.hurtCounter = 1;
    if (this.health <= 0) {
      this.deadCounter = 1;
    }
  }

  moveUpdate(playerPos: pos, map: number[][]) {
    const moveSpeed = this.speed / 100;
    if (this.moveCounter === 0) {
      const newPos = this.getNextPos(
        { x: Math.floor(playerPos.x), y: Math.floor(playerPos.y) },
        map,
      );
      this.movePos = { x: newPos.x + 0.5, y: newPos.y + 0.5 };
    }
    this.moveCounter++;
    if (this.moveCounter === 30) {
      this.moveCounter = 0;
    }

    const distance = Math.sqrt(
      (this.x - this.movePos.y) * (this.x - this.movePos.y) +
        (this.y - this.movePos.x) * (this.y - this.movePos.x),
    );
    if (distance < moveSpeed) {
      this.x = this.movePos.y;
      this.y = this.movePos.x;
    } else {
      const xDif = this.x - this.movePos.y;
      const yDif = this.y - this.movePos.x;
      const angle = Math.atan2(yDif, xDif);
      const moveX = moveSpeed * Math.cos(angle);
      const moveY = moveSpeed * Math.sin(angle);
      this.x -= moveX;
      this.y -= moveY;
    }
  }

  getNextPos(playerPos: pos, map: number[][]) {
    const m = map.length;
    const n = map[0].length;
    const parent: pos[][] = new Array(m)
      .fill(null)
      .map(() => Array(n).fill(undefined));

    const enemyPos = { x: Math.floor(this.y), y: Math.floor(this.x) };
    parent[enemyPos.y][enemyPos.x] = enemyPos;
    const queue: pos[] = [enemyPos];

    let depth = 0;
    while (queue.length > 0) {
      for (let i = 0; i < queue.length; i++) {
        let pos = queue.shift();

        if (pos !== undefined) {
          if (pos.x === playerPos.y && pos.y === playerPos.x) {
            const path: pos[] = [];
            while (pos) {
              path.push(pos);
              pos = parent[pos.y][pos.x];
              if (pos.x === enemyPos.x && pos.y === enemyPos.y) {
                break;
              }
            }
            if (path.length > 1) {
              return path[path.length - 2];
            }
            return path[path.length - 1];
          }

          for (let j = 0; j < dir.length; j++) {
            const newPos = { x: pos.x + dir[j].x, y: pos.y + dir[j].y };
            if (
              newPos.x >= 0 &&
              newPos.x < n &&
              newPos.y >= 0 &&
              newPos.y < m &&
              parent[newPos.y][newPos.x] === undefined &&
              map[newPos.y][newPos.x] === 0
            ) {
              parent[newPos.y][newPos.x] = pos;
              queue.push(newPos);
            }
          }
          let newPos = { x: pos.x - 1, y: pos.y - 1 };
          if (
            newPos.x >= 0 &&
            newPos.x < n &&
            newPos.y >= 0 &&
            newPos.y < m &&
            parent[newPos.y][newPos.x] === undefined &&
            map[newPos.y][newPos.x] === 0 &&
            map[pos.y - 1][pos.x] === 0 &&
            map[pos.y][pos.x - 1] === 0
          ) {
            parent[newPos.y][newPos.x] = pos;
            queue.push(newPos);
          }

          newPos = { x: pos.x - 1, y: pos.y + 1 };
          if (
            newPos.x >= 0 &&
            newPos.x < n &&
            newPos.y >= 0 &&
            newPos.y < m &&
            parent[newPos.y][newPos.x] === undefined &&
            map[newPos.y][newPos.x] === 0 &&
            map[pos.y + 1][newPos.x] === 0 &&
            map[pos.y][pos.x - 1] === 0
          ) {
            parent[newPos.y][newPos.x] = pos;
            queue.push(newPos);
          }
          newPos = { x: pos.x + 1, y: pos.y - 1 };
          if (
            newPos.x >= 0 &&
            newPos.x < n &&
            newPos.y >= 0 &&
            newPos.y < m &&
            parent[newPos.y][newPos.x] === undefined &&
            map[newPos.y][newPos.x] === 0 &&
            map[pos.y - 1][pos.x] === 0 &&
            map[pos.y][pos.x + 1] === 0
          ) {
            parent[newPos.y][newPos.x] = pos;
            queue.push(newPos);
          }
          newPos = { x: pos.x + 1, y: pos.y + 1 };
          if (
            newPos.x >= 0 &&
            newPos.x < n &&
            newPos.y >= 0 &&
            newPos.y < m &&
            parent[newPos.y][newPos.x] === undefined &&
            map[newPos.y][newPos.x] === 0 &&
            map[pos.y + 1][pos.x] === 0 &&
            map[pos.y][pos.x + 1] === 0
          ) {
            parent[newPos.y][newPos.x] = pos;
            queue.push(newPos);
          }
        }
      }
      depth++;
      if (depth >= this.agroDist) {
        return enemyPos;
      }
    }
    return enemyPos;
  }

  hurtUpdate() {
    if (this.deadCounter >= 20) {
      this.alive = false;
    }
    if (this.deadCounter !== 0) {
      this.deadCounter++;
    }

    if (this.hurtCounter === 10) {
      this.hurtCounter = 0;
    }
    if (this.hurtCounter !== 0) {
      this.hurtCounter++;
    }
  }
}

export class Slime extends Enemy {
  walkCounter = 0;
  constructor(
    x: number,
    y: number,
    health: number,
    speed: number,
    agroDist: number,
  ) {
    super(x, y, health, speed, agroDist);
  }

  walkCounterUpdate() {
    if (this.walkCounter >= 30) {
      this.walkCounter = 0;
    }
    this.walkCounter++;
  }
}

export class Mage extends Enemy {
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
    super(x, y, health);
    this.fireballSpeed = fireballSpeed;
    this.shootTimer = shootTimer;
    this.shootCount = shootCount;
  }

  update(ls: levelSettings) {
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

import { levelSettings } from "./levels";
import { Slime, Mage, Ghost, Skeleton } from "./enemy";
import { Boss } from "./boss";
import { sfxSounds } from "./sounds";

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

  reflectDamage(ls: levelSettings) {
    if (this.reflect) {
      for (let i = 0; i < ls.sprites.length; i++) {
        const sprite = ls.sprites[i];
        if (
          sprite.type instanceof Mage ||
          sprite.type instanceof Slime ||
          sprite.type instanceof Ghost ||
          sprite.type instanceof Skeleton ||
          sprite.type instanceof Boss
        ) {
          const distance = Math.sqrt(
            (this.x - sprite.x) * (this.x - sprite.x) +
            (this.y - sprite.y) * (this.y - sprite.y),
          );
          if (distance < 1) {
            sprite.type.takeDamage(200);
            if (ls.player.ammo < 10 && sprite.type.health <= 0) {
              sfxSounds[1].play();
              ls.player.ammo++;
            }
            this.alive = false;
            break;
          }
        }
      }
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

      const distance = Math.sqrt(
        (this.x - ls.player.posX) * (this.x - ls.player.posX) +
        (this.y - ls.player.posY) * (this.y - ls.player.posY),
      );

      if (distance < 5) {
        sfxSounds[21].pause();
        sfxSounds[21].currentTime = 0;
        sfxSounds[21].play();
      }

    }
    this.counter++;
  }
}

import { levelSettings } from "./levels";
import { level7BlockHit } from "./level7";
import { Slime, Mage, Ghost, Skeleton } from "./enemy";
import { Boss } from "./boss";
import { sfxSounds } from "./sounds";

export class Bullet {
  x: number;
  y: number;
  velX: number;
  velY: number;
  alive: boolean = true;

  constructor(x: number, y: number, velX: number, velY: number) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }

  update(ls: levelSettings) {
    const blockY = Math.floor(this.x);
    const blockX = Math.floor(this.y);

    const map = ls.map.map;
    if (
      this.x >= 0 &&
      this.x < map.length &&
      this.y >= 0 &&
      this.y < map[0].length
    ) {
      if (map[blockY][blockX] === 0) {
        this.x += this.velX;
        this.y += this.velY;
      } else if (
        map[blockY][blockX] === 10 ||
        map[blockY][blockX] === 11 ||
        map[blockY][blockX] === 12
      ) {
        ls.map.map[blockY][blockX] = 0;
        this.alive = false;
        sfxSounds[2].play();
      } else if (
        (ls.level === 7 && map[blockY][blockX] === 8) ||
        map[blockY][blockX] === 9
      ) {
        level7BlockHit(blockY, blockX, ls);
        this.alive = false;
        sfxSounds[2].pause();
        sfxSounds[2].currentTime = 0;
        sfxSounds[2].play();
      } else {
        this.alive = false;
      }
    } else {
      this.alive = false;
    }
  }

  hitEnemy(ls: levelSettings) {
    for (let i = 0; i < ls.sprites.length; i++) {
      const sprite = ls.sprites[i].type;
      if (
        sprite instanceof Ghost ||
        sprite instanceof Slime ||
        sprite instanceof Mage ||
        sprite instanceof Skeleton ||
        sprite instanceof Boss
      ) {
        if (!sprite.alive || sprite.deadCounter !== 0) {
          continue;
        }
        const distance = Math.sqrt(
          (sprite.x - this.x) * (sprite.x - this.x) +
          (sprite.y - this.y) * (sprite.y - this.y),
        );

        if (distance < 0.6) {
          sprite.takeDamage(150);
          sfxSounds[26].play()
          this.alive = false;
          break;
        }
      }
    }
  }
}


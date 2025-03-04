import { Fireball } from "./fireball";
import { levelSettings } from "./levels";
import { Teleport } from "./player";
import { Slime, Mage } from "./enemy";
interface sprite {
  x: number;
  y: number;
  texture: number;
  type: any;
}

interface spriteOrder {
  index: number;
  distance: number;
}

const spriteDistance: spriteOrder[] = [];

function sortSprites(spriteDistance: spriteOrder[]) {
  spriteDistance.sort((a, b) => {
    if (a.distance < b.distance) {
      return -1;
    }
    if (a.distance > b.distance) {
      return 1;
    }
    return 0;
  });
}

function spriteUpdate(ls: levelSettings) {
  for (let i = ls.sprites.length - 1; i > -1; i--) {
    const sprite = ls.sprites[i];
    if (ls.sprites[i].type instanceof Fireball) {
      sprite.type.update(ls.map.map);
      sprite.type.reflectDamage(ls.sprites);
      sprite.x = sprite.type.x;
      sprite.y = sprite.type.y;

      if (!sprite.type.alive) {
        ls.sprites.splice(i, 1);
      }
    } else if (ls.sprites[i].type instanceof Teleport) {
      if (!sprite.type.alive) {
        ls.sprites.splice(i, 1);
      }
    } else if (ls.sprites[i].type instanceof Mage) {
      sprite.type.update(ls);
      if (sprite.type.shootCount > sprite.type.shootTimer - 15) {
        sprite.texture = 4;
      } else {
        sprite.texture = 3;
      }

      if (!sprite.type.alive) {
        ls.sprites.splice(i, 1);
      }
    } else if (ls.sprites[i].type instanceof Slime) {
      sprite.type.walkCounterUpdate();
      sprite.type.hurtUpdate();
      if (sprite.type.hurtCounter > 0) {
        sprite.texture = 7;
      } else if (sprite.type.walkCounter > 15) {
        sprite.texture = 6;
      } else {
        sprite.texture = 5;
      }
      if (!sprite.type.alive) {
        ls.sprites.splice(i, 1);
      }
    }
  }
}

export {
  sortSprites,
  type sprite,
  type spriteOrder,
  spriteDistance,
  spriteUpdate,
};

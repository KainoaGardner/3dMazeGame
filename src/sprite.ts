import { Fireball } from "./fireball";
import { levelSettings } from "./levels";
import { Teleport } from "./player";
import { Slime, Mage } from "./enemy";
import { pos } from "./global";
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
      if (sprite.type.deadCounter === 0) {
        sprite.type.update(ls);
      }

      sprite.type.hurtUpdate();

      if (sprite.type.deadCounter > 0 && sprite.type.deadCounter < 10) {
        sprite.texture = 6;
      } else if (sprite.type.deadCounter > 9) {
        sprite.texture = 7;
      } else if (sprite.type.shootCount > sprite.type.shootTimer - 15) {
        sprite.texture = 4;
      } else if (sprite.type.hurtCounter > 0) {
        sprite.texture = 5;
      } else {
        sprite.texture = 3;
      }

      if (!sprite.type.alive) {
        ls.sprites.splice(i, 1);
      }
    } else if (ls.sprites[i].type instanceof Slime) {
      if (sprite.type.deadCounter === 0) {
        sprite.x = sprite.type.x;
        sprite.y = sprite.type.y;

        sprite.type.walkCounterUpdate();
        sprite.type.moveUpdate(
          { x: ls.player.posX, y: ls.player.posY },
          ls.map.map,
        );
      }

      sprite.type.hurtUpdate();
      if (sprite.type.deadCounter > 0 && sprite.type.deadCounter < 10) {
        sprite.texture = 11;
      } else if (sprite.type.deadCounter > 9) {
        sprite.texture = 12;
      } else if (sprite.type.hurtCounter > 0) {
        sprite.texture = 10;
      } else if (sprite.type.walkCounter > 15) {
        sprite.texture = 9;
      } else {
        sprite.texture = 8;
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

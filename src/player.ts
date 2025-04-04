import { sprite, spriteDistance, sortSprites, HornItem } from "./sprite";
import { keyMap } from "./keypress";
import { Fireball } from "./fireball";
import { Map } from "./map";
import { setLevel, levelSettings } from "./levels";
import { Slime, Mage, Ghost, Skeleton } from "./enemy";
import { Boss } from "./boss";
import { SpikeBall } from "./spikeball";
import { Bullet } from "./bullet";
import { level7BlockHit } from "./level7";
import { pauseAudio } from "./util";

import {
  texWidth,
  texHeight,
  spriteTexWidth,
  spriteTexHeight,
  wallTextures,
  bgTextures,
  spriteTextures,
  gunImg,
  gunShootImg,
  gunInvImg,
  sheildImg,
  sheildInvImg,
  hornInvImg,
  hornImg,
  hornOnImg,
  swordImgs,
  swordInvImg,
  dashInvImg,
  errorImg,
  flashlightImg,
  flashlightoffImg,
  flashLightInvImg,
  clockInvImg,
  clockPlacedInvImg,
  shootImgs,
  ammoImg,
} from "./textures";

import {
  sfxSounds,
} from "./sounds";

import {
  canvas,
  c,
  buffer,
  settings,
  invisBlockBuffer,
  zBuffer,
  pos,
} from "./global";

import { drawImage } from "./util";

interface distanceOutput {
  distance: number;
  texX: number;
  wallType: number;
  side: number;
  otherDistance: number;
  pos: pos;
}

interface playerInv {
  flashlight: boolean;
  gun: boolean;
  run: boolean;
  horn: boolean;
  sword: boolean;
  sheild: boolean;
  dash: boolean;
  teleport: boolean;
}

export class Teleport {
  alive = true;
}

export class Player {
  posX: number;
  posY: number;
  dirX = -1;
  dirY = 0;
  planeX: number = 0;
  planeY: number = 1;

  radius: number;
  walkSpeed: number;
  speed: number;
  turnSpeed: number;
  health: number = 1000;
  stamina: number = 1000;

  reloadTimer = 1000;

  inventory: playerInv;

  private teleportPlaced: boolean = false;
  private teleportX = 0;
  private teleportY = 0;


  private hit: number = 0;
  private fireballHit: number = 0;

  private dashCount = 0;
  private reflect: boolean = false;
  private running: boolean = false;
  private tired: boolean = false;

  private viewDist: number = 32;

  private battery: number = 1000;
  private flashlight: boolean = true;

  private sheild: boolean = false;
  private sheildCounter = 1000;
  private sheildBreak = false;

  private horn = false;

  private swordHit: boolean = false;
  private gunCounter = 0;
  private swordCounter = 0;
  ammo: number = 10;
  private ammoCounter = 0;

  holding: number = 1;
  //0 nothing 3 gun 1 flashlight 2 sword

  private walkSoundCounter = 0;


  constructor(
    x: number,
    y: number,
    radius: number,
    speed: number,
    turnSpeed: number,
    inventory: playerInv,
  ) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.walkSpeed = speed;
    this.speed = speed;
    this.turnSpeed = turnSpeed;

    this.inventory = inventory;
  }

  private clearBuffer() {
    for (let i = 0; i < settings.graphicsHeight; i++) {
      for (let j = 0; j < settings.graphicsWidth; j++) {
        buffer[i][j] = undefined;
      }
    }
  }

  private drawBuffer() {
    for (let i = 0; i < settings.graphicsHeight; i++) {
      for (let j = 0; j < settings.graphicsWidth; j++) {
        if (buffer[i][j] !== undefined) {
          const red = buffer[i][j][0];
          const green = buffer[i][j][1];
          const blue = buffer[i][j][2];
          const color = `rgb(${red} ${green} ${blue})`;
          c.fillStyle = color;

          c.fillRect(
            j * settings.bufferRatio,
            i * settings.bufferRatio,
            settings.bufferRatio,
            settings.bufferRatio,
          );
        }
      }
    }
  }

  draw(scale: number, blockSize: number): void {
    c.beginPath();
    c.arc(
      this.posX * scale * blockSize,
      this.posY * scale * blockSize,
      this.radius * scale,
      0,
      2 * Math.PI,
    );
    c.fillStyle = "red";
    c.fill();

    c.lineWidth = 2;
    c.strokeStyle = "white";

    c.beginPath();
    c.moveTo(
      (this.posX + this.dirX + this.planeX) * scale * blockSize,
      (this.posY + this.dirY + this.planeY) * scale * blockSize,
    );
    c.lineTo(
      (this.posX + this.dirX - this.planeX) * scale * blockSize,
      (this.posY + this.dirY - this.planeY) * scale * blockSize,
    );
    c.stroke();
  }

  private drawBG(ls: levelSettings) {
    const floorTex = ls.floorTex
    const ceilingTex = ls.ceilingTex
    const levelBrightness = ls.map.brightness

    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < settings.graphicsHeight; y++) {
      const rayDirX0 = this.dirX - this.planeX;
      const rayDirY0 = this.dirY - this.planeY;
      const rayDirX1 = this.dirX + this.planeX;
      const rayDirY1 = this.dirY + this.planeY;

      let p = y - settings.graphicsHeight / 2;
      const posZ = settings.graphicsHeight / 2;

      const rowDistance = posZ / p;

      const floorStepX = (rowDistance * (rayDirX1 - rayDirX0)) / settings.graphicsWidth;
      const floorStepY = (rowDistance * (rayDirY1 - rayDirY0)) / settings.graphicsWidth;

      let floorX = this.posX + rowDistance * rayDirX0;
      let floorY = this.posY + rowDistance * rayDirY0;


      let brightness: number;
      if (
        this.viewDist === 64 ||
        (this.gunCounter > 0 && this.gunCounter < 15 && this.holding === 3)
      ) {
        if (ls.level === 4) {
          brightness =
            ((p - levelBrightness) / (settings.graphicsHeight / 2)) *
            ((p - levelBrightness) / (settings.graphicsHeight / 2)) *
            2;
        } else {
          brightness = ((p - levelBrightness) / (settings.graphicsHeight / 2)) * 5;
        }
      } else {
        if (ls.level === 4) {
          brightness =
            ((p - levelBrightness) / (settings.graphicsHeight / 2)) *
            ((p - levelBrightness) / (settings.graphicsHeight / 2)) /
            2;
        } else {
          brightness = (p - levelBrightness) / (settings.graphicsHeight / 2);
        }
      }

      brightness = Math.abs(brightness)
      if (brightness > 1) {
        brightness = 1
      }

      for (let x = 0; x < settings.graphicsWidth; x++) {
        const cellX = Math.floor(floorX);
        const cellY = Math.floor(floorY);

        const tX = Math.floor(texWidth * (floorX - cellX));
        const tY = Math.floor(texHeight * (floorY - cellY));

        floorX += floorStepX;
        floorY += floorStepY;

        let color = bgTextures[floorTex][texWidth * tY + tX];
        let red = 0;
        let green = 0;
        let blue = 0;
        if (color) {
          red = color[0]
          green = color[1]
          blue = color[2]

          red = Math.floor(red * brightness)
          green = Math.floor(green * brightness)
          blue = Math.floor(blue * brightness)
        }

        buffer[y][x] = [red, green, blue];
        color = bgTextures[ceilingTex][texWidth * tY + tX];

        if (color) {
          red = color[0]
          green = color[1]
          blue = color[2]

          red = Math.floor(red * brightness)
          green = Math.floor(green * brightness)
          blue = Math.floor(blue * brightness)
        } buffer[settings.graphicsHeight - y - 1][x] = [red, green, blue];
      }
    }
  }

  private drawSprites(sprites: sprite[]) {
    for (let i = 0; i < sprites.length; i++) {
      spriteDistance[i] = { index: 0, distance: 0 };
      spriteDistance[i].index = i;
      spriteDistance[i].distance =
        (this.posX - sprites[i].x) * (this.posX - sprites[i].x) +
        (this.posY - sprites[i].y) * (this.posY - sprites[i].y);
    }
    sortSprites(spriteDistance);

    const invDet = 1 / (this.planeX * this.dirY - this.dirX * this.planeY);
    for (let i = sprites.length - 1; i > -1; i--) {
      if (sprites[spriteDistance[i].index] === undefined) {
        continue;
      }
      const spriteX = sprites[spriteDistance[i].index].x - this.posX;
      const spriteY = sprites[spriteDistance[i].index].y - this.posY;

      const transformX = invDet * (this.dirY * spriteX - this.dirX * spriteY);
      const transformY =
        invDet * (-this.planeY * spriteX + this.planeX * spriteY);

      const spriteScreenX = Math.floor(
        (settings.graphicsWidth / 2) * (1 + transformX / transformY),
      );

      const spriteHeight = Math.abs(Math.floor(settings.graphicsHeight / transformY));
      let drawStartY = Math.floor(-spriteHeight / 2 + settings.graphicsHeight / 2);
      if (drawStartY < 0) drawStartY = 0;
      let drawEndY = Math.floor(spriteHeight / 2 + settings.graphicsHeight / 2);
      if (drawEndY >= settings.graphicsHeight) drawEndY = settings.graphicsHeight - 1;

      const spriteWidth = Math.abs(Math.floor(settings.graphicsHeight / transformY));
      let drawStartX = Math.floor(-spriteWidth / 2 + spriteScreenX);
      if (drawStartX < 0) drawStartX = 0;
      let drawEndX = Math.floor(spriteWidth / 2 + spriteScreenX);
      if (drawEndX >= settings.graphicsWidth) drawEndX = settings.graphicsWidth - 1;

      for (let x = drawStartX; x < drawEndX; x++) {
        if (
          transformY > 0 &&
          x > 0 &&
          x < settings.graphicsWidth) {
          const texX = Math.floor(
            (256 * (x - (-spriteWidth / 2 + spriteScreenX)) * spriteTexWidth) /
            spriteWidth /
            256,
          );

          for (let y = drawStartY; y < drawEndY; y++) {
            if (transformY < zBuffer[y][x]) {
              const d = y * 256 - settings.graphicsHeight * 128 + spriteHeight * 128;
              const texY = Math.floor((d * spriteTexHeight) / spriteHeight / 256);
              const color =
                spriteTextures[sprites[spriteDistance[i].index].texture][
                spriteTexWidth * texY + texX
                ];
              if (
                color !== undefined &&
                !(color[0] === 0 && color[1] === 255 && color[2] === 0)
              ) {
                zBuffer[y][x] = transformY;
                buffer[y][x] = color;
              }

            }
          }
        }
      }
    }
  }

  private drawWalls(
    map: number[][],
    lights: pos[],
    levelBrightness: number,
    sprites: sprite[],
  ) {
    for (let x = 0; x < settings.graphicsWidth; x++) {
      const result = this.distance(x, map);
      for (let y = 0; y < settings.graphicsHeight; y++) {
        zBuffer[y][x] = result.distance;
      }

      const height = Math.floor(settings.graphicsHeight / result.distance);
      let drawStart = Math.floor(-height / 2 + settings.graphicsHeight / 2);
      if (drawStart < 0) {
        drawStart = 0;
      }
      let drawEnd = Math.floor(height / 2 + settings.graphicsHeight / 2);
      if (drawEnd >= settings.graphicsHeight) {
        drawEnd = settings.graphicsHeight - 1;
      }

      let brightness = this.getBrightness(result, lights, sprites);
      let alpha = 0;
      if (
        this.viewDist === 64 ||
        (this.gunCounter > 0 && this.gunCounter < 15 && this.holding === 3)
      ) {
        const middle = Math.abs(x - settings.graphicsWidth / 2) / settings.graphicsWidth / 2;

        alpha = (brightness / 15 + middle * 3) / (levelBrightness * 5);
      } else {
        alpha = brightness / 4 / (levelBrightness * 5);
      }

      if (alpha > 1) {
        alpha = 1;
      }

      let texNum = result.wallType - 1;
      if (texNum > wallTextures.length) {
        texNum = 0;
      }

      const step = texHeight / height;
      let texPos = (drawStart - settings.graphicsHeight / 2 + height / 2) * step;

      for (let y = drawStart; y <= drawEnd; y++) {
        const texY = Math.floor(texPos);
        texPos += step;

        let color = wallTextures[texNum][texHeight * texY + result.texX];
        if (color !== undefined) {
          let red = color[0];
          let green = color[1];
          let blue = color[2];

          if (result.side === 1) {
            red -= 30;
            green -= 30;
            blue -= 30;
          }

          red = Math.floor(red * (1 - alpha))
          green = Math.floor(green * (1 - alpha))
          blue = Math.floor(blue * (1 - alpha))

          buffer[y][x] = [red, green, blue];
        } else {
          buffer[y][x] = undefined;
        }
      }

      if (result.otherDistance !== -1) {
        const otherHeight = Math.floor(canvas.height / result.otherDistance);
        invisBlockBuffer[x] = otherHeight;
      }
    }
  }

  private clearInvisBlockBuffer() {
    for (let i = 0; i < settings.graphicsWidth; i++) {
      invisBlockBuffer[i] = 0;
    }
  }

  private drawInvisBlockBuffer() {
    c.globalAlpha = 0.8;
    c.fillStyle = "black";
    for (let i = 0; i < settings.graphicsWidth; i++) {
      if (invisBlockBuffer[i] !== 0) {
        c.fillRect(
          i * settings.bufferRatio,
          canvas.height / 2 - invisBlockBuffer[i] / 2,
          settings.bufferRatio,
          invisBlockBuffer[i],
        );
      }
    }
    c.globalAlpha = 1;
  }

  private drawHoldingEffectUi() {
    if (this.gunCounter > 0 && this.gunCounter < 10 && this.holding === 3) {
      c.globalAlpha = 0.1;
      c.fillStyle = "#f39c12";
      c.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (this.swordCounter > 0 && this.swordCounter < 35 && this.reflect) {
      c.strokeStyle = "#e74c3c";

      c.lineWidth = 1000;
      c.beginPath();
      c.arc(
        canvas.width / 2,
        canvas.height / 2,
        settings.UIRatio * this.swordCounter * this.swordCounter,
        0,
        2 * Math.PI,
      );

      c.globalAlpha = 0.75;

      c.stroke();
      c.globalAlpha = 1;
    }
  }

  drawView(ls: levelSettings) {
    this.clearBuffer();
    this.clearInvisBlockBuffer();

    this.drawBG(ls);
    this.drawWalls(ls.map.map, ls.map.lightList, ls.map.brightness, ls.sprites);
    this.drawSprites(ls.sprites);

    this.drawBuffer();
    this.drawInvisBlockBuffer();
  }

  private getBrightness(
    result: distanceOutput,
    lights: pos[],
    sprites: sprite[],
  ): number {
    let min = Infinity;
    //on purpose switch x y
    const wallY = result.pos.x;
    const wallX = result.pos.y;

    for (let i = 0; i < lights.length; i++) {
      const lightY = lights[i].y;
      const lightX = lights[i].x;

      const distance = Math.sqrt(
        (wallY - lightY) * (wallY - lightY) +
        (wallX - lightX) * (wallX - lightX),
      );

      if (distance < min) {
        min = distance;
      }
    }

    for (let i = 0; i < sprites.length; i++) {
      if (
        sprites[i].type instanceof Fireball ||
        sprites[i].type instanceof Ghost
      ) {
        const spriteY = sprites[i].type.x;
        const spriteX = sprites[i].type.y;

        const distance = Math.sqrt(
          (wallY - spriteY) * (wallY - spriteY) +
          (wallX - spriteX) * (wallX - spriteX),
        );

        if (distance < min) {
          min = distance;
        }
      }
    }

    const playerDistance = Math.sqrt(
      (this.posX - wallY) * (this.posX - wallY) +
      (this.posY - wallX) * (this.posY - wallX),
    );

    if (playerDistance < min) {
      min = playerDistance;
    }
    return min;
  }

  private distance(x: number, map: number[][]): distanceOutput {
    const result: distanceOutput = {
      distance: -1,
      texX: -1,
      wallType: -1,
      side: 0,
      otherDistance: -1,
      pos: { x: -1, y: -1 },
    };

    const cameraX = (2 * x) / settings.graphicsWidth - 1;
    const rayDirX = this.dirX + this.planeX * cameraX;
    const rayDirY = this.dirY + this.planeY * cameraX;

    let mapX = Math.floor(this.posX);
    let mapY = Math.floor(this.posY);

    let sideDistX: number;
    let sideDistY: number;

    let deltaDistX = Math.abs(1 / rayDirX);
    let deltaDistY = Math.abs(1 / rayDirY);
    let perpWallDist: number;

    let stepX: number;
    let stepY: number;

    let hit = 0;
    let side = 0;

    if (rayDirX < 0) {
      stepX = -1;
      sideDistX = (this.posX - mapX) * deltaDistX;
    } else {
      stepX = 1;
      sideDistX = (mapX + 1 - this.posX) * deltaDistX;
    }
    if (rayDirY < 0) {
      stepY = -1;
      sideDistY = (this.posY - mapY) * deltaDistY;
    } else {
      stepY = 1;
      sideDistY = (mapY + 1 - this.posY) * deltaDistY;
    }

    while (hit === 0) {
      if (sideDistX < sideDistY) {
        sideDistX += deltaDistX;
        mapX += stepX;
        side = 0;
      } else {
        sideDistY += deltaDistY;
        mapY += stepY;
        side = 1;
      }
      if (map[mapX][mapY] === 3 && result.otherDistance === -1) {
        if (side === 0) {
          result.otherDistance = sideDistX - deltaDistX;
        } else {
          result.otherDistance = sideDistY - deltaDistY;
        }
      }
      if (map[mapX][mapY] !== 0 && map[mapX][mapY] !== 3) {
        hit = 1;
      }
    }

    result.side = side;
    result.wallType = map[mapX][mapY];

    if (side === 0) {
      perpWallDist = sideDistX - deltaDistX;
    } else {
      perpWallDist = sideDistY - deltaDistY;
    }

    result.distance = perpWallDist;

    let wallX: number;
    if (side === 0) {
      wallX = this.posY + perpWallDist * rayDirY;
      result.pos.x = mapX;
      result.pos.y = wallX;
    } else {
      wallX = this.posX + perpWallDist * rayDirX;
      result.pos.x = wallX;
      result.pos.y = mapY;
    }
    wallX -= Math.floor(wallX);

    let texX = Math.floor(wallX * texWidth);
    if (side === 0 && rayDirX > 0) {
      texX = texWidth - texX - 1;
    }
    if (side === 1 && rayDirY < 0) {
      texX = texWidth - texX - 1;
    }

    result.texX = texX;

    return result;
  }

  private drawFlashBeamUi() {
    if (this.viewDist === 64) {
      c.globalAlpha = 0.05;
      c.fillStyle = "#f1c40f";
      c.fillRect(0, 0, canvas.width, canvas.height);

      c.globalAlpha = 0.05;
      c.fillStyle = "white";
      c.beginPath();
      c.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height / 2,
        0,
        2 * Math.PI,
      );
      c.fill();

      c.beginPath();
      c.arc(
        canvas.width / 2,
        canvas.height - 30 * settings.UIRatio,
        25 * settings.UIRatio,
        0,
        2 * Math.PI,
      );
      c.fill();

      c.globalAlpha = 1;
    }
  }

  private drawHoldingUi() {
    let recoil = 0;
    if (this.gunCounter !== 0 && this.holding === 3) {
      recoil = 1 - (100 / this.gunCounter) * 3;
    }

    let running = 0;
    if (this.running) running = settings.UIRatio * 20;
    if (this.holding === 3 && this.inventory.gun) {
      if (this.gunCounter < 20 && this.gunCounter > 0) {
        c.drawImage(
          gunShootImg,
          canvas.width / 2 - 28 * settings.UIRatio,
          canvas.height - 52 * settings.UIRatio + recoil * 2 + running,
          56 * settings.UIRatio,
          56 * settings.UIRatio,
        );
      } else {
        c.drawImage(
          gunImg,
          canvas.width / 2 - 28 * settings.UIRatio,
          canvas.height - 52 * settings.UIRatio + recoil * 2 + running,
          56 * settings.UIRatio,
          56 * settings.UIRatio,
        );
      }
    } else if (this.holding === 1 && this.inventory.flashlight) {
      if (this.viewDist === 64) {
        c.drawImage(
          flashlightImg,
          canvas.width / 2 - 25 * settings.UIRatio,
          canvas.height - 40 * settings.UIRatio + running,
          50 * settings.UIRatio,
          40 * settings.UIRatio,
        );
      } else {
        c.drawImage(
          flashlightoffImg,
          canvas.width / 2 - 25 * settings.UIRatio,
          canvas.height - 40 * settings.UIRatio + running,
          50 * settings.UIRatio,
          40 * settings.UIRatio,
        );
      }
    } else if (this.holding === 2 && this.inventory.sword) {
      if (this.swordCounter > 0 && this.swordCounter < 20) {
        c.drawImage(
          swordImgs[2],
          canvas.width / 2 - 16 * settings.UIRatio,
          canvas.height - 120 * settings.UIRatio + running,
          settings.UIRatio * 128,
          settings.UIRatio * 128,
        );
      } else if (this.swordCounter > 19 && this.swordCounter < 40) {
        c.drawImage(
          swordImgs[1],
          canvas.width / 2 - 64 * settings.UIRatio,
          canvas.height - 128 * settings.UIRatio + running,
          settings.UIRatio * 128,
          settings.UIRatio * 128,
        );
      } else if (this.swordCounter > 39 && this.swordCounter < 60) {
        c.drawImage(
          swordImgs[3],
          canvas.width / 2 - 100 * settings.UIRatio,
          canvas.height - 128 * settings.UIRatio + running,
          settings.UIRatio * 128,
          settings.UIRatio * 128,
        );
      } else {
        c.drawImage(
          swordImgs[0],
          canvas.width / 2 - 64 * settings.UIRatio,
          canvas.height - 120 * settings.UIRatio + running,
          settings.UIRatio * 128,
          settings.UIRatio * 128,
        );
      }
    } else if (this.holding === 4 && this.inventory.sheild) {
      if (this.sheild) {
        c.drawImage(
          sheildImg,
          canvas.width / 2 - 64 * settings.UIRatio,
          canvas.height - 100 * settings.UIRatio + recoil + running,
          128 * settings.UIRatio,
          128 * settings.UIRatio,
        );
      } else {
        c.drawImage(
          sheildImg,
          canvas.width / 2 - 64 * settings.UIRatio,
          canvas.height - 32 * settings.UIRatio + recoil + running,
          128 * settings.UIRatio,
          128 * settings.UIRatio,
        );
      }
    } else if (this.holding === 5) {
      if (keyMap.get("Space")) {
        c.drawImage(
          hornOnImg,
          canvas.width / 2 - 28 * settings.UIRatio,
          canvas.height - 56 * settings.UIRatio + recoil + running,
          56 * settings.UIRatio,
          56 * settings.UIRatio,
        );
      } else {
        c.drawImage(
          hornImg,
          canvas.width / 2 - 28 * settings.UIRatio,
          canvas.height - 56 * settings.UIRatio + recoil + running,
          56 * settings.UIRatio,
          56 * settings.UIRatio,
        );
      }
    }
  }

  private drawShootingUi() {
    if (this.gunCounter > 0 && this.gunCounter < 20) {
      c.drawImage(
        shootImgs[0],
        canvas.width / 2 - 16 * settings.UIRatio,
        canvas.height - 70 * settings.UIRatio,
        32 * settings.UIRatio,
        32 * settings.UIRatio,
      );
    } else if (this.gunCounter > 19 && this.gunCounter < 30) {
      c.drawImage(
        shootImgs[1],
        canvas.width / 2 - 16 * settings.UIRatio,
        canvas.height - 70 * settings.UIRatio,
        32 * settings.UIRatio,
        32 * settings.UIRatio,
      );
    }
  }

  private drawInvUi() {
    c.globalAlpha = 1;
    c.fillStyle = "#7f8c8d";
    if (this.inventory.flashlight) {
      c.fillRect(
        2 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }

    if (this.inventory.sword) {
      c.fillRect(
        22 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }
    if (this.inventory.gun) {
      c.fillRect(
        42 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }
    if (this.inventory.sheild) {
      c.fillRect(
        62 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }
    if (this.inventory.horn) {
      c.fillRect(
        82 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }
    if (this.inventory.dash) {
      c.fillRect(
        canvas.width - 82 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }
    if (this.inventory.teleport) {
      c.fillRect(
        canvas.width - 102 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }

    c.globalAlpha = 1;

    if (this.inventory.flashlight) {
      c.drawImage(
        flashLightInvImg,
        2 * settings.UIRatio,
        canvas.height - 21 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }
    if (this.inventory.sword) {
      c.drawImage(
        swordInvImg,
        22 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }

    if (this.inventory.gun) {
      c.drawImage(
        gunInvImg,
        42 * settings.UIRatio,
        canvas.height - 21 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }

    if (this.inventory.sheild) {
      c.drawImage(
        sheildInvImg,
        62 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }

    if (this.inventory.horn) {
      c.drawImage(
        hornInvImg,
        82 * settings.UIRatio,
        canvas.height - 21.5 * settings.UIRatio,
        19 * settings.UIRatio,
        19 * settings.UIRatio,
      );
    }

    if (this.inventory.dash) {
      c.drawImage(
        dashInvImg,
        canvas.width - 82 * settings.UIRatio,
        canvas.height - 21 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }

    if (this.inventory.teleport) {
      if (this.teleportPlaced) {
        c.drawImage(
          clockPlacedInvImg,
          canvas.width - 102 * settings.UIRatio,
          canvas.height - 21 * settings.UIRatio,
          20 * settings.UIRatio,
          20 * settings.UIRatio,
        );
      } else {
        c.drawImage(
          clockInvImg,
          canvas.width - 102 * settings.UIRatio,
          canvas.height - 21 * settings.UIRatio,
          20 * settings.UIRatio,
          20 * settings.UIRatio,
        );
      }
    }
    c.globalAlpha = 0.75;
    c.fillStyle = "black";
    if (this.inventory.flashlight && this.battery < 1000) {
      c.fillRect(
        2 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio + settings.UIRatio * (this.battery / 1000) * 20,
        20 * settings.UIRatio,
        20 * settings.UIRatio - settings.UIRatio * (this.battery / 1000) * 20,
      );
    }

    if (this.inventory.sword && this.swordCounter > 0) {
      c.fillRect(
        22 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio + settings.UIRatio * (this.swordCounter / 100) * 20,
        20 * settings.UIRatio,
        20 * settings.UIRatio - settings.UIRatio * (this.swordCounter / 100) * 20,
      );
    }

    if (this.inventory.gun && this.gunCounter > 0) {
      c.fillRect(
        42 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio + settings.UIRatio * (this.gunCounter / 100) * 20,
        20 * settings.UIRatio,
        20 * settings.UIRatio - settings.UIRatio * (this.gunCounter / 100) * 20,
      );
    }

    if (this.inventory.sheild && this.sheildCounter < 1000) {
      c.fillRect(
        62 * settings.UIRatio,
        canvas.height -
        22 * settings.UIRatio +
        settings.UIRatio * (this.sheildCounter / 1000) * 20,
        20 * settings.UIRatio,
        20 * settings.UIRatio - settings.UIRatio * (this.sheildCounter / 1000) * 20,
      );
    }
    if (this.inventory.dash && this.dashCount > 0) {
      c.fillRect(
        canvas.width - 82 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio + 20 * settings.UIRatio * (this.dashCount / 50),
        20 * settings.UIRatio,
        20 * settings.UIRatio - settings.UIRatio * (this.dashCount / 50) * 20,
      );
    }

    if (this.inventory.dash && this.tired) {
      c.fillRect(
        canvas.width - 82 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio + 20 * settings.UIRatio * (this.stamina / 1000),
        20 * settings.UIRatio,
        20 * settings.UIRatio - settings.UIRatio * (this.stamina / 1000) * 20,
      );
    }

    c.globalAlpha = 1;
    c.fillStyle = "#e74c3c";
    c.strokeStyle = "black";
    c.lineWidth = 2 * settings.UIRatio / 10
    c.font = `bold ${8 * settings.UIRatio}px Kappa20`


    if (this.inventory.flashlight) {
      c.fillText("1", 5 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
      c.strokeText("1", 5 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
    }

    if (this.inventory.sword) {
      c.fillText("2", 25 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
      c.strokeText("2", 25 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
    }

    if (this.inventory.gun) {
      c.fillText("3", 45 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
      c.strokeText("3", 45 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
    }

    if (this.inventory.sheild) {
      c.fillText("4", 65 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
      c.strokeText("4", 65 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
    }

    if (this.inventory.horn) {
      c.fillText("5", 85 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
      c.strokeText("5", 85 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
    }

    if (this.inventory.dash) {
      c.fillText("E", canvas.width - 79 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
      c.strokeText("E", canvas.width - 79 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
    }
    if (this.inventory.teleport) {
      c.fillText("Q", canvas.width - 99 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
      c.strokeText("Q", canvas.width - 99 * settings.UIRatio, canvas.height - 6 * settings.UIRatio);
    }

    c.globalAlpha = 1;
    c.beginPath();
    c.lineWidth = 3;
    c.strokeStyle = "#e74c3c";
    if (this.holding === 1 && this.inventory.flashlight) {
      c.rect(
        2 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
      c.stroke();
    }
    if (this.holding === 2 && this.inventory.sword) {
      c.rect(
        22 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
      c.stroke();
    }
    if (this.holding === 3 && this.inventory.gun) {
      c.rect(
        42 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
      c.stroke();
    }
    if (this.holding === 4 && this.inventory.sheild) {
      c.rect(
        62 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
      c.stroke();
    }
    if (this.holding === 5 && this.inventory.horn) {
      c.rect(
        82 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
      c.stroke();
    }
    if (this.dashCount === 0 && this.inventory.dash) {
      c.rect(
        canvas.width - 82 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }
    if (this.inventory.flashlight && !this.flashlight) {
      c.drawImage(
        errorImg,
        2 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }
    if (this.inventory.sheild && this.sheildBreak) {
      c.drawImage(
        errorImg,
        62 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }

    if (this.inventory.dash && this.tired) {
      c.drawImage(
        errorImg,
        canvas.width - 82 * settings.UIRatio,
        canvas.height - 22 * settings.UIRatio,
        20 * settings.UIRatio,
        20 * settings.UIRatio,
      );
    }
  }

  private drawAmmoUi() {
    for (let i = 0; i < this.ammo; i++) {
      drawImage(
        c,
        ammoImg,
        canvas.width - 13 * settings.UIRatio,
        canvas.height - 35 * settings.UIRatio - i * 8 * settings.UIRatio,
        7 * settings.UIRatio,
        16 * settings.UIRatio,
        -90,
      );
    }
  }

  private drawBatteryUi() {
    if (this.flashlight) {
      c.fillStyle = "#f1c40f";
    } else {
      c.fillStyle = "#b33939";
    }
  }

  private drawStaminaUi() {
    if (this.tired) {
      c.fillStyle = "#b33939";
    } else {
      c.fillStyle = "#2ecc71";
    }

    c.fillRect(
      canvas.width - (this.stamina / 1000) * 58 * settings.UIRatio - 2 * settings.UIRatio,
      canvas.height - 22 * settings.UIRatio,
      (this.stamina / 1000) * 58 * settings.UIRatio,
      9 * settings.UIRatio,
    );
  }

  private drawHealthUi() {
    c.fillStyle = "#e74c3c";
    c.fillRect(
      canvas.width - (this.health / 1000) * 58 * settings.UIRatio - 2 * settings.UIRatio,
      canvas.height - 11 * settings.UIRatio,
      (this.health / 1000) * 58 * settings.UIRatio,
      9 * settings.UIRatio,
    );
  }

  private drawRunUi() {
    if (
      this.running ||
      (this.dashCount > 0 &&
        this.dashCount < 10 &&
        (keyMap.get("ArrowUp") ||
          keyMap.get("ArrowDown") ||
          keyMap.get("KeyW") ||
          keyMap.get("KeyS")))
    ) {
      c.globalAlpha = 0.75;
      c.lineWidth = 100;
      c.strokeStyle = "black";
      c.beginPath();
      c.moveTo(0, 0);
      c.lineTo(canvas.width, 0);
      c.stroke();

      c.beginPath();
      c.moveTo(0, canvas.height);
      c.lineTo(canvas.width, canvas.height);
      c.stroke();
      c.globalAlpha = 1;
    }
  }

  private drawInBlockUi(map: number[][]) {
    const blockX = Math.floor(this.posY);
    const blockY = Math.floor(this.posX);

    if (map[blockY][blockX] === 7) {
      c.fillStyle = "#24135f";
      c.globalAlpha = 0.75;
      c.fillRect(0, 0, canvas.width, canvas.height);
    }
    if (map[blockY][blockX] === 3 || map[blockY][blockX] === 2) {
      c.fillStyle = "black";
      c.globalAlpha = 0.75;
      c.fillRect(0, 0, canvas.width, canvas.height);
    }

    c.globalAlpha = 1;
  }

  private drawDashUi() {
    c.strokeStyle = "black";
    c.lineWidth = 1000;
    c.globalAlpha = 0.8;
    if (
      this.dashCount > 0 &&
      this.dashCount < 5 &&
      (keyMap.get("ArrowUp") ||
        keyMap.get("ArrowDown") ||
        keyMap.get("KeyW") ||
        keyMap.get("KeyS"))
    ) {
      c.beginPath();
      c.arc(
        canvas.width / 2,
        canvas.height / 2,
        this.dashCount * this.dashCount * settings.UIRatio * 10,
        0,
        2 * Math.PI,
      );
      c.stroke();
    }
    c.globalAlpha = 1;
  }

  private drawFireballHitUi() {
    if (this.fireballHit > 0) {
      c.globalAlpha = 0.5;
      c.fillStyle = "#e67e22";

      c.fillRect(0, 0, canvas.width, canvas.height);

      c.globalAlpha = 1;
    }
  }
  private drawHitUi() {
    if (this.hit > 0) {
      c.globalAlpha = 0.1;
      c.fillStyle = "red";
      c.fillRect(0, 0, canvas.width, canvas.height);
      c.globalAlpha = 1;
    }
  }

  drawUi(map: number[][]) {
    this.drawHoldingEffectUi();
    if (!this.running) this.drawFlashBeamUi();

    if (this.inventory.run) this.drawRunUi();
    this.drawInBlockUi(map);
    this.drawFireballHitUi();
    this.drawHitUi();

    if (this.inventory.gun) this.drawAmmoUi();
    if (this.inventory.gun && this.holding === 3) this.drawShootingUi();

    // this.drawLevelUi(level);
    if (this.inventory.dash) this.drawDashUi();

    if (this.inventory.flashlight) this.drawBatteryUi();
    if (this.inventory.run) this.drawStaminaUi();
    this.drawHealthUi();

    this.drawHoldingUi();
    this.drawInvUi();
  }

  private useUpdate(ls: levelSettings) {
    if (keyMap.get("Space")) {
      if (!this.running) {
        if (this.holding === 1 && this.battery > 1 && this.flashlight) {
          if (this.viewDist !== 64) {
            sfxSounds[12].pause();
            sfxSounds[12].currentTime = 0;
            sfxSounds[12].play();
          }
          this.viewDist = 64;
          this.battery -= 5;
        }
        if (this.holding === 2) {
          if (this.swordCounter === 0) {
            const soundIndex = Math.floor(Math.random() * 5);
            sfxSounds[soundIndex + 5].play();
            this.swordCounter = 1;
            this.reflect = false;
          }
        }

        if (this.holding === 3) {
          if (this.ammo > 0 && this.gunCounter === 0) {
            sfxSounds[0].play();
            this.ammo--;
            this.gunCounter = 1;
            const speed = 1;
            const bullet = new Bullet(
              this.posX,
              this.posY,
              this.dirX * speed,
              this.dirY * speed,
            );

            const sprite = {
              x: this.posX,
              y: this.posY,
              texture: 18,
              type: bullet,
            };
            ls.sprites.push(sprite);
          }
        }
      }
      if (this.holding === 4) {
        if (!this.sheildBreak && this.sheildCounter > 0) {
          if (!this.sheild) {
            sfxSounds[16].pause()
            sfxSounds[16].currentTime = 0;

            sfxSounds[16].play()
          }
          this.sheildCounter -= 5;
          this.sheild = true;
        }
      }

      if (this.holding === 5) {
        if (!this.horn) {
          sfxSounds[17].play()
        }
        this.horn = true;
      }
    }
  }

  private hornUpdate() {
    if (this.horn && !keyMap.get("Space")) {
      sfxSounds[17].pause()
      sfxSounds[17].currentTime = 0
      this.horn = false;
    }
  }

  private moveUpdate(map: number[][]) {
    if (!this.inventory.run) {
      this.speed = this.walkSpeed;
      this.running = false;
    }
    if (
      this.inventory.run &&
      keyMap.get("ShiftLeft") &&
      (keyMap.get("ArrowUp") ||
        keyMap.get("KeyW") ||
        keyMap.get("ArrowDown") ||
        keyMap.get("KeyS")) &&
      !this.tired &&
      this.stamina > 0
    ) {
      this.speed = this.walkSpeed * 2;
      this.running = true;
      this.stamina -= 5;
    }

    if (
      this.dashCount === 0 &&
      this.stamina > 15 &&
      !this.tired &&
      keyMap.get("KeyE") &&
      (keyMap.get("ArrowUp") ||
        keyMap.get("ArrowDown") ||
        keyMap.get("KeyW") ||
        keyMap.get("KeyS"))
    ) {
      if (this.inventory.dash) {
        sfxSounds[14].play()
        this.dashCount = 1;
      }
    }

    if (keyMap.get("ArrowUp") || keyMap.get("KeyW")) {
      const forwardX =
        map[Math.floor(this.posX + this.dirX * this.speed * this.radius)][
        Math.floor(this.posY)
        ];
      const forwardY =
        map[Math.floor(this.posX)][
        Math.floor(this.posY + this.dirY * this.speed * this.radius)
        ];

      if (
        forwardX === 0 ||
        forwardX === 4 ||
        forwardX === 3 ||
        forwardX === 14
      ) {
        this.posX += this.dirX * this.speed;
      }
      if (
        forwardY === 0 ||
        forwardY === 4 ||
        forwardY === 3 ||
        forwardY === 14
      ) {
        this.posY += this.dirY * this.speed;
      }
    }

    const backwardX =
      map[Math.floor(this.posX)][
      Math.floor(this.posY - this.dirY * this.speed * this.radius)
      ];
    const backwardY =
      map[Math.floor(this.posX - this.dirX * this.speed * this.radius)][
      Math.floor(this.posY)
      ];

    if (keyMap.get("ArrowDown") || keyMap.get("KeyS")) {
      if (
        backwardX === 0 ||
        backwardX === 4 ||
        backwardX === 3 ||
        backwardX === 14
      ) {
        this.posY -= this.dirY * this.speed;
      }
      if (
        backwardY === 0 ||
        backwardY === 4 ||
        backwardY === 3 ||
        backwardY === 14
      ) {
        this.posX -= this.dirX * this.speed;
      }
    }

    if (keyMap.get("ArrowRight") || keyMap.get("KeyD")) {
      const oldDirX = this.dirX;
      this.dirX =
        this.dirX * Math.cos(-this.turnSpeed) -
        this.dirY * Math.sin(-this.turnSpeed);
      this.dirY =
        oldDirX * Math.sin(-this.turnSpeed) +
        this.dirY * Math.cos(-this.turnSpeed);

      const oldPlaneX = this.planeX;
      this.planeX =
        this.planeX * Math.cos(-this.turnSpeed) -
        this.planeY * Math.sin(-this.turnSpeed);
      this.planeY =
        oldPlaneX * Math.sin(-this.turnSpeed) +
        this.planeY * Math.cos(-this.turnSpeed);
    }

    if (keyMap.get("ArrowLeft") || keyMap.get("KeyA")) {
      const oldDirX = this.dirX;
      this.dirX =
        this.dirX * Math.cos(this.turnSpeed) -
        this.dirY * Math.sin(this.turnSpeed);
      this.dirY =
        oldDirX * Math.sin(this.turnSpeed) +
        this.dirY * Math.cos(this.turnSpeed);
      const oldPlaneX = this.planeX;
      this.planeX =
        this.planeX * Math.cos(this.turnSpeed) -
        this.planeY * Math.sin(this.turnSpeed);
      this.planeY =
        oldPlaneX * Math.sin(this.turnSpeed) +
        this.planeY * Math.cos(this.turnSpeed);
    }
  }

  private holdingUpdate() {
    let pressed = false;
    if (keyMap.get("Digit1") && this.inventory.flashlight) {
      pressed = true;
      this.holding = 1;
    } else if (keyMap.get("Digit2") && this.inventory.sword) {
      pressed = true;
      this.holding = 2;
    } else if (keyMap.get("Digit3") && this.inventory.gun) {
      pressed = true;
      this.holding = 3;
    } else if (keyMap.get("Digit4") && this.inventory.sheild) {
      pressed = true;
      this.holding = 4;
    } else if (keyMap.get("Digit5") && this.inventory.horn) {
      pressed = true;
      this.holding = 5;
    }

    if (pressed) {
      this.reflect = false;
      this.swordHit = false;
    }
  }

  private gunUpdate() {
    if (this.ammoCounter === this.reloadTimer) {
      if (this.ammo < 10) {
        sfxSounds[1].play();
        this.ammo += 1;
      }
      this.ammoCounter = 0;
    }
    this.ammoCounter += 1;

    if (this.gunCounter !== 0 && this.gunCounter < 100) {
      this.gunCounter += 5;
    }
    if (this.gunCounter >= 100) {
      this.swordHit = false;
      this.reflect = false;
      this.gunCounter = 0;
    }
  }

  private flashlightUpdate() {
    if (this.battery <= 0) {
      this.flashlight = false;
    }
    if (!this.flashlight && this.battery >= 1000) {
      this.flashlight = true;
    }

    if (
      !this.flashlight ||
      (this.holding === 1 && !keyMap.get("Space")) ||
      this.holding !== 1 ||
      this.running
    ) {
      if (this.viewDist === 64) {
        sfxSounds[13].pause();
        sfxSounds[13].currentTime = 0;
        sfxSounds[13].play()
      }
      this.viewDist = 16;
      if (this.battery < 1000) {
        this.battery += 3;
      }
    }
  }

  private staminaUpdate() {
    if (this.stamina <= 0) {
      this.tired = true;
    }
    if (this.tired && this.stamina >= 1000) {
      this.tired = false;
    }

    if (this.tired || !keyMap.get("ShiftLeft")) {
      this.speed = this.walkSpeed;
      this.running = false;
      if (this.stamina < 1000) {
        this.stamina += 5;
      }
    }
  }

  private inblockUpdate(map: number[][]) {
    const blockX = Math.floor(this.posY);
    const blockY = Math.floor(this.posX);

    if (map[blockY][blockX] === 7) {
      this.takeDamage(5);
      sfxSounds[36].play()
    }
  }

  goal(map: number[][]): boolean {
    const blockX = Math.floor(this.posY);
    const blockY = Math.floor(this.posX);

    if (map[blockY][blockX] === 4) {
      return true;
    }
    return false;
  }

  private breakBlock(ls: levelSettings) {
    let mine = false;
    const map = ls.map;
    const xHit = Math.floor(this.posX + this.dirX * 1);
    const yHit = Math.floor(this.posY + this.dirY * 1);
    const block = map.map[xHit][yHit];

    if (block === 10) {
      this.swordHit = true;
      map.map[xHit][yHit] = 11;
      mine = true;
    }
    if (block === 11) {
      this.swordHit = true;
      map.map[xHit][yHit] = 12;

      mine = true;
    }
    if (block === 12) {
      this.swordHit = true;
      map.map[xHit][yHit] = 0;

      mine = true;
    }

    if (block === 8 || block === 9) {
      mine = true;
      this.swordHit = true;
      if (ls.level === 7) {
        level7BlockHit(xHit, yHit, ls);
      }
    }

    if (mine) {
      sfxSounds[2].pause();
      sfxSounds[2].currentTime = 0;
      sfxSounds[2].play();
    }
  }

  private reflectProjectile(sprites: sprite[]) {
    let reflect = false;
    for (let i = 0; i < sprites.length; i++) {
      if (sprites[i].type instanceof Fireball) {
        const fireball = sprites[i].type;
        const invDet = 1 / (this.planeX * this.dirY - this.dirX * this.planeY);
        const spriteX = fireball.x - this.posX;
        const spriteY = fireball.y - this.posY;

        const transformX = invDet * (this.dirY * spriteX - this.dirX * spriteY);
        const transformY =
          invDet * (-this.planeY * spriteX + this.planeX * spriteY);

        if (Math.abs(transformX) < 1 && transformY > 0 && transformY < 1) {
          const fireballSpeed = Math.sqrt(
            fireball.velY * fireball.velY + fireball.velX * fireball.velX,
          );
          fireball.velY = this.dirY * fireballSpeed * 2;
          fireball.velX = this.dirX * fireballSpeed * 2;
          fireball.reflect = true;
          this.reflect = true;
          sprites[i].texture = 1;
          reflect = true;
        }
      }
    }

    if (reflect) {
      sfxSounds[3].play();
    }
  }

  private swordUpdate(ls: levelSettings) {
    if (
      this.holding === 2 &&
      this.swordCounter > 0 &&
      this.swordCounter < 10 &&
      !this.swordHit
    ) {
      this.breakBlock(ls);
      this.reflectProjectile(ls.sprites);
    }

    if (this.swordCounter !== 0 && this.swordCounter < 100) {
      this.swordCounter += 5;
    }
    if (this.swordCounter >= 100) {
      this.swordHit = false;
      this.reflect = false;
      this.swordCounter = 0;
    }
  }

  private dashUpdate(map: number[][]) {
    if (this.dashCount !== 0 && this.dashCount < 50) {
      this.dashCount++;
    }
    if (this.dashCount >= 50) {
      this.dashCount = 0;
    }

    if (
      this.dashCount > 0 &&
      this.dashCount < 5 &&
      this.stamina > 15 &&
      !this.tired
    ) {
      this.stamina -= 15;
      this.swordHit = false;

      for (let i = 0; i < 10; i++) {
        if (keyMap.get("ArrowUp") || keyMap.get("KeyW")) {
          const forwardX =
            map[
            Math.floor(this.posX + this.dirX * this.speed * this.radius * 1)
            ][Math.floor(this.posY)];
          const forwardY =
            map[Math.floor(this.posX)][
            Math.floor(this.posY + this.dirY * this.speed * this.radius * 1)
            ];

          if (forwardX === 0 || forwardX === 4) {
            this.posX += this.dirX * this.speed;
          }
          if (forwardY === 0 || forwardY === 4) {
            this.posY += this.dirY * this.speed;
          }
        } else if (keyMap.get("ArrowDown") || keyMap.get("KeyS")) {
          const backwardX =
            map[Math.floor(this.posX)][
            Math.floor(this.posY - this.dirY * this.speed * this.radius)
            ];
          const backwardY =
            map[Math.floor(this.posX - this.dirX * this.speed * this.radius)][
            Math.floor(this.posY)
            ];

          if (keyMap.get("ArrowDown") || keyMap.get("KeyS")) {
            if (backwardX === 0 || backwardX === 4) {
              this.posY -= this.dirY * this.speed;
            }
            if (backwardY === 0 || backwardY === 4) {
              this.posX -= this.dirX * this.speed;
            }
          }
        }
      }
    }
  }

  private hiddenBlockUpdate(map: Map) {
    for (let i = 0; i < map.map.length; i++) {
      for (let j = 0; j < map.map[0].length; j++) {
        const block = map.map[i][j];
        if (block === 2 && this.holding === 1 && this.viewDist === 64) {
          map.map[i][j] = 3;
        } else if (block === 3 && this.viewDist !== 64) {
          map.map[i][j] = 2;
        }
      }
    }
  }

  private sheildUpdate() {
    if (this.sheild && !keyMap.get("Space")) {
      sfxSounds[16].pause()
      sfxSounds[16].currentTime = 0;
      sfxSounds[16].play()
      this.sheild = false;
    }
    if (this.sheild) {
      if (this.health < 1000) {
        this.health += 2;
      }
    }

    if (this.sheildCounter <= 0) {
      this.sheildBreak = true;
      this.sheild = false;
      sfxSounds[16].pause()
      sfxSounds[16].currentTime = 0;
      sfxSounds[16].play()

    }
    if (this.sheildBreak && this.sheildCounter >= 1000) {
      this.sheildBreak = false;
    }

    if (
      this.sheildBreak ||
      (this.holding === 4 && !keyMap.get("Space")) ||
      this.holding !== 4
    ) {
      if (this.sheildCounter < 1000) {
        this.sheildCounter += 3;
      }
    }

  }

  private spriteCollisonUpdate(ls: levelSettings) {
    if (this.hit === 0) {
      for (let i = 0; i < ls.sprites.length; i++) {
        if (ls.sprites[i].type !== undefined) {
          const sprite = ls.sprites[i].type;
          const distance = Math.sqrt(
            (this.posX - sprite.x) * (this.posX - sprite.x) +
            (this.posY - sprite.y) * (this.posY - sprite.y),
          );
          let hit = distance < this.radius / 2;

          if (hit) {
            if (sprite instanceof Fireball) {
              this.fireballHit = 5;
              sprite.alive = false;
              this.takeDamage(200);
            } else if (sprite instanceof Slime) {
              if (sprite.deadCounter === 0) {
                this.takeDamage(50);
              } else {
                hit = false;
              }
            } else if (sprite instanceof Ghost) {
              if (sprite.deadCounter === 0) {
                this.takeDamage(100);
                sprite.killed(ls);
              } else {
                hit = false;
              }
            } else if (sprite instanceof Skeleton) {
              if (sprite.deadCounter === 0) {
                this.takeDamage(150);
              } else {
                hit = false;
              }
            } else if (sprite instanceof Boss) {
              if (sprite.deadCounter === 0) {
                this.takeDamage(150);
              } else {
                hit = false;
              }
            } else if (sprite instanceof SpikeBall) {
              this.takeDamage(300);
            } else if (sprite instanceof HornItem) {
              hit = false;
              this.inventory.horn = true;
              sprite.alive = false;

            }
            else {
              hit = false;
            }
            if (hit) {
              if (this.sheild) {
                sfxSounds[15].play();
              } else {
                sfxSounds[4].play();
              }
            }
          }
        }
      }
    }
  }

  private hitUpdate() {
    if (this.hit > 0) {
      this.hit--;
    }

    if (this.fireballHit > 0) {
      this.fireballHit--;
    }
  }

  private takeDamage(damage: number) {
    this.hit = 30;
    let sheild = 1;
    if (this.sheild) {
      sheild = 0.5;
    }
    this.health -= damage * sheild;
    if (this.health < 0) {
      this.health = 0;
    }
  }

  private teleportUpdate(ls: levelSettings) {
    if (!this.teleportPlaced && keyMap.get("KeyQ")) {
      this.teleportX = this.posX;
      this.teleportY = this.posY;
      this.teleportPlaced = true;
      sfxSounds[19].play();
      sfxSounds[18].play();
      keyMap.set("KeyQ", false);
      const teleport = new Teleport();
      const sprite = {
        x: this.teleportX,
        y: this.teleportY,
        texture: 2,
        type: teleport,
      };
      ls.sprites.push(sprite);
    }
    if (this.teleportPlaced && keyMap.get("KeyQ")) {
      sfxSounds[18].pause();
      sfxSounds[18].currentTime = 0
      sfxSounds[20].play();
      this.posX = this.teleportX;
      this.posY = this.teleportY;
      this.teleportPlaced = false;
      keyMap.set("KeyQ", false);
      for (let i = ls.sprites.length - 1; i > -1; i--) {
        if (ls.sprites[i].type instanceof Teleport) {
          ls.sprites[i].type.alive = false;
          break;
        }
      }
    }
  }

  private damageEnemy(ls: levelSettings) {
    for (let i = 0; i < ls.sprites.length; i++) {
      const sprite = ls.sprites[i].type;
      if (sprite === undefined) continue;
      const invDet = 1 / (this.planeX * this.dirY - this.dirX * this.planeY);
      const spriteX = sprite.x - this.posX;
      const spriteY = sprite.y - this.posY;

      let hit = false;

      const transformX = invDet * (this.dirY * spriteX - this.dirX * spriteY);
      const transformY =
        invDet * (-this.planeY * spriteX + this.planeX * spriteY);

      if (
        sprite instanceof Slime ||
        sprite instanceof Mage ||
        sprite instanceof Ghost ||
        sprite instanceof Skeleton ||
        sprite instanceof Boss
      ) {
        if (sprite.deadCounter !== 0) {
          continue;
        }
        if (
          this.holding === 2 &&
          this.swordCounter > 0 &&
          this.swordCounter < 50
        ) {
          if (
            Math.abs(transformX) < 0.5 &&
            transformY > 0 &&
            transformY < 1.5
          ) {
            sprite.takeDamage(10);
            hit = true;
            if (!(sprite instanceof Boss)) {
              sprite.x += this.dirX * 0.05;
              sprite.y += this.dirY * 0.05;
            }
          }
        }
        if (
          this.sheild &&
          this.dashCount > 0 &&
          this.dashCount < 5 &&
          Math.abs(transformY) < 1
        ) {
          hit = true;
          sprite.takeDamage(10);
        }

        if (hit) {
          sfxSounds[26].play()
        }

      }
      if (this.ammo < 10 && sprite.health <= 0 && !(sprite instanceof Ghost)) {
        sfxSounds[1].play();
        this.ammo++;
      }
    }
  }

  private healthUpdate(ls: levelSettings) {
    if (this.health <= 0) {
      setLevel(ls);
      ls.cutscene.scene = 12;
      sfxSounds[28].play();
    }
  }

  private pauseUpdate(ls: levelSettings) {
    if (ls.screen === -1 && keyMap.get("Escape")) {
      keyMap.set("Escape", false)
      ls.screen = 1;
      ls.backScreen.push(-1);
      pauseAudio();
    }

  }

  private soundUpdate() {
    if (keyMap.get("KeyW") || keyMap.get("KeyS") || keyMap.get("ArrowUp") || keyMap.get("ArrowDown")) {
      this.walkSoundCounter += 1;
    } else {
      this.walkSoundCounter = 0;
    }

    if (this.running) {
      if (this.walkSoundCounter % 20 === 1) {
        sfxSounds[10].play()
      }
      if (this.walkSoundCounter % 20 === 10) {
        sfxSounds[11].play()
      }
    } else {
      if (this.walkSoundCounter % 30 === 1) {
        sfxSounds[10].play()
      }
      if (this.walkSoundCounter % 30 === 15) {
        sfxSounds[11].play()
      }
    }

    if (this.horn) {
    }
  }

  update(ls: levelSettings): void {
    this.useUpdate(ls);
    this.healthUpdate(ls);
    this.pauseUpdate(ls);

    //seperate gun and sword update
    if (this.inventory.gun) this.gunUpdate();
    if (this.inventory.flashlight) this.flashlightUpdate();
    if (this.inventory.flashlight) this.hiddenBlockUpdate(ls.map);
    if (this.inventory.sword) this.swordUpdate(ls);

    if (this.inventory.run) this.staminaUpdate();
    if (this.inventory.dash) this.dashUpdate(ls.map.map);
    if (this.inventory.sheild) this.sheildUpdate();
    if (this.inventory.teleport) this.teleportUpdate(ls);

    if (this.inventory.horn) this.hornUpdate();

    this.spriteCollisonUpdate(ls);
    this.hitUpdate();

    this.moveUpdate(ls.map.map);
    this.holdingUpdate();
    this.inblockUpdate(ls.map.map);
    this.damageEnemy(ls);

    this.soundUpdate()
  }

  resetPlayer(): void {
    this.health = 1000;
    this.stamina = 1000;
    this.reloadTimer = 1000;

    this.teleportPlaced = false;
    this.teleportX = 0
    this.teleportY = 0

    this.hit = 0
    this.fireballHit = 0

    this.dashCount = 0

    this.reflect = false
    this.running = false;
    this.tired = false

    this.viewDist = 32
    this.battery = 1000
    this.flashlight = true

    this.sheild = false
    this.sheildCounter = 1000
    this.sheildBreak = false

    this.swordHit = false;
    this.gunCounter = 0
    this.swordCounter = 0
    this.ammoCounter = 0

    this.holding = 1
  }
}



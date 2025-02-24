import { sprite } from "./sprite";
import { keyMap } from "./keypress";

import {
  texWidth,
  texHeight,
  textures,
  gunImg,
  gunInvImg,
  flashlightImg,
  flashlightoffImg,
  flashLightInvImg,
  shootImgs,
  ammoImg,
  shootSound,
  ammoSound,
} from "./textures";

import {
  canvas,
  c,
  buffer,
  lightingBuffer,
  bufferWidth,
  bufferHeight,
  bufferRatio,
  UIRatio,
} from "./global";

function drawImage(
  ctx: any,
  image: typeof Image,
  x: number,
  y: number,
  w: number,
  h: number,
  degrees: number,
) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate((degrees * Math.PI) / 180.0);
  ctx.translate(-x - w / 2, -y - h / 2);
  ctx.drawImage(image, x, y, w, h);
  ctx.restore();
}

interface distanceOutput {
  distance: number;
  texX: number;
  wallType: number;
  goalDistance: number;
  pos: string;
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

  private running: boolean = false;
  private tired: boolean = false;

  private viewDist: number = 32;

  private battery: number = 1000;
  private flashlight: boolean = true;

  private shootingCounter = 0;
  ammo: number = 10;
  private ammoCounter = 0;

  private holding: number = 1;
  //0 nothing 1 gun 2 flashlight

  constructor(
    x: number,
    y: number,
    radius: number,
    speed: number,
    turnSpeed: number,
  ) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.walkSpeed = speed;
    this.speed = speed;
    this.turnSpeed = turnSpeed;
  }

  private clearBuffer() {
    for (let i = 0; i < bufferHeight; i++) {
      for (let j = 0; j < bufferWidth; j++) {
        buffer[i][j] = undefined;
      }
    }
  }

  private drawBuffer() {
    for (let i = 0; i < bufferHeight; i++) {
      for (let j = 0; j < bufferWidth; j++) {
        if (buffer[i][j] !== undefined) {
          const red = buffer[i][j][0];
          const green = buffer[i][j][1];
          const blue = buffer[i][j][2];
          const color = `rgb(${red} ${green} ${blue})`;
          c.fillStyle = color;
          c.fillRect(
            j * bufferRatio,
            i * bufferRatio,
            bufferRatio,
            bufferRatio,
          );
        }
      }
    }
  }

  private clearLightBuffer() {
    for (let i = 0; i < bufferWidth; i++) {
      lightingBuffer[i] = undefined;
    }
  }

  private drawLightBuffer() {
    for (let i = 0; i < bufferWidth; i++) {
      if (lightingBuffer[i] !== undefined) {
        const height = lightingBuffer[i][0];
        const alpha = lightingBuffer[i][1];
        c.globalAlpha = alpha;
        c.fillStyle = "black";
        c.fillRect(
          bufferRatio * i,
          canvas.height / 2 - height / 2,
          bufferRatio,
          height,
        );
      }
    }
    c.globalAlpha = 1;
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

  private drawBG() {
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < bufferHeight; y++) {
      const rayDirX0 = this.dirX - this.planeX;
      const rayDirY0 = this.dirY - this.planeY;
      const rayDirX1 = this.dirX + this.planeX;
      const rayDirY1 = this.dirY + this.planeY;

      let p = y - bufferHeight / 2;
      const posZ = bufferHeight / 2;

      const rowDistance = posZ / p;

      const floorStepX = (rowDistance * (rayDirX1 - rayDirX0)) / bufferWidth;
      const floorStepY = (rowDistance * (rayDirY1 - rayDirY0)) / bufferWidth;

      let floorX = this.posX + rowDistance * rayDirX0;
      let floorY = this.posY + rowDistance * rayDirY0;

      for (let x = 0; x < bufferWidth; x++) {
        const cellX = Math.floor(floorX);
        const cellY = Math.floor(floorY);

        const tX = Math.floor(texWidth * (floorX - cellX));
        const tY = Math.floor(texHeight * (floorY - cellY));

        floorX += floorStepX;
        floorY += floorStepY;

        let color = textures[1][texWidth * tY + tX];
        buffer[y][x] = color;

        color = textures[2][texWidth * tY + tX];
        buffer[bufferHeight - y - 1][x] = color;
      }
    }
  }

  private drawSprites(sprites: sprite[]) {}

  private drawBGLight() {
    c.fillStyle = "black";
    for (let y = 0; y < bufferHeight / 2; y++) {
      let brightness: number;
      if (
        this.viewDist === 64 ||
        (this.shootingCounter > 0 && this.shootingCounter < 15)
      ) {
        brightness = y / (bufferHeight / 2);
      } else {
        brightness = (y - 5) / (bufferHeight / 2);
      }

      c.globalAlpha = 1 - brightness;
      c.fillRect(
        0,
        canvas.height / 2 + y * bufferRatio,
        canvas.width,
        bufferRatio,
      );

      c.fillRect(
        0,
        canvas.height / 2 - bufferRatio - y * bufferRatio,
        canvas.width,
        bufferRatio,
      );
    }
    c.globalAlpha = 1;
  }

  private drawFlashBeam() {
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
        canvas.height - 30 * UIRatio,
        25 * UIRatio,
        0,
        2 * Math.PI,
      );
      c.fill();

      c.globalAlpha = 1;
    }
  }

  private drawWalls(map: number[][], lights: string[]) {
    for (let x = 0; x < bufferWidth; x++) {
      const result = this.distance(x, map, canvas);
      const height = Math.floor(bufferHeight / result.distance);
      let drawStart = Math.floor(-height / 2 + bufferHeight / 2);
      if (drawStart < 0) {
        drawStart = 0;
      }
      let drawEnd = Math.floor(height / 2 + bufferHeight / 2);
      if (drawEnd >= bufferHeight) {
        drawEnd = bufferHeight - 1;
      }

      let brightness = this.getBrightness(result, lights);
      let alpha = 0;
      if (
        this.viewDist === 64 ||
        (this.shootingCounter > 0 && this.shootingCounter < 15)
      ) {
        const middle = Math.abs(x - bufferWidth / 2) / bufferWidth / 2;
        alpha = brightness / 15 + middle * 3;
      } else {
        alpha = brightness / 4;
      }

      if (alpha > 1) {
        alpha = 1;
      }
      lightingBuffer[x] = [height * bufferRatio, alpha];

      let texNum = result.wallType - 1;
      if (texNum > textures.length) {
        texNum = 0;
      }

      const step = texHeight / height;
      let texPos = (drawStart - bufferHeight / 2 + height / 2) * step;

      for (let y = drawStart; y < drawEnd; y++) {
        const texY = Math.floor(texPos);
        texPos += step;

        let color = textures[texNum][texHeight * texY + result.texX];
        buffer[y][x] = color;
      }
    }
  }

  private drawShootingFlash() {
    if (this.shootingCounter > 0 && this.shootingCounter < 10) {
      c.globalAlpha = 0.1;
      c.fillStyle = "#f39c12";
      c.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  drawView(map: number[][], lights: string[], sprites: sprite[]) {
    this.clearBuffer();
    this.drawBG();
    this.drawBuffer();
    this.drawBGLight();

    this.clearBuffer();
    this.clearLightBuffer();
    this.drawWalls(map, lights);
    this.drawBuffer();
    this.drawLightBuffer();

    this.drawSprites(sprites);
    this.drawShootingFlash();
    this.drawFlashBeam();
  }

  private getBrightness(result: distanceOutput, lights: string[]): number {
    let min = Infinity;
    const wallPos = result.pos.split(",");

    for (let i = 0; i < lights.length; i++) {
      const lightPos = lights[i].split(",");
      const distance = Math.sqrt(
        Math.pow(Number(lightPos[0]) - Number(wallPos[0]), 2) +
          Math.pow(Number(lightPos[1]) - Number(wallPos[1]), 2),
      );

      if (distance < min) {
        min = distance;
      }
    }
    const distance = Math.sqrt(
      Math.pow(this.posX - Number(wallPos[0]), 2) +
        Math.pow(this.posY - Number(wallPos[1]), 2),
    );

    if (distance < min) {
      min = distance;
    }
    return min;
  }

  private distance(x: number, map: number[][], canvas: any): distanceOutput {
    const result: distanceOutput = {
      distance: -1,
      texX: -1,
      wallType: -1,
      goalDistance: -1,
      pos: "",
    };

    const cameraX = (2 * x) / bufferWidth - 1;
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
      if (map[mapX][mapY] !== 0) {
        hit = 1;
      }
    }

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
      result.pos = `${mapX},${wallX}`;
    } else {
      wallX = this.posX + perpWallDist * rayDirX;
      result.pos = `${wallX},${mapY}`;
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

  // private draw

  private drawHoldingUi() {
    let recoil = 0;
    if (this.shootingCounter !== 0) {
      recoil = 1 - (100 / this.shootingCounter) * 3;
    }

    let running = 0;
    if (this.running) running = UIRatio * 20;
    if (this.holding === 1) {
      c.drawImage(
        gunImg,
        canvas.width / 2 - 28 * UIRatio,
        canvas.height - 52 * UIRatio + recoil + running,
        56 * UIRatio,
        56 * UIRatio,
      );
      c.fillStyle = "#e74c3c";
      c.fillRect(
        canvas.width / 2 - (50 * UIRatio) / 5,
        canvas.height - 5 * UIRatio,
        (this.shootingCounter * UIRatio) / 5,
        2 * UIRatio,
      );
    } else if (this.holding === 2) {
      if (this.viewDist === 64) {
        c.drawImage(
          flashlightImg,
          canvas.width / 2 - 25 * UIRatio,
          canvas.height - 40 * UIRatio + running,
          50 * UIRatio,
          40 * UIRatio,
        );
      } else {
        c.drawImage(
          flashlightoffImg,
          canvas.width / 2 - 25 * UIRatio,
          canvas.height - 40 * UIRatio + running,
          50 * UIRatio,
          40 * UIRatio,
        );
      }
    }
  }

  private drawShootingUi() {
    if (this.shootingCounter > 0 && this.shootingCounter < 10) {
      c.drawImage(
        shootImgs[0],
        canvas.width / 2 - 16 * UIRatio,
        canvas.height - 70 * UIRatio,
        32 * UIRatio,
        32 * UIRatio,
      );
    } else if (this.shootingCounter > 9 && this.shootingCounter < 20) {
      c.drawImage(
        shootImgs[1],
        canvas.width / 2 - 16 * UIRatio,
        canvas.height - 70 * UIRatio,
        32 * UIRatio,
        32 * UIRatio,
      );
    }
  }

  private drawInvUi() {
    c.globalAlpha = 0.5;
    c.fillStyle = "#7f8c8d";
    c.fillRect(
      2 * UIRatio,
      canvas.height - 22 * UIRatio,
      20 * UIRatio,
      20 * UIRatio,
    );
    c.fillRect(
      24 * UIRatio,
      canvas.height - 22 * UIRatio,
      20 * UIRatio,
      20 * UIRatio,
    );
    c.globalAlpha = 1;
    c.drawImage;

    c.drawImage(
      gunInvImg,
      2 * UIRatio,
      canvas.height - 21 * UIRatio,
      20 * UIRatio,
      20 * UIRatio,
    );
    c.drawImage(
      flashLightInvImg,
      24 * UIRatio,
      canvas.height - 21 * UIRatio,
      20 * UIRatio,
      20 * UIRatio,
    );

    c.globalAlpha = 0.5;
    c.fillStyle = "black";
    if (this.holding !== 1) {
      c.fillRect(
        2 * UIRatio,
        canvas.height - 22 * UIRatio,
        20 * UIRatio,
        20 * UIRatio,
      );
    }
    if (this.holding !== 2) {
      c.fillRect(
        24 * UIRatio,
        canvas.height - 22 * UIRatio,
        20 * UIRatio,
        20 * UIRatio,
      );
    }

    c.globalAlpha = 1;
  }

  private drawAmmoUi() {
    for (let i = 0; i < this.ammo; i++) {
      drawImage(
        c,
        ammoImg,
        canvas.width - 13 * UIRatio,
        canvas.height - 35 * UIRatio - i * 8 * UIRatio,
        7 * UIRatio,
        16 * UIRatio,
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
    c.fillRect(
      canvas.width - 52 * UIRatio + ((1000 - this.battery) / 20) * UIRatio,
      canvas.height - 21 * UIRatio,
      (this.battery / 20) * UIRatio,
      5 * UIRatio,
    );
  }

  private drawStaminaUi() {
    if (this.tired) {
      c.fillStyle = "#b33939";
    } else {
      c.fillStyle = "#2ecc71";
    }

    c.fillRect(
      canvas.width - 52 * UIRatio + ((1000 - this.stamina) / 20) * UIRatio,
      canvas.height - 14 * UIRatio,
      (this.stamina / 20) * UIRatio,
      5 * UIRatio,
    );
  }

  private drawHealthUi() {
    c.fillStyle = "#e74c3c";
    c.fillRect(
      canvas.width - 52 * UIRatio + ((1000 - this.health) / 20) * UIRatio,
      canvas.height - 7 * UIRatio,
      (this.health / 20) * UIRatio,
      5 * UIRatio,
    );
  }

  private drawRunUi() {
    if (this.running) {
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

  // private drawLevelUi(level: number) {
  //   c.fillStyle = "#241d1d";
  //   c.fillRect(0, 0, 20 * UIRatio, 20 * UIRatio);
  //
  //   c.fillStyle = "red";
  //   c.font = "bold 75px Arial";
  //   c.fillText("" + level, 10 * UIRatio, 10 * UIRatio);
  // }

  drawUi() {
    this.drawRunUi();
    this.drawInvUi();

    this.drawAmmoUi();
    this.drawShootingUi();

    // this.drawLevelUi(level);

    this.drawBatteryUi();
    this.drawStaminaUi();
    this.drawHealthUi();

    this.drawHoldingUi();
  }

  private useUpdate() {
    if (!this.running) {
      if (keyMap.get("Space")) {
        if (this.holding === 2 && this.battery > 0 && this.flashlight) {
          this.viewDist = 64;
          this.battery -= 5;
        }
        if (this.holding === 1) {
          if (this.ammo > 0 && this.shootingCounter === 0) {
            shootSound.play();
            this.ammo--;
            this.shootingCounter = 1;
          }
        }
      }
    }
  }

  private moveUpdate(map: number[][]) {
    if (
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
      this.stamina -= 10;

      keyMap.set("Space", false);
    }

    if (keyMap.get("ArrowUp") || keyMap.get("KeyW")) {
      if (
        map[Math.floor(this.posX + this.dirX * this.speed * this.radius)][
          Math.floor(this.posY)
        ] !== 1
      ) {
        this.posX += this.dirX * this.speed;
      }
      if (
        map[Math.floor(this.posX)][
          Math.floor(this.posY + this.dirY * this.speed * this.radius)
        ] !== 1
      ) {
        this.posY += this.dirY * this.speed;
      }
    }

    if (keyMap.get("ArrowDown") || keyMap.get("KeyS")) {
      if (
        map[Math.floor(this.posX)][
          Math.floor(this.posY - this.dirY * this.speed * this.radius)
        ] !== 1
      ) {
        this.posY -= this.dirY * this.speed;
      }
      if (
        map[Math.floor(this.posX - this.dirX * this.speed * this.radius)][
          Math.floor(this.posY)
        ] !== 1
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
    if (keyMap.get("Digit1")) {
      this.holding = 1;
      this.shootingCounter = 40;
    } else if (keyMap.get("Digit2")) {
      this.holding = 2;
    }
  }

  private gunUpdate() {
    if (this.ammoCounter === 500) {
      if (this.ammo < 10) {
        ammoSound.play();
        this.ammo += 1;
      }
      this.ammoCounter = 0;
    }
    this.ammoCounter += 1;

    if (this.shootingCounter !== 0 && this.shootingCounter < 100) {
      this.shootingCounter += 4;
    }
    if (this.shootingCounter >= 100 && !keyMap.get("Space")) {
      this.shootingCounter = 0;
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
      (this.holding === 2 && !keyMap.get("Space")) ||
      this.holding !== 2
    ) {
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
        this.stamina += 3;
      }
    }
  }

  update(map: number[][]): void {
    this.useUpdate();

    this.gunUpdate();
    this.flashlightUpdate();

    this.staminaUpdate();
    this.moveUpdate(map);
    this.holdingUpdate();
  }
}

const flashlightImg = new Image();
flashlightImg.src = "/img/flashlight.png";
const flashlightoffImg = new Image();
flashlightoffImg.src = "/img/flashlightoff.png";

const gunImg = new Image();
gunImg.src = "/img/gun.png";

interface distanceOutput {
  distance: number;
  goal: number;
}

export class Player {
  x: number;
  y: number;

  posX = 22;
  posY = 12;
  dirX = -1;
  dirY = 0;
  planeX: number = 0;
  planeY: number = 1;

  radius: number;
  direction: number = 0;
  turnSpeed: number = 1;

  viewDist: number = 32;

  battery: number = 1000;
  flashlight: boolean = true;

  speed: number;

  holding: number = 2;
  //0 nothing 1 gun 2 flashlight

  constructor(x: number, y: number, radius: number, speed: number) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
  }

  draw(c: any, scale: number): void {
    const angleRad = (this.direction * Math.PI) / 180;
    c.beginPath();
    c.arc(this.x * scale, this.y * scale, this.radius * scale, 0, 2 * Math.PI);
    c.fillStyle = "red";
    c.fill();

    c.beginPath();
    c.arc(
      this.x * scale,
      this.y * scale,
      this.radius * scale,
      angleRad - Math.PI / 2,
      angleRad + Math.PI / 2,
    );
    c.lineWidth = 5;
    c.strokeStyle = "black";
    c.stroke();
  }

  drawView(c: any, canvas: any, map: number[][], mapSize: number) {
    const lu = this.viewDist / 255;
    c.fillStyle = `rgb(${17 * lu}, ${10 * lu}, ${10 * lu})`;
    c.fillRect(0, 0, canvas.width, canvas.height / 2);

    c.fillStyle = `rgb(${30 * lu}, ${10 * lu}, ${10 * lu})`;
    c.fillRect(0, canvas.height / 2, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x++) {
      const viewAngle = (130 * x) / (canvas.width / 2) - 75;
      const newAngle = this.direction + viewAngle;
      const distanceOut = this.distance(newAngle, map, mapSize);

      if (distanceOut.distance === -1) {
        continue;
      }

      let height =
        ((1 / (distanceOut.distance / 100) - 1) * canvas.height) / 10;

      height = Math.min(height, canvas.height);

      const color = ((height / canvas.height) * this.viewDist) / 2;
      c.fillStyle = `rgb(${color},${color},${color})`;
      c.fillRect(x * 2, canvas.height / 2 - height / 2, 2, height);

      if (distanceOut.goal != -1) {
        let goalHeight =
          ((1 / (distanceOut.goal / 100) - 1) * canvas.height) / 10;

        goalHeight = Math.min(goalHeight, canvas.height);

        c.globalAlpha = 0.05;
        c.fillStyle = "#2ecc71";
        c.fillRect(x * 2, canvas.height / 2 - goalHeight / 2, 2, goalHeight);
        c.globalAlpha = 1;
      }
    }

    if (this.viewDist === 64) {
      c.globalAlpha = 0.02;
      c.fillStyle = "#f1c40f";
      c.fillRect(0, 0, canvas.width, canvas.height);

      c.globalAlpha = 0.02;
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
      c.arc(canvas.width / 2, canvas.height - 150, 125, 0, 2 * Math.PI);
      c.fill();

      c.globalAlpha = 1;
    }
  }

  private distance(
    angle: number,
    map: number[][],
    mapSize: number,
  ): distanceOutput {
    const result: distanceOutput = { distance: -1, goal: -1 };
    for (let i = 1; i <= 100; i += 0.3) {
      const nX = this.x + i * Math.cos((angle * Math.PI) / 180);
      const nY = this.y + i * Math.sin((angle * Math.PI) / 180);

      const blockX = Math.floor(nX / mapSize);
      const blockY = Math.floor(nY / mapSize);

      if (
        blockX < 0 ||
        blockX >= map[0].length ||
        blockY < 0 ||
        blockY >= map.length
      ) {
        return result;
      }

      if (result.goal === -1 && map[blockY][blockX] === 2) {
        result.goal = i;
      }

      if (map[blockY][blockX] === 1) {
        result.distance = i;
        return result;
      }
    }

    return result;
  }

  drawUi(c: any, canvas: any) {
    if (this.flashlight) {
      c.fillStyle = "#f1c40f";
    } else {
      c.fillStyle = "#b33939";
    }
    c.fillRect(canvas.width - 110, 10, (this.battery / 1000) * 100, 10);

    if (this.holding === 2) {
      if (this.viewDist === 64) {
        c.drawImage(flashlightImg, canvas.width / 2 - 120, canvas.height - 200);
      } else {
        c.drawImage(
          flashlightoffImg,
          canvas.width / 2 - 120,
          canvas.height - 200,
        );
      }
    }
  }

  update(
    keyMap: Map<string, boolean>,
    map: number[][],
    blockSize: number,
  ): void {
    if (this.battery <= 0) {
      this.flashlight = false;
    }
    if (!this.flashlight && this.battery >= 1000) {
      this.flashlight = true;
    }
    if (keyMap.get("Space") && this.battery > 0 && this.flashlight) {
      if (this.holding === 2) {
        this.viewDist = 64;
        this.battery--;
      }
    } else {
      this.viewDist = 16;
      if (this.battery < 1000) {
        this.battery += 0.5;
      }
    }

    if (keyMap.get("ArrowRight")) {
      this.direction += this.turnSpeed;
    }
    if (keyMap.get("ArrowLeft")) {
      this.direction -= this.turnSpeed;
    }

    if (keyMap.get("ArrowUp")) {
      const nx =
        this.x + this.speed * Math.cos((this.direction * Math.PI) / 180);
      const ny =
        this.y + this.speed * Math.sin((this.direction * Math.PI) / 180);

      const xBlock = Math.floor(nx / blockSize);
      const yBlock = Math.floor(ny / blockSize);
      if (
        xBlock >= map[0].length ||
        yBlock >= map.length ||
        (xBlock >= 0 &&
          xBlock < map[0].length &&
          yBlock >= 0 &&
          yBlock < map.length &&
          map[yBlock][xBlock] !== 1)
      ) {
        this.x = nx;
        this.y = ny;
      }
    }
    if (keyMap.get("ArrowDown")) {
      const nx =
        this.x - this.speed * Math.cos((this.direction * Math.PI) / 180);
      const ny =
        this.y - this.speed * Math.sin((this.direction * Math.PI) / 180);

      const xBlock = Math.floor(nx / blockSize);
      const yBlock = Math.floor(ny / blockSize);
      if (
        xBlock >= map[0].length ||
        yBlock >= map.length ||
        (xBlock >= 0 &&
          xBlock < map[0].length &&
          yBlock >= 0 &&
          yBlock < map.length &&
          map[yBlock][xBlock] === 0)
      ) {
        this.x = nx;
        this.y = ny;
      }
    }
  }
}

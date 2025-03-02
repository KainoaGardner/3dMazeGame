import { canvas, c, targetFps } from "./global";
import { Player } from "./player";
import { Map } from "./map";
import { spriteUpdate, sprite } from "./sprite";
import { CloseBlock } from "./closeblock";
import { setLevel } from "./levels";
import { FireballWall } from "./fireball";

document.body.style.overflow = "hidden";

const ls = {
  level: 2,
  player: new Player(0, 0, 5, 0.04, 0.05),
  map: new Map([], 100, canvas.height, 1),
  sprites: new Array<sprite>(),
  moveWall: new Array<CloseBlock>(),
  fireWall: new Array<FireballWall>(),
  floorTex: 1,
  ceilingTex: 2,
};

setLevel(ls);

function main(): void {
  drawFrame();
}

function drawFrame(): void {
  requestAnimationFrame(main);
  c.clearRect(0, 0, canvas.width, canvas.height);
  ls.player.drawView(ls);
  ls.player.drawUi(ls.map.map);
}

function updateFrame(): void {
  clearInterval(interval);
  // showFps();
  ls.player.update(ls);
  spriteUpdate(ls);

  for (let i = 0; i < ls.moveWall.length; i++) {
    ls.moveWall[i].update(ls.map);
  }

  for (let i = 0; i < ls.fireWall.length; i++) {
    ls.fireWall[i].update(ls);
  }

  if (ls.player.goal(ls.map.map)) {
    ls.level++;
    setLevel(ls);
  }

  interval = setInterval(updateFrame, 1000 / targetFps);
}

let times: number[] = [];
function showFps(): void {
  const now: number = performance.now();
  while (times.length > 0 && times[0] <= now - 1000) {
    times.shift();
  }
  times.push(now);
  const fps: number = times.length;
  console.log(fps);
}

let interval = setInterval(updateFrame, 1000 / targetFps);

main();

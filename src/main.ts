import { canvas, c, targetFps } from "./global";
import { Player } from "./player";
import { Map } from "./map";
import { sprite } from "./sprite";
import { setLevel } from "./levels";

document.body.style.overflow = "hidden";

const map = new Map([], 100, canvas.height);
const sprites: sprite[] = [];
const player = new Player(0, 0, 5, 0.04, 0.05);

let level = 1;
setLevel(level, player, map, sprites);

function main(): void {
  drawFrame();
}

function drawFrame(): void {
  requestAnimationFrame(main);
  c.clearRect(0, 0, canvas.width, canvas.height);
  player.drawView(map.map, map.lightList, sprites);
  player.drawUi();
}

function updateFrame(): void {
  clearInterval(interval);
  showFps();
  player.update(map.map);
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

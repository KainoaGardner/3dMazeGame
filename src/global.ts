interface pos {
  x: number;
  y: number;
}
document.body.style.backgroundColor = "#000000";

const canvas = document.querySelector("canvas")!;
const targetFps = 30;

canvas.width = 1920;
canvas.height = 1080;

// canvas.width = 1366;
// canvas.height = 768;

// canvas.width = 1280;
// canvas.height = 720;

// canvas.width = 854;
// canvas.height = 480;

// canvas.width = 640;
// canvas.height = 360;

// canvas.width = 256;
// canvas.height = 144;

// const bufferWidth = 512;
// const bufferHeight = 288;
// const UIRatio = (canvas.width / bufferWidth) * 2;

// const bufferWidth = 256;
// const bufferHeight = 144;
// const UIRatio = canvas.width / bufferWidth;

const bufferWidth = 192;
const bufferHeight = 108;
const UIRatio = (canvas.width / bufferWidth) * 0.75;

// const bufferWidth = 128;
// const bufferHeight = 72;
// const UIRatio = canvas.width / bufferWidth / 2;

const bufferRatio = canvas.width / bufferWidth;

const c = canvas.getContext("2d")!;
c.textBaseline = "middle";
c.textAlign = "center";

document.body.style.overflow = "hidden";

const buffer = new Array(bufferHeight)
  .fill(null)
  .map(() => Array(bufferWidth).fill(undefined));

const lightingBuffer = new Array(bufferWidth).fill(undefined);
const invisBlockBuffer = new Array(bufferWidth).fill(undefined);
const zBuffer = new Array(bufferWidth).fill(undefined);

export {
  canvas,
  c,
  buffer,
  lightingBuffer,
  invisBlockBuffer,
  bufferWidth,
  bufferHeight,
  bufferRatio,
  UIRatio,
  targetFps,
  zBuffer,
  type pos,
};

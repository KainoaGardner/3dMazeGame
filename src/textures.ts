import { c } from "./global";

const texWidth = 16;
const texHeight = 16;

const spriteTexWidth = 32;
const spriteTexHeight = 32;

const wallTextures = new Array(12)
  .fill(null)
  .map(() => Array(texWidth).fill(0));

const bgTextures = new Array(5).fill(null).map(() => Array(texWidth).fill(0));

const spriteTextures = new Array(16)
  .fill(null)
  .map(() => Array(spriteTexWidth).fill(0));

function getTexture(
  tex: any,
  texList: number[][],
  index: number,
  texWidth: number,
  texHeight: number,
  textures: any[],
) {
  c.clearRect(0, 0, texWidth, texHeight);
  c.drawImage(tex, 0, 0, texWidth, texHeight);

  let texData;
  texData = c.getImageData(0, 0, texWidth, texHeight).data;
  for (let i = 0; i < texData.length; i += 4) {
    const red = texData[i];
    const green = texData[i + 1];
    const blue = texData[i + 2];

    texList[i / 4] = [red, green, blue];
  }
  textures[index] = texList;
}

function addTexture(
  path: string,
  index: number,
  texWidth: number,
  texHeight: number,
  textures: any[],
) {
  const texList = new Array(texWidth).fill(null).map(() => Array(3).fill(0));
  const tex = new Image();
  if (tex instanceof HTMLElement) {
    tex.src = path;
    tex.addEventListener("load", function () {
      getTexture(tex, texList, index, texWidth, texHeight, textures);
    });
  }
}

//bg
addTexture("/img/bg/roof.png", 0, texWidth, texHeight, bgTextures);
addTexture("/img/bg/roof1.png", 1, texWidth, texHeight, bgTextures);
addTexture("/img/bg/floor0.png", 3, texWidth, texHeight, bgTextures);
addTexture("/img/bg/floor1.png", 2, texWidth, texHeight, bgTextures);
addTexture("/img/bg/floor2.png", 4, texWidth, texHeight, bgTextures);

//walls
addTexture("/img/walls/stone.png", 0, texWidth, texHeight, wallTextures);
addTexture("/img/walls/stone.png", 1, texWidth, texHeight, wallTextures);

addTexture("/img/walls/goal.png", 3, texWidth, texHeight, wallTextures);

addTexture("/img/walls/fireBallWall.png", 4, texWidth, texHeight, wallTextures);
addTexture("/img/walls/moveWall.png", 5, texWidth, texHeight, wallTextures);

addTexture("/img/walls/closeWall.png", 6, texWidth, texHeight, wallTextures);

addTexture("/img/walls/break0.png", 9, texWidth, texHeight, wallTextures);
addTexture("/img/walls/break1.png", 10, texWidth, texHeight, wallTextures);
addTexture("/img/walls/break2.png", 11, texWidth, texHeight, wallTextures);

//sprites
addTexture(
  "/img/sprites/fireball.png",
  0,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/fireballReflect.png",
  1,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/clock.png",
  2,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/mage0.png",
  3,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/mage1.png",
  4,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/mage2.png",
  5,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/mage3.png",
  6,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/mage4.png",
  7,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/slime0.png",
  8,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/slime1.png",
  9,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/slime2.png",
  10,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/slime3.png",
  11,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/slime4.png",
  12,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/spikeball.png",
  13,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/ghost0.png",
  14,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

addTexture(
  "/img/sprites/ghost1.png",
  15,
  spriteTexWidth,
  spriteTexHeight,
  spriteTextures,
);

//items
const flashlightImg = new Image();
if (flashlightImg instanceof HTMLElement)
  flashlightImg.src = "/img/items/flashlight.png";
const flashlightoffImg = new Image();
if (flashlightoffImg instanceof HTMLElement)
  flashlightoffImg.src = "/img/items/flashlightoff.png";
const gunImg = new Image();
if (gunImg instanceof HTMLElement) gunImg.src = "/img/items/gun.png";

const gunShootImg = new Image();
if (gunShootImg instanceof HTMLElement)
  gunShootImg.src = "/img/items/gunshoot.png";

const swordImgs: any[] = [];
for (let i = 0; i < 4; i++) {
  const sword = new Image();
  if (sword instanceof HTMLElement) {
    sword.src = `/img/items/sword${i}.png`;
    swordImgs.push(sword);
  }
}

const sheildImg = new Image();
if (sheildImg instanceof HTMLElement) sheildImg.src = "/img/items/sheild.png";

const hornImg = new Image();
if (hornImg instanceof HTMLElement) hornImg.src = "/img/items/horn.png";

const hornOnImg = new Image();
if (hornOnImg instanceof HTMLElement) hornOnImg.src = "/img/items/hornon.png";

const clockInvImg = new Image();
if (clockInvImg instanceof HTMLElement)
  clockInvImg.src = "/img/items/clock-inv0.png";

const clockPlacedInvImg = new Image();
if (clockPlacedInvImg instanceof HTMLElement)
  clockPlacedInvImg.src = "/img/items/clock-inv1.png";

// const sword0Img = new Image();
// if (sword0Img instanceof HTMLElement) sword0Img.src = "/img/items/sword0.png";
// const sword1Img = new Image();
// if (sword1Img instanceof HTMLElement) sword1Img.src = "/img/items/sword1.png";
// const sword2Img = new Image();
// if (sword2Img instanceof HTMLElement) sword2Img.src = "/img/items/sword2.png";
// const sword3Img = new Image();
// if (sword3Img instanceof HTMLElement) sword3Img.src = "/img/items/sword3.png";

const swordInvImg = new Image();
if (swordInvImg instanceof HTMLElement)
  swordInvImg.src = "/img/items/sword-inv.png";

const flashLightInvImg = new Image();
if (flashLightInvImg instanceof HTMLElement)
  flashLightInvImg.src = "/img/items/flashlight-inv.png";

const gunInvImg = new Image();
if (gunInvImg instanceof HTMLElement) gunInvImg.src = "/img/items/gun-inv.png";

const dashInvImg = new Image();
if (dashInvImg instanceof HTMLElement) dashInvImg.src = "/img/items/dash.png";

const hornInvImg = new Image();
if (hornInvImg instanceof HTMLElement)
  hornInvImg.src = "/img/items/horn-inv.png";

const sheildInvImg = new Image();
if (sheildInvImg instanceof HTMLElement)
  sheildInvImg.src = "/img/items/sheild-inv.png";

const shootImgs: any[] = [];

for (let i = 0; i < 2; i++) {
  const shoot = new Image();
  if (shoot instanceof HTMLElement) {
    shoot.src = `/img/items/shoot${i}.png`;
    shootImgs.push(shoot);
  }
}

const ammoImg = new Image();
if (ammoImg instanceof HTMLElement) ammoImg.src = "/img/items/ammo.png";

const errorImg = new Image();
if (errorImg instanceof HTMLElement) errorImg.src = "/img/items/error.png";

export {
  texWidth,
  texHeight,
  spriteTexWidth,
  spriteTexHeight,
  bgTextures,
  wallTextures,
  spriteTextures,
  gunImg,
  gunShootImg,
  swordImgs,
  swordInvImg,
  sheildImg,
  sheildInvImg,
  hornImg,
  hornOnImg,
  hornInvImg,
  flashlightImg,
  gunInvImg,
  dashInvImg,
  flashLightInvImg,
  clockInvImg,
  clockPlacedInvImg,
  flashlightoffImg,
  shootImgs,
  ammoImg,
  errorImg,
};

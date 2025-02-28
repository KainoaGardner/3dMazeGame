import { c } from "./global";

const texWidth = 16;
const texHeight = 16;

const spriteTexWidth = 32;
const spriteTexHeight = 32;

const wallTextures = new Array(12)
  .fill(null)
  .map(() => Array(texWidth).fill(0));

const bgTextures = new Array(3).fill(null).map(() => Array(texWidth).fill(0));

const spriteTextures = new Array(2)
  .fill(null)
  .map(() => Array(spriteTexWidth).fill(0));

//bg
const floorTexList = new Array(texWidth).fill(null).map(() => Array(3).fill(0));
const floorTex = new Image();
if (floorTex instanceof HTMLElement) {
  floorTex.src = "/img/bg/roof.png";

  floorTex.addEventListener("load", function () {
    getTexture(floorTex, floorTexList, 0, texWidth, texHeight, bgTextures);
  });
}

const roofTexList = new Array(texWidth).fill(null).map(() => Array(3).fill(0));
const roofTex = new Image();
if (roofTex instanceof HTMLElement) {
  roofTex.src = "/img/bg/roof1.png";
  roofTex.addEventListener("load", function () {
    getTexture(roofTex, roofTexList, 1, texWidth, texHeight, bgTextures);
  });
}

const planksTexList = new Array(texWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const planksTex = new Image();
if (planksTex instanceof HTMLElement) {
  planksTex.src = "/img/bg/floor.png";
  planksTex.addEventListener("load", function () {
    getTexture(planksTex, planksTexList, 2, texWidth, texHeight, bgTextures);
  });
}

//walls
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

const wallTexList = new Array(texWidth).fill(null).map(() => Array(3).fill(0));
const wallTex = new Image();
if (wallTex instanceof HTMLElement) {
  wallTex.src = "/img/walls/stone.png";
  wallTex.addEventListener("load", function () {
    getTexture(wallTex, wallTexList, 0, texWidth, texHeight, wallTextures);
    getTexture(wallTex, wallTexList, 8, texWidth, texHeight, wallTextures);
  });
}

const goalTexList = new Array(texWidth).fill(null).map(() => Array(3).fill(0));
const goalTex = new Image();
if (goalTex instanceof HTMLElement) {
  goalTex.src = "/img/walls/goal.png";
  goalTex.addEventListener("load", function () {
    getTexture(goalTex, goalTexList, 3, texWidth, texHeight, wallTextures);
  });
}

const fireBallWallTexList = new Array(texWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const fireBallWallTex = new Image();
if (fireBallWallTex instanceof HTMLElement) {
  fireBallWallTex.src = "/img/walls/fireBallWall.png";
  fireBallWallTex.addEventListener("load", function () {
    getTexture(
      fireBallWallTex,
      fireBallWallTexList,
      4,
      texWidth,
      texHeight,
      wallTextures,
    );
  });
}

const moveWallTexList = new Array(texWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const moveWallTex = new Image();
if (moveWallTex instanceof HTMLElement) {
  moveWallTex.src = "/img/walls/moveWall.png";
  moveWallTex.addEventListener("load", function () {
    getTexture(
      moveWallTex,
      moveWallTexList,
      5,
      texWidth,
      texHeight,
      wallTextures,
    );
  });
}

const closeWallTexList = new Array(texWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const closeWallTex = new Image();
if (closeWallTex instanceof HTMLElement) {
  closeWallTex.src = "/img/walls/closeWall.png";
  closeWallTex.addEventListener("load", function () {
    getTexture(
      closeWallTex,
      closeWallTexList,
      6,
      texWidth,
      texHeight,
      wallTextures,
    );
  });
}

const fireBallTexList = new Array(spriteTexWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const fireBallTex = new Image();
if (fireBallTex instanceof HTMLElement) {
  fireBallTex.src = "/img/sprites/fireball.png";
  fireBallTex.addEventListener("load", function () {
    getTexture(
      fireBallTex,
      fireBallTexList,
      0,
      spriteTexWidth,
      spriteTexHeight,
      spriteTextures,
    );
  });
}

const fireBallReflectTexList = new Array(spriteTexWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const fireBallReflectTex = new Image();
if (fireBallReflectTex instanceof HTMLElement) {
  fireBallReflectTex.src = "/img/sprites/fireballReflect.png";
  fireBallReflectTex.addEventListener("load", function () {
    getTexture(
      fireBallReflectTex,
      fireBallReflectTexList,
      1,
      spriteTexWidth,
      spriteTexHeight,
      spriteTextures,
    );
  });
}

const break0TexList = new Array(texWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const break0Tex = new Image();
if (break0Tex instanceof HTMLElement) {
  break0Tex.src = "/img/walls/break0.png";
  break0Tex.addEventListener("load", function () {
    getTexture(break0Tex, break0TexList, 9, texWidth, texHeight, wallTextures);
  });
}

const break1TexList = new Array(texWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const break1Tex = new Image();
if (break1Tex instanceof HTMLElement) {
  break1Tex.src = "/img/walls/break1.png";
  break1Tex.addEventListener("load", function () {
    getTexture(break1Tex, break1TexList, 10, texWidth, texHeight, wallTextures);
  });
}

const break2TexList = new Array(texWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const break2Tex = new Image();
if (break2Tex instanceof HTMLElement) {
  break2Tex.src = "/img/walls/break2.png";
  break2Tex.addEventListener("load", function () {
    getTexture(break2Tex, break2TexList, 11, texWidth, texHeight, wallTextures);
  });
}

//sprites

//items
const flashlightImg = new Image();
if (flashlightImg instanceof HTMLElement)
  flashlightImg.src = "/img/items/flashlight.png";
const flashlightoffImg = new Image();
if (flashlightoffImg instanceof HTMLElement)
  flashlightoffImg.src = "/img/items/flashlightoff.png";
const gunImg = new Image();
if (gunImg instanceof HTMLElement) gunImg.src = "/img/items/gun.png";

const swordImgs: any[] = [];
for (let i = 0; i < 4; i++) {
  const sword = new Image();
  if (sword instanceof HTMLElement) {
    sword.src = `/img/items/sword${i}.png`;
    swordImgs.push(sword);
  }
}

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

export {
  texWidth,
  texHeight,
  spriteTexWidth,
  spriteTexHeight,
  bgTextures,
  wallTextures,
  spriteTextures,
  gunImg,
  swordImgs,
  swordInvImg,
  flashlightImg,
  gunInvImg,
  flashLightInvImg,
  flashlightoffImg,
  shootImgs,
  ammoImg,
};

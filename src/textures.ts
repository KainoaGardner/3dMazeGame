import { c } from "./global";

const texWidth = 16;
const texHeight = 16;

const spriteTexWidth = 32;
const spriteTexHeight = 32;

const wallTextures = new Array(12)
  .fill(null)
  .map(() => Array(texWidth).fill(0));

const bgTextures = new Array(5).fill(null).map(() => Array(texWidth).fill(0));

const spriteTextures = new Array(8)
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

const tileTexList = new Array(texWidth).fill(null).map(() => Array(3).fill(0));
const tileTex = new Image();
if (tileTex instanceof HTMLElement) {
  tileTex.src = "/img/bg/floor0.png";
  tileTex.addEventListener("load", function () {
    getTexture(tileTex, tileTexList, 3, texWidth, texHeight, bgTextures);
  });
}

const firePlanksTexList = new Array(texWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const firePlanksTex = new Image();
if (firePlanksTex instanceof HTMLElement) {
  firePlanksTex.src = "/img/bg/floor2.png";
  firePlanksTex.addEventListener("load", function () {
    getTexture(
      firePlanksTex,
      firePlanksTexList,
      4,
      texWidth,
      texHeight,
      bgTextures,
    );
  });
}

const planksTexList = new Array(texWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const planksTex = new Image();
if (planksTex instanceof HTMLElement) {
  planksTex.src = "/img/bg/floor1.png";
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
    getTexture(wallTex, wallTexList, 1, texWidth, texHeight, wallTextures);
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

const clockTexList = new Array(spriteTexWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const clockTex = new Image();
if (clockTex instanceof HTMLElement) {
  clockTex.src = "/img/sprites/clock.png";
  clockTex.addEventListener("load", function () {
    getTexture(
      clockTex,
      clockTexList,
      2,
      spriteTexWidth,
      spriteTexHeight,
      spriteTextures,
    );
  });
}

const mage0TexList = new Array(spriteTexWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const mage0Tex = new Image();
if (mage0Tex instanceof HTMLElement) {
  mage0Tex.src = "/img/sprites/mage0.png";
  mage0Tex.addEventListener("load", function () {
    getTexture(
      mage0Tex,
      mage0TexList,
      3,
      spriteTexWidth,
      spriteTexHeight,
      spriteTextures,
    );
  });
}

const mage1TexList = new Array(spriteTexWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const mage1Tex = new Image();
if (mage1Tex instanceof HTMLElement) {
  mage1Tex.src = "/img/sprites/mage1.png";
  mage1Tex.addEventListener("load", function () {
    getTexture(
      mage1Tex,
      mage1TexList,
      4,
      spriteTexWidth,
      spriteTexHeight,
      spriteTextures,
    );
  });
}

const slime0TexList = new Array(spriteTexWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const slime0Tex = new Image();
if (slime0Tex instanceof HTMLElement) {
  slime0Tex.src = "/img/sprites/slime0.png";
  slime0Tex.addEventListener("load", function () {
    getTexture(
      slime0Tex,
      slime0TexList,
      5,
      spriteTexWidth,
      spriteTexHeight,
      spriteTextures,
    );
  });
}
const slime1TexList = new Array(spriteTexWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const slime1Tex = new Image();
if (slime1Tex instanceof HTMLElement) {
  slime1Tex.src = "/img/sprites/slime1.png";
  slime1Tex.addEventListener("load", function () {
    getTexture(
      slime1Tex,
      slime1TexList,
      6,
      spriteTexWidth,
      spriteTexHeight,
      spriteTextures,
    );
  });
}

const slime2TexList = new Array(spriteTexWidth)
  .fill(null)
  .map(() => Array(3).fill(0));
const slime2Tex = new Image();
if (slime2Tex instanceof HTMLElement) {
  slime2Tex.src = "/img/sprites/slime2.png";
  slime2Tex.addEventListener("load", function () {
    getTexture(
      slime2Tex,
      slime2TexList,
      7,
      spriteTexWidth,
      spriteTexHeight,
      spriteTextures,
    );
  });
}

// const boss0TexList = new Array(spriteTexWidth)
//   .fill(null)
//   .map(() => Array(3).fill(0));
// const boss0Tex = new Image();
// if (boss0Tex instanceof HTMLElement) {
//   boss0Tex.src = "/img/sprites/boss1.png";
//   boss0Tex.addEventListener("load", function () {
//     getTexture(
//       boss0Tex,
//       boss0TexList,
//       5,
//       spriteTexWidth,
//       spriteTexHeight,
//       spriteTextures,
//     );
//   });
// }

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

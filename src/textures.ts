import { c } from "./global";

const texWidth = 16;
const texHeight = 16;

const spriteTexWidth = 32;
const spriteTexHeight = 32;


const wallTextures = new Array(14)
  .fill(null)
  .map(() => Array(texWidth).fill(0));

const bgTextures = new Array(6).fill(null).map(() => Array(texWidth).fill(0));

const spriteTextures = new Array(39)
  .fill(null)
  .map(() => Array(spriteTexWidth).fill(0));



const cutsceneTextures = new Array(3);

const screens: CanvasImageSource[] = [];


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
    tex.addEventListener("load", function() {
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
addTexture("/img/bg/roof2.png", 5, texWidth, texHeight, bgTextures);

//walls
addTexture("/img/walls/stone.png", 0, texWidth, texHeight, wallTextures);
addTexture("/img/walls/stone.png", 1, texWidth, texHeight, wallTextures);
addTexture("/img/walls/goal.png", 3, texWidth, texHeight, wallTextures);
addTexture("/img/walls/fireBallWall.png", 4, texWidth, texHeight, wallTextures);
addTexture("/img/walls/moveWall.png", 5, texWidth, texHeight, wallTextures);
addTexture("/img/walls/closeWall.png", 6, texWidth, texHeight, wallTextures);
addTexture("/img/walls/lamp0.png", 7, texWidth, texHeight, wallTextures);
addTexture("/img/walls/lamp1.png", 8, texWidth, texHeight, wallTextures);
addTexture("/img/walls/break0.png", 9, texWidth, texHeight, wallTextures);
addTexture("/img/walls/break1.png", 10, texWidth, texHeight, wallTextures);
addTexture("/img/walls/break2.png", 11, texWidth, texHeight, wallTextures);
addTexture("/img/walls/spikeballWall.png", 12, texWidth, texHeight, wallTextures,);
addTexture("/img/walls/goal.png", 13, texWidth, texHeight, wallTextures);

//sprites
addTexture("/img/sprites/fireball.png", 0, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/fireballReflect.png", 1, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/clock.png", 2, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/mage0.png", 3, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/mage1.png", 4, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/mage2.png", 5, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/mage3.png", 6, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/mage4.png", 7, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/slime0.png", 8, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/slime1.png", 9, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/slime2.png", 10, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/slime3.png", 11, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/slime4.png", 12, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/spikeball.png", 13, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/ghost0.png", 14, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/ghost1.png", 15, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/ghost2.png", 16, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/ghost3.png", 17, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/bullet.png", 18, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/skeleton0.png", 19, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/skeleton1.png", 20, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/skeleton2.png", 21, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/skeleton3.png", 22, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/skeleton4.png", 23, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss0.png", 24, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss1.png", 25, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss2.png", 26, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss3.png", 27, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss4.png", 28, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss5.png", 29, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss6.png", 30, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss7.png", 31, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss8.png", 32, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss9.png", 33, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss10.png", 34, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss11.png", 35, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss12.png", 36, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/boss13.png", 36, spriteTexWidth, spriteTexHeight, spriteTextures,);
addTexture("/img/sprites/horn.png", 37, spriteTexWidth, spriteTexHeight, spriteTextures,);

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

for (let i = 0; i < 7; i++) {
  const screen = new Image();
  if (screen instanceof HTMLElement) {
    screen.src = `/img/screens/screen${i}.png`;
    screens.push(screen);
  }
}

const frame0Img = new Image();
if (frame0Img instanceof HTMLElement) frame0Img.src = "/img/screens/frame0.png";

const frame1Img = new Image();
if (frame1Img instanceof HTMLElement) frame1Img.src = "/img/screens/frame1.png";

const controlsImg = new Image();
if (controlsImg instanceof HTMLElement) controlsImg.src = "/img/screens/controlsText.png";


const bossCS0 = new Image();
if (bossCS0 instanceof HTMLElement) bossCS0.src = "/img/cutscenes/boss0.png";
cutsceneTextures[0] = bossCS0

const bossCS1 = new Image();
if (bossCS1 instanceof HTMLElement) bossCS1.src = "/img/cutscenes/boss1.png";
cutsceneTextures[1] = bossCS1

const bossCS2 = new Image();
if (bossCS2 instanceof HTMLElement) bossCS2.src = "/img/cutscenes/boss2.png";
cutsceneTextures[2] = bossCS2





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

  screens,
  frame0Img,
  frame1Img,
  controlsImg,

  cutsceneTextures
};

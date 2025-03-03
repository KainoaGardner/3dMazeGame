import { Player } from "./player";
import { Map } from "./map";
import { makeMap } from "./maze";
import { sprite } from "./sprite";
import { CloseBlock } from "./closeblock";
import { FireballWall } from "./fireball";
import { Mage } from "./enemy";
// import { pos } from "./global";

interface levelSettings {
  level: number;
  player: Player;
  map: Map;
  sprites: sprite[];
  moveWall: CloseBlock[];
  fireWall: FireballWall[];
  floorTex: number;
  ceilingTex: number;
}

function setLevel(ls: levelSettings) {
  switch (ls.level) {
    case 1:
      level1(ls);
      break;
    case 2:
      level2(ls);
      break;
    case 4:
      level4(ls);
      break;

    default:
      level0(ls);
      break;
  }
}

function level1(ls: levelSettings) {
  //player
  ls.player.posX = 1.5;
  ls.player.posY = 1.5;
  ls.player.dirX = 1;
  ls.player.dirY = 0;
  ls.player.planeX = 0;
  ls.player.planeY = -1;
  ls.player.holding = 1;

  ls.player.inventory = {
    flashlight: true,
    gun: false,
    run: false,
    horn: false,
    sword: false,
    sheild: false,
    dash: false,
    teleport: false,
  };

  //map

  ls.map.map = [
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1,
    ],
    [
      1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 6, 0, 0, 0, 6, 0, 0, 0,
      1, 6, 0, 0, 0, 4, 1,
    ],
    [
      1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 6, 0, 0, 0, 0, 0, 0, 0, 0,
      1, 6, 0, 0, 1, 0, 5,
    ],
    [
      1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 1, 2, 2,
      1, 6, 0, 0, 1, 0, 5,
    ],
    [
      1, 1, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0,
      1, 6, 0, 1, 1, 0, 5,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 6, 0, 1, 0, 0,
      0, 0, 0, 1, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 6,
      0, 0, 0, 1, 0, 0, 1,
    ],
    [
      1, 0, 0, 1, 6, 1, 6, 1, 6, 1, 6, 1, 6, 1, 1, 1, 6, 0, 2, 0, 1, 0, 1, 0, 6,
      0, 0, 6, 1, 0, 0, 1,
    ],
    [
      1, 0, 0, 1, 1, 1, 6, 6, 1, 1, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1,
      1, 1, 1, 1, 2, 5, 1,
    ],
    [
      1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 0, 0, 1, 5, 0,
      0, 0, 0, 0, 0, 0, 1,
    ],
    [
      1, 2, 2, 1, 6, 6, 1, 1, 6, 6, 1, 1, 6, 6, 1, 2, 2, 0, 0, 0, 0, 6, 1, 1, 0,
      1, 0, 1, 1, 1, 0, 1,
    ],
    [
      1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
      1, 0, 0, 0, 1, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0,
      1, 1, 1, 2, 0, 0, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 2, 0,
      1, 0, 0, 0, 1, 1, 1,
    ],
    [
      1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0,
      0, 0, 0, 0, 0, 0, 5,
    ],
    [
      1, 5, 5, 1, 5, 5, 5, 5, 5, 1, 5, 5, 5, 5, 5, 1, 1, 1, 1, 5, 1, 1, 1, 1, 5,
      1, 1, 1, 1, 1, 1, 1,
    ],
  ];

  ls.moveWall = [
    new CloseBlock(5, 3, 50, 30),
    new CloseBlock(5, 5, 50, 30),
    new CloseBlock(5, 7, 50, 30),
    new CloseBlock(5, 9, 50, 30),
    new CloseBlock(5, 11, 50, 30),

    new CloseBlock(6, 4, 50, 30),
    new CloseBlock(6, 6, 50, 30),
    new CloseBlock(6, 8, 50, 30),
    new CloseBlock(6, 10, 50, 30),
    new CloseBlock(6, 12, 50, 30),

    new CloseBlock(9, 4, 100, 20),
    new CloseBlock(9, 5, 100, 20),
    new CloseBlock(9, 6, 100, 20, 60),
    new CloseBlock(9, 7, 100, 20, 60),
    new CloseBlock(9, 8, 100, 20),
    new CloseBlock(9, 9, 100, 20),
    new CloseBlock(9, 10, 100, 20, 60),
    new CloseBlock(9, 11, 100, 20, 60),
    new CloseBlock(9, 12, 100, 20),
    new CloseBlock(9, 13, 100, 20),

    new CloseBlock(9, 15, 50, 30),
    new CloseBlock(10, 16, 50, 30),
    new CloseBlock(10, 20, 50, 30),
    new CloseBlock(9, 21, 50, 30),

    new CloseBlock(4, 20, 50, 30),
    new CloseBlock(5, 19, 50, 30),
    new CloseBlock(5, 21, 50, 30),

    new CloseBlock(6, 16, 50, 30),
    new CloseBlock(7, 17, 50, 30),

    new CloseBlock(3, 16, 50, 30),
    new CloseBlock(2, 17, 50, 30),
    new CloseBlock(1, 18, 50, 30),

    new CloseBlock(1, 20, 50, 30),
    new CloseBlock(2, 21, 50, 30),
    new CloseBlock(1, 22, 50, 30),

    new CloseBlock(5, 24, 50, 30),
    new CloseBlock(6, 23, 50, 30),
    new CloseBlock(7, 23, 50, 30),
    new CloseBlock(6, 25, 50, 30),
    new CloseBlock(7, 25, 50, 30),

    new CloseBlock(7, 26, 50, 30),
    new CloseBlock(6, 27, 50, 30),

    new CloseBlock(5, 26, 50, 30),
    new CloseBlock(4, 27, 50, 30),
    new CloseBlock(3, 27, 50, 30),
    new CloseBlock(2, 27, 50, 30),
    new CloseBlock(1, 27, 50, 30),
  ];

  ls.fireWall = [
    new FireballWall(1.5, 15.5, 0, -0.1, 100),
    new FireballWall(2.5, 15.5, 0, -0.1, 100, 50),

    new FireballWall(15.5, 1.5, -0.1, 0, 100),
    new FireballWall(15.5, 2.5, -0.1, 0, 100, 50),

    new FireballWall(15.5, 4.5, -0.1, 0, 100, 100),
    new FireballWall(15.5, 5.5, -0.1, 0, 100, 80),
    new FireballWall(15.5, 6.5, -0.1, 0, 100, 60),
    new FireballWall(15.5, 7.5, -0.1, 0, 100, 40),
    new FireballWall(15.5, 8.5, -0.1, 0, 100, 20),

    new FireballWall(15.5, 10.5, -0.1, 0, 100, 0),
    new FireballWall(15.5, 11.5, -0.1, 0, 100, 80),
    new FireballWall(15.5, 12.5, -0.1, 0, 100, 60),
    new FireballWall(15.5, 13.5, -0.1, 0, 100, 40),
    new FireballWall(15.5, 14.5, -0.1, 0, 100, 20),

    new FireballWall(15.5, 19.5, -0.1, 0, 50),

    new FireballWall(15.5, 24.5, -0.1, 0, 150),

    new FireballWall(9.5, 23, 0, 0.1, 150),

    new FireballWall(14.5, 31.5, 0, -0.1, 150),

    new FireballWall(8.5, 30.5, -0.1, 0, 150),
    new FireballWall(8.5, 30.5, 0, -0.1, 150),
    new FireballWall(8.5, 30.5, 0.1, 0, 150),

    new FireballWall(2.5, 31.5, 0, -0.1, 150, 0),
    new FireballWall(3.5, 31.5, 0, -0.1, 150, 50),
    new FireballWall(4.5, 31.5, 0, -0.1, 150, 100),
  ];

  ls.map.brightness = 0.2;
  ls.floorTex = 0;
  ls.ceilingTex = 1;
  ls.sprites = [];
}
function level2(ls: levelSettings) {
  //player
  ls.player.posX = 1.5;
  ls.player.posY = 1.5;
  ls.player.dirX = 1;
  ls.player.dirY = 0;
  ls.player.planeX = 0;
  ls.player.planeY = -1;
  ls.player.holding = 2;

  ls.player.inventory = {
    flashlight: true,
    gun: false,
    run: false,
    horn: false,
    sword: true,
    sheild: false,
    dash: false,

    teleport: false,
  };

  //map

  ls.map.map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [1, 0, 1, 10, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 6, 1, 10, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 5, 1, 0, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 1, 6, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 1],
    [1, 5, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 1, 1, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 5, 1, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [1, 0, 0, 0, 1, 6, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 10, 0, 1, 6, 6, 6, 6, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 10, 0, 2, 0, 0, 0, 0, 2, 4, 1],
    [1, 1, 1, 1, 1, 6, 1, 5, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  ls.map.lightList = [];
  ls.map.brightness = 0.5;

  ls.moveWall = [
    new CloseBlock(3, 10, 50, 50),
    new CloseBlock(5, 10, 50, 50, 50),
    new CloseBlock(13, 5, 50, 50),
    new CloseBlock(14, 5, 50, 50),

    new CloseBlock(14, 9, 100, 25, 75),
    new CloseBlock(14, 10, 100, 25, 50),
    new CloseBlock(14, 11, 100, 25, 25),
    new CloseBlock(14, 12, 100, 25),
  ];
  ls.fireWall = [
    new FireballWall(4.5, 7.5, 0, -0.1, 150),
    new FireballWall(1.5, 15.5, 0, -0.1, 100),
    new FireballWall(8.5, 0.5, 0, 0.1, 100),
    new FireballWall(7.5, 1.5, 0.1, 0, 100),
    new FireballWall(15.5, 7.5, -0.1, 0, 150),
    new FireballWall(11.5, 15.5, 0, -0.1, 150),
    new FireballWall(11.5, 15.5, 0, -0.1, 150),
    new FireballWall(11.5, 5.5, 0, -0.1, 100),
  ];
  ls.floorTex = 4;
  ls.ceilingTex = 1;

  ls.sprites = [];
}
function level3(ls: levelSettings) {}
function level4(ls: levelSettings) {
  //player
  ls.player.posX = 1.5;
  ls.player.posY = 1.5;
  ls.player.dirX = 1;
  ls.player.dirY = 0;
  ls.player.planeX = 0;
  ls.player.planeY = -1;

  ls.player.inventory = {
    flashlight: true,
    gun: false,
    run: true,
    horn: false,
    sword: true,
    sheild: false,
    dash: false,
    teleport: false,
  };

  //map

  ls.map.map = makeMap(16, 5, 15);

  const goal = ls.map.map.length - 1;
  ls.map.lightList = [{ x: goal, y: goal }];
  ls.map.brightness = 0.2;

  ls.moveWall = [];
  ls.fireWall = [];
  ls.floorTex = 2;
  ls.ceilingTex = 1;

  ls.sprites = [];
}
function level5(ls: levelSettings) {}
function level6(ls: levelSettings) {}
function level7(ls: levelSettings) {}
function level8(ls: levelSettings) {}
function level9(ls: levelSettings) {}
function level10(ls: levelSettings) {}

function level0(ls: levelSettings) {
  //player
  ls.player.posX = 1.5;
  ls.player.posY = 1.5;
  ls.player.dirX = 1;
  ls.player.dirY = 0;
  ls.player.planeX = 0;
  ls.player.planeY = -1;

  ls.player.inventory = {
    flashlight: true,
    gun: true,
    run: true,
    horn: true,
    sword: true,
    sheild: true,
    dash: true,
    teleport: true,
  };

  //map

  ls.map.map = [
    [1, 4, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 2, 10, 0, 1],
    [1, 5, 6, 1, 1, 1, 1, 1],
  ];

  ls.map.lightList = [];
  ls.map.brightness = 0.5;

  ls.moveWall = [new CloseBlock(6, 2, 50, 30)];
  ls.fireWall = [new FireballWall(7.5, 1.5, -0.1, 0, 50)];
  ls.floorTex = 3;
  ls.ceilingTex = 1;

  ls.sprites = [
    { x: 3, y: 3, texture: 3, type: new Mage(3, 3, 100, 0.1, 100) },
  ];
}

export { type levelSettings, setLevel };

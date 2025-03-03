interface cell {
  right: boolean;
  left: boolean;
  up: boolean;
  down: boolean;
}

export function makeMap(
  size: number,
  removeAmount: number,
  blockAmount: number,
) {
  const maze: cell[][] = [];

  for (let r = 0; r < size; r++) {
    const row = [];
    for (let c = 0; c < size; c++) {
      let currCell = { right: true, left: true, up: true, down: true };
      row.push(currCell);
    }
    maze.push(row);
  }

  const visited = new Set<string>();
  makeBaseMaze(0, 0, maze, visited);

  return makeFinalMaze(maze, removeAmount, blockAmount);
}

function makeBaseMaze(
  r: number,
  c: number,
  maze: cell[][],
  visited: Set<string>,
) {
  visited.add(`${r},${c}`);
  const dir = [
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0],
  ];
  let shuffDir = dir
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  for (let i = 0; i < shuffDir.length; i++) {
    const dY = shuffDir[i][0];
    const dX = shuffDir[i][1];
    const y = r + dY;
    const x = c + dX;

    if (
      !visited.has(`${y},${x}`) &&
      y >= 0 &&
      y < maze.length &&
      x >= 0 &&
      x < maze.length
    ) {
      switch (`${dY},${dX}`) {
        case "0,1":
          maze[r][c].right = false;
          maze[y][x].left = false;
          break;
        case "0,-1":
          maze[r][c].left = false;
          maze[y][x].right = false;
          break;
        case "-1,0":
          maze[r][c].up = false;
          maze[y][x].down = false;
          break;
        case "1,0":
          maze[r][c].down = false;
          maze[y][x].up = false;
          break;
      }
      makeBaseMaze(y, x, maze, visited);
    }
  }
}

function makeFinalMaze(
  baseMaze: cell[][],
  removeAmount: number,
  blockAmount: number,
): number[][] {
  const size = baseMaze.length;
  let finalMaze: number[][] = [];

  for (let r = 0; r < size; r++) {
    const row1 = [1];
    const row2 = [1];
    for (let c = 0; c < size; c++) {
      const cell = baseMaze[r][c];
      if (cell.up) {
        row1.push(1);
        row1.push(1);
        if (cell.right) {
          row2.push(0);
          row2.push(1);
        } else {
          row2.push(0);
          row2.push(0);
        }
      } else {
        const upRight = r - 1 >= 0 && baseMaze[r - 1][c].right;
        const rightUp = c + 1 < size && baseMaze[r][c + 1].up;

        if (cell.right) {
          row1.push(0);
          row1.push(1);
          row2.push(0);
          row2.push(1);
        } else if (upRight || rightUp) {
          row1.push(0);
          row1.push(1);
          row2.push(0);
          row2.push(0);
        } else {
          row1.push(0);
          row1.push(0);
          row2.push(0);
          row2.push(0);
        }
      }
    }
    finalMaze.push(row1);
    finalMaze.push(row2);
  }

  const finalRow: number[] = [];
  for (let i = 0; i < size * 2 + 1; i++) {
    finalRow.push(1);
  }
  finalMaze.push(finalRow);
  finalMaze[size * 2 - 1][size * 2 - 1] = 0;
  finalMaze[size * 2 - 1][size * 2] = 4;
  if (removeAmount !== 0) {
    finalMaze = removeWalls(finalMaze, size * 2 + 1, removeAmount);
  }
  if (blockAmount !== 0) {
    finalMaze = addBlocks(finalMaze, size * 2 + 1, blockAmount);
  }
  return finalMaze;
}

function removeWalls(
  maze: number[][],
  size: number,
  removeAmount: number,
): number[][] {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (
        r != 0 &&
        r != size - 1 &&
        c != 0 &&
        c != size - 1 &&
        maze[r][c] === 1 &&
        Math.floor(Math.random() * removeAmount) === 0
      ) {
        maze[r][c] = 0;
      }
    }
  }

  return maze;
}

function addBlocks(maze: number[][], size: number, chance: number): number[][] {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (
        maze[r][c] === 0 &&
        Math.floor(Math.random() * chance) === 0 &&
        r != 1 &&
        c != 1
      ) {
        maze[r][c] = 3;
      }
    }
  }
  return maze;
}

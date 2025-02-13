const keyMap = new Map<string, boolean>();
keyMap.set("ArrowRight", false);
keyMap.set("ArrowLeft", false);
keyMap.set("ArrowUp", false);
keyMap.set("ArrowDown", false);
keyMap.set("Space", false);
keyMap.set("Digit1", false);
keyMap.set("Digit2", false);
keyMap.set("Digit3", false);

window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);

function keyDown(e: any) {
  if (keyMap.has(e.code)) {
    keyMap.set(e.code, true);
  }
}

function keyUp(e: any) {
  if (keyMap.has(e.code)) {
    keyMap.set(e.code, false);
  }
}

export { keyMap };

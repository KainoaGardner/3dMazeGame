const keyMap = new Map<string, boolean>();
keyMap.set("ArrowRight", false);
keyMap.set("ArrowLeft", false);
keyMap.set("ArrowUp", false);
keyMap.set("ArrowDown", false);
keyMap.set("KeyW", false);
keyMap.set("KeyS", false);
keyMap.set("KeyD", false);
keyMap.set("KeyA", false);

keyMap.set("KeyE", false);
keyMap.set("KeyQ", false);

keyMap.set("Space", false);
keyMap.set("ShiftLeft", false);
keyMap.set("Digit1", false);
keyMap.set("Digit2", false);
keyMap.set("Digit3", false);
keyMap.set("Digit4", false);
keyMap.set("Digit5", false);

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

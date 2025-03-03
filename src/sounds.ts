const shootSound = new Audio("/sound/shoot.wav");
if (shootSound instanceof HTMLElement) shootSound.volume = 0.3;

const ammoSound = new Audio("/sound/ammo.wav");
if (ammoSound instanceof HTMLElement) ammoSound.volume = 0.3;

const mineSound = new Audio("/sound/mine.wav");
if (mineSound instanceof HTMLElement) mineSound.volume = 1;

const reflectSound = new Audio("/sound/reflect.wav");
if (reflectSound instanceof HTMLElement) reflectSound.volume = 1;

const hitSound = new Audio("/sound/hitHurt.wav");
if (hitSound instanceof HTMLElement) hitSound.volume = 1;

const swordSounds: any[] = [];
for (let i = 0; i < 5; i++) {
  const swordSound = new Audio(`/sound/swordSlash${i}.wav`);

  if (swordSound instanceof HTMLElement) swordSound.volume = 0.4;
  swordSounds.push(swordSound);
}

export {
  shootSound,
  ammoSound,
  swordSounds,
  reflectSound,
  mineSound,
  hitSound,
};

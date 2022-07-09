// All sounds used with Howler
// Reference: https://github.com/goldfire/howler.js#documentation

// Click on emoji key from keyboard
let clickEmojiSFX = new Howl({
  src: [`assets/sounds/arcade-game-jump-coin.wav`],
});

// Click on left/right buttons to switch between keyboard sets
let leftRightButtonsSFX = new Howl({
  src: [`assets/sounds/correct-positive-notification.wav`],
  volume: 0.8,
});

// Click on Send button
let sendButtonSFX = new Howl({
  src: [`assets/sounds/select-click.wav`],
});

// Click on Exit button
let exitButtonSFX = new Howl({
  src: [`assets/sounds/video-game-retro-click.wav`],
});

// Click on backspace/delete, or try sending without a message
let errorSFX = new Howl({
  src: [`assets/sounds/negative-tone-interface-tap.wav`],
});

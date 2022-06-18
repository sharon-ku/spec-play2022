/*
Speculative Play 2022
Sharon Ku

Description will go here
*/

"use strict";

// Keyboard only becomes active when clicked on an npc to talk to
let keyboardActive = false;
keyboardIsInactive();

// Create a PIXI canvas
// For nice resolution on circle, source: https://stackoverflow.com/questions/41932258/how-do-i-antialias-graphics-circle-in-pixijs
let app = new PIXI.Application({
  transparent: false,
  width: 640,
  height: 360,
  antialias: true,
});
document.body.appendChild(app.view);

// store all npcs in here
let npcs = [];
// number of npcs
const NUM_NPCS = 3;

// Create a class for an NPC
// Source: https://www.youtube.com/watch?v=NG5qxx9Ij6Q&ab_channel=DowerChin
class Npc {
  constructor({ x, y }) {
    // set to true if currently talking to this npc
    this.talking = false;

    // Body position: all body parts are offset from these coordinates
    this.x = x;
    this.y = y;

    this.speed = 0.5;
    this.vx = 0;
    this.vy = 0;

    this.head = new PIXI.Graphics();
    this.head.beginFill(0x5cafe2);
    this.head.drawCircle(0, 0, 80);
    this.head.x = undefined;
    this.head.y = undefined;
    // offset from this.x and this.y
    this.head.offset = {
      x: 0,
      y: 0,
    };

    // Opt-in to interactivity
    this.head.interactive = true;
    // Shows hand cursor
    this.head.buttonMode = true;
    // Handles mouse and touch click
    // reference: https://pixijs.io/examples/#/interaction/click.js
    this.head.on("pointerdown", this.clicked.bind(this));

    app.stage.addChild(this.head);

    this.faceStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 100,
      //   // fontStyle: "italic",
      //   // fontWeight: "bold",
      //   // fill: ["#ffffff", "#00ff99"], // gradient
      //   // stroke: "#4a1850",
      //   // strokeThickness: 5,
      //   // dropShadow: true,
      //   // dropShadowColor: "#000000",
      //   // dropShadowBlur: 4,
      //   // dropShadowAngle: Math.PI / 6,
      //   // dropShadowDistance: 6,
      //   // wordWrap: true,
      //   // wordWrapWidth: 440,
      //   // lineJoin: "round",
    });

    this.faceText = new PIXI.Text("🙊", this.faceStyle);
    this.faceText.x = undefined;
    this.faceText.y = undefined;
    // offset from this.x and this.y
    this.faceText.offset = {
      x: 0,
      y: 0,
    };

    // center text
    this.faceText.anchor.set(0.5);

    app.stage.addChild(this.faceText);

    // NPC response message
    this.messageStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 40,
    });
    this.messageText = new PIXI.Text("🙊", this.messageStyle);
    this.messageText.x = undefined;
    this.messageText.y = undefined;
    // offset from this.x and this.y
    this.messageText.offset = {
      x: 110,
      y: 0,
    };
    // center text
    this.messageText.anchor.set(0, 0.5);

    // Update body part positions that are relative to this.x and this.y
    this.updateBodyPartPositions();

    app.stage.addChild(this.messageText);
  }

  // Head is clicked and we're not already talking to this character
  clicked() {
    // If we're not currently talking to this npc:
    if (!this.talking) {
      stopAllConversations();

      // head temporarily scales up to check that click is working
      this.head.scale.x *= 1.05;
      this.head.scale.y *= 1.05;

      // give ability to talk with keyboard
      this.talking = true;

      // keyboard pops into view
      keyboardIsActive();
    }
  }

  // Code that should be updated every frame
  loop() {
    // Constrain npc's movement along x and y directions
    this.constrainMovement();

    // Handles random walking
    this.walk();
  }

  // Constrain npc's movement along x and y directions
  constrainMovement() {
    // If npc exceeds left or right of canvas, stop movement in s direction
    if (this.x < 50 || this.x > app.screen.width - 50) {
      this.vx = 0;
    }

    // If npc exceeds top or bottom of canvas, stop movement in y direction
    if (this.y < 50 || this.y > app.screen.height - 50) {
      this.vy = 0;
    }
  }

  // Handles random walking
  walk() {
    if (Math.random() < 0.005) {
      this.vx = randomBtw(-this.speed, this.speed);
      this.vy = randomBtw(-this.speed, this.speed);
    }

    this.x += this.vx;
    this.y += this.vy;

    // Update body part positions that are relative to this.x and this.y
    this.updateBodyPartPositions();
  }

  // Update body part positions that are relative to this.x and this.y
  updateBodyPartPositions() {
    this.head.x = this.x + this.head.offset.x;
    this.head.y = this.y + this.head.offset.y;

    this.faceText.x = this.x + this.faceText.offset.x;
    this.faceText.y = this.y + this.faceText.offset.y;

    this.messageText.x = this.x + this.messageText.offset.x;
    this.messageText.y = this.y + this.messageText.offset.y;
  }

  // Update face when clicked on Send button
  updateFace() {
    if (this.talking) {
      this.faceText.text = nextEmojiToDisplay;
    }
  }

  // Update response message when clicked on Send button
  updateResponseMessage() {
    if (this.talking) {
      this.messageText.text = npcResponseMessage;
    }
  }
}

// Return random value between min and max
function randomBtw(min, max) {
  let randomValue = min + Math.random() * (max - min);
  return randomValue;
}

// Create many npcs
createManyNpcs();

// Create many npcs
function createManyNpcs() {
  for (let i = 0; i < NUM_NPCS; i++) {
    let npcProperties = {
      x: Math.random() * app.screen.width,
      y: Math.random() * app.screen.height,
    };

    let npc = new Npc(npcProperties);
    npcs.push(npc);
  }

  // app.stage.addChild(npc);
}

// Similar to draw()
// source: https://pixijs.io/examples/#/demos-basic/blendmodes.js
app.ticker.add(gameLoop);

// Similar to draw()
function gameLoop(delta) {
  for (let i = 0; i < npcs.length; i++) {
    let npc = npcs[i];
    npc.loop();
  }

  // iterate through the dudes and update the positions
  // for (let i = 0; i < dudeArray.length; i++) {
  //     const dude = dudeArray[i];
  //     dude.direction += dude.turningSpeed * 0.01;
  //     dude.x += Math.sin(dude.direction) * dude.speed;
  //     dude.y += Math.cos(dude.direction) * dude.speed;
  //     dude.rotation = -dude.direction - Math.PI / 2;
  //
  //     // wrap the dudes by testing their bounds...
  //     if (dude.x < dudeBounds.x) {
  //         dude.x += dudeBounds.width;
  //     } else if (dude.x > dudeBounds.x + dudeBounds.width) {
  //         dude.x -= dudeBounds.width;
  //     }
  //
  //     if (dude.y < dudeBounds.y) {
  //         dude.y += dudeBounds.height;
  //     } else if (dude.y > dudeBounds.y + dudeBounds.height) {
  //         dude.y -= dudeBounds.height;
  //     }
  // }
}

function keyboardIsActive() {
  keyboardActive = true;
  $(`#keyboard-section`).show();
}

function keyboardIsInactive() {
  keyboardActive = false;
  $(`#keyboard-section`).hide();
}

// let keyboardEmojis = `🎑🌄🥻🙉🍅🥽🧶👮‍♀️🙊🤞👩‍👧‍👦⚽️👠🧐🧥💂👩‍🦱🌌🐣⌚️👙😉🐗😞🤛🐨🩰🖕👩‍👦👎😒😕😊🌉🚗👉👐🐽🥳🥑👕🐌🏉🩳🕍🚄🚌🍑⛪️✍️🧵🧳🧑😔🐯🏑`;
let keyboardEmojis = `🎑🌄🥻🙉🍅🥽🧶👮‍♀️🙊🤞👩‍👧‍👦⚽️👠🧐🧥💂👩‍🦱🌌🐣⌚️👙😉🐗😞🤛🐨🩰🖕👩‍👦👎😒`;
// let keyboardEmojis = `🎑🌄🥻🙉🍅👩‍👧‍👦`;

// Max emojis user can type in
let maxInputEmojis = 10;

/*
Handle NPC facial expressions
*/
// Emojis from: https://www.freecodecamp.org/news/all-emojis-emoji-list-for-copy-and-paste/
let hornyEmojis = `😏😘😍😚😙😗😉🤭🤫🤤🤣`;
let inLoveEmojis = `🥰🤩😇😊🤗😳😎🤓🧐🤑`;
let happyEmojis = `🙂😀😄😁🥳😋😛😜🤪😝😆😂`;
let neutralEmojis = `🙃😐😑😶😬`;
let surprisedEmojis = `😮😯😲🤯😦😧😨😰😱`;
let boredEmojis = `😪😴🥱😅🤨😒🙄😌😔🤔`;
let sadEmojis = `😕😟🙁😥😢😭😓😩😫😖😞🥺`;
let sickEmojis = `😷🤒🤕🤢🤮🤧🥵🥶🥴😵`;
let angryEmojis = `😤😡😠🤬😈👿💀`;
let unusedEmojis = `🤐‍🤥`;

// Grapheme Splitter is a library that handles splitting emojis properly
// Without it, emojis like this one 👩‍👧‍👦 will count as several emojis
let splitter = new GraphemeSplitter();

// All categories of emojis
let emojiCategories = [
  `horny`,
  `inLove`,
  `happy`,
  `neutral`,
  `surprised`,
  `bored`,
  `sad`,
  `sick`,
  `angry`,
];

// Split two-char emojis and six-char combined emoji into arrays
let hornyEmojisArray = splitter.splitGraphemes(hornyEmojis);
let inLoveEmojisArray = splitter.splitGraphemes(inLoveEmojis);
let happyEmojisArray = splitter.splitGraphemes(happyEmojis);
let neutralEmojisArray = splitter.splitGraphemes(neutralEmojis);
let surprisedEmojisArray = splitter.splitGraphemes(surprisedEmojis);
let boredEmojisArray = splitter.splitGraphemes(boredEmojis);
let sadEmojisArray = splitter.splitGraphemes(sadEmojis);
let sickEmojisArray = splitter.splitGraphemes(sickEmojis);
let angryEmojisArray = splitter.splitGraphemes(angryEmojis);

// Odds of getting a positive emoji
const CHANCE_TO_GET_POSITIVE_EMOJI = 0.5;
// Set the next emoji after clicking "Send" button
let nextEmojiToDisplay = undefined;

/*
Handle NPC responses
*/
// Will either positive or negative
let responseType = undefined;
// Total number of emoji characters in response string
const NPC_RESPONSE_MAX_LENGTH = 3;
// Response message from NPC after clicking "Send" button
let npcResponseMessage = undefined;

// Other random emojis to mix in with facial expressions
let otherEmojis = `💋💖💚💯💦💣💤👋🖖👌🤏🤞🤟🖕👍👎👏🙏💪🦶👀👅🍆🍑🌙🌞⭐🌈🔥✨🎉🏆💩🤡👻👽👑🔪🎈💰🪓🔫`;
// Split emojis into array
let otherEmojisArray = splitter.splitGraphemes(otherEmojis);

// Split two-char emojis and six-char combined emoji
let splitEmojis = splitter.splitGraphemes(keyboardEmojis);

// Append emojis to the emoji keyboard
for (let i = 0; i < splitEmojis.length; i++) {
  $(`#emoji-keyboard`).append(
    `<div class="emoji-character">${splitEmojis[i]}</div>`
  );
}

// Add Send button
$(`#emoji-keyboard`).append(`<button id="send-button">Send</button>`);

// When clicked on emoji from keyboard:
$(`.emoji-character`).click(function () {
  // Store emoji that was clicked
  let containedEmoji = $(this).text();

  // Add it to the input bubble, constraining to max 10 emojis
  // splintInputEmojis: number of emojis in input box
  let splitInputEmojis = splitter.splitGraphemes(
    $(`#emoji-input-bubble`).text()
  );
  console.log(splitInputEmojis.length);

  if (splitInputEmojis.length < maxInputEmojis + 1) {
    $(`#emoji-input-bubble`).append(containedEmoji);
  }

  // // Remove emoji from keyboard
  // $(this).remove();
});

// Remove input emoji if backspace or delete key pressed
$(document).keydown(function (e) {
  // 8: backspace key
  // 46: delete key
  if (e.keyCode === 8 || e.keyCode === 46) {
    // Grab current string in input and split emojis properly into array
    let currentStringArray = splitter.splitGraphemes(
      $(`#emoji-input-bubble`).text()
    );
    // Remove 1 emoji from end of string
    let strMinus = currentStringArray.slice(0, -1);
    // Clear what's currently in input field
    $(`#emoji-input-bubble`).text(``);

    // Restore the emoji input field
    for (let i = 0; i < strMinus.length; i++) {
      $(`#emoji-input-bubble`).append(strMinus[i]);
    }
  }
});

// After clicking on x button
$(`#exit-button`).click(function () {
  console.log(`exit clicked`);
  // Hide the keyboard
  keyboardIsInactive();

  // Stop all conversations
  stopAllConversations();
});

// Stop all current conversations
function stopAllConversations() {
  for (let i = 0; i < npcs.length; i++) {
    let npc = npcs[i];
    npc.talking = false;
    // Empty out response message
    npc.messageText.text = ``;
  }
}

// After clicking on Send button
$(`#send-button`).click(function () {
  // Remove message in input-bubble
  $(`#emoji-input-bubble`).empty();
  // Empty out npcResponseMessage
  npcResponseMessage = ``;
  $(`#npc-response-message`).empty();

  // Randomly select the response type of NPC
  let randomIndex = Math.floor(Math.random() * emojiCategories.length);
  let responseType = emojiCategories[randomIndex];
  console.log(responseType);

  // Update facial and verbal reaction based on the response type
  if (responseType === `horny`) {
    setNpcReaction(hornyEmojisArray);
  } else if (responseType === `inLove`) {
    setNpcReaction(inLoveEmojisArray);
  } else if (responseType === `happy`) {
    setNpcReaction(happyEmojisArray);
  } else if (responseType === `neutral`) {
    setNpcReaction(neutralEmojisArray);
  } else if (responseType === `surprised`) {
    setNpcReaction(surprisedEmojisArray);
  } else if (responseType === `bored`) {
    setNpcReaction(boredEmojisArray);
  } else if (responseType === `sad`) {
    setNpcReaction(sadEmojisArray);
  } else if (responseType === `sick`) {
    setNpcReaction(sickEmojisArray);
  } else if (responseType === `angry`) {
    setNpcReaction(angryEmojisArray);
  }
});

// Reaction is composed of two parts: the face and the response message
function setNpcReaction(reactionArray) {
  // (1) Update facial expression of emoji
  updateNpcFace(reactionArray);

  // (2) Compose a response message
  composeAMessage(reactionArray);
}

// Update NPC's face based on response type
function updateNpcFace(reactionArray) {
  // Fetch a positive emoji
  nextEmojiToDisplay = random(reactionArray);
  // Update emoji face and response message
  $(`#emoji-face`).text(nextEmojiToDisplay);

  // Update emoji face in Pixi
  for (let i = 0; i < npcs.length; i++) {
    let npc = npcs[i];

    npc.updateFace();
  }
}

// Compose a response message
function composeAMessage(emojiArraySet) {
  // Choose random number of emojis to respond with
  let randomResponseLength = Math.ceil(Math.random() * NPC_RESPONSE_MAX_LENGTH);

  // Type out the randomized message
  for (let i = 0; i < randomResponseLength; i++) {
    let newCharacter;
    // The message is composed of facial expressions and other emojis
    if (Math.random() < 0.2) {
      newCharacter = random(emojiArraySet);
    } else {
      newCharacter = random(otherEmojisArray);
    }

    npcResponseMessage += newCharacter;
  }

  // Update response message
  $(`#npc-response-message`).text(npcResponseMessage);

  // Update response message in Pixi
  for (let i = 0; i < npcs.length; i++) {
    let npc = npcs[i];
    npc.updateResponseMessage();
  }
}

/*------------------------
p5 below - unused for now
-------------------------*/

/**
Description of preload
*/
function preload() {}

/**
Description of setup
*/
function setup() {}

/**
Description of draw()
*/
function draw() {}

/*
Speculative Play 2022
Sharon Ku

Description will go here
*/

"use strict";

// Different scenes in this game: restaurant
let stage = `restaurant`;

// Keyboard only becomes active when clicked on an npc to talk to
let keyboardActive = false;
keyboardIsInactive();

// Create a PIXI canvas
// For nice resolution on circle, source: https://stackoverflow.com/questions/41932258/how-do-i-antialias-graphics-circle-in-pixijs
let app = new PIXI.Application({
  transparent: false,
  width: 999, //640
  height: 487, //360
  antialias: true,
});
document.body.appendChild(app.view);

// border around which objects (like NPCs) cannot pass through
let canvasPadding = 100;

// const backgroundContainer = new PIXI.Container();
//
// app.stage.addChild(backgroundContainer);

//
// backgroundContainer.addChild(restaurantBackground);
//
// // Move container to the center
// backgroundContainer.x = app.screen.width / 2;
// backgroundContainer.y = app.screen.height / 2;
//
// // Center bunny sprite in local container coordinates
// backgroundContainer.pivot.x = backgroundContainer.width / 2;
// backgroundContainer.pivot.y = backgroundContainer.height / 2;

// store all npcs in here
let npcs = [];
// number of npcs
const NUM_NPCS = 8;

// Create many npcs
createManyNpcs();

// Set up restaurant scene
setUpScene();

// Depth sorting for NPCs
depthSortNpcs();

function setUpScene() {
  if (stage === `restaurant`) {
    // Add image in scene background
    addBackground();

    // Add cashier NPC
    let npcCashier = new NpcCashier();
    npcs.push(npcCashier);

    // Add table image
    addTableImage();

    // Add customer adult NPC
    let npcCustomerAdult = new NpcCustomerAdult();
    npcs.push(npcCustomerAdult);
  }
}

// Add image in scene background
function addBackground() {
  let restaurantBackground = PIXI.Sprite.from(
    "assets/images/restaurant/background.png"
  );
  // body's position
  restaurantBackground.x = app.screen.width / 2;
  restaurantBackground.y = app.screen.height / 2;

  // center the sprite's anchor point
  restaurantBackground.anchor.set(0.5);

  app.stage.addChild(restaurantBackground);
}

// Add table image
function addTableImage() {
  let tableImage = PIXI.Sprite.from("assets/images/restaurant/table.png");
  // body's position
  tableImage.x = app.screen.width / 2;

  tableImage.y = app.screen.height - 207 / 2;

  // center the sprite's anchor point
  tableImage.anchor.set(0.5);

  app.stage.addChild(tableImage);
}

// Create many npcs
function createManyNpcs() {
  if (stage != `restaurant`) {
    for (let i = 0; i < NUM_NPCS; i++) {
      let npc = new Npc();
      npcs.push(npc);
    }
  }
}

// Depth sorting for NPCs based on y positions
function depthSortNpcs() {
  // REMOVED FOR NOW: please implement this back later
  // app.stage.children.sort(sortByY);
  //
  // for (let i = 0; i < app.stage.children.length; i++) {
  //   app.stage.children[i].zIndex = i;
  // }
}

// Return random value between min and max
function randomBtw(min, max) {
  let randomValue = min + Math.random() * (max - min);
  return randomValue;
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

  // Sort NPC's depth based on y positions
  depthSortNpcs();

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

// Source: Pippin's lecture - https://pippinbarr.com/cart253-2020/topics/object-oriented-programming/introducing-object-oriented-programming.html#display-order
function sortByY(npc1, npc2) {
  return npc1.children[1].y - npc2.children[1].y;
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

// Put all keyboard set strings into here
// The strings will be converted into arrays
// Source: https://getemoji.com/
// let keyboardSets = [
//   // Keyboard set 1: faces
//   `🙂😄😁🥳😋😛😏😘😍😚😲🤯😧😨😤😡😠🤬😴🥱😅🤨😒🙄🤔`,
//   // Keyboard set 2: body parts
//   `👋🖐👌🖖🤏✌️🤞🤘👉🖕👍👎👊🤜👏🙏🤝💪👂🦶👃👀🧠👅💋`,
//   // Keyboard set 3: objects
//   `❤️💔💖💝❌💯💤❓🎵💭⌚️📞💡💰💳💎🔫💣🪓🔪⚰️🔮🎊🎉🎁`,
//   // Keyboard set 4: nature
//   `🎄🌳🌴🍀🍂🍄💐🥀🌸🌞🌝🌎🪐⭐️🌟✨⚡️🔥🌈☁️❄️☃️💧💦☂️`,
//   // Keyboard set 5: animals
//   `🐶🐱🐹🐷🐼🐇🐔🐵🙈🐧🐣🐣🦉🐴🦄🐛🦋🦂🐌🐙🐠🐳🦧🦘🦥`,
//   // Keyboard set 6: food
//   `🍎🍌🍉🍇🍓🍒🍑🍍🍅🍆🥑🌶️🌽🍞🥖🧀🍳🍗🌭🍔🍟🍕🥗🍣🍰`,
// ];
let keyboardSets = [
  // Keyboard set 1: faces
  `🙂😄😁🥳😋😛😏😘😍😚😲🤯😧😨😤😡🤬😴🥱😅🤨😒🤑🙄🤔`,
  // Keyboard set 2: body parts
  `👋🖐👌🖖🤏✌️🤞🤘👉🖕👍👎👊🤜👏🙏🤝💪👂🦶👃👀🧠👅💋`,
  // Keyboard set 3: objects + food
  `❤️💔💯💤❓🎵⌚️💰💳🔫💣🪓🔪⚰️🔮🎉🍔🍟🍕🌶️🍑🍌🍎🍆🍰`,
  // Keyboard set 4: animals + nature
  `🐶🐱🐷🐇🐔🙈🐧🐣🦄🦋🐌🐠🐳🦥🌳🍀🌸🌞🌝🌟✨⚡️🔥☃️🌈`,
];
// let keyboardEmojis = `🎑🌄🥻🙉🍅🥽🧶👮‍♀️🙊🤞👩‍👧‍👦⚽️👠🧐🧥💂👩‍🦱🌌🐣⌚️👙😉🐗😞🤛🐨🩰🖕👩‍👦👎😒`;
// let keyboardObjectEmojis = `🌄🙉🍅🧶👮‍♀️🙊🤞⚽️👠👩‍🌌🐣👙🐗🤛🐨🩰🖕👩‍👦👎🚗👉👐🐽🥑👕🐌🏉🩳🚌🍑✍️🧵🧳🐯`,
// `🙉🍅👮‍♀️🙊🤞⚽️👠‍🌌🐣👙🐗🤛🩰🖕👩‍👦👎🚗👉🥑🐌🩳🚌🍑🧳🐯`,

// let keyboardEmojis = keyboardFaceEmojis + keyboardObjectEmojis;
let keyboardEmojis = [];
let currentKeyboardSet = 0;

// Max emojis user can type in
let maxInputEmojis = 5; //19

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
for (let i = 0; i < keyboardSets.length; i++) {
  keyboardSets[i] = splitter.splitGraphemes(keyboardSets[i]);
}

// Append emojis to the emoji keyboard
fillKeyboard();

// Append emojis to the emoji keyboard
function fillKeyboard() {
  // Set the keyboard emojis to current keyboard set
  keyboardEmojis = keyboardSets[currentKeyboardSet];

  // Clear what's currently in keyboard
  $(`#emoji-keyboard`).text(``);

  // Now fill it
  for (let i = 0; i < keyboardEmojis.length; i++) {
    $(`#emoji-keyboard`).append(
      `<div class="emoji-key">
        <div class="emoji-character">${keyboardEmojis[i]}</div>
      </div>`
    );
  }

  // Add Left and right buttons
  $(`#emoji-keyboard`).append(
    `<button id="left-button" class="left-right-buttons"><</button>
    <button id="right-button" class="left-right-buttons">></button>`
  );

  // Add Send button
  $(`#emoji-keyboard`).append(`<button id="send-button">✉️➟ </button>`);

  // Handle clicking behaviours
  emojiCharacterClicking();
  leftAndRightButtonClick();
  sendButtonClick();
}

// Make emoji character clickable
function emojiCharacterClicking() {
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

    if (splitInputEmojis.length < maxInputEmojis) {
      // Play click SFX
      clickEmojiSFX.play();

      // Add emoji to input bubble
      $(`#emoji-input-bubble`).append(containedEmoji);
    } else if (splitInputEmojis.length === maxInputEmojis) {
      // if reach max number emojis: play sfx
      errorSFX.play();
    }

    // // Remove emoji from keyboard
    // $(this).remove();
  });
}

// Remove input emoji if backspace or delete key pressed
$(document).keydown(function (e) {
  // 8: backspace key
  // 46: delete key
  if (e.keyCode === 8 || e.keyCode === 46) {
    // Play Exit button SFX
    exitButtonSFX.play();

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
  // Play exit button SFX
  exitButtonSFX.play();

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

// Handle clicking effects of left and right buttons
function leftAndRightButtonClick() {
  // After clicking on Left button
  $(`#left-button`).click(function () {
    // Play sfx
    leftRightButtonsSFX.play();

    if (currentKeyboardSet >= 1) {
      // go back one keyboard set
      currentKeyboardSet -= 1;
    } else {
      // start with the greatest keyboard set
      currentKeyboardSet = keyboardSets.length - 1;
    }

    fillKeyboard();
  });

  // After clicking on Right button
  $(`#right-button`).click(function () {
    // Play sfx
    leftRightButtonsSFX.play();

    if (currentKeyboardSet < keyboardSets.length - 1) {
      // go forward one keyboard set
      currentKeyboardSet++;
    } else {
      // start with the lowest keyboard set
      currentKeyboardSet = 0;
    }

    fillKeyboard();
  });
}

// Handle send button clicking
function sendButtonClick() {
  // After clicking on Send button
  $(`#send-button`).click(function () {
    // If input-bubble is not empty:
    if ($(`#emoji-input-bubble`).text() != ``) {
      // Play send SFX
      sendButtonSFX.play();

      // Remove message in input-bubble
      $(`#emoji-input-bubble`).empty();
      // Empty out npcResponseMessage
      npcResponseMessage = ``;
      $(`#npc-response-message`).empty();

      // Randomly select the response type of NPC
      responseType = getRandomItem(emojiCategories);
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
    } else {
      // Play error SFX
      errorSFX.play();
    }
  });
}

// Get random item from an array
// Code from: https://www.programiz.com/javascript/examples/get-random-item
function getRandomItem(arr) {
  // get random index value
  const randomIndex = Math.floor(Math.random() * arr.length);

  // get random item
  const item = arr[randomIndex];

  return item;
}

// Reaction is composed of two parts: the face and the response message
function setNpcReaction(reactionArray) {
  // (1) Update facial expression of emoji
  updateNpcFace(reactionArray);

  // (2) Compose a response message
  composeAMessage(reactionArray);
}

// Update NPC's face based on response type
function updateNpcFace(reactionArray) {
  // Fetch an emoji
  nextEmojiToDisplay = getRandomItem(reactionArray);
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
      newCharacter = getRandomItem(emojiArraySet);
    } else {
      newCharacter = getRandomItem(otherEmojisArray);
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

// /**
// Description of preload
// */
// function preload() {}
//
// /**
// Description of setup
// */
// function setup() {}
//
// /**
// Description of draw()
// */
// function draw() {}

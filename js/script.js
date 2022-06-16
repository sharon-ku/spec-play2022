/*
Speculative Play 2022
Sharon Ku

Description will go here
*/

"use strict";

// let keyboardEmojis = `🎑🌄🥻🙉🍅🥽🧶👮‍♀️🙊🤞👩‍👧‍👦⚽️👠🧐🧥💂👩‍🦱🌌🐣⌚️👙😉🐗😞🤛🐨🩰🖕👩‍👦👎😒😕😊🌉🚗👉👐🐽🥳🥑👕🐌🏉🩳🕍🚄🚌🍑⛪️✍️🧵🧳🧑😔🐯🏑`;
let keyboardEmojis = `🎑🌄🥻🙉🍅🥽🧶👮‍♀️🙊🤞👩‍👧‍👦⚽️👠🧐🧥💂👩‍🦱🌌🐣⌚️👙😉🐗😞🤛🐨🩰🖕👩‍👦👎😒`;
// let keyboardEmojis = `🎑🌄🥻🙉🍅👩‍👧‍👦`;

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
  // Add it to the input bubble
  $(`#emoji-input-bubble`).append(containedEmoji);
  // // Remove emoji from keyboard
  // $(this).remove();
});

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
}

/*------------------------
Testing separate body parts of NPC
https://www.youtube.com/watch?v=L1E_7FoTrik&ab_channel=TheTechTrain
-------------------------*/

window.onload = function () {
  // Create file name for test head
  let testHead = new Image();
  // Set number of head files (here it's 3)
  let testHeadNum = Math.floor(Math.random() * 3);
  let testHeadName = "assets/images/head" + testHeadNum + ".png";
  testHead.src = testHeadName;

  testHead.onload = function () {
    buildTestBody();
  };

  function buildTestBody() {
    // Create canvas
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 400;

    // Place image in center: draw head
    ctx.drawImage(testHead, (400 - testHead.width) / 2, 50);
  }
};

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

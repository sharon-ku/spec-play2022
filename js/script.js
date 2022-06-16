/*
Speculative Play 2022
Sharon Ku

Description will go here
*/

"use strict";

// let keyboardEmojis = `🎑🌄🥻🙉🍅🥽🧶👮‍♀️🙊🤞👩‍👧‍👦⚽️👠🧐🧥💂👩‍🦱🌌🐣⌚️👙😉🐗😞🤛🐨🩰🖕👩‍👦👎😒😕😊🌉🚗👉👐🐽🥳🥑👕🐌🏉🩳🕍🚄🚌🍑⛪️✍️🧵🧳🧑😔🐯🏑`;
let keyboardEmojis = `🎑🌄🥻🙉🍅🥽🧶👮‍♀️🙊🤞👩‍👧‍👦⚽️👠🧐🧥💂👩‍🦱🌌🐣⌚️👙😉🐗😞🤛🐨🩰🖕👩‍👦👎😒`;
// let keyboardEmojis = `🎑🌄🥻🙉🍅👩‍👧‍👦`;

// /*
// Handle NPC facial expressions
// */
// // Emojis from: https://www.freecodecamp.org/news/all-emojis-emoji-list-for-copy-and-paste/
// let smileyEmojis = `🙂😀😄😁😅😆🤣😂🙃😉😊😇😎🤓🧐🥳🤗🤭🤫`;
// let emotionalEmojis = `🥰😍🤩😘😗😚😙🤔`;
// let tongueEmojis = `😋😛😜🤪😝🤑`;
// let neutralEmojis = `😐🤐🤨😑😶😏😒🙄😬‍🤥`;
// let sleepyEmojis = `😪😴😌😔🤤`;
// let sickEmojis = `😷🤒🤕🤢🤮🤧🥵🥶🥴😵🤯`;
// let concernedEmojis = `😕😟🙁😮😯😲😳🥺😦😧😨😰😥😢😭😱😖😞😓😩😫🥱`;
// let badEmojis = `😤😡😠🤬😈👿💀`;
//
// // Temporarily categorizing emojis for sake of simplicity:
// let positiveEmojis = smileyEmojis + emotionalEmojis + tongueEmojis;
// let negativeEmojis =
//   neutralEmojis + sleepyEmojis + sickEmojis + concernedEmojis + badEmojis;
//
// // Grapheme Splitter is a library that handles splitting emojis properly
// // Without it, emojis like this one 👩‍👧‍👦 will count as several emojis
// let splitter = new GraphemeSplitter();
//
// // Split two-char emojis and six-char combined emoji into arrays
// let positiveEmojisArray = splitter.splitGraphemes(positiveEmojis);
// let negativeEmojisArray = splitter.splitGraphemes(negativeEmojis);

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

// Split two-char emojis and six-char combined emoji into arrays
let numEmojiCategories = 9;
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

  // // Randomly update the facial expression of NPC
  // if (Math.random() < CHANCE_TO_GET_POSITIVE_EMOJI) {
  //   responseType = `positive`;
  // } else {
  //   responseType = `negative`;
  // }
  //
  // // Set response based on emotion
  // if (responseType === `positive`) {
  //   // Fetch a positive emoji
  //   nextEmojiToDisplay = random(positiveEmojisArray);
  //
  //   // Compose a positive response message
  //   composeAMessage(positiveEmojisArray);
  //
  //   console.log(npcResponseMessage);
  // } else if (responseType === `negative`) {
  //   // Fetch a negative emoji
  //   nextEmojiToDisplay = random(negativeEmojisArray);
  //
  //   // Compose a negative response message
  //   composeAMessage(negativeEmojisArray);
  //
  //   console.log(npcResponseMessage);
  // }
  //
  // console.log(nextEmojiToDisplay);

  // Randomly update the facial expression of NPC
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
  let randomIndex = Math.floor(Math.random() * emojiCategories.length);
  let responseType = emojiCategories[randomIndex];
  console.log(responseType);

  // PUT CODE HERE

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

  $(`#emoji-face`).text(nextEmojiToDisplay);
  $(`#npc-response-message`).text(npcResponseMessage);
});

function setNpcReaction(reactionArray) {
  // Fetch a positive emoji
  nextEmojiToDisplay = random(reactionArray);

  // Compose a positive response message
  composeAMessage(reactionArray);
}

function composeAMessage(emojiArraySet) {
  // Compose a positive response message
  for (let i = 0; i < Math.ceil(Math.random() * 3); i++) {
    let newCharacter;
    if (Math.random() < 0.2) {
      newCharacter = random(emojiArraySet);
    } else {
      newCharacter = random(otherEmojisArray);
    }

    npcResponseMessage += newCharacter;
  }
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

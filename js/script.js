/**
Speculative Play 2022
Sharon Ku

Description will go here
*/

"use strict";

// let keyboardEmojis = `🎑🌄🥻🙉🍅🥽🧶👮‍♀️🙊🤞👩‍👧‍👦⚽️👠🧐🧥💂👩‍🦱🌌🐣⌚️👙😉🐗😞🤛🐨🩰🖕👩‍👦👎😒😕😊🌉🚗👉👐🐽🥳🥑👕🐌🏉🩳🕍🚄🚌🍑⛪️✍️🧵🧳🧑😔🐯🏑`;
let keyboardEmojis = `🎑🌄🥻🙉🍅🥽🧶👮‍♀️🙊🤞👩‍👧‍👦⚽️👠🧐🧥💂👩‍🦱🌌🐣⌚️👙😉🐗😞🤛🐨🩰🖕👩‍👦👎😒`;
// let keyboardEmojis = `🎑🌄🥻🙉🍅👩‍👧‍👦`;

// Emojis from: https://www.freecodecamp.org/news/all-emojis-emoji-list-for-copy-and-paste/
let smileyEmojis = `🙂😀😄😁😅😆🤣😂🙃😉😊😇😎🤓🧐🥳🤗🤭🤫`;
let emotionalEmojis = `🥰😍🤩😘😗😚😙🤔`;
let tongueEmojis = `😋😛😜🤪😝🤑`;
let neutralEmojis = `😐🤐🤨😑😶😏😒🙄😬‍🤥`;
let sleepyEmojis = `😪😴😌😔🤤`;
let sickEmojis = `😷🤒🤕🤢🤮🤧🥵🥶🥴😵🤯`;
let concernedEmojis = `😕😟🙁😮😯😲😳🥺😦😧😨😰😥😢😭😱😖😞😓😩😫🥱`;
let badEmojis = `😤😡😠🤬😈👿💀`;

// Temporarily categorizing emojis for sake of simplicity:
let positiveEmojis = smileyEmojis + emotionalEmojis + tongueEmojis;
let negativeEmojis =
  neutralEmojis + sleepyEmojis + sickEmojis + concernedEmojis + badEmojis;

// Grapheme Splitter is a library that handles splitting emojis properly
// Without it, emojis like this one 👩‍👧‍👦 will count as several emojis
let positiveEmojiSplitter = new GraphemeSplitter();
let negativeEmojiSplitter = new GraphemeSplitter();

// Split two-char emojis and six-char combined emoji into arrays
let positiveEmojisArray = positiveEmojiSplitter.splitGraphemes(positiveEmojis);
let negativeEmojisArray = negativeEmojiSplitter.splitGraphemes(negativeEmojis);

// Odds of getting a positive emoji
const CHANCE_TO_GET_POSITIVE_EMOJI = 0.5;
// Set the next emoji after clicking "Send" button
let nextEmojiToDisplay = undefined;

// Grapheme Splitter is a library that handles splitting emojis properly
// Without it, emojis like this one 👩‍👧‍👦 will count as several emojis
let splitter = new GraphemeSplitter();

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

  // Randomly update the facial expression of NPC
  if (Math.random() < CHANCE_TO_GET_POSITIVE_EMOJI) {
    // Fetch a positive emoji
    nextEmojiToDisplay = random(positiveEmojisArray);
  } else {
    // Fetch a negative emoji
    nextEmojiToDisplay = random(negativeEmojisArray);
  }

  console.log(nextEmojiToDisplay);

  $(`#emoji-face`).text(nextEmojiToDisplay);
});

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

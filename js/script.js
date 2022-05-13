/**
Speculative Play 2022
Sharon Ku

Description will go here
*/

"use strict";

let keyboardEmojis = `🎑🌄🥻🙉🍅🥽🧶👮‍♀️🙊🤞👩‍👧‍👦⚽️👠🧐🧥💂👩‍🦱🌌🐣⌚️👙😉🐗😞🤛🐨🩰🖕👩‍👦👎😒😕😊🌉🚗👉👐🐽🥳🥑👕🐌🏉🩳🕍🚄🚌🍑⛪️✍️🧵🧳🧑😔🐯🏑`;
// let keyboardEmojis = `🎑🌄🥻🙉🍅👩‍👧‍👦`;

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

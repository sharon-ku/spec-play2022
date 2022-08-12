// Create a class for an NPC
// Source: https://www.youtube.com/watch?v=NG5qxx9Ij6Q&ab_channel=DowerChin
class Npc {
  constructor() {
    // Put npc inside a container which will later be used for depth sorting (in script.js)
    this.npcContainer = new PIXI.Container();
    // Add npcContainer to the PIXI app stage
    app.stage.addChild(this.npcContainer);

    // set to true if currently talking to this npc
    this.talking = false;

    // ----------------------------
    // Movement & Scaling
    // ----------------------------

    // Npc position: all body parts are offset from these coordinates
    this.x =
      canvasPadding + Math.random() * (app.screen.width - canvasPadding * 2);
    this.y =
      canvasPadding + Math.random() * (app.screen.height - canvasPadding * 2);

    this.speed = 0.5;
    this.vx = 0;
    this.vy = 0;

    // Defines type of movement
    // Options: `walk`, `approachOrRetreat`
    this.movementType = `walk`;

    // Speed at which NPC is shaking
    this.shakeSpeed = 0;

    // Used to set facing direction
    // By default, scale is (1,1)
    this.scale = {
      x: 1.5,
      y: 1.5,
    };
    // used to set scale of entire body
    this.currentScale = undefined;

    // ----------------------------
    // Colors
    // ----------------------------

    // Possible NPC tint colors
    // Tint source: https://scottmcdonnell.github.io/pixi-examples/index.html?s=demos&f=tinting.js&title=Tinting
    this.pink = `FF80D4`;
    this.green = `BAFF9A`;
    this.red = `FF6B00`;
    this.blue = `5CAFE2`;
    // this.yellow = `FFC83D`;
    this.purple = `B5AEFF`;

    // put the colors in an array
    this.possibleColors = [];
    this.possibleColors.push(
      this.pink,
      this.green,
      this.red,
      this.blue,
      // this.yellow,
      this.purple
    );
    // randomly choose a tint color; hexcodes are prefixed by `0x`
    this.tintColor = `0x` + this.getRandomElementFrom(this.possibleColors);

    // ----------------------------
    // Body
    // ----------------------------

    // create a new body Sprite from an image path.
    this.body = PIXI.Sprite.from("assets/images/npc-body.png");
    // body's position
    this.body.x = undefined;
    this.body.y = undefined;
    // offset from this.x and this.y
    this.body.offset = {
      x: 0 * Math.abs(this.scale.x),
      y: 32 * Math.abs(this.scale.y),
    };
    // center the sprite's anchor point
    this.body.anchor.set(0.5);
    this.body.scale.x = this.scale.x;
    this.body.scale.y = this.scale.y;

    // Make the body clickable to start keyboard communication
    this.clickToInteract(this.body);

    // ----------------------------
    // Head
    // ----------------------------

    this.head = new PIXI.Graphics();
    this.head.beginFill(0xffffff); //0x5cafe2
    this.head.radius = 40 * Math.abs(this.scale.x); //80
    this.head.drawCircle(0, 0, this.head.radius);
    this.head.x = undefined;
    this.head.y = undefined;
    // offset from this.x and this.y
    this.head.offset = {
      x: 0 * Math.abs(this.scale.x),
      y: 0 * Math.abs(this.scale.y),
    };

    // Make the head clickable to start keyboard communication
    this.clickToInteract(this.head);

    // ----------------------------
    // Emoji face
    // ----------------------------

    this.faceStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 50 * Math.abs(this.scale.x), //100
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

    // Grapheme Splitter is a library that handles splitting emojis properly
    // Without it, emojis like this one 👩‍👧‍👦 will count as several emojis
    let splitter = new GraphemeSplitter();
    // Keyboard set 1: faces
    this.possibleFaces = `🙂😄😁🥳😋😛😏😘😍😚😲🤯😧😨😤😡🤬😴🥱😅🤨😒🤑🙄🤔`;
    // Split two-char emojis and six-char combined emoji
    this.possibleFacesArray = splitter.splitGraphemes(this.possibleFaces);
    // Generate random initial face
    this.randomFace = getRandomItem(this.possibleFacesArray);

    // starting message in the face/head emoji
    this.faceText = new PIXI.Text(this.randomFace, this.faceStyle);
    this.faceText.x = undefined;
    this.faceText.y = undefined;
    // offset from this.x and this.y
    this.faceText.offset = {
      x: 3 * Math.abs(this.scale.x),
      y: 0 * Math.abs(this.scale.y),
    };

    // center text
    this.faceText.anchor.set(0.5);

    // ----------------------------
    // Response text
    // ----------------------------

    this.messageStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 30 * Math.abs(this.scale.x),
    });
    this.messageText = new PIXI.Text("", this.messageStyle);
    this.messageText.x = undefined;
    this.messageText.y = undefined;
    // offset from this.x and this.y
    this.messageText.offset = {
      x: 60 * Math.abs(this.scale.x), //110
      y: -25 * Math.abs(this.scale.y),
    };
    // center text
    this.messageText.anchor.set(0, 0.5);

    // ----------------------------
    // Response message box
    // ----------------------------

    this.messageBox = new PIXI.Graphics();
    this.messageBox.beginFill(0xffffff); //0x5cafe2
    // temporarily set widht and height to 100 so that cornerRadius works properly
    // these values will be reset to match string length later on
    this.messageBox.tempWidth = 150; //100
    this.messageBox.tempHeight = 100;
    this.messageBox.cornerRadius = 150 * Math.abs(this.scale.x);
    // Outline: https://pixijs.download/dev/docs/PIXI.Graphics.html#lineStyle
    this.messageBox.lineStyle(2, 0x000000);
    this.messageBox.drawRoundedRect(
      0,
      0,
      this.messageBox.tempWidth,
      this.messageBox.tempHeight,
      this.messageBox.cornerRadius
    );
    // padding
    this.messageBox.padding = {
      x: 30 * Math.abs(this.scale.x),
      y: 20 * Math.abs(this.scale.y),
    };
    // position
    this.messageBox.x = undefined;
    this.messageBox.y = undefined;
    // offset from this.x and this.y
    this.messageBox.offset = {
      x: this.messageText.offset.x - this.messageBox.padding.x / 2,
      y:
        this.messageText.offset.y -
        this.messageBox.padding.y / 2 -
        15 * Math.abs(this.scale.y),
    };

    // ----------------------------
    // Target arrow
    // ----------------------------

    // create a new body Sprite from an image path.
    this.targetArrow = PIXI.Sprite.from("assets/images/target-arrow.png");
    // set to true if hovering over NPC
    this.hovering = false;
    // body's position
    this.targetArrow.x = undefined;
    this.targetArrow.y = undefined;
    // offset from this.x and this.y
    this.targetArrow.offset = {
      x: 0 * Math.abs(this.scale.x),
      y: -60 * Math.abs(this.scale.y),
    };
    // center the sprite's anchor point
    this.targetArrow.anchor.set(0.5);

    // ----------------------------
    // Applies to all of body
    // ----------------------------

    // Change head and body color of NPC
    this.changeTintColor();

    // Add parts and texts to app stage
    this.addAllBodyParts();

    // Update body part positions that are relative to this.x and this.y
    this.updateBodyPartPositions();
  }

  // Change head and body color of NPC
  changeTintColor() {
    this.head.tint = this.tintColor;
    this.body.tint = this.tintColor;
  }

  // Add parts and texts to app stage
  addAllBodyParts() {
    this.npcContainer.addChild(this.body);
    this.npcContainer.addChild(this.head);
    this.npcContainer.addChild(this.faceText);
    this.npcContainer.addChild(this.messageBox);
    this.npcContainer.addChild(this.messageText);
    this.npcContainer.addChild(this.targetArrow);
  }

  // Update body part positions that are relative to this.x and this.y
  updateBodyPartPositions() {
    this.targetArrow.x = this.x + this.targetArrow.offset.x;
    this.targetArrow.y = this.y + this.targetArrow.offset.y;

    this.body.x = this.x + this.body.offset.x;
    this.body.y = this.y + this.body.offset.y;

    this.head.x = this.x + this.head.offset.x;
    this.head.y = this.y + this.head.offset.y;

    this.faceText.x = this.x + this.faceText.offset.x;
    this.faceText.y = this.y + this.faceText.offset.y;

    this.messageText.x = this.x + this.messageText.offset.x;
    this.messageText.y = this.y + this.messageText.offset.y;

    this.messageBox.x = this.x + this.messageBox.offset.x;
    this.messageBox.y = this.y + this.messageBox.offset.y;
  }

  // Make a body part clickable to start keyboard communication
  clickToInteract(bodyPart) {
    // Opt-in to interactivity
    bodyPart.interactive = true;
    // Shows hand cursor
    bodyPart.buttonMode = true;
    // Handles mouse and touch click:
    // When click, cue clicked() function
    // When hovering over Npc, scale it up
    // When leaving hover over Npc, scale down to normal
    // reference: https://pixijs.io/examples/#/interaction/click.js
    bodyPart
      .on("pointerdown", this.clicked.bind(this))
      .on("pointerover", this.hover.bind(this))
      .on("pointerout", this.onHoverOut.bind(this));
  }

  // Get a random element from an array
  getRandomElementFrom(arrayName) {
    return arrayName[Math.floor(Math.random() * arrayName.length)];
  }

  // Shake the body (as if NPC is scared)
  // source: https://pixijs.io/examples/#/filters-basic/color-matrix.js
  shake() {
    this.body.scale.x = 1 + Math.sin(this.shakeSpeed) * 0.01;
    this.body.scale.y = 1 + Math.cos(this.shakeSpeed) * 0.01;

    this.shakeSpeed += 0.1;
  }

  // When hovering over body, scale up and show target arrow
  hover() {
    // this.currentScale = 1.1;
    // this.updateNpcScale(this.currentScale);
    // Hovering boolean is used to show target arrow only when hovering
    this.hovering = true;
  }

  // When leave hovering over body, scale down to normal and hide target arrow
  onHoverOut() {
    // this.currentScale = 1;
    // this.updateNpcScale(this.currentScale);
    // Hovering boolean is used to show target arrow only when hovering
    this.hovering = false;
  }

  // Set Npc scale based on currentScale;
  updateNpcScale(currentScale) {
    this.head.scale.x = currentScale;
    this.head.scale.y = currentScale;

    this.body.scale.x = currentScale;
    this.body.scale.y = currentScale;

    this.faceText.scale.x = currentScale;
    this.faceText.scale.y = currentScale;

    // Update facing direction
    // this.updateFacingDirection(currentScale);
  }

  // Head is clicked and we're not already talking to this character
  clicked() {
    // If we're not currently talking to this npc:
    if (!this.talking) {
      stopAllConversations();

      // // head temporarily scales up to check that click is working
      // this.head.scale.x *= 1.1; //1.05
      // this.head.scale.y *= 1.1; //1.05

      // give ability to talk with keyboard
      this.talking = true;

      // keyboard pops into view
      keyboardIsActive();
    }
  }

  // Code that should be updated every frame
  loop() {
    // Handles random walking
    if (this.movementType === `walk`) {
      this.walk();
    }

    // Constrain npc's movement along x and y directions
    this.constrainMovement();

    // Only show target arrow when talking to or hovering over NPC
    this.handleTargetArrowVisibility();

    // // Shake the body
    // this.shake();

    // Set message box size based on length of message
    this.updateMessageBoxSizeAndVisibility();
  }

  // Set message box size based on length of message
  updateMessageBoxSizeAndVisibility() {
    if (this.messageText.text === ``) {
      // hide messsage box if no message
      this.messageBox.visible = false;
    } else {
      this.messageBox.visible = true;
      this.messageBox.cornerRadius = 100;

      this.messageBox.width =
        this.messageText.width + this.messageBox.padding.x;
      this.messageBox.height =
        this.messageText.height + this.messageBox.padding.y;
    }
  }

  // Hide or show target arrow
  handleTargetArrowVisibility() {
    // Only show target arrow when talking to or hovering over NPC
    if (this.talking || this.hovering) {
      this.targetArrow.visible = true;
    } else {
      this.targetArrow.visible = false;
    }
  }

  // Constrain npc's movement along x and y directions
  constrainMovement() {
    // If npc exceeds left or right of canvas, stop movement in s direction
    if (this.x < canvasPadding || this.x > app.screen.width - canvasPadding) {
      this.vx = 0;
    }

    // If npc exceeds top or bottom of canvas, stop movement in y direction
    if (this.y < canvasPadding || this.y > app.screen.height - canvasPadding) {
      this.vy = 0;
    }
  }

  // Handles random walking
  walk() {
    if (Math.random() < 0.005) {
      this.vx = randomBtw(-this.speed, this.speed);
      this.vy = randomBtw(-this.speed, this.speed);

      // Update facing direction
      this.updateFacingDirection();
    }

    this.x += this.vx;
    this.y += this.vy;

    // Update body part positions that are relative to this.x and this.y
    this.updateBodyPartPositions();
  }

  // Flip the emoji when it's moving left or right
  updateFacingDirection() {
    // If walking to the right:
    if (this.vx >= 0) {
      // face right
      this.scale.x = Math.abs(this.scale.x);
      this.scale.y = Math.abs(this.scale.x);
      // put face emoji closer to right
      this.faceText.offset.x = 4;
    }
    // Else if walking to the left:
    else if (this.vx < 0) {
      // face left
      this.scale.x = -Math.abs(this.scale.x);
      this.scale.y = Math.abs(this.scale.x);
      // put face emoji closer to left
      this.faceText.offset.x = -4;
    }

    // Set scale to body and emoji face text
    this.body.scale.x = this.scale.x;
    this.body.scale.y = this.scale.y;

    this.faceText.scale.x = Math.abs(this.scale.x) / 1.5;
    this.faceText.scale.y = Math.abs(this.scale.y) / 1.5;
  }

  // Update face when clicked on Send button
  updateFace() {
    if (this.talking) {
      this.faceText.text = nextEmojiToDisplay;

      // UNCOMMENT THIS IF WANT APPROACH OR RETREAT CODE
      // Bring the NPC forward or back depending on response type
      // this.approachOrRetreat();
    }
  }

  // Bring the NPC forward or back depending on response type
  approachOrRetreat() {
    this.movementType = `approachOrRetreat`;

    // if response type is a positive one, approach player:
    if (
      responseType === `horny` ||
      responseType === `inLove` ||
      responseType === `happy`
    ) {
      this.approach();
      console.log(`response type approach`);
    }
    // else if generally negative, retreat
    else if (
      responseType === `bored` ||
      responseType === `sad` ||
      responseType === `sick`
    ) {
      this.retreat();
      console.log(`response type retreat`);
    }
    // else if surprised or angry, different behaviour
    else if (responseType === `surprised` || responseType === `angry`) {
      if (Math.random() < 0.5) {
        // 50% of time, approach player to confront them
        this.approach();
      } else {
        // remaining time, retreat out of anger
        this.retreat();
      }
    }
    // else if neutral, don't move
    else if (responseType === `neutral`) {
      // no reaction if responseType === `neutral`
    }
  }

  approach() {
    // PUT CODE HERE
    this.currentScale *= 1.2;
    this.updateNpcScale(this.currentScale);

    this.movementType = `walk`;

    console.log(`approaching`);
  }

  retreat() {
    // PUT CODE HERE
    this.currentScale /= 1.2;
    this.updateNpcScale(this.currentScale);

    this.movementType = `walk`;

    console.log(`retreating`);
  }

  // Update response message when clicked on Send button
  updateResponseMessage() {
    if (this.talking) {
      this.messageText.text = npcResponseMessage;
    }
  }
}

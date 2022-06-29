// Create a class for an NPC
// Source: https://www.youtube.com/watch?v=NG5qxx9Ij6Q&ab_channel=DowerChin
class Npc {
  constructor({ x, y }) {
    // set to true if currently talking to this npc
    this.talking = false;

    // Npc position: all body parts are offset from these coordinates
    this.x = x;
    this.y = y;

    this.speed = 0.5;
    this.vx = 0;
    this.vy = 0;

    // Speed at which NPC is shaking
    this.shakeSpeed = 0;

    // Used to set facing direction
    // By default, scale is (1,1)
    this.scale = {
      x: 1,
      y: 1,
    };

    // Possible NPC tint colors
    // Tint source: https://scottmcdonnell.github.io/pixi-examples/index.html?s=demos&f=tinting.js&title=Tinting
    this.pink = `FF80D4`;
    this.green = `BAFF9A`;
    this.red = `FF6B00`;
    this.blue = `5CAFE2`;
    this.yellow = `FFC83D`;
    this.purple = `B5AEFF`;

    // put the colors in an array
    this.possibleColors = [];
    this.possibleColors.push(
      this.pink,
      this.green,
      this.red,
      this.blue,
      this.yellow,
      this.purple
    );
    // randomly choose a tint color; hexcodes are prefixed by `0x`
    this.tintColor = `0x` + this.getRandomElementFrom(this.possibleColors);

    // create a new body Sprite from an image path.
    this.body = PIXI.Sprite.from("assets/images/npc-body.png");
    // body's position
    this.body.x = undefined;
    this.body.y = undefined;
    // offset from this.x and this.y
    this.body.offset = {
      x: 0,
      y: 32,
    };
    // center the sprite's anchor point
    this.body.anchor.set(0.5);

    // Make the body clickable to start keyboard communication
    this.clickToInteract(this.body);

    app.stage.addChild(this.body);

    this.head = new PIXI.Graphics();
    this.head.beginFill(0xffffff); //0x5cafe2
    this.head.radius = 40; //80
    this.head.drawCircle(0, 0, this.head.radius);
    this.head.x = undefined;
    this.head.y = undefined;
    // offset from this.x and this.y
    this.head.offset = {
      x: 0,
      y: 0,
    };

    // Make the head clickable to start keyboard communication
    this.clickToInteract(this.head);

    app.stage.addChild(this.head);

    this.faceStyle = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 50, //100
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
      x: 3,
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
      x: 50, //110
      y: 0,
    };
    // center text
    this.messageText.anchor.set(0, 0.5);

    // Change head and body color of NPC
    this.changeTintColor();

    // Update body part positions that are relative to this.x and this.y
    this.updateBodyPartPositions();

    app.stage.addChild(this.messageText);
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

  // Change head and body color of NPC
  changeTintColor() {
    this.head.tint = this.tintColor;
    this.body.tint = this.tintColor;
  }

  // Shake the body (as if NPC is scared)
  // source: https://pixijs.io/examples/#/filters-basic/color-matrix.js
  shake() {
    this.body.scale.x = 1 + Math.sin(this.shakeSpeed) * 0.01;
    this.body.scale.y = 1 + Math.cos(this.shakeSpeed) * 0.01;

    this.shakeSpeed += 0.1;
  }

  // When hovering over body, scale up
  hover() {
    let currentScale = 1.1;
    this.updateNpcScale(currentScale);
  }

  // When leave hovering over body, scale down to normal
  onHoverOut() {
    let currentScale = 1;
    this.updateNpcScale(currentScale);
  }

  // Set Npc scale based on currentScale;
  updateNpcScale(currentScale) {
    this.head.scale.x = currentScale;
    this.head.scale.y = currentScale;

    this.body.scale.x = currentScale;
    this.body.scale.y = currentScale;

    // Update facing direction
    this.updateFacingDirection();
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
    // Constrain npc's movement along x and y directions
    this.constrainMovement();

    // Handles random walking
    this.walk();

    // // Shake the body
    // this.shake();
  }

  // Constrain npc's movement along x and y directions
  constrainMovement() {
    let canvasPadding = 100;
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

  // Update body part positions that are relative to this.x and this.y
  updateBodyPartPositions() {
    this.body.x = this.x + this.body.offset.x;
    this.body.y = this.y + this.body.offset.y;

    this.head.x = this.x + this.head.offset.x;
    this.head.y = this.y + this.head.offset.y;

    this.faceText.x = this.x + this.faceText.offset.x;
    this.faceText.y = this.y + this.faceText.offset.y;

    this.messageText.x = this.x + this.messageText.offset.x;
    this.messageText.y = this.y + this.messageText.offset.y;
  }

  // Flip the emoji when it's moving left or right
  updateFacingDirection() {
    // If walking to the right:
    if (this.vx >= 0) {
      // face right
      this.scale.x = 1;
      // put face emoji closer to right
      this.faceText.offset.x = 4;
    }
    // Else if walking to the left:
    else if (this.vx < 0) {
      // face left
      this.scale.x = -1;
      // put face emoji closer to left
      this.faceText.offset.x = -4;
    }

    // Set scale to body and emoji face text
    this.body.scale.x = this.scale.x;
    this.faceText.scale.x = this.scale.x;
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

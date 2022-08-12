// Create a class for an NPC
// Source: https://www.youtube.com/watch?v=NG5qxx9Ij6Q&ab_channel=DowerChin
class NpcCustomerAdult extends NpcRestaurant {
  constructor() {
    super();

    this.x = app.screen.width / 2;
    this.y = 370;

    this.speed = 0.4;
    this.vx = 0;
    this.vy = 0;

    // Used to set facing direction
    // By default, scale is (1,1)
    this.scale = {
      x: 1.8,
      y: 1.8,
    };

    // Possible NPC tint colors
    // Tint source: https://scottmcdonnell.github.io/pixi-examples/index.html?s=demos&f=tinting.js&title=Tinting
    this.pink = `FF80D4`;
    this.green = `BAFF9A`;
    this.red = `FF6B00`;
    this.blue = `5CAFE2`;
    // this.yellow = `FFC83D`;
    this.purple = `B5AEFF`;

    // randomly choose a tint color; hexcodes are prefixed by `0x`
    this.tintColor = `0x` + this.green;

    // Change head and body color of NPC
    this.changeTintColor();
  }

  // Handles random walking
  walk() {
    if (Math.random() < 0.005) {
      this.vx = randomBtw(-this.speed, this.speed);
      // this.vy = randomBtw(-this.speed, this.speed);

      // Update facing direction
      this.updateFacingDirection();
    }

    this.x += this.vx;
    // this.y += this.vy;

    // Update body part positions that are relative to this.x and this.y
    this.updateBodyPartPositions();
  }
}

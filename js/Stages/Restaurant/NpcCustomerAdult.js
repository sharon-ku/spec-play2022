// Create a class for an NPC
// Source: https://www.youtube.com/watch?v=NG5qxx9Ij6Q&ab_channel=DowerChin
class NpcCustomerAdult extends NpcRestaurant {
  constructor() {
    super();

    this.x = app.screen.width / 2;
    this.y = 400;

    this.speed = 0.4;
    this.vx = 0;
    this.vy = 0;

    // // Used to set facing direction
    // // By default, scale is (1,1)
    // this.scale = {
    //   x: 1.8,
    //   y: 1.8,
    // };
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

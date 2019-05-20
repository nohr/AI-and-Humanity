// texture for the particle
let particle_texture = null;

// variable holding our particle system
let ps = null;

function preload() {
  particle_texture = loadImage("sketches/assets/particle_texture.png");
}

function setup() {

  //set the canvas size
   var canvas = createCanvas(500, 200);
  canvas.parent("sketch1");

  //initialize our particle system
  ps = new ParticleSystem(0, createVector(width / 3, height - 50), particle_texture);
}

function draw() {
  background(0);
  let dx = map(mouseX, 0, width, -.2, .2);
  let wind = createVector(dx, 0);

  ps.applyForce(wind);
  ps.run();
  for (let i = 0; i < 1; i++) {
    ps.addParticle();
  }
}

//========= PARTICLE SYSTEM ===========
let ParticleSystem = function(num, v, img_) {

  this.particles = [];
  this.origin = v.copy(); // we make sure to copy the vector value in case we accidentally mutate the original by accident
  this.img = img_
  for(let i = 0; i < num; ++i){
    this.particles.push(new Particle(this.origin, this.img));
  }
};
ParticleSystem.prototype.run = function() {

  // cache length of the array we're going to loop into a variable
  // You may see <variable>.length in a for loop, from time to time but
  // we cache it here because otherwise the length is re-calculated for each iteration of a loop
  let len = this.particles.length;

  //loop through and run particles
  for (let i = len - 1; i >= 0; i--) {
    let particle = this.particles[i];
    particle.run();

    // if the particle is dead, we remove it.
    // javascript arrays don't have a "remove" function but "splice" works just as well.
    // we feed it an index to start at, then how many numbers from that point to remove.
    if (particle.isDead()) {
      this.particles.splice(i, 1);
    }
  }
}
ParticleSystem.prototype.applyForce = function(dir) {
  let len = this.particles.length;
  for(let i = 0; i < len; ++i){
    this.particles[i].applyForce(dir);
  }
}
ParticleSystem.prototype.addParticle = function() {
    this.particles.push(new Particle(this.origin, this.img));
}
let Particle = function (pos, img_) {
  this.loc = pos.copy();

  let vx = randomGaussian() * 0.3;
  let vy = randomGaussian() * 0.3 - 1.0;

  this.vel = createVector(vx, vy);
  this.acc = createVector();
  this.lifespan = 100.0;
  this.texture = img_;
}
Particle.prototype.run = function() {
  this.update();
  this.render();
}
Particle.prototype.render = function() {
  imageMode(CENTER);
  tint(255, this.lifespan);
  image(this.texture, this.loc.x, this.loc.y);
}
Particle.prototype.applyForce = function(f) {
  this.acc.add(f);
}
Particle.prototype.isDead = function () {
  if (this.lifespan <= 0.0) {
    return true;
  } else {
      return false;
    }
}
Particle.prototype.update = function() {
  this.vel.add(this.acc);
  this.loc.add(this.vel);
  this.lifespan -= 2.5;
  this.acc.mult(0);
}
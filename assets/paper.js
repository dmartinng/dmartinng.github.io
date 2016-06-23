var max_balls = 70;
var start_balls = 40;

if(isMobile.phone) {
  max_balls = 50;
  start_balls = 20;
}

function Ball(p, r) {
  this.radius = r;
  this.pos = p;
  this.mag = 3;
  this.velocity = {x: 1, y: 1};
  var randAngle = Math.random() * 2*Math.PI;
  this.velocity.x = this.mag * Math.cos(randAngle);
  this.velocity.y = this.mag * Math.sin(randAngle);
  this.circle = new Path.Circle(this.pos, this.radius);
  this.circle.strokeColor = 'rgba(0, 0, 0, 0.2)';
}

Ball.prototype = {
  iterate: function() {
    this.checkBorders();
    this.move();
  },
  checkBorders: function() {
    var size = view.size;
    if(this.pos.x - this.radius <= 0) {
      this.velocity.x = -this.velocity.x;
    }
    if(this.pos.x + this.radius >= size.width) {
      this.velocity.x = -this.velocity.x;
    }
    if(this.pos.y - this.radius <= 0) {
      this.velocity.y = -this.velocity.y;
    }
    if(this.pos.y + this.radius >= size.height) {
      this.velocity.y = -this.velocity.y;
    }
  },
  move: function() {
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
    this.circle.position = this.pos;
  },
  checkCollision: function(other) {
    if(this.pos.getDistance(other.pos) <= 2*this.radius) {
      // collision happened
      var collisionVector = (this.pos - other.pos);
      var normalizedCollisionVector = collisionVector.normalize(this.mag)
      this.velocity.x = normalizedCollisionVector.x;
      this.velocity.y = normalizedCollisionVector.y;
    }
  }
}

var circles = []

// Add the circles:
for (var i = 0; i < start_balls; i++) {
	var position = Point.random() * view.size;
  var radius = 10;
  // check if colliding with existing Ball
  var foundCollision = false;
  do {
    foundCollision = false;
    for (var j = 0; j < circles.length; j++) {
      if( position.getDistance(circles[j].pos) <= radius * 2 ) {
        position = Point.random() * view.size;
        foundCollision = true;
      }
    }
  } while(foundCollision);
  var circle = new Ball(position, radius);
  circles.push(circle);
}

function onFrame(event) {
  for (var i = 0; i < circles.length; i++) {
    for (var j = 0; j < circles.length; j++) {
      if(i != j) {
        circles[i].checkCollision(circles[j]);
      }
    }
  }
  for (var i = 0; i < circles.length; i++) {
    circles[i].iterate();
  }
}

function onMouseDown(event) {
  console.log("PRESSED");
  if (circles.length < max_balls) {
    var position = event.point;
    var radius = 10;
    // check if colliding with existing Ball
    var foundCollision = false;
    for (var j = 0; j < circles.length; j++) {
      if( position.getDistance(circles[j].pos) <= radius * 2 ) {
        position = Point.random() * view.size;
        foundCollision = true;
      }
    }
    if (!foundCollision) {
      var circle = new Ball(position, radius);
      circles.push(circle);
    }
  }
}

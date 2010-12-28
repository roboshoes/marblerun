Event.observe(window, 'load', function() {

  console.log("Load Event");

  var domCanvas = $('canvas'),
    drawingContext = domCanvas.getContext('2d'),
    canvasWidth = parseInt(domCanvas.width),
    canvasHeight = parseInt(domCanvas.height),
    worldAABB,
    gravity,
    world,
    elements = [];
    
worldAABB = new b2AABB();
worldAABB.lowerBound.Set(-10000.0, -10000.0);
worldAABB.upperBound.Set(10000.0, 10000.0);

gravity = new b2Vec2(0.0, -9.8);
world = new b2World(worldAABB, gravity, true);

var bodyDefinition = new b2BodyDef(),
  body,
  shapeDefinition;

bodyDefinition.position.Set(100, 1000);
body = world.CreateBody(bodyDefinition);

shapeDefinition = new b2PolygonDef();
shapeDefinition.SetAsBox(1, 1);
shapeDefinition.restitution = 0;
shapeDefinition.density = 2;
shapeDefinition.friction = 0.9;

//body.w = 1;
//body.h = 1;

body.CreateShape(shapeDefinition);
body.SetMassFromShapes();

elements.push(body);

for (var i = 0; i < elements.length; i++) {
  console.log(elements[i]);
}

// TODO: figure out what the drawing interval is, what a step is, and how these values correlate to each other!

setInterval(function() {
  world.Step(1.0/60.0, 10);



}, 1000 / 30);
});
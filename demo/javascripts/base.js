Event.observe(window, 'load', function() {
  var domCanvas = $('canvas'),
    drawingContext = domCanvas.getContext('2d'),
    canvasWidth = parseInt(domCanvas.width),
    canvasHeight = parseInt(domCanvas.height),
    worldAABB,
    gravity,
    world,
    elements = [];
    
worldAABB = new b2AABB();
worldAABB.lowerBound.Set(-50, -50);
worldAABB.upperBound.Set(200, 250);

gravity = new b2Vec2(0.0, 9.81);
world = new b2World(worldAABB, gravity, true);

for (var i = 0; i < 1; i++) {
var bodyDefinition = new b2BodyDef(),
  body,
  shapeDefinition;

bodyDefinition.position.Set(55, 55);
body = world.CreateBody(bodyDefinition);

shapeDefinition = new b2PolygonDef();
shapeDefinition.SetAsBox(2.5, 2.5);
shapeDefinition.restitution = 0;
shapeDefinition.density = 2;
shapeDefinition.friction = 0.9;

body.CreateShape(shapeDefinition);
body.SetMassFromShapes();

elements.push(body);
}


var bodyDefinition = new b2BodyDef(),
  body,
  shapeDefinition;

bodyDefinition.position.Set(66, 55);
body = world.CreateBody(bodyDefinition);

shapeDefinition = new b2PolygonDef();
shapeDefinition.SetAsBox(2.5, 2.5);
shapeDefinition.restitution = 0;
shapeDefinition.friction = 0.9;

body.CreateShape(shapeDefinition);
body.SetMassFromShapes();

elements.push(body);


// TODO: figure out what the drawing interval is, what a step is, and how these values correlate to each other!
setInterval(function() {
  world.Step(1.0/60.0, 10);

  canvas.width = canvas.width;


  for (var i = 0; i < elements.length; i++) {

  for (var shape = elements[i].GetShapeList(); shape; shape = shape.GetNext())
  {
    var position = elements[i].GetPosition(),
    offset = {
      x: 50,
      y: 50
    },
    xFactor = canvasWidth / 100,
    yFactor = canvasHeight / 150;

    drawingContext.save();
    drawingContext.translate(position.x * xFactor, position.y * yFactor);
    drawingContext.strokeStyle = '#00ff00';
    drawingContext.beginPath(); 

    drawingContext.moveTo((shape.m_vertices[0].x - offset.x) * xFactor, (shape.m_vertices[0].y - offset.y) * yFactor);

    for (var k = 1; k < shape.m_vertexCount; k++) {
      drawingContext.lineTo((shape.m_vertices[k].x - offset.x) * xFactor, (shape.m_vertices[k].y - offset.y) * yFactor);
    }

    drawingContext.closePath();
    drawingContext.stroke();
    drawingContext.restore();
  }
}

}, 1000 / 30);
});
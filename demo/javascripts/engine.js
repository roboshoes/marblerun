var timeStep = 1.0/120;
var iteration = 1;
world.Step(timeStep, iteration);

var ctx;
var canvasWidth; 
var canvasHeight; 

function step(cnt) {
  world.Step(1.0/60, 1);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  drawGrid();

  drawWorld(world, ctx);
  setTimeout('step(' + (cnt || 0) + ')', 10);
}

function drawGrid() {
	var columns = Math.floor(canvasWidth / 50),
		rows = Math.floor(canvasHeight / 50);

	ctx.strokeStyle = '#bbbbbb';

	for (var i = 0; i < columns; i++) {
		ctx.beginPath();
		ctx.moveTo(i * 50, 0);
		ctx.lineTo(i * 50, rows * 50);
		ctx.stroke();
	}

	for (var i = 0; i < rows; i++) {
		ctx.beginPath();
		ctx.moveTo(0, i * 50);
		ctx.lineTo(columns * 50, i * 50);
		ctx.stroke();
	}
}

window.onclick = function(event) {
	var row = Math.floor(event.pageY / 50),
		column = Math.floor(event.pageX / 50);

	placeShape(column, row);	
};

var bodyID = 0;

window.onkeyup = function(event) {
	if (event.keyCode == 32) {
		factory.newMarble({x: 25, y: 0}, {});
	}

	switch (event.keyCode) {
		case 49:
			bodyID = 0;
			break;
		case 50:
			bodyID = 1;
			break;
		case 51:
			bodyID = 2;
			break;
		case 52:
			bodyID = 3;
			break;
		case 53:
			bodyID = 4;
			break;
		case 54:
			bodyID = 5;
			break;
		case 55:
			bodyID = 6;
			break;
		case 56:
			bodyID = 7;
			break;
		case 57:
			bodyID = 8;
			break;
		default:
			bodyID = -1;
	}	
};

var bodys = [];

function placeShape(column, row) {
	if (bodys[column][row]) {
		if (bodys[column][row].length > 1) {
			for (var i = 0; i < bodys[column][row].length; i++) {
				world.DestroyBody(bodys[column][row][i]);
			}
		} else {
			world.DestroyBody(bodys[column][row]);
		}
	}

	switch (bodyID) {
		case 0:
			bodys[column][row] = factory.newBox({x: 50 * column + 25, y: 50 * row + 25}, {width: 50, height: 50});
			break;
		case 1:
			bodys[column][row] = factory.newRamp({x: 50 * column + 25, y: 50 * row + 25}, {width: 50, height: 50, rotation: 0});
			break;
		case 2:
			bodys[column][row] = factory.newRamp({x: 50 * column + 25, y: 50 * row + 25}, {width: 50, height: 50, rotation: 90});
			break;
		case 3:
			bodys[column][row] = factory.newRamp({x: 50 * column + 25, y: 50 * row + 25}, {width: 50, height: 50, rotation: 180});
			break;
		case 4:
			bodys[column][row] = factory.newRamp({x: 50 * column + 25, y: 50 * row + 25}, {width: 50, height: 50, rotation: 270});
			break;
		case 5:
			bodys[column][row] = factory.newKicker({x: 50 * column + 25, y: 50 * row + 25}, {width: 50, height: 50, rotation: 0});
			break;
		case 6:
			bodys[column][row] = factory.newKicker({x: 50 * column + 25, y: 50 * row + 25}, {width: 50, height: 50, rotation: 90});
			break;
		case 7:
			bodys[column][row] = factory.newKicker({x: 50 * column + 25, y: 50 * row + 25}, {width: 50, height: 50, rotation: 180});
			break;
		case 8:
			bodys[column][row] = factory.newKicker({x: 50 * column + 25, y: 50 * row + 25}, {width: 50, height: 50, rotation: 270});
			break;
		default:
	}

	
};

Event.observe(window, 'load', function() {
  ctx = $('myCanvas').getContext('2d');
  var canvasElm = $('myCanvas');
  canvasWidth = parseInt(canvasElm.width);
  canvasHeight = parseInt(canvasElm.height);
  step();

  // MARBLERUN CODE
  drawGrid();

  var columns = Math.floor(canvasWidth / 50),
		rows = Math.floor(canvasHeight / 50);

		for (var i = 0; i < columns; i++) {
			bodys[i] = [];
		}

});

function drawWorld(world, context) {
	for (var j = world.m_jointList; j; j = j.m_next) {
		drawJoint(j, context);
	}
	for (var b = world.m_bodyList; b; b = b.m_next) {
		for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
			drawShape(s, context);
		}
	}
}
function drawJoint(joint, context) {
	var b1 = joint.m_body1;
	var b2 = joint.m_body2;
	var x1 = b1.m_position;
	var x2 = b2.m_position;
	var p1 = joint.GetAnchor1();
	var p2 = joint.GetAnchor2();
	context.strokeStyle = '#00eeee';
	context.beginPath();
	switch (joint.m_type) {
	case b2Joint.e_distanceJoint:
		context.moveTo(p1.x, p1.y);
		context.lineTo(p2.x, p2.y);
		break;

	case b2Joint.e_pulleyJoint:
		// TODO
		break;

	default:
		if (b1 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
		}
		else if (b2 == world.m_groundBody) {
			context.moveTo(p1.x, p1.y);
			context.lineTo(x1.x, x1.y);
		}
		else {
			context.moveTo(x1.x, x1.y);
			context.lineTo(p1.x, p1.y);
			context.lineTo(x2.x, x2.y);
			context.lineTo(p2.x, p2.y);
		}
		break;
	}
	context.stroke();
}

function drawShape(shape, context) {
	context.strokeStyle = '#ffffff';
	context.beginPath();
	switch (shape.m_type) {
	case b2Shape.e_circleShape:
		{
			var circle = shape;
			var pos = circle.m_position;
			var r = circle.m_radius;
			var segments = 16.0;
			var theta = 0.0;
			var dtheta = 2.0 * Math.PI / segments;
			// draw circle
			context.moveTo(pos.x + r, pos.y);
			for (var i = 0; i < segments; i++) {
				var d = new b2Vec2(r * Math.cos(theta), r * Math.sin(theta));
				var v = b2Math.AddVV(pos, d);
				context.lineTo(v.x, v.y);
				theta += dtheta;
			}
			context.lineTo(pos.x + r, pos.y);
	
			// draw radius
			context.moveTo(pos.x, pos.y);
			var ax = circle.m_R.col1;
			var pos2 = new b2Vec2(pos.x + r * ax.x, pos.y + r * ax.y);
			context.lineTo(pos2.x, pos2.y);
		}
		break;
		
	case b2Shape.e_polyShape:
		{
			var poly = shape;
			var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
			context.moveTo(tV.x, tV.y);
			for (var i = 0; i < poly.m_vertexCount; i++) {
				var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
				context.lineTo(v.x, v.y);
			}
			context.lineTo(tV.x, tV.y);
		}
		break;
	}
	context.stroke();
}

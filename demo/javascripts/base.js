var worldAABB = new b2AABB(),
	gravity = new b2Vec2(0, 300),
	doSleep = true,
	world,
	factory;

worldAABB.minVertex.Set(-1000, -1000);
worldAABB.maxVertex.Set(1000, 1000);
world = new b2World(worldAABB, gravity, doSleep);

factory = new Factory(world);



/*factory.newMarble({x: 30, y: 20}, {});

factory.newKicker({x: 50, y: 50}, {width: 50, height: 50});
factory.newBox({x: 100, y: 100}, {width: 50, height: 50});
factory.newBox({x: 150, y: 100}, {width: 50, height: 50});
factory.newBox({x: 200, y: 100}, {width: 50, height: 50});
factory.newBox({x: 250, y: 100}, {width: 50, height: 50});
//factory.newRamp({x: 300, y: 100}, {width: 50, height: 50});*/

/* --- CIRCLE --- */
/*var circleSd = new b2CircleDef();
circleSd.density = 1;
circleSd.radius = 5;
circleSd.restitution = .2;

var circleBd = new b2BodyDef();
circleBd.AddShape(circleSd);
circleBd.position.Set(30, 20);

var circleBody = world.CreateBody(circleBd);*/
/* --- */

/*
createFunnyStuff({x: 50, y: 50}, {width: 50, height: 50});
createBox({x: 100, y: 100}, {width: 50, height: 50});
createBox({x: 150, y: 100}, {width: 50, height: 50});
createBox({x: 200, y: 100}, {width: 50, height: 50});
createBox({x: 250, y: 100}, {width: 50, height: 50});

createFunnyStuff({x: 350, y: 150}, {width: 50, height: 50, rotation: -90});
createBox({x: 150, y: 200}, {width: 50, height: 50});
createBox({x: 200, y: 200}, {width: 50, height: 50});
createBox({x: 250, y: 200}, {width: 50, height: 50});
createBox({x: 300, y: 200}, {width: 50, height: 50});

createFunnyStuff({x: 100, y: 250}, {width: 50, height: 50});
createBox({x: 150, y: 300}, {width: 50, height: 50});
createBox({x: 200, y: 300}, {width: 50, height: 50});
createBox({x: 250, y: 300}, {width: 50, height: 50});
createBox({x: 300, y: 300}, {width: 50, height: 50});

createTriangle({x: 350, y: 250}, {width: 50, height: 50, rotation: 180});
createTriangle({x: 400, y: 300}, {width: 50, height: 50, rotation: 180});
createTriangle({x: 450, y: 350}, {width: 50, height: 50, rotation: 180});
createTriangle({x: 500, y: 400}, {width: 50, height: 50, rotation: 180});
createTriangle({x: 550, y: 450}, {width: 50, height: 50, rotation: 180});
createTriangle({x: 600, y: 500}, {width: 50, height: 50, rotation: 180});
createTriangle({x: 350, y: 300}, {width: 50, height: 50});
createTriangle({x: 400, y: 350}, {width: 50, height: 50});
createTriangle({x: 450, y: 400}, {width: 50, height: 50});
createTriangle({x: 500, y: 450}, {width: 50, height: 50});
createTriangle({x: 550, y: 500}, {width: 50, height: 50});
createTriangle({x: 600, y: 550}, {width: 50, height: 50});

createFunnyStuff({x: 650, y: 550}, {width: 50, height: 50, rotation: -90});




function createFunnyStuff(point, parameters) {
	var w = parameters.width / 2;
	var h = parameters.height / 2;
	
	var polySd = new b2PolyDef();
	polySd.vertexCount = 3;
	polySd.vertices[0].Set(0 - w, 0 - h);
	polySd.vertices[1].Set(parameters.width / 20 - w, parameters.height / 5 - h);
	polySd.vertices[2].Set(0 - w, parameters.height / 5 - h);
	putIntoWorld(polySd, point, parameters.rotation);
	
	var polySd = new b2PolyDef();
	polySd.vertexCount = 4;
	polySd.vertices[0].Set(0 - w, parameters.height / 5 - h);
	polySd.vertices[1].Set(parameters.width / 20 - w, parameters.height / 5 - h);
	polySd.vertices[2].Set(parameters.width / 9 - w, (parameters.height / 5) * 2 - h);
	polySd.vertices[3].Set(0 - w, (parameters.height / 5) * 2 - h);
	putIntoWorld(polySd, point, parameters.rotation);
	
	
	var polySd = new b2PolyDef();
	polySd.vertexCount = 4;
	polySd.vertices[0].Set(0 - w, (parameters.height / 5) * 2 - h);
	polySd.vertices[1].Set(parameters.width / 9 - w, (parameters.height / 5) * 2 - h);
	polySd.vertices[2].Set((parameters.width / 10) * 2 - w, (parameters.height / 5) * 3 - h);
	polySd.vertices[3].Set(0 - w, (parameters.height / 5) * 3 - h);
	putIntoWorld(polySd, point, parameters.rotation);
	
	
	var polySd = new b2PolyDef();
	polySd.vertexCount = 4;
	polySd.vertices[0].Set(0 - w, (parameters.height / 5) * 3 - h);
	polySd.vertices[1].Set((parameters.width / 10) * 2 - w, (parameters.height / 5) * 3 - h);
	polySd.vertices[2].Set((parameters.width / 10) * 3 - w, (parameters.height / 10) * 7 - h);
	polySd.vertices[3].Set(0 - w, (parameters.height / 10) * 7 - h);
	putIntoWorld(polySd, point, parameters.rotation);
	
	var polySd = new b2PolyDef();
	polySd.vertexCount = 4;
	polySd.vertices[0].Set(0 - w, (parameters.height / 10) * 7 - h);
	polySd.vertices[1].Set((parameters.width / 10) * 3 - w, (parameters.height / 10) * 7 - h);
	polySd.vertices[2].Set((parameters.width / 10) * 4 - w, (parameters.height / 5) * 4 - h);
	polySd.vertices[3].Set(0 - w, (parameters.height / 5) * 4 - h);
	putIntoWorld(polySd, point, parameters.rotation);
	
	var polySd = new b2PolyDef();
	polySd.vertexCount = 4;
	polySd.vertices[0].Set(0 - w, (parameters.height / 5) * 4 - h);
	polySd.vertices[1].Set((parameters.width / 10) * 4 - w, (parameters.height / 5) * 4 - h);
	polySd.vertices[2].Set((parameters.width / 5) * 3 - w, (parameters.height / 10) * 9 - h);
	polySd.vertices[3].Set(0 - w, (parameters.height / 10) * 9 - h);
	putIntoWorld(polySd, point, parameters.rotation);
	
	var polySd = new b2PolyDef();
	polySd.vertexCount = 4;
	polySd.vertices[0].Set(0 - w, (parameters.height / 10) * 9 - h);
	polySd.vertices[1].Set((parameters.width / 5) * 3 - w, (parameters.height / 10) * 9 - h);
	polySd.vertices[2].Set((parameters.width / 5) * 4 - w, (parameters.height / 20) * 19 - h);
	polySd.vertices[3].Set(0 - w, (parameters.height / 20) * 19 - h);
	putIntoWorld(polySd, point, parameters.rotation);
	
	var polySd = new b2PolyDef();
	polySd.vertexCount = 4;
	polySd.vertices[0].Set(0 - w, (parameters.height / 20) * 19 - h);
	polySd.vertices[1].Set((parameters.width / 5) * 4 - w, (parameters.height / 20) * 19 - h);
	polySd.vertices[2].Set(parameters.width - w, parameters.height - h);
	polySd.vertices[3].Set(0 - w, parameters.height - h);
	putIntoWorld(polySd, point, parameters.rotation);
	

}

function createTriangle(point, parameters) {
	var w = parameters.width / 2;
	var h = parameters.height / 2;
	
	var polySd = new b2PolyDef();
	polySd.vertexCount = 3;
	polySd.vertices[0].Set(0 - w, 0 - h);
	polySd.vertices[1].Set(parameters.width - w, parameters.height - h);
	polySd.vertices[2].Set(0 - w, parameters.height - h);	
	
	putIntoWorld(polySd, point, parameters.rotation);
}

function createBox(point, parameter) {
	var boxSd = new b2BoxDef();
	boxSd.restitution = 0;
	//boxSd.localRotation = degreeToRadian(parameter.rotation);
	boxSd.extents = {x: parameter.width / 2, y: parameter.height / 2};
	
	putIntoWorld(boxSd, point);	
}

function putIntoWorld(element, point, rotation) {
	var bodyElement = new b2BodyDef();
	bodyElement.rotation = degreeToRadian(rotation) || 0;
	bodyElement.AddShape(element);
	bodyElement.position.Set(point.x, point.y);
	
	return world.CreateBody(bodyElement);
}

function degreeToRadian(value) {
	return value * (Math.PI/180);
}*/




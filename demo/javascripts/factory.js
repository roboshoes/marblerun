var Factory = function(world) {
    this.world = world;
};

Factory.prototype.newMarble = function(position, parameters) {
    var shape = new b2CircleDef();

    shape.density = parameters.density || 1;
    shape.radius = parameters.radius || 5;
    shape.restitution = parameters.restitution || 0.2;

    return this.createObject(shape, position);
};

Factory.prototype.newBox = function(position, parameters) {
    var shape = new b2BoxDef();

    shape.restitution = 0;
    shape.extents = {
        x: parameter.width / 2,
        y: parameter.height / 2  
    };

    return this.createObject(shape, position);
};

Factory.prototype.newRamp = function(position, parameters) {
    var shape = new b2PolyDef(),
        halfWidth = parameters.width/ 2,
        halfHeight = parameters.height / 2;

    shape.vertexCount = 3;
    shape.vertices[0].Set(0 - halfWidth, 0 - halfHeight);
    shape.vertices[0].Set(halfWidth, halfHeight);
    shape.vertices[0].Set(0 - halfWidth, halfHeight);

    return this.createObject(shape, position, parameters.rotation);
};

Factory.prototype.newKicker = function(position, parameters) {
    // FIXME: refactor this crap of shit
    var shapes = [],
        bodys = [],
        halfWidth = parameters.width / 2,
        halfHeight = parameters.height / 2;

    shapes[0] = new b2PolyDef();
    shapes[0].vertexCount = 3;
    shapes[0].vertices[0].Set(0 - halfWidth, 0 - halfHeight);
    shapes[0].vertices[1].Set(parameters.width / 20 - halfWidth, parameters.height / 5 - halfHeight);
    shapes[0].vertices[2].Set(0 - halfWidth, parameters.height / 5 - halfHeight);
    bodys[0] = this.createObject(shapes[0], position, parameters.rotation);
    
    shapes[1] = new b2PolyDef();
    shapes[1].vertexCount = 4;
    shapes[1].vertices[0].Set(0 - halfWidth, parameters.height / 5 - halfHeight);
    shapes[1].vertices[1].Set(parameters.width / 20 - halfWidth, parameters.height / 5 - halfHeight);
    shapes[1].vertices[2].Set(parameters.width / 9 - halfWidth, (parameters.height / 5) * 2 - halfHeight);
    shapes[1].vertices[3].Set(0 - halfWidth, (parameters.height / 5) * 2 - halfHeight);
    bodys[1] = this.createObject(shapes[1], position, parameters.rotation);
    
    
    shapes[2] = new b2PolyDef();
    shapes[2].vertexCount = 4;
    shapes[2].vertices[0].Set(0 - halfWidth, (parameters.height / 5) * 2 - halfHeight);
    shapes[2].vertices[1].Set(parameters.width / 9 - halfWidth, (parameters.height / 5) * 2 - halfHeight);
    shapes[2].vertices[2].Set((parameters.width / 10) * 2 - halfWidth, (parameters.height / 5) * 3 - halfHeight);
    shapes[2].vertices[3].Set(0 - halfWidth, (parameters.height / 5) * 3 - halfHeight);
    bodys[2] = this.createObject(shapes[2], position, parameters.rotation);
    
    
    shapes[3] = new b2PolyDef();
    shapes[3].vertexCount = 4;
    shapes[3].vertices[0].Set(0 - halfWidth, (parameters.height / 5) * 3 - halfHeight);
    shapes[3].vertices[1].Set((parameters.width / 10) * 2 - halfWidth, (parameters.height / 5) * 3 - halfHeight);
    shapes[3].vertices[2].Set((parameters.width / 10) * 3 - halfWidth, (parameters.height / 10) * 7 - halfHeight);
    shapes[3].vertices[3].Set(0 - halfWidth, (parameters.height / 10) * 7 - halfHeight);
    bodys[3] = this.createObject(shapes[3], position, parameters.rotation);
    
    shapes[4] = new b2PolyDef();
    shapes[4].vertexCount = 4;
    shapes[4].vertices[0].Set(0 - halfWidth, (parameters.height / 10) * 7 - halfHeight);
    shapes[4].vertices[1].Set((parameters.width / 10) * 3 - halfWidth, (parameters.height / 10) * 7 - halfHeight);
    shapes[4].vertices[2].Set((parameters.width / 10) * 4 - halfWidth, (parameters.height / 5) * 4 - halfHeight);
    shapes[4].vertices[3].Set(0 - halfWidth, (parameters.height / 5) * 4 - halfHeight);
    bodys[4] = this.createObject(shapes[4], position, parameters.rotation);
    
    shapes[5] = new b2PolyDef();
    shapes[5].vertexCount = 4;
    shapes[5].vertices[0].Set(0 - halfWidth, (parameters.height / 5) * 4 - halfHeight);
    shapes[5].vertices[1].Set((parameters.width / 10) * 4 - halfWidth, (parameters.height / 5) * 4 - halfHeight);
    shapes[5].vertices[2].Set((parameters.width / 5) * 3 - halfWidth, (parameters.height / 10) * 9 - halfHeight);
    shapes[5].vertices[3].Set(0 - halfWidth, (parameters.height / 10) * 9 - halfHeight);
    bodys[5] = this.createObject(shapes[5], position, parameters.rotation);
    
    shapes[6] = new b2PolyDef();
    shapes[6].vertexCount = 4;
    shapes[6].vertices[0].Set(0 - halfWidth, (parameters.height / 10) * 9 - halfHeight);
    shapes[6].vertices[1].Set((parameters.width / 5) * 3 - halfWidth, (parameters.height / 10) * 9 - halfHeight);
    shapes[6].vertices[2].Set((parameters.width / 5) * 4 - halfWidth, (parameters.height / 20) * 19 - halfHeight);
    shapes[6].vertices[3].Set(0 - halfWidth, (parameters.height / 20) * 19 - halfHeight);
    bodys[6] = this.createObject(shapes[6], position, parameters.rotation);
    
    shapes[7] = new b2PolyDef();
    shapes[7].vertexCount = 4;
    shapes[7].vertices[0].Set(0 - halfWidth, (parameters.height / 20) * 19 - halfHeight);
    shapes[7].vertices[1].Set((parameters.width / 5) * 4 - halfWidth, (parameters.height / 20) * 19 - halfHeight);
    shapes[7].vertices[2].Set(parameters.width - halfWidth, parameters.height - halfHeight);
    shapes[7].vertices[3].Set(0 - halfWidth, parameters.height - halfHeight);
    bodys[7] = this.createObject(shapes[7], position, parameters.rotation);

    return bodys;
};

Factory.prototype.createObject = function(shape, position, rotation) {
    var body = new b2BodyDef();

    body.rotation = Utilities.degreeToRadian(rotation) || 0;
    body.AddShape(shape);
    body.position.Set(position.x, position.y);

    return this.world.CreateBody(body);
};
var Factory = function(world) {
    this.world = world;
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

Factory.prototype.newKicker = function() {
    
};

Factory.prototype.createObject = function(shape, position, rotation) {
    var body = new b2BodyDef();

    body.rotation = Utilities.degreeToRadian(rotation) || 0;
    body.AddShape(shape);
    body.position.Set(position.x, position.y);

    return this.world.CreateBody(body);
};
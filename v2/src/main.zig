const std = @import("std");
const ray = @import("raylib");
const c = @import("box2d_c");

const Ball = struct {
    x: u8,
    y: u8,
};

const Ramp = struct {
    x: u8,
    y: u8,
};

const Brick = struct {
    x: u8,
    y: u8,
};

pub fn main() anyerror!void {
    const ball = Ball{ .x = 0, .y = 14 };
    const ramp_1 = Ball{ .x = 0, .y = 11 };
    const ramp_2 = Ball{ .x = 1, .y = 10 };
    const brick_1 = Ball{ .x = 2, .y = 9 };
    const pixels_per_meter2: i32 = 50;
    const number_of_columns = 10;
    const number_of_rows = 15;
    const screenWidth = number_of_columns * pixels_per_meter2;
    const screenHeight = number_of_rows * pixels_per_meter2;

    // Setup raylib window with FPS target.
    ray.initWindow(screenWidth, screenHeight, "MARBLERUN v2");
    defer ray.closeWindow();
    ray.setTargetFPS(60);

    // Setup Box2D world with gravity.
    var world_def = c.b2DefaultWorldDef();
    world_def.gravity = .{ .x = 0.0, .y = 10.0 };
    const world_id = c.b2CreateWorld(&world_def);
    defer c.b2DestroyWorld(world_id);

    // Reusable ramp stuff.
    const ramp_points = [3]c.b2Vec2{
        .{ .x = 0.0, .y = 0.0 },
        .{ .x = 0.0, .y = 1.0 },
        .{ .x = 1.0, .y = 1.0 },
    };
    const ramp_hull = c.b2ComputeHull(&ramp_points, ramp_points.len);
    std.debug.assert(ramp_hull.count > 0);
    const ramp_poly = c.b2MakePolygon(&ramp_hull, 0.0); // 0.0 = corner radius (no rounding)

    // Ramp 1.
    var ramp_1_body_def = c.b2DefaultBodyDef();
    ramp_1_body_def.position = .{ .x = ramp_1.x, .y = ramp_1.y };
    const ramp_1_id = c.b2CreateBody(world_id, &ramp_1_body_def);
    const ramp_1_shape_def = c.b2DefaultShapeDef();
    _ = c.b2CreatePolygonShape(ramp_1_id, &ramp_1_shape_def, &ramp_poly);

    // Ramp 2.
    var ramp_2_body_def = c.b2DefaultBodyDef();
    ramp_2_body_def.position = .{ .x = ramp_2.x, .y = ramp_2.y };
    const ramp_2_id = c.b2CreateBody(world_id, &ramp_2_body_def);
    const ramp_2_shape_def = c.b2DefaultShapeDef();
    _ = c.b2CreatePolygonShape(ramp_2_id, &ramp_2_shape_def, &ramp_poly);

    // Brick.
    var brick_1_body_def = c.b2DefaultBodyDef();
    brick_1_body_def.position = .{ .x = brick_1.x, .y = brick_1.y };
    const brick_1_id = c.b2CreateBody(world_id, &brick_1_body_def);
    const brick_1_box = c.b2MakeBox(0.5, 0.5);
    const brick_1_shape_def = c.b2DefaultShapeDef();
    _ = c.b2CreatePolygonShape(brick_1_id, &brick_1_shape_def, &brick_1_box);


    // Falling circle: a dynamic body
    var circle_body_def = c.b2DefaultBodyDef();
    circle_body_def.type = c.b2_dynamicBody;
    circle_body_def.position = .{ .x = ball.x, .y = ball.y };
    const circle_id = c.b2CreateBody(world_id, &circle_body_def);

    const circle_shape = c.b2Circle{ .center = .{ .x = ball.x, .y = ball.y }, .radius = 0.25 };
    var circle_shape_def = c.b2DefaultShapeDef();
    circle_shape_def.density = 1.0;
    circle_shape_def.material.friction = 0.3;
    _ = c.b2CreateCircleShape(circle_id, &circle_shape_def, &circle_shape);

    // Meters -> pixels for drawing
    const pixels_per_meter: f32 = 50.0;

    while (!ray.windowShouldClose()) {
        ray.beginDrawing();
        defer ray.endDrawing();


        c.b2World_Step(world_id, 1.0 / 60.0, 4);

        const circle_pos = c.b2Body_GetPosition(circle_id);

        ray.clearBackground(.white);


        // Draw falling circle
        ray.drawCircle(
            @intFromFloat(circle_pos.x * pixels_per_meter),
            @intFromFloat((number_of_rows - 1 - circle_pos.y) * pixels_per_meter),
            0.4 * pixels_per_meter,
            .blue,
        );

        ray.drawCircle(ball.x * pixels_per_meter2 + pixels_per_meter2 / 2, (number_of_rows - 1 - ball.y) * pixels_per_meter2 + pixels_per_meter2 / 2, pixels_per_meter2 / 4, .red);
        ray.drawRectangle(brick_1.x * pixels_per_meter2, (number_of_rows - 1 - brick_1.y) * pixels_per_meter2, pixels_per_meter2, pixels_per_meter2, .black);
        ray.drawTriangle(.{ .x = 0, .y = 150 }, .{ .x = 0, .y = 200 }, .{ .x = 50, .y = 200 }, .black);
        ray.drawTriangle(.{ .x = ramp_1.x * pixels_per_meter2, .y = (number_of_rows - 1 - ramp_1.y) * pixels_per_meter2 }, .{ .x = ramp_1.x * pixels_per_meter2, .y = (number_of_rows - 1 - ramp_1.y) * pixels_per_meter2 + pixels_per_meter2 }, .{ .x = ramp_1.x * pixels_per_meter2 + pixels_per_meter2, .y = (number_of_rows - 1 - ramp_1.y) * pixels_per_meter2 + pixels_per_meter2 }, .black);
        ray.drawTriangle(.{ .x = ramp_2.x * pixels_per_meter2, .y = (number_of_rows - 1 - ramp_2.y) * pixels_per_meter2 }, .{ .x = ramp_2.x * pixels_per_meter2, .y = (number_of_rows - 1 - ramp_2.y) * pixels_per_meter2 + pixels_per_meter2 }, .{ .x = ramp_2.x * pixels_per_meter2 + pixels_per_meter2, .y = (number_of_rows - 1 - ramp_2.y) * pixels_per_meter2 + pixels_per_meter2 }, .black);
    }
}

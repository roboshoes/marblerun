const std = @import("std");
const ray = @import("raylib");
const c = @import("box2d_c");
const Io = std.Io;

const v2 = @import("v2");

pub fn main() anyerror!void {
    const screenWidth = 800;
    const screenHeight = 450;

    ray.initWindow(screenWidth, screenHeight, "MARBLERUN v2");
    defer ray.closeWindow();

    ray.setTargetFPS(60);

    // --- Box2D setup ---
    var world_def = c.b2DefaultWorldDef();
    world_def.gravity = .{ .x = 0.0, .y = 10.0 }; // Box2D's Y is "down" in this setup
    const world_id = c.b2CreateWorld(&world_def);
    defer c.b2DestroyWorld(world_id);

    // Ground: a static body with a wide box shape
    var ground_body_def = c.b2DefaultBodyDef();
    ground_body_def.position = .{ .x = 4.0, .y = 8.0 };
    const ground_id = c.b2CreateBody(world_id, &ground_body_def);

    const ground_box = c.b2MakeBox(4.0, 0.2); // half-width, half-height (meters)
    const ground_shape_def = c.b2DefaultShapeDef();
    _ = c.b2CreatePolygonShape(ground_id, &ground_shape_def, &ground_box);

    // Falling circle: a dynamic body
    var circle_body_def = c.b2DefaultBodyDef();
    circle_body_def.type = c.b2_dynamicBody;
    circle_body_def.position = .{ .x = 4.0, .y = 1.0 };
    const circle_id = c.b2CreateBody(world_id, &circle_body_def);

    const circle_shape = c.b2Circle{ .center = .{ .x = 0, .y = 0 }, .radius = 0.4 };
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

        // Draw ground
        ray.drawRectangle(0, @intFromFloat(8.0 * pixels_per_meter - 10), screenWidth, 20, .dark_gray);

        // Draw falling circle
        ray.drawCircle(
            @intFromFloat(circle_pos.x * pixels_per_meter),
            @intFromFloat(circle_pos.y * pixels_per_meter),
            0.4 * pixels_per_meter,
            .red,
        );


        ray.clearBackground(.white);
        ray.drawCircle(100, 100, 10, .red);
        ray.drawRectangle(100, 200, 50, 50, .black);
        ray.drawTriangle(.{ .x = 100, .y = 300 }, .{ .x = 100, .y = 400 }, .{ .x = 200, .y = 400 }, .black);
    }
}

const std = @import("std");
const ray = @import("raylib");
const c = @import("box2d_c");

const pixels_per_meter = 50;
const number_of_columns = 10;
const number_of_rows = 15;

const Cell = struct { x: f32, y: f32 };

/// Box2D world (meters, y up) -> raylib screen (pixels, y down).
fn toScreen(p: c.b2Vec2) ray.Vector2 {
    return .{ .x = p.x * pixels_per_meter, .y = (number_of_rows - p.y) * pixels_per_meter };
}

fn cellCenter(cell: Cell) c.b2Vec2 {
    return .{ .x = cell.x + 0.5, .y = cell.y + 0.5 };
}

fn createStatic(world_id: c.b2WorldId, cell: Cell, poly: *const c.b2Polygon) void {
    var body_def = c.b2DefaultBodyDef();
    body_def.position = cellCenter(cell);
    const body_id = c.b2CreateBody(world_id, &body_def);
    const shape_def = c.b2DefaultShapeDef();
    _ = c.b2CreatePolygonShape(body_id, &shape_def, poly);
}

pub fn main() anyerror!void {
    const ball = Cell{ .x = 0, .y = 14 };
    const ramps = [_]Cell{ .{ .x = 0, .y = 11 }, .{ .x = 1, .y = 10 } };
    const bricks = [_]Cell{.{ .x = 2, .y = 9 }};
    const ball_radius = 0.25;

    ray.initWindow(number_of_columns * pixels_per_meter, number_of_rows * pixels_per_meter, "MARBLERUN v2");
    defer ray.closeWindow();
    ray.setTargetFPS(60);

    var world_def = c.b2DefaultWorldDef();
    world_def.gravity = .{ .x = 0.0, .y = -10.0 }; // y is up in Box2D
    const world_id = c.b2CreateWorld(&world_def);
    defer c.b2DestroyWorld(world_id);

    // Ramp ◣ relative to the cell center: bottom-left, top-left, bottom-right.
    const ramp_points = [_]c.b2Vec2{
        .{ .x = -0.5, .y = -0.5 },
        .{ .x = -0.5, .y = 0.5 },
        .{ .x = 0.5, .y = -0.5 },
    };
    const ramp_hull = c.b2ComputeHull(&ramp_points, ramp_points.len);
    std.debug.assert(ramp_hull.count > 0);
    const ramp_poly = c.b2MakePolygon(&ramp_hull, 0.0);
    for (ramps) |r| createStatic(world_id, r, &ramp_poly);

    const brick_box = c.b2MakeBox(0.5, 0.5);
    for (bricks) |b| createStatic(world_id, b, &brick_box);

    // Ball: dynamic body, circle centered on the body.
    var circle_body_def = c.b2DefaultBodyDef();
    circle_body_def.type = c.b2_dynamicBody;
    circle_body_def.position = cellCenter(ball);
    const circle_id = c.b2CreateBody(world_id, &circle_body_def);

    const circle_shape = c.b2Circle{ .center = .{ .x = 0, .y = 0 }, .radius = ball_radius };
    var circle_shape_def = c.b2DefaultShapeDef();
    circle_shape_def.density = 1.0;
    circle_shape_def.material.friction = 0.3;
    _ = c.b2CreateCircleShape(circle_id, &circle_shape_def, &circle_shape);

    while (!ray.windowShouldClose()) {
        c.b2World_Step(world_id, 1.0 / 60.0, 4);

        ray.beginDrawing();
        defer ray.endDrawing();
        ray.clearBackground(.white);

        for (ramps) |r| {
            ray.drawTriangle(
                toScreen(.{ .x = r.x, .y = r.y + 1 }), // top-left
                toScreen(.{ .x = r.x, .y = r.y }), // bottom-left
                toScreen(.{ .x = r.x + 1, .y = r.y }), // bottom-right
                .black,
            );
        }

        for (bricks) |b| {
            ray.drawRectangleV(
                toScreen(.{ .x = b.x, .y = b.y + 1 }), // top-left corner
                .{ .x = pixels_per_meter, .y = pixels_per_meter },
                .black,
            );
        }

        ray.drawCircleV(toScreen(c.b2Body_GetPosition(circle_id)), ball_radius * pixels_per_meter, .blue);
    }
}

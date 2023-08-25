import v, {Vec3} from 'vec3';
import {Color, ShapeType, SphereShape, Transform} from './primitives';
import {applySphereShadow, colorToHex, darkenColor, hexToColor} from './utils';

const RAY_MAX_LENGTH = 10;
const RAY_STEP_BASE = 0.01;

export class Renderer {
    width: number = 1;
    height: number = 1;
    backgroundColor: string = '#000';
    scene: Scene;

    private buffer: Color[] = [];

    constructor(width: number, height: number, scene: Scene) {
        this.width = width;
        this.height = height;
        this.scene = scene;

        this.buffer = Array.from(Array(width * height)).map(() => hexToColor(this.backgroundColor));
    }

    render() {
        const renderChunk = async (index: number, size: number) => {
            const task = new Promise<void>(resolve => {
                this.buffer.slice(index, index + size).forEach((_, di) => {
                    const i = index + di;
                    const x = i % this.width;
                    const y = Math.floor(i / this.width);

                    const ray = new Ray(this.scene.camera.position);
                    ray.setDirection(this.scene.camera.direction, this.scene.camera.fov, x, y, this.width, this.height);
                    //console.log('Trace:', x, y);
                    this.buffer[i] = ray.trace(this.scene);
                });
                resolve();
            });
            await task;
            if (index < this.buffer.length) renderChunk(index + size, size);
        };

        setTimeout(() => renderChunk(0, 10000), 0);
    }

    exportToCanvas(ctx: CanvasRenderingContext2D) {
        [...this.buffer].forEach((px, i) => {
            const x = i % this.width;
            const y = Math.floor(i / this.width);

            ctx.fillStyle = colorToHex(px);
            ctx.fillRect(x, y, 1, 1);
        });
    }
}

export class Scene {
    entities: Array<Transform> = [];
    camera: Camera;
    sunDirection: Vec3 = v(1, 1, 1);
    ambient: number = 0.3;

    constructor() {
        this.camera = new Camera();
    }
}

export class Camera extends Transform {
    fov: number = 1.5;
}

export class Ray {
    color: Color = {r: 0, g: 0, b: 0};
    maxLength: number = RAY_MAX_LENGTH;
    position: Vec3 = v(0, 0, 0);
    private direction: Vec3 = v(0, 0, 1);
    private stepPosition: Vec3 = v(0, 0, 0);
    private alive = true;

    constructor(position: Vec3) {
        this.position = position;
        this.stepPosition = v(position);
    }

    setDirection(
        cameraDirection: Vec3,
        fov: number,
        screenX: number,
        screenY: number,
        screenWidth: number,
        screenHeight: number,
    ) {
        const x = screenX / screenWidth - 0.5;
        const y = screenY / screenHeight - 0.5;
        const rayVector = v(x * fov, y * fov * (screenHeight / screenWidth), 1);
        const dir = cameraDirection.add(rayVector).normalize();
        this.direction = dir;
    }

    trace(scene: Scene) {
        while (this.alive && this.stepPosition.distanceTo(this.position) < this.maxLength) {
            this.step(scene);
        }

        return this.color;
    }

    step({entities, sunDirection, ambient}: Scene) {
        const minDistToEntity = entities.reduce((acc, val) => {
            const dist = this.stepPosition.distanceTo(val.position) - (val.shape?.size || 0) / 2;
            return dist < acc ? dist : acc;
        }, RAY_MAX_LENGTH);
        const stepSize = minDistToEntity > RAY_STEP_BASE * 10 ? minDistToEntity / 2 : RAY_STEP_BASE;

        this.stepPosition = this.stepPosition.add(this.direction.scaled(stepSize));

        entities.forEach(en => {
            if (en.shape && en.shape.type === ShapeType.sphere) {
                const distToCenter = this.stepPosition.distanceTo(en.position);
                if (distToCenter <= (en.shape as SphereShape).radius) {
                    this.alive = false;
                    this.color = en.shape.color;

                    // shadow
                    this.color = applySphereShadow(this.color, sunDirection, en.position, this.stepPosition, ambient);
                }
            }
        });
    }
}

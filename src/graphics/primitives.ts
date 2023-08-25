import v, {Vec3} from 'vec3';
import {colorToHex, hexToColor} from './utils';

export type Color = {
    r: number;
    g: number;
    b: number;
};

export enum ShapeType {
    undef,
    sphere,
}

export class Transform {
    position: Vec3 = v(0, 0, 0);
    direction: Vec3 = v(0, 0, 1);
    shape?: Shape;
}

export class Shape {
    type: ShapeType = ShapeType.undef;
    color: Color = hexToColor('#fff');
    size: number = 0;
}

export class SphereShape extends Shape {
    radius: number = 1;

    constructor(radius: number) {
        super();
        this.type = ShapeType.sphere;
        this.radius = radius;
        this.size = radius * 2;
    }
}

export class Sphere extends Transform {
    constructor(position: Vec3, radius: number, color?: Color) {
        super();

        this.position = position;
        this.shape = new SphereShape(radius);

        if (color) {
            this.shape.color = color;
        }
    }
}

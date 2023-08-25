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
    voxel,
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

export type Voxel = {
    x: number;
    y: number;
    z: number;
    color: Color;
};

export class VoxelShape extends Shape {
    voxels: Record<string, Voxel> = {};
    sx: number = 10;
    sy: number = 10;
    sz: number = 10;

    constructor(sX: number, sY: number, sZ: number) {
        super();
        this.type = ShapeType.voxel;
        this.size = Math.max(sX, sY, sZ);

        this.sx = sX;
        this.sy = sY;
        this.sz = sZ;
    }

    setVoxel(x: number, y: number, z: number, c: Color) {
        if (x < 0 || x > this.sx || y < 0 || y > this.sy || z < 0 || z > this.sz) {
            return;
        }

        this.voxels[`${x};${y};${z}`] = {x, y, z, color: c};
    }

    removeVoxel(x: number, y: number, z: number) {
        delete this.voxels[`${x};${y};${z}`];
    }

    getVoxel(x: number, y: number, z: number): Voxel | null {
        return this.voxels[`${x};${y};${z}`] || null;
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

export class VoxelEntity extends Transform {
    voxelSize: number = 1;

    constructor(position: Vec3, size: number, voxelSize: number) {
        super();

        this.position = position;
        this.shape = new VoxelShape(size, size, size);

        this.voxelSize = voxelSize;
    }

    getClosestVoxel(point: Vec3): Voxel | null {
        const relative = point.minus(this.position);
        const [cX, cY, cZ] = [
            Math.floor(relative.x / this.voxelSize),
            Math.floor(relative.y / this.voxelSize),
            Math.floor(relative.z / this.voxelSize),
        ];
        const voxelShape = this.shape as VoxelShape;
        const voxel = voxelShape.getVoxel(cX + voxelShape.sx / 2, cY + voxelShape.sy / 2, cZ + voxelShape.sz / 2);

        return voxel;
    }
}

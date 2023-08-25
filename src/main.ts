import {createCanvas, fillBackground} from 'canvas/utils';
import {Sphere, VoxelEntity, VoxelShape} from 'graphics/primitives';
import {Renderer, Scene} from 'graphics/render';
import {colorToHex, hexToColor} from 'graphics/utils';
import v from 'vec3';

function requestExport(renderer: Renderer, ctx: CanvasRenderingContext2D) {
    setTimeout(() => {
        renderer.exportToCanvas(ctx);
        requestExport(renderer, ctx);
    }, 2000);
}

export function start() {
    console.log('Start');

    const {canvas, ctx} = createCanvas(300, 200);
    if (!ctx) return;

    fillBackground(canvas, ctx, '#333');

    const scene = new Scene();
    const renderer = new Renderer(canvas.width, canvas.height, scene);
    scene.camera.direction = v(1, 0.5, 4).normalize();

    scene.entities.push(new Sphere(v(0, 0, 3.5), 1));
    scene.entities.push(new Sphere(v(0.6, -0.3, 2.2), 0.6, hexToColor('#f58')));

    // scene.entities.push(new Sphere(v(3, 1, 4), 1.0, hexToColor('#f86')));
    // scene.entities.push(new Sphere(v(3, 1, 5), 1.0, hexToColor('#8f6')));
    // scene.entities.push(new Sphere(v(2.5, 1, 6), 1.0, hexToColor('#84f')));
    // scene.entities.push(new Sphere(v(2.2, 1, 7), 1.0, hexToColor('#f8f')));
    // scene.entities.push(new Sphere(v(1.8, 1, 8), 1.0, hexToColor('#ff4')));

    const voxels = new VoxelEntity(v(0, 0, 2), 10, 0.1);
    const vShape = voxels.shape as VoxelShape;
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if ((i < 4 || i > 6) && (j < 4 || j > 6)) {
                vShape.setVoxel(i, j, 0, {
                    r: i * 10 + 140,
                    g: 40,
                    b: j * 10 + 140,
                });
            } else {
                vShape.setVoxel(i, j, i, {
                    r: i * 10 + 140,
                    g: 40,
                    b: j * 10 + 140,
                });
            }
        }
    }
    scene.entities.push(voxels);
    console.log('Voxels:', voxels);

    requestExport(renderer, ctx);
    renderer.render();

    console.log('Color to hex:', colorToHex({r: 0, g: 200.099, b: 255}));
}

start();

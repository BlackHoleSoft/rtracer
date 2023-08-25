import {createCanvas, fillBackground} from 'canvas/utils';
import {Sphere} from 'graphics/primitives';
import {Renderer, Scene} from 'graphics/render';
import {colorToHex, hexToColor} from 'graphics/utils';
import v from 'vec3';

function requestExport(renderer: Renderer, ctx: CanvasRenderingContext2D) {
    requestAnimationFrame(() => {
        renderer.exportToCanvas(ctx);
        requestExport(renderer, ctx);
    });
}

export function start() {
    console.log('Start');

    const {canvas, ctx} = createCanvas(800, 500);
    if (!ctx) return;

    fillBackground(canvas, ctx, '#333');

    const scene = new Scene();
    const renderer = new Renderer(canvas.width, canvas.height, scene);

    scene.entities.push(new Sphere(v(0, 0, 5), 1));
    scene.entities.push(new Sphere(v(0.6, -0.3, 4.3), 0.6, hexToColor('#f58')));

    scene.entities.push(new Sphere(v(3, 1, 4), 1.0, hexToColor('#f86')));
    scene.entities.push(new Sphere(v(3, 1, 5), 1.0, hexToColor('#8f6')));
    scene.entities.push(new Sphere(v(2.5, 1, 6), 1.0, hexToColor('#84f')));
    scene.entities.push(new Sphere(v(2.2, 1, 7), 1.0, hexToColor('#f8f')));
    scene.entities.push(new Sphere(v(1.8, 1, 8), 1.0, hexToColor('#ff4')));

    requestExport(renderer, ctx);
    renderer.render();

    console.log('Color to hex:', colorToHex({r: 0, g: 200.099, b: 255}));
}

start();

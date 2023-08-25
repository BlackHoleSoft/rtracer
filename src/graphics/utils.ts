import v, {Vec3} from 'vec3';
import {Color} from './primitives';

export function colorToHex({r, g, b}: Color) {
    const rc = Math.floor(r).toString(16);
    const gc = Math.floor(g).toString(16);
    const bc = Math.floor(b).toString(16);
    return `#${rc.length === 1 ? '0' + rc : rc}${gc.length === 1 ? '0' + gc : gc}${bc.length === 1 ? '0' + bc : bc}`;
}

export function hexToColor(color: string) {
    if (!color.startsWith('#')) return {r: 0, g: 0, b: 0};
    if (color.length === 4) {
        return {
            r: parseInt(color[1], 16) * 16,
            g: parseInt(color[2], 16) * 16,
            b: parseInt(color[3], 16) * 16,
        };
    } else if (color.length === 7) {
        return {
            r: parseInt(color.substring(1, 3), 16),
            g: parseInt(color.substring(3, 5), 16),
            b: parseInt(color.substring(5, 7), 16),
        };
    } else {
        return {r: 0, g: 0, b: 0};
    }
}

export function darkenColor({r, g, b}: Color, multiply: number) {
    return {
        r: r * (1 - multiply),
        g: g * (1 - multiply),
        b: b * (1 - multiply),
    } as Color;
}

export function applySphereShadow(color: Color, sunDirection: Vec3, center: Vec3, point: Vec3, ambient: number) {
    const normVector = center.minus(point).normalize();
    const mult = Math.max(0, normVector.dot(v(sunDirection).normalize()));
    return darkenColor(color, Math.max(0, 1 - mult) * (1 - ambient));
}

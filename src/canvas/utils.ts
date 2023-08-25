export function createCanvas(width: number, height: number) {
    const canv = document.createElement('canvas');
    canv.setAttribute('width', width.toString());
    canv.setAttribute('height', height.toString());
    document.querySelector('#root')?.appendChild(canv);
    const ctx = canv.getContext('2d');

    return {
        canvas: canv,
        ctx,
    };
}

export function fillBackground(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

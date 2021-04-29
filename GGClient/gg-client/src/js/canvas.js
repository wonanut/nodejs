const color_map = {
    0: "rgb(255,255,255)",
    1: "rgb(217,217,217)",
    2: "rgb(255,0,0)",
    3: "rgb(255,185,185)",
    4: "rgb(0,176,80)",
    5: "rgb(133,255,185)",
    6: "rgb(0,176,240)",
    7: "rgb(175,234,255)",
    8: "rgb(255,192,0)",
    9: "rgb(255,234,167)"
}

// 绘制填充矩阵
export function canvasFillRect(ctx, x, y, width, height, fillStyle, strokeStyle) {
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.fillRect(x, y, width, height);
}

// 绘制矩形框
export function canvasStrokeRect(ctx, x, y, width, height, fillStyle, strokeStyle, lineWidth=2) {
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, width, height);
}

export function canvasDrawBlock(ctx, x, y, width, height, blockType, fillColor, lineColor="rgb(255,255,255)", lineWidth=2) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, width, height);
    switch(blockType) {
        case 0:
            break;
        case 1:
            // 上边框
            canvasDrawLine(ctx, x, y, width, lineWidth, lineColor);
            break;
        case 2:
            // 右边框
            canvasDrawLine(ctx, x + width, y, lineWidth, height, lineColor);
            break;
        case 3:
            // 下边框
            canvasDrawLine(ctx, x, y + height, lineWidth, height, lineColor);
            break;
        case 4:
            // 左边框
            canvasDrawLine(ctx, x, y, lineWidth, height, lineColor);
            break;
        case 5:
            canvasDrawLine(ctx, x, y, width, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y, lineWidth, height, lineColor);
            break;
        case 6:
            canvasDrawLine(ctx, x, y, lineWidth, height, lineColor);
            canvasDrawLine(ctx, x + width, y, lineWidth, height, lineColor);
            break;
        case 7:
            canvasDrawLine(ctx, x, y, lineWidth, height, lineColor);
            canvasDrawLine(ctx, x, y + height, lineWidth, height, lineColor);
            break;
        case 8:
            canvasDrawLine(ctx, x, y, width, lineWidth, lineColor);
            canvasDrawLine(ctx, x + width, y, lineWidth, height, lineColor);
            break;
        case 9:
            canvasDrawLine(ctx, x, y, width, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y + height, lineWidth, height, lineColor);
            break;
        case 10:
            canvasDrawLine(ctx, x, y + height, lineWidth, height, lineColor);
            canvasDrawLine(ctx, x + width, y, lineWidth, height, lineColor);
            break;
        case 11:
            canvasDrawLine(ctx, x, y, width, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y, lineWidth, height, lineColor);
            canvasDrawLine(ctx, x + width, y, lineWidth, height, lineColor);
            break;
        case 12:
            canvasDrawLine(ctx, x, y, width, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y, lineWidth, height, lineColor);
            canvasDrawLine(ctx, x, y + height, lineWidth, height, lineColor);
            break;
        case 13:
            canvasDrawLine(ctx, x, y + height, lineWidth, height, lineColor);
            canvasDrawLine(ctx, x, y, lineWidth, height, lineColor);
            canvasDrawLine(ctx, x + width, y, lineWidth, height, lineColor);
            break;
        case 14:
            canvasDrawLine(ctx, x, y, width, lineWidth, lineColor);
            canvasDrawLine(ctx, x + width, y, lineWidth, height, lineColor);
            canvasDrawLine(ctx, x, y + height, lineWidth, height, lineColor);
            break;
        case 15:
            canvasDrawLine(ctx, x, y, width, lineWidth, lineColor);
            canvasDrawLine(ctx, x + width, y, lineWidth, height, lineColor);
            canvasDrawLine(ctx, x, y + height, lineWidth, height, lineColor);
            canvasDrawLine(ctx, x, y, lineWidth, height, lineColor);
            break;
        default:
            break;
    }
}

// 绘制整个游戏的地图
export function canvasDrawMap(ctx, map, canvas_config) {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            this.canvasFillRect(
                ctx,
                canvas_config.start_x + i * canvas_config.block_width + 1,
                canvas_config.start_y + j * canvas_config.block_width + 1,
                canvas_config.block_width - 2,
                canvas_config.block_width - 2,
                color_map[map[i][j]],
                "rgb(0,0,0)"
            )
        }
    }
}

export function canvasDrawLine(ctx, x, y, width, height, strokeColor, lineWidth=2) {
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y + height);
    ctx.stroke();
}

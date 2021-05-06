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

// 绘制棋局上的基本单元格
export function canvasDrawBlock(ctx, x, y, width, height, blockType, fillColor, lineColor="rgb(255,255,255)", lineWidth=2) {
    ctx.fillStyle = fillColor;
    ctx.fillRect(x, y, width, height);
    switch(blockType) {
        case 0:
            break;
        case 1:
            // 上边框
            canvasDrawLine(ctx, x, y, width, 0, lineWidth, lineColor);
            break;
        case 2:
            // 右边框
            canvasDrawLine(ctx, x + width, y, 0, height, lineWidth, lineColor);
            break;
        case 3:
            // 下边框
            canvasDrawLine(ctx, x, y + height, width, 0, lineWidth, lineColor);
            break;
        case 4:
            // 左边框
            canvasDrawLine(ctx, x, y, 0, height, lineWidth, lineColor);
            break;
        case 5:
            canvasDrawLine(ctx, x, y, width, 0, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y, 0, height, lineWidth, lineColor);
            break;
        case 6:
            canvasDrawLine(ctx, x, y, 0, height, lineWidth, lineColor);
            canvasDrawLine(ctx, x + width, y, 0, height, lineWidth, lineColor);
            break;
        case 7:
            canvasDrawLine(ctx, x, y, 0, height, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y + height, width, 0, lineWidth, lineColor);
            break;
        case 8:
            canvasDrawLine(ctx, x, y, width, 0, lineWidth, lineColor);
            canvasDrawLine(ctx, x + width, y, 0, height, lineWidth, lineColor);
            break;
        case 9:
            canvasDrawLine(ctx, x, y, width, 0, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y + height, width, 0, lineWidth, lineColor);
            break;
        case 10:
            canvasDrawLine(ctx, x + width, y, 0, height, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y + height, width, 0, lineWidth, lineColor);
            break;
        case 11:
            canvasDrawLine(ctx, x, y, width, 0, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y, 0, height, lineWidth, lineColor);
            canvasDrawLine(ctx, x + width, y, 0, height, lineWidth, lineColor);
            break;
        case 12:
            canvasDrawLine(ctx, x, y, width, 0, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y, 0, height, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y + height, width, 0, lineWidth, lineColor);
            break;
        case 13:
            canvasDrawLine(ctx, x, y, 0, height, lineWidth, lineColor);
            canvasDrawLine(ctx, x + width, y, 0, height, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y + height, width, 0, lineWidth, lineColor);
            break;
        case 14:
            canvasDrawLine(ctx, x, y, width, 0, lineWidth, lineColor);
            canvasDrawLine(ctx, x + width, y, 0, height, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y + height, width, 0, lineWidth, lineColor);
            break;
        case 15:
            canvasDrawLine(ctx, x, y, 0, height, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y, width, 0, lineWidth, lineColor);
            canvasDrawLine(ctx, x + width, y, 0, height, lineWidth, lineColor);
            canvasDrawLine(ctx, x, y + height, width, 0, lineWidth, lineColor);
            break;
        default:
            break;
    }
}

// 绘制整个游戏的地图
export function canvasDrawMap(canvas_config, map) {
    // 清除之前绘制的内容
    canvas_config.context.clearRect(0, 0, canvas_config.width, canvas_config.height);
    // 重新绘制新的内容
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            this.canvasDrawBlock(
                canvas_config.context,
                canvas_config.start_x + j * canvas_config.block_width,
                canvas_config.start_y + i * canvas_config.block_width,
                canvas_config.block_width,
                canvas_config.block_width,
                map[i][j].block_type,
                color_map[map[i][j].block_color]
            )
        }
    }
}

// 绘制浮动Canvas上的提示内容
export function canvasDrawFloatMap(canvas_config, start_row, start_col, chess, current_player) {
    // 清除之前绘制的内容
    canvas_config.context_float.clearRect(0, 0, canvas_config.width, canvas_config.height);
    // 重新绘制新的内容
    let rows = chess.height;
    let cols = chess.width;
    let blocks = chess.shape.length;
    for (let i = 0; i < blocks; i++) {
        let current_row = Math.floor(i / cols) + start_row;
        let current_col = i % cols + start_col;
        if (current_row < 6 || current_col < 6 || current_row > 25 ||current_col > 25 ) continue;
        if (chess.shape[i] == 1) {
            this.canvasDrawBlock(
                canvas_config.context_float,
                canvas_config.start_x + current_col * canvas_config.block_width,
                canvas_config.start_y + current_row * canvas_config.block_width,
                canvas_config.block_width,
                canvas_config.block_width,
                15,
                color_map[(current_player + 1) * 2]
            )
        }
    }
}


/* 内部函数 外部JS无法访问 */

// 绘制线条
function canvasDrawLine(ctx, x, y, width, height, lineWidth=2, strokeColor="rgb(255,255,255)") {
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y + height);
    ctx.stroke();
}
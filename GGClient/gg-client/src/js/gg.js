// 检查坐标(row, col)是否在region中，如果在返回true，否则返回false
export function checkIsInRegion(row, col, region) {
    if (row >= region.x && col >= region.y && row < region.x + region.width && col < region.y + region.height) {
        for (let i = 0; i < region.empty.length; i++) {
            if (row == region.empty[i].x && col == region.empty[i].y) {
                return false;
            }
        }
        return true;
    }
    return false;
}

export function test() {
    console.log("test ok!");
}

// 定义棋子类存储所有棋子的状态
// 棋子编号定义：sabc，其中a指的是该棋子由多少个小方块组成，b指的是其最大高度（横着放，高度最大为3），c指的是其具体编号
export const chesses = [{
        index: 0,
        width: 1,
        height: 1,
        shape: [1],
        canOverturn: false,
        canRotates: 1
    },
    {
        index: 1,
        width: 2,
        height: 1,
        shape: [1,1],
        canOverturn: false,
        canRotates: 2
    },
    {
        index: 2,
        width: 3,
        height: 1,
        shape: [1,1,1],
        canOverturn: false,
        canRotates: 2
    },
    {
        index: 3,
        width: 2,
        height: 2,
        shape: [1,0,1,1],
        canOverturn: false,
        canRotates: 4
    },
    {
        index: 4,
        width: 4,
        height: 1,
        shape: [1,1,1,1],
        canOverturn: false,
        canRotates: 2
    },
    {
        index: 5,
        width: 3,
        height: 2,
        shape: [1,0,0,1,1,1],
        canOverturn: true,
        canRotates: 4
    },
    {
        index: 6,
        width: 3,
        height: 2,
        shape: [0,1,0,1,1,1],
        canOverturn: false,
        canRotates: 4
    }
    ,{
        index: 7,
        width: 2,
        height: 2,
        shape: [1,1,1,1],
        canOverturn: false,
        canRotates: 1
    },
    {
        index: 8,
        width: 3,
        height: 2,
        shape: [1,1,0,0,1,1],
        canOverturn: true,
        canRotates: 4
    },
    {
        index: 9,
        width: 5,
        height: 1,
        shape: [1,1,1,1,1],
        canOverturn: false,
        canRotates: 2
    },
    {
        index: 10,
        width: 4,
        height: 2,
        shape: [1,0,0,0,1,1,1,1],
        canOverturn: true,
        canRotates: 4
    },
    {
        index: 11,
        width: 4,
        height: 2,
        shape: [1,1,0,0,0,1,1,1],
        canOverturn: true,
        canRotates: 4
    },
    {
        index: 12,
        width: 4,
        height: 2,
        shape: [1,1,1,1,0,0,1,0],
        canOverturn: true,
        canRotates: 4
    },
    {
        index: 13,
        width: 3,
        height: 2,
        shape: [1,1,0,1,1,1],
        canOverturn: true,
        canRotates: 4
    },
    {
        index: 14,
        width: 3,
        height: 2,
        shape: [1,0,1,1,1,1],
        canOverturn: false,
        canRotates: 4
    },
    {
        index: 15,
        width: 3,
        height: 3,
        shape: [0,1,0,0,1,0,1,1,1],
        canOverturn: false,
        canRotates: 4
    },
    {
        index: 16,
        width: 3,
        height: 3,
        shape: [1,0,0,1,0,0,1,1,1],
        canOverturn: false,
        canRotates: 4
    },
    {
        index: 17,
        width: 3,
        height: 3,
        shape: [1,1,0,0,1,1,0,0,1],
        canOverturn: false,
        canRotates: 4
    },
    {
        index: 18,
        width: 3,
        height: 3,
        shape: [1,0,0,1,1,1,0,0,1],
        canOverturn: false,
        canRotates: 4
    },
    {
        index: 19,
        width: 3,
        height: 3,
        shape: [1,0,0,1,1,1,0,1,0],
        canOverturn: true,
        canRotates: 4
    },
    {
        index: 20,
        width: 3,
        height: 3,
        shape: [0,1,0,1,1,1,0,1,0],
        canOverturn: false,
        canRotates: 1
    }
]

// 定义基本单元Block的数据结构
export function Chess(row, col, chess_type, block_type) {
    var chess = new Object;
    chess.row = row;
    chess.col = col;
    chess.chess_type = chess_type;
    chess.block_type = block_type;
    return chess;
}

// 初始化玩家棋盘函数
const chess_type_list = [
    [7,7,11,11,16,16,16,2,17,17,10,10,3,3,1,1,15,-1],
    [7,7,5,11,11,11,16,2,19,17,17,10,3,20,15,15,15,4],
    [14,14,5,18,18,8,16,2,19,19,17,10,20,20,20,6,15,4],
    [14,5,5,18,8,8,12,19,19,13,13,10,0,20,6,6,6,4],
    [14,14,18,18,8,12,12,12,12,13,13,13,9,9,9,9,9,4]
]

const block_type_list = [
    [5,8,12,8,12,9,8,11,12,8,12,8,5,14,12,14,11,-1],
    [7,10,11,7,9,14,6,6,11,7,8,6,13,11,12,9,2,11],
    [5,14,6,5,14,11,13,13,4,14,13,6,12,0,14,11,13,6],
    [6,12,10,6,5,10,11,12,10,5,8,13,15,13,12,3,14,6],
    [7,14,12,10,13,12,3,9,14,7,3,14,12,9,9,9,14,13]
]

export function initChess() {
    var ret_list = [];
    for (let i = 0; i < chess_type_list.length; i++) {
        var row_list = [];
        for (let j = 0; j < chess_type_list[i].length; j++) {
            var chessObject = Chess(i, j, chess_type_list[i][j], block_type_list[i][j]);
            row_list.push(chessObject);
        }
        ret_list.push(row_list);
    }
    return ret_list;
}

export function rotateMatrix(mat, angle) {
    var ret_mat;
    
}
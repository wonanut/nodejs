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
        canRotates: 1,
        blocks: 1
    },
    {
        index: 1,
        width: 2,
        height: 1,
        shape: [1,1],
        canOverturn: false,
        canRotates: 2,
        blocks: 2
    },
    {
        index: 2,
        width: 3,
        height: 1,
        shape: [1,1,1],
        canOverturn: false,
        canRotates: 2,
        blocks: 3
    },
    {
        index: 3,
        width: 2,
        height: 2,
        shape: [1,0,1,1],
        canOverturn: false,
        canRotates: 4,
        blocks: 3
    },
    {
        index: 4,
        width: 4,
        height: 1,
        shape: [1,1,1,1],
        canOverturn: false,
        canRotates: 2,
        blocks: 4
    },
    {
        index: 5,
        width: 3,
        height: 2,
        shape: [1,0,0,1,1,1],
        canOverturn: true,
        canRotates: 4,
        blocks: 4
    },
    {
        index: 6,
        width: 3,
        height: 2,
        shape: [0,1,0,1,1,1],
        canOverturn: false,
        canRotates: 4,
        blocks: 4
    }
    ,{
        index: 7,
        width: 2,
        height: 2,
        shape: [1,1,1,1],
        canOverturn: false,
        canRotates: 1,
        blocks: 4
    },
    {
        index: 8,
        width: 3,
        height: 2,
        shape: [1,1,0,0,1,1],
        canOverturn: true,
        canRotates: 4,
        blocks: 4
    },
    {
        index: 9,
        width: 5,
        height: 1,
        shape: [1,1,1,1,1],
        canOverturn: false,
        canRotates: 2,
        blocks: 5
    },
    {
        index: 10,
        width: 4,
        height: 2,
        shape: [1,0,0,0,1,1,1,1],
        canOverturn: true,
        canRotates: 4,
        blocks: 5
    },
    {
        index: 11,
        width: 4,
        height: 2,
        shape: [1,1,0,0,0,1,1,1],
        canOverturn: true,
        canRotates: 4,
        blocks: 5
    },
    {
        index: 12,
        width: 4,
        height: 2,
        shape: [1,1,1,1,0,0,1,0],
        canOverturn: true,
        canRotates: 4,
        blocks: 5
    },
    {
        index: 13,
        width: 3,
        height: 2,
        shape: [1,1,0,1,1,1],
        canOverturn: true,
        canRotates: 4,
        blocks: 5
    },
    {
        index: 14,
        width: 3,
        height: 2,
        shape: [1,0,1,1,1,1],
        canOverturn: false,
        canRotates: 4,
        blocks: 5
    },
    {
        index: 15,
        width: 3,
        height: 3,
        shape: [0,1,0,0,1,0,1,1,1],
        canOverturn: false,
        canRotates: 4,
        blocks: 5
    },
    {
        index: 16,
        width: 3,
        height: 3,
        shape: [1,0,0,1,0,0,1,1,1],
        canOverturn: false,
        canRotates: 4,
        blocks: 5
    },
    {
        index: 17,
        width: 3,
        height: 3,
        shape: [1,1,0,0,1,1,0,0,1],
        canOverturn: false,
        canRotates: 4,
        blocks: 5
    },
    {
        index: 18,
        width: 3,
        height: 3,
        shape: [1,0,0,1,1,1,0,0,1],
        canOverturn: true,
        canRotates: 4,
        blocks: 5
    },
    {
        index: 19,
        width: 3,
        height: 3,
        shape: [1,0,0,1,1,1,0,1,0],
        canOverturn: true,
        canRotates: 4,
        blocks: 5
    },
    {
        index: 20,
        width: 3,
        height: 3,
        shape: [0,1,0,1,1,1,0,1,0],
        canOverturn: false,
        canRotates: 1,
        blocks: 5
    }
]

// 定义基本单元Block的数据结构
// row和col对应Block在棋盘上的位置
// chess_type对应棋盘上棋子的形状，与逻辑有关
// block_type对应Block的绘图样式，与逻辑无关，且初始化之后不再更改
export function Block(row, col, chess_type, block_type, block_color) {
    var block = new Object;
    block.row = row;
    block.col = col;
    block.chess_type = chess_type;
    block.block_type = block_type;
    block.block_color = block_color;
    return block;
}

// 定义玩家数据结构
export function Player(idx, name, regions, empty_block, start_block, remains, status) {
    var player = new Object;
    player.idx = idx;
    player.name = name;
    player.regions = regions;
    player.empty_block = empty_block;
    player.start_block = start_block;
    player.remains = remains;
    player.status = status;
    return player;
}

// 玩家区域信息配置
const player_region_conf = [{
    start_row: 27,
    start_col: 7,
    width: 18,
    height: 5,
    chess_type_list: [
        [7,7,11,11,16,16,16,2,17,17,10,10,3,3,1,1,15,-1],
        [7,7,5,11,11,11,16,2,19,17,17,10,3,20,15,15,15,4],
        [14,14,5,18,18,8,16,2,19,19,17,10,20,20,20,6,15,4],
        [14,5,5,18,8,8,12,19,19,13,13,10,0,20,6,6,6,4],
        [14,14,18,18,8,12,12,12,12,13,13,13,9,9,9,9,9,4]
    ],
    block_type_list: [
        [5,8,12,8,12,9,8,11,12,8,12,8,5,14,12,14,11,-1],
        [7,10,11,7,9,14,6,6,11,7,8,6,13,11,12,9,2,11],
        [5,14,6,5,14,11,13,13,4,14,13,6,12,0,14,11,13,6],
        [6,12,10,6,5,10,11,12,10,5,8,13,15,13,12,3,14,6],
        [7,14,12,10,13,12,3,9,14,7,3,14,12,9,9,9,14,13]
    ],
    empty_block: [27, 24],
    start_block: [25, 6]
},
{
    start_row: 7,
    start_col: 27,
    width: 5,
    height: 18,
    chess_type_list: [
        [-1,4,4,4,4],
        [15,15,15,6,9],
        [1,15,6,6,9],
        [1,15,20,6,9],
        [3,20,20,20,9],
        [3,3,20,0,9],
        [10,10,10,10,13],
        [10,17,17,13,13],
        [17,17,19,13,13],
        [17,19,19,19,12],
        [2,2,2,19,12],
        [16,16,16,12,12],
        [16,11,8,8,12],
        [16,11,18,8,8],
        [11,11,18,18,18],
        [11,5,5,5,18],
        [7,7,14,5,14],
        [7,7,14,14,14]
    ],
    block_type_list: [
        [15,12,9,9,14],
        [12,1,14,11,11],
        [11,6,12,2,6],
        [13,13,11,13,6],
        [11,12,0,14,6],
        [7,14,13,15,13],
        [5,9,9,14,11],
        [13,5,14,5,2],
        [5,10,11,7,10],
        [13,12,3,8,11],
        [12,9,14,13,6],
        [5,9,14,12,2],
        [6,11,12,8,13],
        [13,6,11,7,14],
        [5,10,7,9,8],
        [13,12,9,8,13],
        [5,8,11,13,11],
        [7,10,7,9,10]
    ],
    empty_block: [7, 27],
    start_block: [25, 25]
},
{
    start_row: 0,
    start_col: 7,
    width: 18,
    height: 5,
    chess_type_list: [
        [4,9,9,9,9,9,13,13,13,12,12,12,12,8,18,18,14,14],
        [4,6,6,6,20,0,10,13,13,19,19,12,8,8,18,5,5,14],
        [4,15,6,20,20,20,10,17,19,19,2,16,8,18,18,5,14,14],
        [4,15,15,15,20,3,10,17,17,19,2,16,11,11,11,5,7,7],
        [-1, 15,1,1,3,3,10,10,17,17,2,16,16,16,11,11,7,7]
    ],
    block_type_list: [
        [11,12,9,9,9,14,12,1,8,12,9,1,14,11,5,14,12,8],
        [6,12,1,14,11,15,11,7,10,5,14,13,5,10,6,5,14,6],
        [6,11,13,12,0,14,6,11,12,2,11,11,13,12,10,6,12,10],
        [13,4,9,14,13,11,6,7,8,13,6,6,12,9,8,13,5,8],
        [-1,13,12,14,12,10,7,14,7,14,13,7,9,14,7,14,7,10]
    ],
    empty_block: [4, 7],
    start_block: [6, 25]
},
{
    start_row: 7,
    start_col: 0,
    width: 5,
    height: 18,
    chess_type_list: [
        [14,14,14,7,7],
        [14,5,14,7,7],
        [18,5,5,5,11],
        [18,18,18,11,11],
        [8,8,18,11,16],
        [12,8,8,11,16],
        [12,12,16,16,16],
        [12,19,2,2,2],
        [12,19,19,19,17],
        [13,13,19,17,17],
        [13,13,17,17,10],
        [13,10,10,10,10],
        [9,0,20,3,3],
        [9,20,20,20,3],
        [9,6,20,15,1],
        [9,6,6,15,1],
        [9,6,15,15,15],
        [4,4,4,4,-1]
    ],
    block_type_list: [
        [5,9,8,5,8],
        [13,11,13,7,10],
        [11,7,9,14,11],
        [7,9,8,5,10],
        [12,8,13,6,11],
        [11,7,14,13,6],
        [4,14,12,9,10],
        [6,11,12,9,14],
        [13,7,1,14,11],
        [5,8,13,5,10],
        [4,10,12,10,11],
        [13,12,9,9,10],
        [11,15,11,12,8],
        [6,12,0,14,13],
        [6,11,13,11,11],
        [6,4,14,6,7],
        [13,13,12,3,14],
        [12,9,9,14,-1]
    ],
    empty_block: [24, 4],
    start_block: [6, 6]
}]

// 初始化玩家信息函数
export function initPlayerInfo() {
    var player_infos = [];
    for (let i = 0; i < 4; i++) {
        let regions = {
            start_row: player_region_conf[i].start_row,
            start_col: player_region_conf[i].start_col,
            width: player_region_conf[i].width,
            height: player_region_conf[i].height,
        }
        let player = new Player(i, "player_" + i, regions, player_region_conf[i].empty_block, player_region_conf[i].start_block, 89, 'inited');
        player_infos.push(player);
    }
    return player_infos;
}

// 初始化棋盘函数
export function initGameBoard() {
    var game_data = {};
    var game_board = [];
    
    game_data["rows"] = 32;
    game_data["cols"] = 32;
    game_data["board_start"] = [6, 6];
    game_data["board_dest"] = [25, 25]; 
    
    // 初始化整个棋盘
    for (let i = 0; i < 32; i++) {
        var row_list = [];
        for (let j = 0; j < 32; j++) {
            // 默认的block_type为0即没有边框
            // 默认的chess_type为-1，表示不能操作区域
            // 默认的chess_color编码为0，绘图为白色
            var chessObject = Block(i, j, -1, 0, 0);
            row_list.push(chessObject);
        }
        game_board.push(row_list);
    }

    // 初始化玩家区域
    for (let i = 0; i < player_region_conf.length; i++) {
        let color_code = (i + 1) * 2;
        let start_row = player_region_conf[i].start_row;
        let start_col = player_region_conf[i].start_col;
        for (let j = 0; j < player_region_conf[i].height; j++) {
            for (let k = 0; k < player_region_conf[i].width; k++) {
                if (start_row + j == player_region_conf[i].empty_block[0] && start_col + k == player_region_conf[i].empty_block[1]) {
                    continue;
                }
                game_board[start_row + j][start_col + k].chess_type = player_region_conf[i].chess_type_list[j][k];
                game_board[start_row + j][start_col + k].block_type = player_region_conf[i].block_type_list[j][k];
                game_board[start_row + j][start_col + k].block_color = color_code;
            }
        }
    }

    // 初始化棋盘
    for (let i = 6; i <= 25; i++) {
        for (let j = 6; j <= 25; j++) {
            game_board[i][j].block_color = 1;
            game_board[i][j].block_type = 15;
            game_board[i][j].chess_type = 30;
        }
    }

    game_data["map"] = game_board;
    return game_data;
}

// 使用BFS找到与row, col位置Block类型相同的所有Blocks
export function BFSSearch(map, row, col) {
    var ret = [];
    _BFSSearch(map, row, col, map[row][col].chess_type, ret);
    return ret;
}

// 内部函数，BFSSearch函数调用的递归函数
function _BFSSearch(map, row, col, chess_type, ret) {
    map[row][col].chess_type = -1;
    map[row][col].block_color += 1;
    ret.push([row, col]);
    let directions_x = [0, 0, 1, -1];
    let directions_y = [1, -1, 0, 0];
    for (let i = 0; i < 4; i++) {
        let new_row = row + directions_x[i];
        let new_col = col + directions_y[i];
        if (new_row < 0 || new_col < 0 || new_row >= 32 || new_col >= 32) continue;
        if (map[new_row][new_col].chess_type != chess_type) continue;
        _BFSSearch(map, new_row, new_col, chess_type, ret);
    }
}

// 将原本选中的棋子放回玩家手中
export function putBackChess(map, positions, chess_type) {
    for (let i = 0; i < positions.length; i++) {
        let row = positions[i][0];
        let col = positions[i][1];
        map[row][col].chess_type = chess_type;
        map[row][col].block_color -= 1;
    }
}

// 顺时针旋转棋子
export function rotateChess(chess) {
    if (chess.canRotates == 1) return;
    var tmp_shape = [];
    for (let i = 0; i < chess.width; i++) {
        for (let j = chess.height - 1; j >= 0; j--) {
            tmp_shape.push(chess.shape[j * chess.width + i]);
        }
    }
    chess.shape = tmp_shape;
    let tmp_width = chess.width;
    chess.width = chess.height;
    chess.height = tmp_width;
}

// 垂直翻转棋子
export function overturnChess(chess) {
    if (!chess.canOverturn) return;
    // 遍历每一行
    for (let i = 0; i < chess.height; i++) {
        // 遍历每一行的前一半列，将该位置的数据和镜像对称位置的数据交换
        for (let j = 0; j < Math.floor(chess.width / 2); j++) {
            let j_image = chess.width - 1 - j;
            let tmp = chess.shape[i * chess.width + j];
            chess.shape[i * chess.width + j] = chess.shape[i *chess.width + j_image];
            chess.shape[i *chess.width + j_image] = tmp;
        }
    }
}

// 检查当前位置能否放置棋子
export function checkLegalPosition(game_data, start_row, start_col) {
    var current_player = game_data.player_infos[game_data.current_player];
    // 如果当前玩家是inited状态，棋子必须放置在start_block位置
    if (current_player.status == "inited") {
        var flag = false;
        for (let i = 0; i < game_data.current_chess.height; i++) {
            for (let j = 0; j < game_data.current_chess.width; j++) {
                let current_row = start_row + i;
                let current_col = start_col + j;
                if (current_row < 6 || current_col < 6 || current_row > 25 || current_col > 25) return false;
                if (game_data.current_chess.shape[i * game_data.current_chess.width + j] == 1) {
                    if (game_data.map["map"][current_row][current_col].chess_type == -1) return false;
                    if (current_row == current_player.start_block[0] && current_col == current_player.start_block[1]) flag = true;
                }
            }
        }
        return flag;
    }
    // 如果当前玩家是normal状态，判断规则就复杂很多
    else {
        // 先检查最基本的规则：当前棋子所在的blocks中不能已经被占用
        for (let i = 0; i < game_data.current_chess.height; i++) {
            for (let j = 0; j < game_data.current_chess.width; j++) {
                let current_row = start_row + i;
                let current_col = start_col + j;
                if (current_row < 6 || current_col < 6 || current_row > 25 || current_col > 25) return false;
                if (game_data.current_chess.shape[i * game_data.current_chess.width + j] == 1 && game_data.map["map"][current_row][current_col].chess_type == -1) return false;
            }
        }
        // 检查方格游戏的棋子放置规则
        return checkChess(game_data, start_row, start_col);
    }
}

// 检查当前棋子game_data.current_chess的放置是否符合方格游戏的规则
function checkChess(game_data, start_row, start_col) {
    // TODO
    return true;
}

// 放置棋子到棋盘上，调用该函数之前应该使用checkLegalPosition函数判断当前位置是否合法
export function putChess(game_data, start_row, start_col) {
    var current_player = game_data.player_infos[game_data.current_player];
    if (current_player.status == "inited") {
        current_player.status = "normal";
    }
    for (let i = 0; i < game_data.current_chess.height; i++) {
        for (let j = 0; j < game_data.current_chess.width; j++) {
            let current_row = start_row + i;
            let current_col = start_col + j;
            if (game_data.current_chess.shape[i * game_data.current_chess.width + j] == 1) {
                game_data.map["map"][current_row][current_col].chess_type = -1;
                game_data.map["map"][current_row][current_col].block_color = (game_data.current_player + 1) * 2;
            }
        }
    }
}

// 检查当前位置是否在player_info对应区域
export function checkCurrentPlayerRegion(game_data, row, col) {
    var player_info = game_data.player_infos[game_data.current_player]
    if (row < player_info.regions.start_row || col < player_info.regions.start_col) return false;
    if (row >= player_info.regions.start_row + player_info.regions.height || col >= player_info.regions.start_col + player_info.regions.width) return false;
    if (row == player_info.empty_block[0] && col == player_info.empty_block[1]) return false;
    // 如果当前区域的棋子已经被使用过
    if (game_data.map["map"][row][col].chess_type == -1) return false;
    return true;
}
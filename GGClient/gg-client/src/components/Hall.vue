<template>
<div id="hall-view">
    <div id="hall-view-left">
        <!-- 在游戏大厅(game_view=0)或者匹配界面(game_view=2)会显示该左侧边栏 -->
        <div v-show="game_view != 1" id="hall-view-left-body">
            <div id="hall-view-left-top">
                <el-input v-model="nickname" class="input-with-select" :disabled=nickname_editable>
                    <el-button slot="append" v-if="nickname_editable" @click="handleEdit()" icon="el-icon-edit"></el-button>
                    <el-button slot="append" v-else @click="handleSubmitEdit()" icon="el-icon-check"></el-button>
                </el-input>
            </div>
            <el-table :data="player_list" id="player-list">
                <el-table-column label="玩家列表" :span="1">
                    <template slot-scope="scope">
                        <span>{{ scope.$index }}&nbsp;>&nbsp;{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" :span="1">
                    <template slot-scope="scope">
                        <el-tag size="mini">{{ scope.row.status }}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 进入游戏状态(game_view=1)会显示该左侧栏 -->
        <div v-show="game_view == 1" id="hall-view-left-body">
            <el-table :data="game_data.player_infos" id="player-list" :row-class-name="tableRowClassName">
                <el-table-column label="玩家昵称" :span="1">
                    <template slot-scope="scope">
                        <span>
                            <div v-if="scope.row.idx == 0" style="color: rgb(255,0,0)">▊ {{ scope.row.name }}</div>
                            <div v-else-if="scope.row.idx == 1" style="color: rgb(0,176,80)" >▊ {{ scope.row.name }}</div>
                            <div v-else-if="scope.row.idx == 2" style="color: rgb(0,176,240)" >▊ {{ scope.row.name }}</div>
                            <div v-else style="color: rgb(255,192,0)" >▊ {{ scope.row.name }}</div>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="剩余方块" :span="1">
                    <template slot-scope="scope">
                        <span>{{ scope.row.remains }} blocks</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" :span="1">
                    <template slot-scope="scope">
                        <span>
                            <el-tag v-if="scope.row.status == 'inited'" >{{ scope.row.status }}</el-tag>
                            <el-tag v-else-if="scope.row.status == 'normal'" type="success">{{ scope.row.status }}</el-tag>
                            <el-tag v-else type="info" >{{ scope.row.status }}</el-tag>
                        </span>
                    </template>
                </el-table-column>
            </el-table>
            <el-button id="give-up" @click="handleGiveup()" icon="el-icon-close" type="danger" round>认输</el-button>
            <el-button id="give-up" @click="handleQuitOfflineGame()" icon="el-icon-upload2" type="success" round>离开</el-button>
        </div>
    </div>
    <div id="hall-view-right" ref="canvasWrapper">
        <div v-show="game_view == 0" id="offline-game-tip">
            <p id="tip-content">当前没有正在进行的游戏 你可以进入匹配队列等待其他联机队友 或者开始一场单机游戏</p>
            <el-button type="primary" round size="normal" @click="handleStartOfflineGame">开始单机游戏</el-button>
            <el-button type="success" round size="normal" @click="handleStartOnlineGame">加入匹配队列</el-button>
        </div>
        <canvas v-show="game_view == 1" id="offline-game-canvas" width="800" height="600" ref="myCanvas"></canvas>
        <canvas v-show="game_view == 1" id="offline-game-canvas-float" width="800" height="600" ref=myCanvasFloat></canvas>
        <div v-show="game_view == 2" id="matching-queue">
        </div>
    </div>
</div>
</template>

<script>
const ele = require('element-ui')
const ggl = require('@/js/gg.js')
const can = require('@/js/canvas.js')

export default {
    name: "hall",
    data() {
        return {
            nickname_editable: true,
            // 控制当前显示界面 0-大厅界面（初始值） 1-游戏界面 2-匹配界面
            game_view: 0,
            canvas_config: {
                canvas: null,
                context: null,
                canvas_float: null,
                context_float: null,
                width: 800,
                height: 600,
                actual_width: 600,
                start_x: 0,
                start_y: 0,
                block_width: 20,
            },
            game_data: {
                map: null,
                map_row: 32,
                map_col: 32,
                chesses: null,
                player_infos: [],
                game_status: 0,
                current_status: 0, // 0 表示没有选中棋子 1 表示已经选中棋子但还没有放置 2 表示已经放置棋子到棋盘上但是还没有点击确定 3 表示游戏结束
                current_blocks_chess_type: 0,
                current_blocks_prev_pos: [],
                current_chess: null,
                current_player: 3
            }
        }
    },
    props: {
        nickname: {
            type: String,
            defalut: "PLAYER_XXXX"
        },
        ws: {
            type: WebSocket,
            default: null
        },
        player_list: {
            type: Array,
            default: null
        }
    },
    mounted() {
        //
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (row.idx === this.game_data.current_player) {
                return 'success-row';
            } else {
                return '';
            }
        },
        handleGiveup() {
            if (this.game_data.player_infos[this.game_data.current_player].status == "finished") return;
            this.game_data.player_infos[this.game_data.current_player].status = "failed";
            this.gameLoop();
        },
        handleQuitOfflineGame() {
            this.game_view = 0;
        },
        handleEdit() {
            this.nickname_editable = false
        },
        handleSubmitEdit() {
            this.nickname_editable = true
        },
        handleStartOnlineGame() {
            // 显示匹配界面
            this.game_view = 2
            // 向服务器端发送进入匹配队列的消息
            this.ws.send(JSON.stringify({
                name: this.nickname,
                type: 'PLAYER_PREPARE'
            }));
        },
        handleStartOfflineGame() {
            this.game_view = 1

            // 初始化游戏数据
            this.initGame()

            // 调用Canvas初始化游戏场景
            this.initCanvas()

            // 开始进入游戏循环
            this.gameLoop()
        },
        handleMouseMove(event) {
            if (this.game_data.game_status == 1) {
                return;
            }

            let current_pos = this.getCurrentBlock(event);
            let row = current_pos[0];
            let col = current_pos[1];
            
            if (this.game_data.current_status == 1) {
                can.canvasDrawFloatMap(this.canvas_config, row, col, this.game_data.current_chess, this.game_data.current_player);
            }
        },
        handleMouseDown(event) {
            if (this.game_data.game_status == 1) {
                return;
            }

            // 鼠标按下事件对应处理函数，分为左击和右击两种情况处理
            event = event || window.event;
            let current_pos = this.getCurrentBlock(event);
            let row = current_pos[0];
            let col = current_pos[1];
            let chess_type = this.game_data.map["map"][row][col].chess_type;

            // 如果是鼠标左击
            if (event.button == 0) {
                // 无效区域
                if (row < 0 || col < 0 || row >= 32 || col >= 32) return;
                // 棋盘区域
                // 如果当前位置可以放置棋子，而且当前的current_status为1，检查是否能够在当前位置放置棋子
                // 这里的判断逻辑比较复复杂，详细的规则可以看ggl.checkLegalPosition函数实现
                if (this.game_data.current_status == 1 && ggl.checkLegalPosition(this.game_data, row, col)) {
                    ggl.putChess(this.game_data, row, col);
                    this.game_data.player_infos[this.game_data.current_player].remains -= this.game_data.current_chess.blocks;
                    // 如果某个玩家已经用完所有的棋子，将其状态更改为finished
                    if (this.game_data.player_infos[this.game_data.current_player].remains == 0) {
                        this.game_data.player_infos[this.game_data.current_player].status = "finished";
                        ele.Notification.success("玩家 " + this.game_data.player_infos[this.game_data.current_player].name + "已经完成游戏!");
                    }
                    this.game_data.current_status = 0;
                    this.game_data.current_chess = null;
                    this.gameLoop();
                }
                // 当前玩家有效区域
                else if (ggl.checkCurrentPlayerRegion(this.game_data, row, col)) {
                    // 如果当前已经选中了一个棋子，需要将原本选中的棋子放回去
                    if (this.game_data.current_status == 1) {
                        ggl.putBackChess(this.game_data.map["map"], this.game_data.current_blocks_prev_pos, this.game_data.current_blocks_chess_type);
                    }
                    this.game_data.current_status = 1;
                    this.game_data.current_blocks_chess_type = this.game_data.map["map"][row][col].chess_type;
                    this.game_data.current_chess = this.game_data.chesses[this.game_data.current_blocks_chess_type];
                    this.game_data.current_blocks_prev_pos = ggl.BFSSearch(this.game_data.map["map"], row, col);
                }

                can.canvasDrawMap(this.canvas_config, this.game_data.map["map"]);
            }
            // 如果是鼠标右击
            else if (event.button == 2) {
                if (this.game_data.current_status == 1) {
                    ggl.overturnChess(this.game_data.current_chess);
                    can.canvasDrawFloatMap(this.canvas_config, row, col, this.game_data.current_chess, this.game_data.current_player);
                }
            }
        },
        handleMouseWheel(event) {
            if (this.game_data.game_status == 1) {
                return;
            }
            // 滚动鼠标滑轮可以旋转当前选中的棋子
            let current_pos = this.getCurrentBlock(event);
            let row = current_pos[0];
            let col = current_pos[1];
            if (this.game_data.current_status == 1) {
                ggl.rotateChess(this.game_data.current_chess);
                can.canvasDrawFloatMap(this.canvas_config, row, col, this.game_data.current_chess, this.game_data.current_player);
            }
        },
        gameLoop() {
            // 一定要消除掉前一个玩家的状态信息，否则在前一个玩家主动认输时可能会出现意想不到的bug
            this.game_data.current_status = 0;
            this.current_blocks_prev_pos = [];
            this.current_chess = null;

            if (this.game_data.game_status == 1) {
                ele.Notification.info("游戏结束");
            }
            this.game_data.current_player = (this.game_data.current_player + 1) % 4;
            let cnt = 0;
            while (this.game_data.player_infos[this.game_data.current_player].status == "failed") {
                this.game_data.current_player = (this.game_data.current_player + 1) % 4;
                cnt += 1;
                if (cnt == 4) break;
            }
            if (cnt == 4) {
                this.game_data.game_status = 1;
                ele.Notification.info("游戏结束");
            }
            else {
                ele.Notification.success("现在轮到 " + this.game_data.player_infos[this.game_data.current_player].name + " 操作");
            }
        },
        getCurrentBlock(event) {
            const canvas = this.$refs.myCanvas;
            let cRect = canvas.getBoundingClientRect();
            let current_x = event.clientX - cRect.left - this.canvas_config.start_x;
            let current_y = event.clientY - cRect.top - this.canvas_config.start_y
            let current_row = Math.floor(current_y / this.canvas_config.block_width);
            let current_col = Math.floor(current_x / this.canvas_config.block_width);
            return [current_row, current_col];
        },
        initCanvas() {
            // 初始化Canvas绘图相关基本参数以及配置
            const canvas = this.$refs.myCanvas;
            const canvas_float = this.$refs.myCanvasFloat;
            this.canvas_config.width = this.$refs.canvasWrapper.offsetWidth;
            this.canvas_config.height = this.$refs.canvasWrapper.offsetHeight;
            canvas.width = this.canvas_config.width;
            canvas.height = this.canvas_config.height
            canvas_float.width = this.canvas_config.width;
            canvas_float.height = this.canvas_config.height;
            this.canvas_config.context = canvas.getContext('2d');
            this.canvas_config.context_float = canvas_float.getContext('2d');

            if (this.canvas_config.width >= this.canvas_config.height) {
                let gap = (this.canvas_config.width - this.canvas_config.height) / 2;
                this.canvas_config.start_x = gap;
                this.canvas_config.start_y = 0;
                this.canvas_config.actual_width = this.canvas_config.height;
                this.canvas_config.block_width = this.canvas_config.height / this.game_data.map_row;
            } else {
                let gap = (this.canvas_config.height - this.canvas_config.width) / 2;
                this.canvas_config.start_x = 0;
                this.canvas_config.start_y = gap;
                this.canvas_config.actual_width = this.canvas_config.width;
                this.canvas_config.block_width = this.canvas_config.width / this.game_data.map_row;
            }

            // Canvas绘图区域划分
            can.canvasDrawMap(this.canvas_config, this.game_data.map["map"]);

            // 添加canvas_float上的鼠标操作监控
            canvas_float.addEventListener('mousemove', this.handleMouseMove);
            canvas_float.addEventListener('mousedown', this.handleMouseDown);
            canvas_float.addEventListener('mousewheel', this.handleMouseWheel);
        },
        initGame() {
            // 初始化地图
            this.game_data.map = ggl.initGameBoard();
            
            // 初始化其他相关内容
            this.game_data.chesses = ggl.chesses;
            this.game_data.player_infos = ggl.initPlayerInfo();
            this.game_data.current_player = 3;
            this.game_data.current_chess = null;
            this.game_data.game_status = 0;
            this.game_data.current_status = 0;
            this.current_blocks_prev_pos = [];
            this.current_chess = null;

            // 屏蔽原生右键单击功能
            document.oncontextmenu = function(e){
                e.preventDefault();
            }
        }
    }
}
</script>

<style scoped>

@font-face {
    font-family: Camicakan;
    src: url('../font/Camicakan.otf');
}

#hall-view {
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
}

#hall-view-left {
    width: 20%;
    height: 80%;
    /* background-color: rgb(229, 233, 242); */
    margin: 5%;
    margin-left: 10%;
    margin-right: 0;
    border: solid 1px rgb(229, 233, 242);
    border-radius: 10px;
    flex: 2;
    font-size: 22px;
    /* font-family: Camicakan; */
}

#hall-view-right {
    width: 70%;
    height: 80%;
    /* background-color: rgb(229, 233, 242); */
    margin: 5%;
    margin-right: 10%;
    border-radius: 10px;
    flex: 5;
    position: relative;
}

#hall-view-left-top {
    /* padding-top: 5px; */
}

#nickname_input {
    width: 60%;
    padding-right: 8px;
}

#player-list {
    width: 95%;
    margin: 10px;
}

.input-with-select {
    margin: 10px;
    width: 95%;
}

#tip-content {
    padding-top: 30%;
    font-size: 16px;
}

#offline-game-canvas {
    /* background-color: #fafafa; */
    position: absolute;
    left: 0;
    top: 0;
}

#offline-game-canvas-float {
    background:rgba(255,255,255,0);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
}

.el-table >>> .success-row {
    background: rgb(253,245,230);
    font-weight: bold;
}

#give-up {
    margin-top: 10%;
}
</style>

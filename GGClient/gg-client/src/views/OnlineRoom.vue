<template>
    <div id="online-view">
        <div id="online-view-left">
            <div id="online-view-left-body">
                <ScoreBoardComponent
                    :current_player="game_data.current_player"
                    :player_infos="game_data.player_infos"
                    :player_name="player_nickname"
                />
                <el-button id="give-up" @click="handleGiveup()" icon="el-icon-close" type="danger" :disabled="game_data.current_status == 3">认输(Giveup)</el-button>
                <el-button id="give-up" @click="handleQuitOnlineGame()" icon="el-icon-upload2" type="success">离开游戏(Quit)</el-button>
            </div>
        </div>
        <div id="online-view-right" ref="canvasWrapper">
            <canvas id="online-game-canvas" width="800" height="600" ref="myCanvas"></canvas>
            <canvas id="online-game-canvas-float" width="800" height="600" ref=myCanvasFloat></canvas>
        </div>
    </div>
</template>

<script>
const ele = require('element-ui')
const ggl = require('@/js/gg.js')
const can = require('@/js/canvas.js')

import ScoreBoardComponent from '@/components/ScoreBoardComponent.vue'

export default {
    name: "online",
    components: {
        ScoreBoardComponent
    },
    data() {
        return {
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
                my_idx: null,
                current_status: 0, // 0 表示没有选中棋子 1 表示已经选中棋子但还没有放置 2 表示已经放置棋子到棋盘上但是还没有点击确定 3 表示游戏结束
                current_blocks_chess_type: 0,
                current_blocks_prev_pos: [],
                current_player: 0,
                current_chess: null,
            }
        }
    },
    props: {
        player_nickname: {
            type: String,
            defaule: "Player_online"
        },
        ws: {
            type: WebSocket,
            default: null
        },
        room_player_list: {
            type: Array,
            default: null
        },
        room_id: {
            type: String,
            default: null
        },
        operation: {
            type: Object,
            default: null
        }
    },
    watch: {
        operation: {
            handler(new_value, old_value) {
                switch(new_value.type) {
                    case "update_player":
                        this.game_data.current_player = parseInt(new_value.current_player_idx);
                        break;
                    case 'status_changed':
                        this.game_data.player_infos[parseInt(new_value.player_idx)].status = new_value.new_status;
                        break;
                    default:
                        break;
                }
            },
            immediate: true
        }
    },
    mounted() {
        this.ws.send(JSON.stringify({
            name: this.player_nickname,
            type: 'PLAYER_START_ONLINE_GAME'
        }));
        
        // 初始化游戏数据
        this.initGame();

        // 调用Canvas初始化游戏场景
        this.initCanvas();
    },
    methods: {
        initGame() {
            // 初始化地图
            this.game_data.map = ggl.initGameBoard();
            
            // 初始化其他相关内容
            this.game_data.chesses = ggl.chesses;
            this.game_data.player_infos = ggl.initPlayerInfo(this.room_player_list);
            this.game_data.my_idx = this.room_player_list.indexOf(this.player_nickname);
            this.game_data.current_chess = null;
            this.game_data.current_status = 0;
            this.current_blocks_prev_pos = [];
            this.current_chess = null;

            // 屏蔽原生右键单击功能
            document.oncontextmenu = function(e){
                e.preventDefault();
            }
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
        // 认输处理函数
        handleGiveup() {
            if (this.game_data.player_infos[this.game_data.current_player].status == "finished") {
                return;
            }
            
            this.ws.send(JSON.stringify({
                name: this.player_nickname,
                type: 'PLAYER_OPERATION_ONLINE_GAME',
                operation: 'GIVEUP',
            }));
        },
        // 退出游戏处理函数
        handleQuitOnlineGame() {
            // 向服务器端发送开始离线游戏的消息
            this.ws.send(JSON.stringify({
                name: this.player_nickname,
                type: 'PLAYER_QUIT_ONLINE_GAME'
            }));

            this.$emit('updateGameView', 1);
        },
        handleMouseMove(event) {
            if (this.game_data.current_status == 3 || this.game_data.my_idx != this.game_data.current_player) {
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
            if (this.game_data.current_status == 3 || this.game_data.my_idx != this.game_data.current_player) {
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
                    this.game_data.player_infos[this.game_data.game_data.current_player].remains -= this.game_data.current_chess.blocks;
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
            if (this.game_data.current_status == 3 || this.game_data.my_idx != this.game_data.current_player) {
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
        getCurrentBlock(event) {
            const canvas = this.$refs.myCanvas;
            let cRect = canvas.getBoundingClientRect();
            let current_x = event.clientX - cRect.left - this.canvas_config.start_x;
            let current_y = event.clientY - cRect.top - this.canvas_config.start_y
            let current_row = Math.floor(current_y / this.canvas_config.block_width);
            let current_col = Math.floor(current_x / this.canvas_config.block_width);
            return [current_row, current_col];
        }
    }
}
</script>

<style scoped>
#online-view {
    width: 100%;
    height: 100%;
    text-align: center;
    display: flex;
    overflow: hidden;
}


#online-view-left {
    width: 20%;
    height: 80%;
    margin: 5%;
    margin-left: 10%;
    margin-right: 0;
    border: solid 1px rgb(229, 233, 242);
    border-radius: 10px;
    flex: 2;
    font-size: 22px;
}

#online-view-right {
    width: 70%;
    height: 80%;
    margin: 5%;
    margin-right: 10%;
    border-radius: 10px;
    flex: 5;
    position: relative;
}

#give-up {
    margin-top: 10%;
}

#online-game-canvas {
    position: absolute;
    left: 0;
    top: 0;
}

#online-game-canvas-float {
    background:rgba(255,255,255,0);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
}
</style>

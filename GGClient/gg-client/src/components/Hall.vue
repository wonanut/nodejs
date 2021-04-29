<template>
<div id="hall-view">
    <div id="hall-view-left">
        <div id="hall-view-left-body">
            <div id="hall-view-left-top">
                <el-input v-model="nickname" class="input-with-select" :disabled=nickname_editable>
                    <el-button slot="append" v-if="nickname_editable" @click="handleEdit()" icon="el-icon-edit"></el-button>
                    <el-button slot="append" v-else @click="handleSubmitEdit()" icon="el-icon-check"></el-button>
                </el-input>
            </div>
            <el-table :data="player_list" id="player-list">
                <el-table-column label="当前在线玩家列表" :span="1">
                    <template slot-scope="scope">
                        <span>{{ scope.$index }}&nbsp;>&nbsp;{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <div id="hall-view-right" ref="canvasWrapper">
        <div v-show="!show_offline_game" id="offline-game-tip">
            <p id="tip-content">当前没有正在进行的游戏 来局单人游戏吧</p>
            <el-button type="primary" round size="small" @click="handleStartOfflineGame">开始游戏</el-button>
        </div>
        <canvas v-show="show_offline_game" id="offline-game-canvas" width="800" height="600" ref="myCanvas"></canvas>
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
            show_offline_game: false,
            canvas_config: {
                context: null,
                width: 800,
                height: 600,
                start_x: 0,
                start_y: 0,
                block_width: 20,
            },
            game_data: {
                map: null,
                map_row: 32,
                map_col: 32,
                map_region: {
                    x: 6,
                    y: 6,
                    width: 20,
                    height: 20,
                    empty: {}
                },
                player_infos: []
                // player_regions: [{
                //     x: 7,
                //     y: 27,
                //     width: 18,
                //     height: 5,
                //     empty: [{
                //         x: 24,
                //         y: 27
                //     }]
                // },
                // {
                //     x: 27,
                //     y: 7,
                //     width: 5,
                //     height: 18,
                //     empty: [{
                //         x: 27,
                //         y: 7
                //     }]
                // },
                // {
                //     x: 7,
                //     y: 0,
                //     width: 18,
                //     height: 5,
                //     empty: [{
                //         x: 7,
                //         y: 4
                //     }]
                // },
                // {
                //     x: 0,
                //     y: 7,
                //     width: 5,
                //     height: 18,
                //     empty: [{
                //         x: 4,
                //         y: 24
                //     }]
                // }]
            },
            player_list_test: [{
                name: "PLAYER_XXXX"
            }, {
                name: "PLAYER_XXXX"
            }, {
                name: "PLAYER_XXXX"
            }]
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
        // nothing
    },
    methods: {
        handleEdit() {
            this.nickname_editable = false
        },
        handleSubmitEdit() {
            this.nickname_editable = true
        },
        handleStartOfflineGame() {
            ele.Notification.success("进入离线单人游戏")
            this.show_offline_game = true

            // 初始化游戏数据
            this.initGame()

            // 调用Canvas初始化游戏场景
            this.initCanvas()
        },
        initCanvas() {
            // 初始化Canvas绘图相关基本参数以及配置
            const canvas = this.$refs.myCanvas;
            this.canvas_config.width = this.$refs.canvasWrapper.offsetWidth;
            this.canvas_config.height = this.$refs.canvasWrapper.offsetHeight;
            canvas.width = this.canvas_config.width;
            canvas.height = this.canvas_config.height
            this.canvas_config.context = canvas.getContext('2d');

            if (this.canvas_config.width >= this.canvas_config.height) {
                let gap = (this.canvas_config.width - this.canvas_config.height) / 2;
                this.canvas_config.start_x = gap;
                this.canvas_config.start_y = 0;
                this.canvas_config.block_width = this.canvas_config.height / this.game_data.map_row;
            } else {
                let gap = (this.canvas_config.height - this.canvas_config.width) / 2;
                this.canvas_config.start_x = 0;
                this.canvas_config.start_y = gap;
                this.canvas_config.block_width = this.canvas_config.width / this.game_data.map_row;
            }

            // Canvas绘图区域划分
            can.canvasDrawMap(this.canvas_config.context, this.game_data.map, this.canvas_config);
        },
        initGame() {
            // 初始化地图
            this.game_data.map = new Array(20);
            for (let i = 0; i < this.game_data.map_row; i++) {
                this.game_data.map[i] = new Array(20);
                for (let j = 0; j < this.game_data.map_col; j++) {
                    // 检查当前区域是否为棋盘区域
                    if (ggl.checkIsInRegion(i, j, this.game_data.map_region)) {
                        this.game_data.map[i][j] = 1;
                    }
                    // 检查当前区域是否为玩家区域
                    else if (ggl.checkIsInRegion(i, j, this.game_data.player_regions[0])) {
                        this.game_data.map[i][j] = 2;
                    }
                    // else if (ggl.checkIsInRegion(i, j, this.game_data.player_regions[1])) {
                    //     this.game_data.map[i][j] = 4;
                    // }
                    // else if (ggl.checkIsInRegion(i, j, this.game_data.player_regions[2])) {
                    //     this.game_data.map[i][j] = 6;
                    // }
                    // else if (ggl.checkIsInRegion(i, j, this.game_data.player_regions[3])) {
                    //     this.game_data.map[i][j] = 8;
                    // }
                    else {
                        this.game_data.map[i][j] = 0;
                    }
                }
            }
        },   
    }
}
</script>

<style scoped>
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
}

#hall-view-right {
    width: 70%;
    height: 80%;
    /* background-color: rgb(229, 233, 242); */
    margin: 5%;
    margin-right: 10%;
    border-radius: 10px;
    flex: 5;
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
</style>

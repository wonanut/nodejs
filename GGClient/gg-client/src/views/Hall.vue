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
    </div>
    <div id="hall-view-right" ref="canvasWrapper">
        <div v-show="game_view == 0" id="offline-game-tip">
            <p id="tip-content">当前没有正在进行的游戏 你可以进入匹配队列等待其他联机队友 或者开始一场单机游戏</p>
            <el-button type="primary" round size="normal" @click="handleStartOfflineGame">开始单机游戏</el-button>
            <el-button type="success" round size="normal" @click="handleStartOnlineGame">加入匹配队列</el-button>
        </div>
    </div>
</div>
</template>

<script>
const ele = require('element-ui')

export default {
    name: "hall",
    data() {
        return {
            nickname_editable: true,
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
        }
    },
    methods: {
        handleEdit() {
            this.nickname_editable = false
        },
        handleSubmitEdit() {
            this.nickname_editable = true
        },
        handleStartOnlineGame() {
            this.$emit('updateGameView', 3)
        },
        handleStartOfflineGame() {
            this.$tmie('updateGameView', 2)
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
    padding-top: 200px;
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

#prepared-div {
    border-radius: 10px;
    width: wrap;
    display: flex;
    justify-content: center;
    padding: 0px;
}

#prepared-div li {
    list-style: none;
    background-color: ghostwhite;
    margin-left: 20px;
    font-size: 10px;
    margin: 10px;
    padding: 20px;
    padding-bottom: 10px;
}
</style>

<template>
<div id="hall-view">
    <div id="hall-view-left">
        <div id="hall-view-left-body">
            <div id="hall-view-left-top">
                <el-input v-model="player_nickname" class="input-with-select" :disabled=nickname_editable>
                    <el-button slot="append" v-if="nickname_editable" @click="handleEdit()" icon="el-icon-edit"></el-button>
                    <el-button slot="append" v-else @click="handleSubmitEdit()" icon="el-icon-check"></el-button>
                </el-input>
            </div>
            <PlayerListComponent 
                :player_list="player_list"
            />
        </div>
    </div>
    <div id="hall-view-right" ref="canvasWrapper">
        <div id="hall-tip">
            <p id="title">GridGame Online (v1.0)</p>
            <p id="tip-content">当前没有正在进行的游戏 你可以进入匹配队列等待其他联机队友 或者立即开始一场单机游戏</p>
            <el-button type="primary" round size="normal" @click="handleStartOfflineGame">开始单机游戏</el-button>
            <el-button type="success" round size="normal" @click="handleStartOnlineGame" :disabled=true>匹配2人游戏</el-button>
            <el-button type="success" round size="normal" @click="handleStartOnlineGame">匹配4人游戏</el-button>
        </div>
    </div>
</div>
</template>

<script>
import PlayerListComponent from '@/components/PlayerListComponent.vue'

export default {
    name: "hall",
    components: {
        PlayerListComponent
    },
    data() {
        return {
            nickname_editable: true,
        }
    },
    props: {
        player_nickname: {
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
            this.$emit('updateGameView', 2)
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
    padding: 0px;
    margin: 0px;
    text-align: center;
    display: flex;
    overflow: hidden;
}

#hall-view-left {
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

#hall-view-right {
    width: 70%;
    height: 80%;
    margin: 5%;
    margin-right: 10%;
    border-radius: 10px;
    flex: 5;
    position: relative;
}

#nickname_input {
    width: 60%;
    padding-right: 8px;
}

.input-with-select {
    margin: 10px;
    width: 95%;
}

#hall-tip {
    padding-top: 200px;
}

#tip-content {
    font-size: 16px;
    color: gray;
    padding-bottom: 30px;
}

#title {
    font-family: Camicakan;
    font-size: 45px;
    margin-top: 5px;
    margin-bottom: 0px;
    color: rgb(62, 126, 30);
}
</style>

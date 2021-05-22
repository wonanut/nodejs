<template>
<div id="welcome-view">
    <el-card id="welcome-view-card">
        <h2>{{ welcome }}</h2>
        <el-form label-width="80px">
            <el-form-item label="设置昵称">
                <el-input v-model="player_nickname"></el-input>
            </el-form-item>
            <el-form-item label="设置IP">
                <el-input v-model="server_host"></el-input>
            </el-form-item>
            <el-form-item label="设置端口">
                <el-input v-model="server_port"></el-input>
            </el-form-item>
        </el-form>
            <el-button id="welcome-view-button" @click="handleLogin()" type="success">连接服务器</el-button>
            <el-button id="welcome-view-button" @click="handleStartOfflineGame()">开始离线游戏</el-button>
    </el-card>
</div>
</template>

<script>
const ele = require('element-ui')

export default {
    name: 'welcome-view',
    data() {
        return {
            welcome: "Welcome to the GridGame",
            player_nickname: getRandomNickName(),
            server_host: 'localhost',
            server_port: '12345'
        }
    },
    props: {
        game_status: {
            type: Number,
            defaule: 0
        },
    },
    methods: {
        handleLogin() {
            this.$emit('handleLogin', this.player_nickname, this.server_host, this.server_port);
        },
        handleStartOfflineGame() {
            this.$emit('handleUpdateGameView', 2);
        }
    },
    mounted() {
        ele.Message.success("依赖环境检测完成");
    }
}

function getRandomNickName() {
    var nick_name = "PLAYER_";
    var alphbat_dict = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 4; i++) {
        nick_name += alphbat_dict[Math.floor(Math.random()*alphbat_dict.length)];
    }
    return nick_name;
}
</script>

<style scoped>
#welcome-view {
    text-align: center;
}

#welcome-view-card {
    width: 30%;
    margin: 10% auto;
    padding: 30px;
}

#welcome-view-button {
    margin: 0px;
    margin-top: 10px;
    width: 100%;
}
</style>

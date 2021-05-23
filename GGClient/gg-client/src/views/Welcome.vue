<template>
<div id="welcome-view">
    <el-card id="welcome-view-card">
        <p id="welcome-title">{{ welcome }}</p>
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
            <el-button id="welcome-view-button" @click="handleLogin()" type="success" :disabled="login_disabled" :loading="login_disabled">连接服务器</el-button>
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
            server_port: '12345',
            login_disabled: false,
        }
    },
    props: {
        game_status: {
            type: Number,
            default: 0
        }
    },
    watch: {
        game_status(new_value, old_value) {
            this.game_status = new_value;
        },
    },
    methods: {
        // 登陆处理函数
        handleLogin() {
            this.login_disabled = true;
            this.$emit('handleLogin', this.player_nickname, this.server_host, this.server_port);
            // 点击登陆按钮之后等待3秒，之后根据game_status变量值核对是否登陆成功
            setTimeout(() => {
                if (this.game_status == 0) {
                    this.login_disabled = false;
                    ele.Message.error("登陆失败，请检查网络连接或者连接配置是否正确");
                }
            }, 3000);
        },
        handleStartOfflineGame() {
            this.$emit('updateGameView', 2);
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
@font-face {
    font-family: Camicakan;
    src: url('../font/Camicakan.otf');
}

#welcome-title {
    font-family: Camicakan;
    font-size: 35px;
    margin-top: 5px;
    color: #2c3e50;
}

#welcome-view {
    height: 80%;
    display: grid;
    align-items: center;
    justify-items: center;
}

#welcome-view-card {
    width: 30%;
    padding: 30px;
}

#welcome-view-button {
    margin: 0px;
    margin-top: 10px;
    width: 100%;
}
</style>

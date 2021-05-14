<template>
<div id="app">
    <WelcomeView v-if="game_status == 0" @params="handleLogin" />
    <HallView v-else-if="game_status == 1" :nickname="player_nickname" :ws="ws" :player_list="player_list" />
</div>
</template>

<script>
import WelcomeView from '@/components/Welcome.vue'
import HallView from '@/components/Hall.vue'

const ele = require('element-ui')

export default {
    name: 'App',
    components: {
        WelcomeView,
        HallView
    },
    data() {
        return {
            ws: null,
            player_nickname: 'default',
            // game_status 0-没有登录  1-进入大厅  2-等待组队  3-游戏中  4-其他
            // 不同的game_status对应不同的显示内容
            game_status: 0,
            player_list: []
        }
    },
    destroyed() {
        if (this.ws != null) {
            this.ws.close();
        }
    },
    methods: {
        initWebSocket() {
            this.ws.onmessage = this.wsOnMessage;
            this.ws.onError = this.wsOnError;
            this.ws.onClose = this.wsOnClose;
        },
        wsOnMessage(e) {
            var data = JSON.parse(e.data);
            console.log(data)
            switch(data.type) {
                case 'SERVER_LOGINSTATUS':
                    if (data.message == 'success') {
                        this.game_status = 1
                    }
                    break;
                case 'SERVER_BORADCAST_ALL':
                    this.player_list = data.player_list
                    ele.Notification.success("欢迎新玩家进入GG游戏大厅")
                    break;
                default:
                    break;
            }
        },
        wsOnError() {
            console.log("[发生错误]")
        },
        wsOnClose() {
            console.log("[断开连接]")
        },
        handleLogin(name, host, port) {
            this.player_nickname = name
            let conn_address = 'ws://' + host + ':' + port

            // 使用WebSocket与游戏服务器建立通信
            this.ws = new WebSocket(conn_address)
            this.ws.onopen = () => {
                this.ws.send(JSON.stringify({
                    name: this.player_nickname,
                    type: 'PLAYER_LOGIN'
                }));
            }
            this.initWebSocket();
        }
    }
}
</script>

<style>
body, html {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
}
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
}
</style>

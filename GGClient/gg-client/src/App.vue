<template>
<div id="app">
    <WelcomeView v-if="game_status == 0" @params="handleLogin" />
    <HallView v-else-if="game_status == 1" :nickname="player_nickname" :ws="ws" :player_list="player_list" :prepare_list="prepare_list"/>
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
            player_list: [],
            prepare_list: []
        }
    },
    destroyed() {
        if (this.ws != null) {
            this.ws.close();
        }
    },
    created() {
        window.addEventListener('beforeunload', e => this.closeWebSocket(e));
    },
    beforeDestroy() {
        window.removeEventListener('beforeunload', e => this.closeWebSocket(e));
    },
    methods: {
        // 初始化/重载websocket连接的相关函数
        initWebSocket() {
            this.ws.onmessage = this.wsOnMessage;
            this.ws.onError = this.wsOnError;
            this.ws.onClose = this.wsOnClose;
        },
        // 接受消息处理函数
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
                case 'SERVER_BORADCAST_NEW_PREPARE':
                case 'SERVER_BORADCAST_CANCEL_PREPARE':
                case 'SERVER_BORADCAST_START_OFFLINE_GAME':
                case 'SERVER_BORADCAST_QUIT_OFFLINE_GAME':
                    this.player_list = data.player_list
                    break;
                case 'SERVER_MULTICAST_PREPARE_QUEUE':
                    this.prepare_list = data.prepare_list
                    break;
                default:
                    break;
            }
        },
        // 关闭websocket处理函数
        closeWebSocket(e) {
            if (this.ws) {
                this.ws.close();
                let _this = this
                this.ws.onclose = function(evt) {
                    console.log("websocket已关闭"); 
                };
            }
        },
        // 发生错误处理函数
        wsOnError() {
            console.log("[发生错误]")
        },
        // 关闭连接处理函数
        wsOnClose() {
            console.log("[断开连接]")
        },
        // 登陆处理函数
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

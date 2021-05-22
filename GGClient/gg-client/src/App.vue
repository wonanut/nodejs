<template>
<div id="app">
    <HallView 
        v-if="game_status == 1 && game_view == 1" 
        :nickname="player_nickname" 
        :ws="ws"
        @updateGameView="handleUpdateGameView"
    />
    <OfflineGameView 
        v-else-if="game_status == 1 && game_view == 2"

    />
    <PrepareQueueView 
        v-else-if="game_status == 1 && game_view == 3"
    />
    <OnlineRoomView
        v-else-if="game_status == 1 && game_view == 4"
    />
    <WelcomeView 
        v-else @login="handleLogin" 
        :game_status="game_status"
    />
</div>
</template>

<script>
import WelcomeView from '@/views/Welcome.vue'
import HallView from '@/views/Hall.vue'
import PrepareQueueView from '@/views/PrepareQueue.vue'
import OfflineGameView from '@/views/OfflineGame.vue'
import OnlineRoomView from '@/views/OnlineRoom.vue'

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
            // 不同的game_status对应不同的游戏状态 0-未登录（不需要和服务器建立联系） 1-已和服务器建立连接
            game_status: 0,
            // 不同的game_view对应不同的具体的页面 0-登陆 1-大厅 2-离线游戏 3-匹配 4-在线房间
            game_view: 0,
            player_list: [],
            prepare_list: [],
            // room_player_list 和 room_id 是和在线游戏的房间有关的数据
            room_player_list: [],
            room_id: null
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
                case 'SERVER_MULTICAST_CREATE_ROOM':
                    this.room_player_list = data.player_list
                    this.room_id = data.room_id
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
            // URL that will be connected with, the legal address likes ws://192.168.0.1:8080
            let conn_address = 'ws://' + host + ':' + port

            // 使用WebSocket与游戏服务器建立通信
            try {
                this.ws = new WebSocket(conn_address)
                this.ws.onopen = () => {
                    this.ws.send(JSON.stringify({
                        name: this.player_nickname,
                        type: 'PLAYER_LOGIN'
                    }));
                }
                this.initWebSocket();

                // 更新game_status和game_view
                this.game_status = 1;
                this.game_view = 1;
            }
            catch {
                console.log("Error while connecting to server, check and try again.");
            }
            
        },
        handleUpdateGameView(new_view) {
            this.game_view = new_view
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

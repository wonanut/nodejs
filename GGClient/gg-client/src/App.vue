<template>
<div id="app">
    <WelcomeView 
        v-show="game_view == 0"
        :game_status="game_status"
        @handleLogin="handleLogin" 
        @updateGameView="handleUpdateGameView"
    />
    <HallView 
        v-if="game_status == 1 && game_view == 1" 
        :player_nickname="player_nickname" 
        :ws="ws"
        :player_list="player_list"
        @updateGameView="handleUpdateGameView"
    />
    <OfflineGameView 
        v-else-if="game_view == 2"
        :player_nickname="player_nickname"
        :ws="ws"
        :game_status="game_status"
        @updateGameView="handleUpdateGameView"
    />
    <PrepareQueueView 
        v-else-if="game_status == 1 && game_view == 3"
        :player_nickname="player_nickname" 
        :ws="ws"
        :player_list="player_list"
        :prepare_list="prepare_list"
        @updateGameView="handleUpdateGameView"
    />
    <OnlineRoomView
        v-else-if="game_status == 1 && game_view == 4"
        :player_nickname="player_nickname" 
        :ws="ws"
        :room_player_list="room_player_list"
        :room_id="room_id"
        :operation="operation"
        @updateGameView="handleUpdateGameView"
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
        HallView,
        PrepareQueueView,
        OfflineGameView,
        OnlineRoomView
    },
    data() {
        return {
            ws: null,
            player_nickname: 'PLAYER_offline',
            // 不同的game_status对应不同的游戏状态 0-未登录（不需要和服务器建立联系） 1-已和服务器建立连接
            game_status: 0,
            // 不同的game_view对应不同的具体的页面 0-登陆 1-大厅 2-离线游戏 3-匹配 4-在线房间
            game_view: 0,
            player_list: [],
            prepare_list: [],
            // 下面的参数是和在线游戏的房间有关的数据
            room_player_list: [],
            room_id: null,
            operation: null
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
            console.log(data);
            switch(data.type) {
                case 'SERVER_LOGINSTATUS':
                    if (data.message == 'success') {
                        // 如果接收到服务器端的登陆成功消息，更新game_status和game_view
                        this.game_status = 1;
                        this.game_view = 1;
                    }
                    break;
                case 'SERVER_BROADCAST_ALL':
                    this.player_list = data.player_list;
                    ele.Notification.success("欢迎新玩家进入GG游戏大厅");
                    break;
                case 'SERVER_BROADCAST_NEW_PREPARE':
                case 'SERVER_BROADCAST_CANCEL_PREPARE':
                case 'SERVER_BROADCAST_START_OFFLINE_GAME':
                case 'SERVER_BROADCAST_QUIT_OFFLINE_GAME':
                case 'SERVER_BROADCAST_START_ONLINE_GAME':
                case 'SERVER_BROADCAST_QUIT_ONLINE_GAME':
                    this.player_list = data.player_list;
                    break;
                case 'SERVER_MULTICAST_PREPARE_QUEUE':
                    this.prepare_list = data.prepare_list;
                    break;
                case 'SERVER_MULTICAST_CREATE_ROOM':
                    this.room_player_list = data.player_list;
                    this.room_id = data.room_id;
                    this.operation = {
                        player_nickname: this.player_nickname,
                        type: "update_player",
                        current_player_idx: 0
                    }
                    this.game_view = 4;
                    break;
                case 'SERVER_MULTICAST_GIVEUP_ONLINE_GAME':
                case 'SERVER_MULTICAST_UPDATE_ONLINE_GAME':
                case 'SERVER_MULTICAST_QUIT_ONLINE_GAME':
                    this.operation = data.operation;
                    break;
                default:
                    break;
            }
        },
        // 关闭websocket处理函数
        closeWebSocket(e) {
            if (this.ws) {
                this.ws.close();
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
            this.ws = new WebSocket(conn_address)
            this.ws.onopen = () => {
                this.ws.send(JSON.stringify({
                    name: this.player_nickname,
                    type: 'PLAYER_LOGIN'
                }));
            }
            this.initWebSocket();
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

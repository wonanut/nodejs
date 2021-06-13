<template>
<div id="hall-view">
    <div id="hall-view-left">
        <div v-show="!messageListVisible" class="hall-view-left-wrapper">
            <div id="hall-view-left-top">
                <el-input v-model="player_nickname" class="edit-nickname" :disabled=nickname_editable>
                    <el-button slot="append" v-if="nickname_editable" @click="handleEdit()" icon="el-icon-edit"></el-button>
                    <el-button slot="append" v-else @click="handleSubmitEdit()" icon="el-icon-check"></el-button>
                </el-input>
            </div>
            <PlayerListComponent 
                :player_list="player_list"
            />
            <div class="message-box">
                <el-badge :value="message_list.length" class="item">
                    <el-button size="small" icon="el-icon-chat-line-square" @click="handleMessageList()">新消息</el-button>
                </el-badge>
                <el-link class="message-box-info" type="primary" @click="handleMessageList()">{{ new_message.nickname }}:{{ new_message.message.substr(0,10) }}...</el-link>
            </div>
        </div>
        
        <div v-show="messageListVisible" class="hall-view-left-wrapper">
            <el-page-header id="back-title" @back="handleGoBack()" content="大厅消息"></el-page-header>
            <el-divider></el-divider>

            <MessageListComponent
                v-show="messageListVisible"
                :message_list="message_list"
            />
            
            <el-input v-model="editMessage" class="edit-message">
                <el-button slot="append" @click="handleSend()" icon="el-icon-s-promotion"></el-button>
            </el-input>
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
import MessageListComponent from '@/components/MessageListComponent.vue'

export default {
    name: "hall",
    components: {
        PlayerListComponent,
        MessageListComponent
    },
    data() {
        return {
            nickname_editable: true,
            messageListVisible: 0,
            editMessage: "",
            message_list: []
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
        },
        new_message: {
            type: Object,
            default: null
        }
    },
    watch: {
        new_message: {
            handler(new_value, old_value) {
                console.log(new_value);
                if (new_value.message_type == "init") return;
                this.message_list.unshift(new_value);
            },
            immediate: true
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
        },
        handleMessageList() {
            this.messageListVisible ^= 1;
        },
        handleGoBack() {
            this.messageListVisible ^= 1;
        },
        handleSend() {
            if (this.editMessage != "") {
                this.ws.send(JSON.stringify({
                    type: "PLAYER_SEND_MESSAGE",
                    name: this.player_nickname,
                    message: this.editMessage
                }));
                this.editMessage = "";
            }
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
    position: relative;
    border: solid 1px rgb(229, 233, 242);
    border-radius: 10px;
    font-size: 22px;
    flex: 2;
}

.hall-view-left-wrapper {
    width: 95%;
    padding-left: 2.5%;
    padding-top: 20px;
}

.message-box {
    position: absolute;
    width: 95%;
    left: 2.5%;
    bottom: 12px;
    text-align: left;
    background: white;
    z-index: 99;
}

.message-box-info {
    margin-left: 10px;
}

#back-title {
    padding-left: 10px;
    font-size: 14px;
}

.edit-message {
    position: absolute;
    width: 98%;
    bottom: 5px;
    left: 1%;
    z-index: 99;
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

.edit-nickname {
    width: 100%;
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

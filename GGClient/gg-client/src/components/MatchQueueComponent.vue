<template>
    <div id="matching-queue">
        <p id="tip-content"><span><i class="el-icon-loading" style="margin-right: 10px;"></i></span>匹配玩家中 ({{prepare_list.length}}/4)</p>
        <ul id="prepared-div">
            <li v-for="item in prepare_list" :key="item">
                <el-avatar icon="el-icon-user-solid"></el-avatar>
                <p>{{ item }}</p>
            </li>
        </ul>
        <el-button type="warning" round size="normal" @click="handleCancelPrepare">退出匹配队列</el-button>
    </div>
</template>

<script>
export default {
    name: 'MatchQueue',
    props: {
        player_nickname: {
            type: String,
            defalut: "PLAYER_XXXX"
        },
        ws: {
            type: WebSocket,
            default: null
        },
        prepare_list: {
            type: Array,
            default: null
        }
    },
    mounted: {
        
    },
    methods: {
        handleCancelPrepare() {
            // 向服务器端发送退出匹配队列的消息
            this.ws.send(JSON.stringify({
                name: this.player_nickname,
                type: 'PLAYER_CANCEL_PREPARE'
            }));

            this.$emit('updateGameView', 1);
        }
    }
}
</script>


<style scoped>
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
<template>
    <div id="player-bar">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
        <div id="player-bar-content">
            <p id="player-bar-nickname">{{ nickname }}</p>
            <p v-if="connection_status" class="player-bar-p" id="player-bar-connection-status-success">连接状态 ●●●●●</p>
            <p v-else class="player-bar-p" id="player-bar-connection-status-failed">连接状态 ○○○○○</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "PersonalBar",
    props: {
        nickname: {
            type: String,
            default: "PLAYER_unknown"
        },
        connection_status: {
            type: Boolean,
            default: false
        }
    }
}
</script>


<style scoped>
#player-bar {
    position: absolute;
    top: 20px;
    right: 50px;
    background-color: #FFF;
    border-radius: 5px;
    border: 1px solid rgb(229, 233, 242);
    color: #333;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    align-items: center;
}

#player-bar-content {
    padding-left: 10px;
    text-align: left;
}

.player-bar-p {
    font-size: 12px;
    margin-top: 0;
}

#player-bar-connection-status-success {
    color: green;
}

#player-bar-connection-status-failed {
    color: red;
}

#player-bar-nickname {
    font-weight: bold;
    margin-bottom: 5px;
    font-size: 14px;
}
</style>
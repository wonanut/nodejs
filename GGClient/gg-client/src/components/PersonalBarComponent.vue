<template>
    <div id="player-bar">
        <el-avatar icon="el-icon-user-solid"></el-avatar>
        <div id="player-bar-content">
            <p id="player-bar-p">昵称</p>
            <p id="player-bar-nickname">{{ nickname }}</p>
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

#player-bar-p {
    color: #aaa;
    font-size: 12px;
    margin-bottom: 0;
}

#player-bar-nickname {
    font-weight: bold;
    margin-top: 5px;
    font-size: 14px;
}
</style>
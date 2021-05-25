<template>
    <div id="score-board">
        <el-card id="score-board-userinfo" shadow="never">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
            <p id="score-board-username">{{ player_name }}</p>
        </el-card>
        <el-table :data="player_infos" id="player-list" :row-class-name="tableRowClassName">
            <el-table-column label="玩家昵称">
                <template slot-scope="scope">
                    <span>
                        <div v-if="scope.row.idx == 0" style="color: rgb(255,0,0)">▊ {{ scope.row.name }}</div>
                        <div v-else-if="scope.row.idx == 1" style="color: rgb(0,176,80)" >▊ {{ scope.row.name }}</div>
                        <div v-else-if="scope.row.idx == 2" style="color: rgb(0,176,240)" >▊ {{ scope.row.name }}</div>
                        <div v-else style="color: rgb(255,192,0)" >▊ {{ scope.row.name }}</div>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="剩余方块">
                <template slot-scope="scope">
                    <span>{{ scope.row.remains }} blocks</span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <span>
                        <el-tag v-if="scope.row.status == 'inited'" >{{ scope.row.status }}</el-tag>
                        <el-tag v-else-if="scope.row.status == 'normal'" type="success">{{ scope.row.status }}</el-tag>
                        <el-tag v-else type="info" >{{ scope.row.status }}</el-tag>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    name: 'ScoreBoard',
    props: {
        player_infos: {
            type: Array,
            default: null
        },
        current_player: {
            type: Number,
            default: 0
        },
        player_name: {
            type: String,
            default: "Player"
        }
    },
    methods: {
        tableRowClassName({row, rowIndex}) {
            if (row.idx === this.current_player) {
                return 'success-row';
            } else {
                return '';
            }
        }
    }
}
</script>


<style scoped>
#score-board {
    width: 100%;
}

#score-board-userinfo {
    padding: 0px;
    font-size: 16px;
    border-radius: 0px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

#score-board-username {
    margin: 0px;
    padding-top: 10px;
}

#player-list {
    width: 95%;
    margin: 10px;
}

.el-table >>> .success-row {
    background: rgb(253,245,230);
    font-weight: bold;
}
</style>
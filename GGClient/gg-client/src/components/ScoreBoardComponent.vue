<template>
    <el-table :data="player_infos" id="player-list" :row-class-name="tableRowClassName">
        <el-table-column label="玩家昵称" :span="1">
            <template slot-scope="scope">
                <span>
                    <div v-if="scope.row.idx == 0" style="color: rgb(255,0,0)">▊ {{ scope.row.name }}</div>
                    <div v-else-if="scope.row.idx == 1" style="color: rgb(0,176,80)" >▊ {{ scope.row.name }}</div>
                    <div v-else-if="scope.row.idx == 2" style="color: rgb(0,176,240)" >▊ {{ scope.row.name }}</div>
                    <div v-else style="color: rgb(255,192,0)" >▊ {{ scope.row.name }}</div>
                </span>
            </template>
        </el-table-column>
        <el-table-column label="剩余方块" :span="1">
            <template slot-scope="scope">
                <span>{{ scope.row.remains }} blocks</span>
            </template>
        </el-table-column>
        <el-table-column label="状态" :span="1">
            <template slot-scope="scope">
                <span>
                    <el-tag v-if="scope.row.status == 'inited'" >{{ scope.row.status }}</el-tag>
                    <el-tag v-else-if="scope.row.status == 'normal'" type="success">{{ scope.row.status }}</el-tag>
                    <el-tag v-else type="info" >{{ scope.row.status }}</el-tag>
                </span>
            </template>
        </el-table-column>
    </el-table>
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
.el-table >>> .success-row {
    background: rgb(253,245,230);
    font-weight: bold;
}
</style>
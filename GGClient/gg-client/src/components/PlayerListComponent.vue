<template>
    <el-table :data="player_list" id="player-list">
        <el-table-column label="玩家列表" :span="1">
            <template slot-scope="scope">
                <span>{{ scope.$index }}&nbsp;>&nbsp;{{ scope.row.name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="状态" :span="1">
            <template slot-scope="scope">
                <el-tag size="mini">{{ scope.row.status }}</el-tag>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
    name: 'PlayerList',
    props: {
        player_list: {
            type: Array,
            default: null
        }
    }
}
</script>

<style scoped>
#player-list {
    width: 100%;
    margin: 0px;
}
</style>
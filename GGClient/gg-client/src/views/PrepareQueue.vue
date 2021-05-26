<template>
<div id="prepare-view">
    <MatchQueueComponent 
        :prepare_list="prepare_list"
        :ws="ws"
        :player_nickname="player_nickname"
        @updateGameView="handleCancelPrepare"
    />
</div>
</template>

<script>
import MatchQueueComponent from '@/components/MatchQueueComponent.vue'

export default {
    name: "hall",
    components: {
        MatchQueueComponent
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
        prepare_list: {
            type: Array,
            default: null
        }
    },
    mounted() {
        this.ws.send(JSON.stringify({
            name: this.player_nickname,
            type: 'PLAYER_PREPARE'
        }));
    },
    methods: {
        handleCancelPrepare(new_view) {
            this.$emit('updateGameView', new_view);
        }
    }
}
</script>

<style scoped>
#prepare-view {
    width: 100%;
    height: 80%;
    overflow: hidden;
    display: grid;
    align-items: center;
    justify-items: center;
}
</style>

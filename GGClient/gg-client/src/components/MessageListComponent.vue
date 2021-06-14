<template>
    <div id="message-liat">
        <!--eslint-disable-next-line-->
        <div v-for="item in message_list">
            <div v-if="item.message_type == 'normal'" class="message-item-normal">
                <p v-if="item.nickname == nickname" class="message-author">我</p>
                <p v-else class="message-author">{{ item.nickname }}</p>
                <p class="message-content">{{ item.message }}</p>
            </div>
            <div v-if="item.message_type == 'system'" class="message-item-system">
                <div class="message-system">{{ item.message }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MessageList',
    props: {
        message_list: {
            type: Array,
            default: null
        },
        nickname: {
            type: String,
            default: null
        }
    }
}
</script>

<style scoped>
#message-list {
    width: 100%;
    text-align: left;
}

.message-item-normal {
    text-align: left;
    padding-left: 5px;
}

.message-item-system {
    text-align: center;
}

.message-author {
    color: darkgrey;
    font-size: 8px;
    margin-bottom: 0px;
}

.message-content {
    color: black;
    margin-top: 5px;
    font-size: 15px;
}

.message-system {
    background-color: #f2f2f2;
    border-radius: 5px;
    color: #333;
    padding: auto;
    margin: 10px;
    padding-top: 4px;
    padding-bottom: 4px;
    font-size: 8px;
}

</style>
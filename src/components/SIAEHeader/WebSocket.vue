<template>
<span class="websock"></span>
</template>

<script>
import token from '@/utils/token'
import {
    closeSocket,
    getUnreadCount
} from '@/api/message'
export default {
    name: 'websock',
    props: {
        sysNoticeCount: {
            type: Number,
            require: true,
        },
        isLogin: {
            type: Boolean,
            require: true,
        },
    },
    data() {
        return {
            websock: null,
            count: 0,
        }
    },
    watch: {
        count(newVal) {
            this.$emit('update:sysNoticeCount', newVal)
        },
        isLogin(newVal) {
            if (!newVal) this.closeSocket()
        },
    },
    created() {
        this.initWebSocket()
    },
    beforeDestroy() {
        this.closeSocket()
    },

    methods: {
        async initWebSocket() {
            await this.closeSocket()
            //初始化weosocket
            const wsurl = 'ws://120.26.177.203:1234/socket/notice'
            this.websock = new WebSocket(wsurl)
            this.websock.onmessage = this.websocketonmessage
            this.websock.onopen = this.websocketonopen
            this.websock.onerror = this.websocketonerror
            this.websock.onclose = this.websocketclose
        },
        websocketonopen() {
            //连接建立之后执行send方法发送数据
            const actions = {
                'HEADER-TOKEN': token.getHeaderToken(),
            }

            this.websocketsend(JSON.stringify(actions))
        },
        websocketonerror() {
            //连接建立失败重连
            this.initWebSocket()
        },
        websocketonmessage(e) {
            //数据接收
            const redata = JSON.parse(e.data)
            this.getUnreadCount()
        },
        websocketsend(Data) {

            //数据发送
            this.websock.send(Data)
        },
        websocketclose(e) {
            //断开连接
        },
        async closeSocket() {
            const data = await closeSocket()
        },
        async getUnreadCount() {
            const data = await getUnreadCount()
            if (data.code === 200) {
                this.count = data.data
                this.$emit('update:sysNoticeCount', this.count)
            }
        },
    },
}
</script>

<style lang='scss'>
</style>

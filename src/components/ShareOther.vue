<template>
<div class="share-other">
    <span style="margin:8px" :style="{'display':size.isSmallSize?'inline':'block'}" @click="copy()">
        <icon name="share" scale="35" width="35"></icon>
    </span>
    <span style="margin:8px" :style="{'display':size.isSmallSize?'inline':'block'}" @click="share(0)">
        <icon name="qq" scale="35" width="35"></icon>
    </span>
    <span style="margin:8px" :style="{'display':size.isSmallSize?'inline':'block'}" @click="share(1)">
        <icon name="qq-space" scale="35" width="35"></icon>
    </span>
    <span style="margin:8px" :style="{'display':size.isSmallSize?'inline':'block'}" @click="share(2)">
        <icon name="we-chat" scale="35" width="35"></icon>
    </span>
</div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '软件协会',
        },
        pics: {
            type: String,
            default: null,
        },
        summary: {
            type: String,
            default: '分享给你，戳我看看',
        },
    },
    computed: {
        size() {
            return this.$store.state.resize
        },
    },
    methods: {
        copy() {
            const url = window.location.href
            const input = document.createElement('input')
            document.body.appendChild(input)
            input.setAttribute('value', url)
            input.select()
            if (document.execCommand('copy')) {
                document.execCommand('copy')
                this.$message({
                    type: 'success',
                    message: '链接已复制到剪切板',
                    customClass: 'siae-msg',
                })
            }
            document.body.removeChild(input)
        },
        share(index) {
            /*
?url=你的分享网址

&sharesource=qzone

&title=你的分享标题

&pics=你的分享图片地址

&summary=你的分享描述

&desc=你的分享简述
        */
            const url = window.location.href
            const shareMap = [
                'http://connect.qq.com/widget/shareqq/index.html', //qq好友
                'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey', //qq空间
                'http://zixuephp.net/inc/qrcode_img.php', //微信
            ]
            // if (index === 2) {
            //   window.open(shareMap[index])
            // } else
            window.open(
                shareMap[index] +
                `?url=${encodeURIComponent(url)}&title=${this.title}&pics=${this.pics}&summary=${this.summary}`
            )
        },
    },
}
</script>

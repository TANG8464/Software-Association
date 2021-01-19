<template>
<span class="personal-avatar">
    <el-avatar :src="avatar" :shape="shape" :size="avatarSize"></el-avatar>
</span>
</template>

<script>
import {
    getActiveUserInfo
} from '@/api/active-user'
export default {
    props: {
        avatar: {
            type: String,
            default: require('@/assets/img/headImg.png')
        },
        avatarSize: {
            type: Number,
            default: 40,
        },
        shape: {
            type: String,
            default: 'circle',
        },

    },
}
</script>

<style>
.personal-avatar .el-avatar {
    background: white;
}
</style>

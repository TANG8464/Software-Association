<template>
<div class="bind-successs">
    <h2>
        <span style="margin:0 10px">
            <icon name="success" scale="50" width="50"></icon>
        </span>
        绑定成功
    </h2>
    <h5>
        <a class="link" href="#" @click="skip()">立即跳转</a>
        至个人中心({{time}})
    </h5>
</div>
</template>

<script>
import {
    getSiae
} from '@/utils/url'
export default {
    data() {
        return {
            time: 5,
        }
    },
    mounted() {
        const timing = setInterval(() => {
            this.time--
            if (this.time === 0) {
                clearInterval(timing)
                this.$router.push(getSiae() + 'personal-center/home')
            }
        }, 1000)
    },
    methods: {
        skip() {
            this.$router.push(getSiae() + 'personal-center/home')
        },
    },
}
</script>

<style lang="scss">
.bind-successs {
    .link {
        color: #54b4fe;
        text-decoration: none;
    }

    .link:hover {
        border-bottom: 1px solid #54b4fe;
    }
}
</style>

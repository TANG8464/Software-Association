<template>
<span class="send-verify-btn" style="width:30%;display:inline-block;text-align:right;">
    <el-button class="verify" plain type="primary" @click="sendVerify()" :disabled="disabled">
        {{disabled?`重新发送(${tenMinutes})`:'发送验证码'}}
    </el-button>
</span>
</template>

<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            require: true
        }
    },
    data() {
        return {
            time: 5,
            tenMinutes: 60
        }
    },
    watch: {
        disabled(newVal) {
            if (newVal) {
                const time = setInterval(() => {
                    this.tenMinutes--;
                    if (this.tenMinutes === 0) {
                        this.$emit('update:disabled', false)
                        this.tenMinutes = 60
                    }
                }, 1000)
            }
        },
    },
    methods: {
        sendVerify() {
            this.$emit('send-verify')
        },

    }
}
</script>

<style lang="scss">
.send-verify-btn {
    .verify {
        background: none;
    }

    .verify:hover {
        color: #1f8dff;
        border: 1px solid #1f8dff;
        background: none;
    }

    .verify:visited {
        background: none;
    }
}
</style>

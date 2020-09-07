<template>
<div class="oauth">
    <div class="content" :style="{margin}">
        <div class="logo-box">
            <img src="@/assets/img/logo.png" class="logo" />
        </div>
        <div>
            <router-view></router-view>
        </div>
    </div>
</div>
</template>

<script>
export default {
    computed: {
        size() {
            return this.$store.state.resize
        },
        margin() {
            return this.size.isSmallSize ? "10px" : "100px"
        }
    }

}
</script>

<style lang="scss">
.oauth {
    .content {
        text-align: center;
    }

    .logo {
        height: 100px;
    }

    .logo-box {
        padding: 20px;
        border-bottom: 1px solid #e0e0e0;
        border-radius: 10%;
    }
}
</style>

<template>
<div class="menu-nav">
    <div class="siae-menu" style="list-style:none;" ref="menu">
        <slot name="logo" class="logo logo-box"></slot>
        <router-link class="siae-menu-item" tag="span" v-for="(item,index) in menu" :key="index" :to="parent+item.url">{{item.name}}</router-link>
        <span class="actions">
            <slot name="actions"></slot>
        </span>
    </div>
</div>
</template>

<script>
export default {
    props: {
        menu: {
            type: Array,
        },
        parent: {
            type: String,
        },
    },

    computed: {
        size() {
            return this.$store.state.resize
        },
    },
}
</script>

<style scoped>
.menu-nav {
    text-align: center;
}

.menu-right {
    float: right;
}

.el-menu,
.el-menu-item {
    border: none;
}

.el-menu-item:hover {
    background-color: white !important;
}

.el-menu.el-menu--horizontal {
    border-bottom: none;
}

.siae-menu {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 40px;
    display: flex;
    align-items: center;
    margin: 0;
}

.siae-menu-item {
    cursor: pointer;
    color: #b0b0b0;
    font-size: 14px;
    margin: 0 5px;
    display: flex;
    align-items: center;
    text-shadow: 0 0 0.5px #fff;
}

.actions {
    position: absolute;
    right: 10px;
}

.router-link-active {
    color: white;
}
</style>

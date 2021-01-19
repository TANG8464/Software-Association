<template>
<!-- 应用于后台的右击弹出框 -->
<ul class="right-click-box" ref="rightClickBox" :style="{ opacity, display, top, left }">
    <li class="right-click-box_item" v-for="(item, index) in menu" :key="item" @click="open(index)">
        {{ item }}
    </li>
</ul>
</template>

<script>
export default {
    props: {
        menu: {
            //弹出框的菜单项
            type: Array,
            require: true,
        },
    },
    data() {
        return {
            opacity: 0,
            display: 'none',
            isOpen: false,
            top: 0,
            left: 0,
            time: new Date().getTime(),
        }
    },
    watch: {
        isOpen(newVal) {
            if (!newVal) {
                this.opacity = 0
                //将contentMenu消除以防误触
                setTimeout(() => {
                    this.display = 'none'
                }, 300)
            } else {
                //先将其展示防止动画无效
                this.display = 'inline-block'
                //再将透明度变为1
                setTimeout(() => {
                    this.opacity = 1
                }, 300)
            }
        },
    },
    mounted() {
        //其他地方被点击时，页面滚动时，都将其关闭
        document.body.onclick = (e) => {
            this.close()
        }
        //滚动监听
        window.addEventListener(
            'scroll',
            () => {
                this.close()
            },
            true
        )
    },
    methods: {
        more(event) {
            //父组件直接调用的函数
            this.isOpen = true
            //打开更多选项设置
            this.top = event.clientY + 'px'
            this.left = event.clientX + 'px'
        },
        open(index) {
            this.$emit('open', index) //激起open菜单事件，被点击菜单项的位置传给父组件
        },
        close() {
            const newDate = new Date().getTime()
            if (newDate - this.time > 500) {
                this.isOpen = false
                this.time = newDate
            }
        },
    },
}
</script>

<style>
/*
右击弹出框
*/

.right-click-box {
    list-style: none;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    display: inline-block;
    box-shadow: 0px 0px 10px 1px #e0e0e0;
    position: fixed;
    z-index: 100;
    transition: all 0.2s;
    padding: 10px 0;
}

.right-click-box_item {
    padding: 10px 15px;
    font-size: 13px;
    cursor: pointer;
}

.right-click-box_item:hover {
    background-color: rgb(221, 243, 255);
    color: rgb(81, 193, 253);
}
</style>

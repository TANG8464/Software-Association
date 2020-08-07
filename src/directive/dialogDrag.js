import Vue from 'vue';

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
        const dragDom = el.querySelector('.el-dialog'); //整个dialog
        const dialogHeaderEl = el.querySelector('.el-dialog__header'); //dialog的hearder部分
        dialogHeaderEl.style.cursor = 'move'; //将header区域的鼠标样式改成move

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

        dialogHeaderEl.onmousedown = (e) => {
            document.onmousemove = function(e) {
                // 通过事件委托，计算移动的距离 
                const l = e.movementX;
                const t = e.movementY;
                const styL = parseInt(dragDom.style.left || 0)
                const styT = parseInt(dragDom.style.top || 0)
                    // 移动当前元素  
                dragDom.style.left = `${l + styL}px`;
                dragDom.style.top = `${t + styT}px`;
            };

            document.onmouseup = function(e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
})

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
    bind(el, binding, vnode, oldVnode) {
        const dragDom = binding.value.$el.querySelector('.el-dialog');

        el.onmousedown = (e) => {

            // 鼠标按下，计算当前元素距离可视区的距离
            const disX = e.clientX - el.offsetLeft;

            document.onmousemove = function(e) {
                e.preventDefault(); // 移动时禁用默认事件

                // 通过事件委托，计算移动的距离 
                const l = e.clientX - disX;
                dragDom.style.width = `${l}px`;
            };

            document.onmouseup = function(e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }
})
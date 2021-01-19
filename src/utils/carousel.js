import store from "@/store";

export function dragSort(el) {
    let before;
    let after;
    el.ondragstart = async function (e) {//拖拽开始
        e.dataTransfer.setData('text', e.target.innerHtml)//记录一下元素中的html产生拖动时的缩略图
        await e.path.forEach(item => {
            if (item.className && item.className.indexOf('img-item') >= 0) before = item //记住被拖拽的元素
        })
    }
    el.ondragover = async function (e) {//拖拽结束
        const carouselSort = store.state.carouselSort //轮播图初始顺序
        e.preventDefault();//阻止默认行为
        await e.path.forEach(item => {
            if (typeof item.className==='string' && item.className.indexOf('img-item') >= 0) after = item //记录被拖拽元素到达相应元素
        })
        let beforeIndex;//记录被拖拽元素的下标
        let afterIndex;//记录被拖拽元素到达相应元素的位置
        await el.children.forEach((item, index) => {
            if (item === before) beforeIndex = index;
            if (item === after) afterIndex = index;
        })
        if (before !== after) {//如果相等就不用排序了
            if (beforeIndex < afterIndex) {//判断是不是往后拖
                //第一个是插入的元素  第二个是在什么地方插入  nextSibling当前dom的下一个
                el.insertBefore(before, after.nextSibling)//在after后面一个元素的前面插入
            } else {
                el.insertBefore(before, after)//在after前面插入
            }
            const beforeId = Number(before.getAttribute('data-id'))//获取被拖拽元素的id
            carouselSort.splice(beforeIndex, 1)//删除before
            carouselSort.splice(afterIndex, 0, beforeId)//在after后面插入before
            store.commit('setCarouselSort', carouselSort)//设置拖动后的轮播图排序
        }
    }
}
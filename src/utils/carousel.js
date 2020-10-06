import store from "@/store";

export function dragSort(el) {
    let before;
    let after;
    el.ondragstart = async function (e) {
        e.dataTransfer.setData('text', e.target.innerHtml)
        await e.path.forEach(item => {
            if (item.className && item.className.indexOf('img-item') >= 0) before = item
        })
    }
    el.ondragover = async function (e) {
        const carouselSort = store.state.carouselSort
        e.preventDefault();
        await e.path.forEach(item => {
            if (typeof item.className==='string' && item.className.indexOf('img-item') >= 0) after = item
        })
        let beforeIndex;
        let afterIndex;
        await el.children.forEach((item, index) => {
            if (item === before) beforeIndex = index;
            if (item === after) afterIndex = index;
        })
        if (before !== after) {
            if (beforeIndex < afterIndex) {
                el.insertBefore(before, after.nextSibling)//第一个是插入的元素  第二个是在什么地方插入  nextSibling当前dom的下一个
            } else {
                el.insertBefore(before, after)
            }
            const beforeId = Number(before.getAttribute('data-id'))
            carouselSort.splice(beforeIndex, 1)
            carouselSort.splice(afterIndex, 0, beforeId)
            store.commit('setCarouselSort', carouselSort)
        }
    }
}
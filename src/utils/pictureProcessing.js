export function imageSizeConversion() {

}
export function imgDrag(el, img) {
    console.log(el);

    el.style.cursor = 'move'; //将鼠标样式换成move
    el.onmousedown = (e) => {
        const currentPosX = e.offsetX
        const currentPosY = e.offsetY
        document.onmousemove = function(e) {
            // 通过事件委托，计算移动的距离 
            const moveX = e.offsetX - currentPosX;
            const moveY = e.offsetY - e.clientY;
            console.log(moveX + " " + moveY);
            // const l = e.clientX - disX;
            // const t = e.clientY - disY;

            // 移动当前元素  
            // el.style.left = `${l + styL}px`;
            // el.style.top = `${t + styT}px`;
        };
    }
    el.onmouseup = function(e) {
        console.log(e);

        document.onmousemove = null;
        document.onmouseup = null;
    };
}
import store from '@/store'
export function redraw(img, type, w, h) {
    let canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    let ct = canvas.getContext('2d')
        //设置图片跨域访问
    img.setAttribute('crossOrigin', 'anonymous');
    const imgT = parseInt(img.style.top)
    const imgL = parseInt(img.style.left)
    const imgW = parseInt(img.style.width)
    const imgH = parseInt(img.style.height)
    ct.fillStyle = '#fff';
    ct.fillRect(0, 0, canvas.width, canvas.height);
    ct.drawImage(img, imgL, imgT, imgW, imgH)

    const dataURL = canvas.toDataURL(type) //使用canvas将img转换为dataURL
    const base64 = { dataURL, type, } //生成base64对象
    const bytes = window.atob(dataURL.split(',')[1]) //通过atob生成bytes
    const ab = new ArrayBuffer(bytes.length) //生成二进制数据缓冲区
    let ia = new Uint8Array(ab) //8位无符号整型数组
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
    }
    const blob = new Blob([ab], { type: base64.type }) //生成blob对象
    const file = new File([blob], `avatar.${type.split('/')[1]}`, { type: base64.type }) //生成文件对象
        //存储到store仓库
    store.commit('setRedrawImgFile', file)
        //使用外网图片


}
export function imgDrag(el, img) {
    el.style.cursor = 'move'; //将鼠标样式换成move
    el.onmousedown = (e) => {
        document.onmousemove = function(e) {
            const originalX = parseInt(img.style.left)
            const originalY = parseInt(img.style.top)
            img.style.left = `${originalX+e.movementX}px` //e.movementX移动的距离X
            img.style.top = `${originalY+e.movementY}px` //e.movementX移动的距离Y
        };
        document.onmouseup = function(e) {
            store.commit('changeImg', !store.state.changeImg)
            document.onmousemove = null;
            document.onmouseout = null;
        }
    }
}
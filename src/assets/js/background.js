class Star {
    //星星类
    constructor(x, y, r, ct) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.ct = ct;
    }
    draw() {
        //绘制星星
        this.ct.shadowBlur = 100;
        this.ct.shadowColor = "#ffffff";
        this.ct.fillStyle = "rgb(255, 255, 255,1)";
        this.ct.fillRect(this.x, this.y, this.r, this.r);
    }
    move(mX, maxW) {
        //每次移动mX,平行移动
        this.x += mX;
        if (this.x > maxW) {
            this.x = 0;
        }
        this.draw();
    }
}
class Meteor {
    //流星类
    constructor(x, y, r, ct) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.ct = ct;
    }
    draw() {
        //绘制流星
        this.ct.rotate((-40 * Math.PI) / 180); //将画布旋转-40°
        this.ct.fillStyle = "rgba(255, 255, 255,1)"; //设置流星前面的圆的填充色
        this.ct.fillRect(this.x, this.y, this.r, this.r);
        this.ct.rotate((40 * Math.PI) / 180); //将画布旋转回去
    }
    move(mX, mY, maxW, maxH) {
        if (this.x > maxW * 2 || this.y > maxH * 2) {
            this.x = Math.floor(Math.random() * maxW + 1);
            this.y = 0;
        }
        this.x += mX;
        this.y += mY;
        this.draw();
    }
}
const stars = [],
    meteors = [];
let maxW;
let maxH;
let sCt, mCt, bCt1;
let b1;

function html(el) {
    maxW = window.outerWidth; //获取网页外部窗体宽
    maxH = window.outerHeight; //获取网页外部窗体高
    // maxW = document.body.scrollWidth;
    // maxH = document.body.scrollHeight > 0 ? document.body.scrollHeight : 791;
    el.style = " margin: 0;padding: 0;position: fixed;top: 0;bottom: 0;left: 0;right: 0;";
    let sc = document.createElement("canvas");
    sc.id = "star";
    sc.height = maxH;
    sc.width = maxW;
    sc.style = "position: fixed;background: none;left: 0;";
    let mc = document.createElement("canvas");
    mc.id = "meteor";
    mc.height = maxH;
    mc.width = maxW;
    mc.style = "position: fixed;background:rgb(41,42,52);left: 0;";
    mc.innerText = "该浏览器不支持canvas，为了更好的使用体验，请您切换为其他浏览器。";
    let img = el.children[0];
    el.insertBefore(mc, img);
    el.insertBefore(sc, img);
}

function init() {
    let st = document.querySelector("#star");
    let met = document.querySelector("#meteor");
    if (st.getContext) {
        let stCt = st.getContext("2d");
        let metCt = met.getContext("2d");
        sCt = stCt;
        mCt = metCt;
        mCt.fillStyle = "rgba(41,42,52,1)";
        mCt.fillRect(0, 0, maxW, maxH);
        star();
        meteor();
        move();
    }
}

function star() {
    for (let i = 1; i <= 70; i++) {
        stars[i] = new Star(Math.floor(Math.random() * maxW + 1), Math.floor(Math.random() * maxH + 1), Math.random() * 2 + 0.5, sCt);
        stars[i].draw();
    }
}

function meteor() {
    for (let i = 0; i < 5; i++) {
        meteors[i] = new Meteor(Math.floor(Math.random() * maxW + 1), 0, Math.random() + 2, mCt);
        meteors[i].draw();
    }
}

function move() {
    sCt.clearRect(0, 0, maxW, maxH);
    for (let star in stars) {
        stars[star].move(0.2, maxW);
    }
    mCt.fillStyle = "rgba(41,42,52,0.4)";
    mCt.fillRect(0, 0, maxW, maxH);
    for (let meteor in meteors) {
        meteors[meteor].move(3, 6, maxW, maxH);
    }
    requestAnimationFrame(move); //不断重新请求
}

window.onresize = function() {
    maxW = window.outerWidth; //获取网页外部窗体宽
    maxH = window.outerHeight; //获取网页外部窗体高
    let sc = document.getElementById("star");
    let mc = document.getElementById("meteor");
    if (sc && mc) {
        sc.height = maxH;
        sc.width = maxW;
        mc.height = maxH;
        mc.width = maxW;
        mc.style = "position: fixed;background:rgb(41,42,52);left:0;";
    }
}

function back(el) {
    html(el);
    init();
}
export {
    back
}
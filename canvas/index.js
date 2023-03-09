// 相关API
// arc(x, y, radius, startAngle, endAngle, anticlockwise)
// 画一个以（x,y）为圆心的以 radius 为半径的圆弧（圆），从 startAngle 开始到 endAngle 结束，按照 anticlockwise 给定的方向（默认为顺时针）来生成。
//beginPath() 新建一条路径，生成之后，图形绘制命令被指向到路径上生成路径。
//closePath() 闭合路径之后图形绘制命令又重新指向到上下文中。
// stroke() 通过线条来绘制图形轮廓。
//fill()  通过填充路径的内容区域生成实心的图形。
const MAX_W = window.innerWidth;
const MAX_H = window.innerHeight;
const R = 4;

let ctx = null;
const canvasEle = document.querySelector("#canvas");

function getRandom(min, max) {
  return Math.floor(Math.random() * max + 1 + min);
}

function getPixelRatio(context) {
  const backingStore =
    context.backingStorePixelRatio ||
    context.webkitBackingStorePixelRatio ||
    context.mozBackingStorePixelRatio ||
    context.msBackingStorePixelRatio ||
    context.oBackingStorePixelRatio ||
    context.backingStorePixelRatio ||
    1;
  return (window.devicePixelRatio || 1) / backingStore;
}

function setLayout() {
  const ratio = getPixelRatio(ctx);
  canvasEle.width = MAX_W * ratio;
  canvasEle.height = MAX_H * ratio;
  canvasEle.style.background = "#000";
}

class Point {
  constructor() {
    this.r = R;
    this.x = getRandom(0, MAX_W - this.r / 2);
    this.y = getRandom(0, MAX_H - this.r / 2);
    this.xSpeed = getRandom(-100, 100);
    this.ySpeed = getRandom(-100, 100);
    this.lastDrawTime = null;
  }
  draw() {
    if (this.lastDrawTime) {
      let duration = this.lastDrawTime - new Date();
      let xDis = this.xSpeed * (duration / 1000);
      let yDis = this.ySpeed * (duration / 1000);
      let x = this.x + xDis;
      let y = this.y + yDis;
      if (x > MAX_W - this.r) {
        x = MAX_W - this.r;
        this.xSpeed = -this.xSpeed;
      }
      if (x < this.r) {
        x = this.r;
        this.xSpeed = -this.xSpeed;
      }
      if (y > MAX_H - this.r) {
        y = MAX_H - this.r;
        this.ySpeed = -this.ySpeed;
      }
      if (y < this.r) {
        y = this.r;
        this.ySpeed = -this.ySpeed;
      }
      this.x = x;
      this.y = y;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, true);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fill();
    ctx.closePath();
    this.lastDrawTime = new Date();
  }
}

class Graph {
  constructor(pointNum, disMax = 300) {
    this.points = new Array(pointNum).fill(null).map(() => new Point());
    this.disMax = disMax;
  }

  draw() {
    requestAnimationFrame(() => {
      ctx.clearRect(0, 0, MAX_W, MAX_H);
      this.draw();
    });
    const pointList = this.points;
    for (let i = 0; i < pointList.length; i++) {
      const p1 = pointList[i];
      p1.draw();
      for (let j = i + 1; j < pointList.length; j++) {
        const p2 = pointList[j];
        const d = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        if (d > this.disMax) continue;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.strokeStyle = `rgba(200,200,200,${1 - d / this.disMax})`;
        ctx.stroke();
      }
    }
  }
}

function init() {
  ctx = canvasEle.getContext("2d");
  // 设置canvas的宽、高
  setLayout();
  const g = new Graph(36);
  g.draw();
}

init();

var cvs = document.getElementById("canvas");
//点击或者触摸
function onTouchStart(e){
	e.preventDefault();
    if(e.changedTouches){
        e=e.changedTouches[e.changedTouches.length-1];
    }
    x=e.pageX - offsetLeft;
    y=e.pageY - offsetTop;

    ctx.beginPath();//开始绘制
	ctx.arc(x, y, 20/2, 0, Math.PI*2, true);
	ctx.closePath();//结束绘制
	ctx.fill();//填充的方式

	document.addEventListener(end,onTouchEnd);
    cvs.addEventListener(move,onTouch);
};
function onTouch(e){
    if(e.changedTouches){
        e=e.changedTouches[e.changedTouches.length-1];
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(e.pageX - offsetLeft, e.pageY- offsetTop);
    x=e.pageX - offsetLeft;y=e.pageY - offsetTop;
    ctx.closePath();
    ctx.stroke();
    var n=(Math.random()*10000000)|0;
    ctx.canvas.style.color='#'+ n.toString(16);//fix android 4.2 bug force repaint
};
function onTouchEnd(){
    cvs.removeEventListener(move,onTouch);
    pathPoints=[];
};


if(cvs.getContext){
	var ctx = cvs.getContext("2d");
	ctx.fillStyle='#bbb';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.globalCompositeOperation = 'destination-out';
	ctx.strokeStyle="fff";
	ctx.lineJoin = "round";
	ctx.lineWidth = 20;
	var start='mousedown',move='mousemove',end='mouseup';
	var x,y;
	var offsetParent=cvs,offsetLeft=0,offsetTop=0;
    while(offsetParent){
        offsetLeft+=offsetParent.offsetLeft;
        offsetTop+=offsetParent.offsetTop;
        offsetParent=offsetParent.offsetParent;
    }
    if(document.createTouch){//兼容移动设备
        start="touchstart";
        move="touchmove";
        end="touchend";
    }
    cvs.addEventListener(start,onTouchStart);
}else{
	console.log('您的浏览器不支持canvas标签！');
};
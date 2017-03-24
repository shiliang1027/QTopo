/**
 * Created by qiyc on 2017/2/7.
 */
var Link=require("./Link.js");
module.exports =  {
    constructor:FoldLink,
    setDefault:setDefault,
    getDefault:getDefault
};
//-
var DEFAULT ={
        number:1,
        alpha:1,
        color: '22,124,255',
        arrow:{
            size:10,
            offset:0,
            start:false,
            end:false
        },
        gap:20,
        width: 2,
        dashed:  null,
        zIndex : 100,
        radius:0,
        font:{
            size:16,
            type:"微软雅黑",
            color:'255,255,255'
        },
        useType: QTopo.constant.link.FOLD,
        direction:"vertical"
};
function setDefault(config){
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault(){
    return QTopo.util.deepClone(DEFAULT);
}
//---------
var jtopoReset={
    //双向箭头,添加左右边概念
    paintPath:function (cx, path) {
        var attr=this.qtopo.attr;
        if (this.nodeA === this.nodeZ)return void this.paintLoop(cx);
        cx.beginPath();
        cx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++){
            if(null == this.dashedPattern){
                if (attr.radius > 0) {
                    if (i < path.length - 1) {
                        cx.arcTo(path[i].x, path[i].y,path[i + 1].x, path[i + 1].y,attr.radius);//增加折线弧度
                    } else {
                        cx.lineTo(path[i].x, path[i].y);
                    }
                } else {
                    cx.lineTo(path[i].x, path[i].y);
                }
            }else{
                cx.JTopoDashedLineTo(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y, this.dashedPattern);
            }
        }
        cx.stroke();
        cx.closePath();
        if (null != this.arrowsRadius) {
            if (attr.arrow.end) {
                this.paintArrow(cx, path[path.length - 2], path[path.length - 1]);
            }
            if (attr.arrow.start) {
                this.paintArrow(cx, path[1], path[0]);//添加双向箭头
            }
        }
    }
};
//---------
//-
function FoldLink(config){
    if(!config.start||!config.end||!config.start.jtopo||!config.end.jtopo){
        QTopo.util.error("Create Link need start and end");
        return;
    }
    this.attr =  QTopo.util.extend(getDefault(), config || {});
    Link.call(this, new JTopo.FoldLink(config.start.jtopo, config.end.jtopo));
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    //修改源码
    reset(this);
}
QTopo.util.inherits(FoldLink,Link);
//-
function setJTopo(config) {
    if (config) {
        var self=this;
        this._setAttr(config);
    }
}
function reset(link){
    link.jtopo.paintPath = jtopoReset.paintPath;
}
//-
FoldLink.prototype.setDirection=function(direction){
    //折线方向 horizontal 水平 "vertical"垂直
    if(direction){
        this.jtopo.direction=direction;
    }
    this.attr.direction=this.jtopo.direction;
};
FoldLink.prototype.getDefault=getDefault;
FoldLink.prototype.setRadius = function (radius) {
    if ($.isNumeric(radius)) {
        radius = parseInt(radius);
        if (radius > 20) {
            radius = 20;
        } else if (radius < 0) {
            radius = 0;
        }
        this.attr.radius = radius;
    }
};
//-
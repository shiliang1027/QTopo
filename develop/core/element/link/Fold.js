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
            size:null,
            offset:0,
            start:false,
            end:false
        },
        gap:20,
        width: 2,
        dashed:  null,
        zIndex : 100,
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
    paintPath:function (context2D, pointsArray) {
        if (this.nodeA === this.nodeZ)return void this.paintLoop(context2D);
        context2D.beginPath();
        context2D.moveTo(pointsArray[0].x, pointsArray[0].y);
        for (var c = 1; c < pointsArray.length; c++)
            if(null == this.dashedPattern){
                context2D.lineTo(pointsArray[c].x, pointsArray[c].y);
            }else{
                context2D.JTopoDashedLineTo(pointsArray[c - 1].x, pointsArray[c - 1].y, pointsArray[c].x, pointsArray[c].y, this.dashedPattern);
            }
        if (context2D.stroke(), context2D.closePath(), null != this.arrowsRadius) {
            if (this.qtopo.attr.arrow.end) {
                this.paintArrow(context2D, pointsArray[pointsArray.length - 2], pointsArray[pointsArray.length - 1]);
            }
            if (this.qtopo.attr.arrow.start) {
                this.paintArrow(context2D, pointsArray[1], pointsArray[0]);//添加双向箭头
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
    Link.call(this, new JTopo.FoldLink(config.start.jtopo, config.end.jtopo));
    this.attr =  QTopo.util.extend(getDefault(), config || {});
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
//-
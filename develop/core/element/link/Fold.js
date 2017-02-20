/**
 * Created by qiyc on 2017/2/7.
 */
var Link=require("./Link.js");
module.exports = FoldLink;
//折线
var defaults =function(){
    return {
        num:1,
        alpha:1,
        color: '22,124,255',
        arrow:{
            size:null,
            offset:0,
            start:false,
            end:true
        },
        gap:20,
        width: 2,
        dashed:  null,
        zIndex : 100,
        textOffset:[0,0],
        font:{
            size:16,
            type:"微软雅黑",
            color:'255,255,255'
        },
        useType: 'fold',
        direction:"vertical"
    };
};
function FoldLink(config){
    if(!config.start||!config.end){
        console.error("Create Link need start and end");
        return;
    }
    Link.call(this, new JTopo.FoldLink(config.start.jtopo, config.end.jtopo));
    this.attr =  QTopo.util.extend(defaults(), config || {});
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    //修改源码
    reset(this);
}
QTopo.util.inherits(FoldLink,Link);
function setJTopo(config) {
    if (config) {
        var self=this;
        this._setAttr(config);
    }
}
function reset(link){
    //双向箭头
    link.jtopo.paintPath = function (a, b) {
        if (this.nodeA === this.nodeZ)return void this.paintLoop(a);
        a.beginPath(), a.moveTo(b[0].x, b[0].y);
        for (var c = 1; c < b.length; c++)
            null == this.dashedPattern ? a.lineTo(b[c].x, b[c].y) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern);
        if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
            if (link.attr.arrow.end) {
                this.paintArrow(a, b[b.length - 2], b[b.length - 1]);
            }
            if (link.attr.arrow.start) {
                this.paintArrow(a, b[1], b[0]);//添加双向箭头
            }
        }
    };
}
FoldLink.prototype.setDirection=function(direction){
    //折线方向 horizontal 水平 "vertical"垂直
    if(direction){
        this.jtopo.direction=direction;
    }
    this.attr.direction=this.jtopo.direction;
};

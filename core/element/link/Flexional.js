/**
 * Created by qiyc on 2017/2/7.
 */
var Link=require("./Link.js");
FlexionalLink.prototype=new Link();
module.exports = FlexionalLink;
//二次折线
var defaults =function(){
    return {
        num: 1,
        alpha:1,
        color: '22,124,255',
        arrow:{
            size:null,
            offset:0,
            start:false,
            end:true
        },
        gap:20,
        width:2,
        dashed:  null,
        zIndex : 100,
        textOffset:[0,0],
        font:{
            size:16,
            type:"微软雅黑",
            color:'255,255,255'
        },
        type: 'flexional',
        direction:"horizontal",
        offsetGap:60
    };
};
function FlexionalLink(config){
    if(!config.start||!config.end){
        console.error("Create Link need start and end");
        return;
    }
    var self = this;
    self.jtopo = new JTopo.FlexionalLink(config.start.jtopo, config.end.jtopo);
    //封装对象之间相互保持引用
    self.jtopo.qtopo=self;
    self.attr =  QTopo.util.extend(defaults(), config || {});
    //函数
    self.set = setJTopo;
    //初始化
    self.set(self.attr);
    //修改源码
    reset(self);
}
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
FlexionalLink.prototype.setOffsetGap=function(offsetGap){
    this.jtopo.offsetGap = parseInt(offsetGap);// 折线拐角处的长度
    this.attr.offsetGap=this.jtopo.offsetGap;
};
FlexionalLink.prototype.setDirection=function(direction){
    //折线方向 horizontal 水平 "vertical"垂直
    this.jtopo.direction=direction;
    this.attr.direction=this.jtopo.direction;
};
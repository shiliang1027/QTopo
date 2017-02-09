/**
 * Created by qiyc on 2017/2/7.
 */
Flexional.prototype=require("./Link.js");
module.exports = Flexional;
//二次折线
var defaults =function(){
    return {
        num: 0,
        id:  '',
        alpha:1,
        pid:  '',
        weight: 1000,
        color: '22,124,255',
        arrow:{
            size:null,
            offset:0,
            start:false,
            end:true
        },
        gap:20,
        width:3,
        dashed:  null,
        zIndex : 100,
        textOffset:[0,0],
        font:{
            size:16,
            type:"微软雅黑"
        },
        fontColor: '255,255,255',
        type: 'flexional',
        direction:"horizontal",
        offsetGap:60
    };
};
function Flexional(config){
    if(!config.start||!config.end){
        console.error("Create Link need start and end");
        return;
    }
    var self = this;
    self.jtopo = new JTopo.FlexionalLink(config.start.jtopo, config.end.jtopo);
    self.attr = $.extend(true,defaults(), config || {});
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
        self._setLink(config,["direction"]);
        if(config.offsetGap){
            setOffsetGap.call(self,config.offsetGap);
        }
    }
}
function setOffsetGap(offsetGap){
    this.jtopo.offsetGap = parseInt(offsetGap);// 折线拐角处的长度
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
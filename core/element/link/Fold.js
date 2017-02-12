/**
 * Created by qiyc on 2017/2/7.
 */
Fold.prototype=require("./Link.js");
module.exports = Fold;
//折线
var defaults =function(){
    return {
        num:1,
        alpha:1,
        weight: 1000,
        color: '22,124,255',
        arrow:{
            size:null,
            offset:0,
            start:false,
            end:true
        },
        gap:20,
        width: 4,
        dashed:  null,
        zIndex : 100,
        textOffset:[0,0],
        font:{
            size:16,
            type:"微软雅黑",
            color:'255,255,255'
        },
        type: 'fold',
        direction:"vertical"
    };
};
function Fold(config){
    if(!config.start||!config.end){
        console.error("Create Link need start and end");
        return;
    }
    var self = this;
    self.jtopo = new JTopo.FoldLink(config.start.jtopo, config.end.jtopo);
    //封装对象之间相互保持引用
    self.jtopo.qtopo=self;
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

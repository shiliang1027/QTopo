/**
 * Created by qiyc on 2017/2/7.
 */
Direct.prototype=require("./Link.js");
module.exports = Direct;
//直线
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
        width: 4,
        dashed:  null,
        zIndex : 100,
        textOffset:[0,0],
        font:{
            size:16,
            type:"微软雅黑",
            color:'255,255,255'
        },
        type: 'direct',
        bundleOffset:60// 多条直线时，线条折线拐角处的长度
    };
};
function Direct(config) {
    if(!config.start||!config.end){
        console.error("Create Link need start and end");
        return;
    }
    var self = this;
    self.jtopo = new JTopo.Link(config.start.jtopo, config.end.jtopo);
    self.attr = $.extend(true,defaults(), config || {});
    //函数
    self.set = setJTopo;
    //初始化
    self.set(self.attr);
    //源码修改
    reset(self);

}
function setJTopo(config) {
    if (config) {
        var self=this;
        self._setLink(config);
        if(config.bundleOffset){
            self.jtopo.bundleOffset=parseInt(config.bundleOffset);
        }
    }
}
function reset(link){
    //双向箭头
    link.jtopo.getStartPosition = function () {
        var a;
        return null != this.arrowsRadius && (a = (function (thisl) {
            var b = thisl.nodeA, c = thisl.nodeZ;
            var d = JTopo.util.lineF(b.cx, b.cy, c.cx, c.cy);
            var e = b.getBound();
            return f = JTopo.util.intersectionLineBound(d, e);
        })(this)), null == a && (a = {
            x: this.nodeA.cx,
            y: this.nodeA.cy
        }), a;
    };
    link.jtopo.paintPath = function (a, b) {
        if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
        a.beginPath(),
            a.moveTo(b[0].x, b[0].y);
        for (var c = 1; c < b.length; c++) {
            null == this.dashedPattern ? (
                (null == this.PointPathColor ? a.lineTo(b[c].x, b[c].y) : a.JtopoDrawPointPath(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, a.strokeStyle, this.PointPathColor))
            ) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
        }
        if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
            if (link.attr.arrow.end) {
                this.paintArrow(a, b[0], b[b.length - 1]);
            }//终点箭头
            if (link.attr.arrow.start) {
                this.paintArrow(a, b[b.length - 1], b[0]);
            }//起点箭头
        }
    };
}

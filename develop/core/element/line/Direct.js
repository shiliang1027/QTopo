/**
 * @module core
 */
/**
 * 图形节点
 * @class  DirectLine
 * @constructor
 * @extends [LE] Line
 * @param [config] 配置参数，无参则按全局配置创建
 */
var Line=require("./Line.js");
module.exports =  {
    constructor:DirectLine,
    setDefault:setDefault,
    getDefault:getDefault
};
//-
var DEFAULT={
        num: 1,
        alpha:1,
        color: '22,124,255',
        arrow:{
            size:null,
            offset:0,
            start:false,
            end:true
        },
        jsonId:"",
        gap:20,
        position:{
            start:[0,0],
            end:[0,100]
        },
        path:{
            start:{},
            end:{}
        },
        width: 2,
        dashed:  null,
        zIndex : 80,
        font:{
            size:16,
            type:"微软雅黑",
            color:'255,255,255'
        },
        useType: QTopo.constant.line.DIRECT,
        bundleOffset:60// 多条直线时，线条折线拐角处的长度
};
function setDefault(config){
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault(){
    return QTopo.util.deepClone(DEFAULT);
}
//-
//----
var jtopoReset={
    //双向箭头
    getStartPosition:function () {
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
    },
    paintPath:function (a, b) {
        if (this.nodeA === this.nodeZ) return void this.paintLoop(a);
        a.beginPath(),
            a.moveTo(b[0].x, b[0].y);
        for (var c = 1; c < b.length; c++) {
            null == this.dashedPattern ? (
                (null == this.PointPathColor ? a.lineTo(b[c].x, b[c].y) : a.JtopoDrawPointPath(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, a.strokeStyle, this.PointPathColor))
            ) : a.JTopoDashedLineTo(b[c - 1].x, b[c - 1].y, b[c].x, b[c].y, this.dashedPattern)
        }
        if (a.stroke(), a.closePath(), null != this.arrowsRadius) {
            if (this.qtopo.attr.arrow.end) {
                this.paintArrow(a, b[0], b[b.length - 1]);
            }//终点箭头
            if (this.qtopo.attr.arrow.start) {
                this.paintArrow(a, b[b.length - 1], b[0]);
            }//起点箭头
        }
    }
};
//----
function DirectLine(config) {
    this.attr =  QTopo.util.extend(getDefault(), config || {});
    //line基于不加入画布的节点之间的线生成
    Line.call(this,new JTopo.Link(new JTopo.Node(), new JTopo.Node()));
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    //源码修改
    reset(this);
}
QTopo.util.inherits(DirectLine,Line);
/**
 *  元素对属性的统一设置函数，推荐使用
 *
 *  参数可设置一项或多项,未设置部分参考全局配置
 *  @method set
 *  @param config
 *  @example
 *          实际参数参考attr内属性,只会修改有对应set函数的属性,若新增属性且添加了setXXX函数，也可用此函数配置
 *          如:name 对应 setName("..")
 *          参数格式如下
 *          config={
 *              xx:...,
 *              xx:...
 *          }
 */
function setJTopo(config) {
    if (config) {
        var self=this;
        self._setAttr(config);
    }
}
function reset(Line){
    Line.jtopo.getStartPosition = jtopoReset.getStartPosition;
    Line.jtopo.paintPath = jtopoReset.paintPath;
}
/**
 *  设置直线两端的线段长度
 *
 *  当一条链路的两端元素之间有多条链路时，链路将会分成三段绘制并偏移，以区分其他链路
 *  @method setBundleOffset
 *  @param bundleOffset {number}
 */
DirectLine.prototype.setBundleOffset=function(bundleOffset){
    if($.isNumeric(bundleOffset)){
        this.jtopo.bundleOffset=parseInt(bundleOffset);
    }
    this.attr.bundleOffset=this.jtopo.bundleOffset;
};
/**
 * 获取元素全局样式
 * @method getDefault
 * @return {object}
 * @example
 *          var DEFAULT = {
                                number: 1,
                                alpha: 1,
                                color: '22,124,255',
                                arrow: {
                                    size: 10,
                                    offset: 0,
                                    start: false,
                                    end: false
                                },
                                position:{
                                    start:[0,0],
                                    end:[0,100]
                                },
                                jsonId:"",
                                gap: 20,
                                width: 3,
                                dashed: null,
                                zIndex: 100,
                                font: {
                                    size: 16,
                                    type: "微软雅黑",
                                    color: '255,255,255'
                                },
                                expendAble: true,
                                useType: QTopo.constant.line.DIRECT,
                                bundleOffset: 60// 多条直线时，线条折线拐角处的长度
                            };
 */
DirectLine.prototype.getDefault=getDefault;
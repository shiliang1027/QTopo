/**
 * @module core
 */
/**
 * 线段基类,用以继承
 * @class [LE] Line
 * @constructor
 * @extends [E] Element
 * @param jtopo 元素核心的jtopo对象
 */
var Element=require("../Element.js");
module.exports =Line;
function Line(jtopo) {
    if(jtopo){
        Element.call(this,jtopo);
    }else{
        QTopo.util.error("create Line without jtopo",this);
    }
    /**
     * 记录线段的首尾元素,首尾元素一般隐藏，且为jtopo对象，仅作为绘制的坐标点
     * @property [LE] path {object}
     * @param start {object} 起始元素
     * @param end {object} 终点元素
     */
    this.attr.path={
        start:this.jtopo.nodeA,
        end:this.jtopo.nodeZ
    };
}
QTopo.util.inherits(Line,Element);
/**
 *  设置线段位置,原理是设置线段首尾处隐藏jtopo节点的位置
 *  @method [LE] setPosition
 *  @param position {object}
 *
 *          position={
 *              start:[x,y],
 *              end:[x,y]
 *          }
 */
Line.prototype.setPosition=function(position){
    var start=this.attr.path.start;
    var end=this.attr.path.end;
    if($.isArray(position.start)&&$.isNumeric(position.start[0])&&$.isNumeric(position.start[1])){
        start.setLocation(parseInt(position.start[0]), parseInt(position.start[1]));
    }
    if($.isArray(position.end)&&$.isNumeric(position.end[0])&&$.isNumeric(position.end[1])){
        end.setLocation(parseInt(position.end[0]), parseInt(position.end[1]));
    }
    this.attr.position={
        start:[start.x,start.y],
        end:[end.x,end.y]
    };
};
/**
 *  获取基本类型
 *  @method [LE] getType
 *  @return QTopo.constant.Line {string}
 */
Line.prototype.getType=function(){
    return QTopo.constant.Line;
};
/**
 *  设置线段颜色
 *  @method [LE] setColor
 *  @param color{string} "255,255,255"/"#ffffff"
 */
Line.prototype.setColor = function (color) {
    if (color) {
        this.jtopo.strokeColor = QTopo.util.transHex(color.toLowerCase());
    }
    this.attr.color=this.jtopo.strokeColor;
};
/**
 *  设置线段计数
 *  @method [LE] setNum
 *  @param {number} num
 */
Line.prototype.setNum = function (num) {
    if ($.isNumeric(num)) {
        if(num > 1){
            this.jtopo.text = '(+' + num + ')';
        }else {
            this.jtopo.text = '';
        }
        this.attr.num=num;
    }
};
/**
 *  设置线段宽度
 *  @method [LE] setWidth
 *  @param {number} width
 */
Line.prototype.setWidth=function(width){
    if($.isNumeric(width)){
        this.jtopo.lineWidth = width; // 线宽
    }
    this.attr.width=this.jtopo.lineWidth;
};
/**
 *  设置线段两端箭头参数
 *  @method [LE] setArrow
 *  @param arrow {object}
 *
 *          arrow={
 *              size:箭头大小{number},
 *              offset:箭头在链路上的偏移量{number},
 *              start:是否显示起点箭头{boolean},
 *              end:是否显示终点箭头{boolean},
 *          }
 */
Line.prototype.setArrow = function(arrow){
    if(arrow){
        this.jtopo.arrowsRadius = $.isNumeric(arrow.size)?arrow.size:0;
        this.jtopo.arrowsOffset = $.isNumeric(arrow.offset)?arrow.offset:0;
    }
    if(!this.attr.arrow){
        this.attr.arrow={};
    }
    this.attr.arrow.size=this.jtopo.arrowsRadius;
    this.attr.arrow.offset=this.jtopo.arrowsOffset;
};
/**
 *  设置相同起点和终点的链路之间的间隔大小
 *
 *  @method [LE] setGap
 *  @param gap {number}
 */
Line.prototype.setGap=function(gap){
    if(gap){
        this.jtopo.bundleGap = $.isNumeric(gap)?gap:0; // 线条之间的间隔
    }
    this.attr.gap=this.jtopo.bundleGap;
};
/**
 *  设置链路的虚线线段长度
 *
 *  设置不为number类型或小于0时，则认为不要虚线
 *
 *  @method [LE] setDashed
 *  @param dashedPattern {number|null}
 */
Line.prototype.setDashed=function(dashedPattern){
    if($.isNumeric(dashedPattern)&&dashedPattern>0){
        this.jtopo.dashedPattern=parseInt(dashedPattern);
    }else{
        this.jtopo.dashedPattern=null;
    }
    this.attr.dashed=this.jtopo.dashedPattern;
};
/**
 *  单个对象的属性提取
 *  @method [LE] toJson
 *  @return {object}
 */
Line.prototype.toJson=function(){
    var json=$.extend({},this.attr);
    json.extra=$.extend({},this.extra);
    return json;
};
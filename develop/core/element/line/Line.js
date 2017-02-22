/**
 * Created by qiyc on 2017/2/7.
 */
var Element=require("../Element.js");
module.exports =Line;
function Line(jtopo) {
    if(jtopo){
        Element.call(this,jtopo);
    }else{
        console.error("create Line without jtopo",this);
    }
    this.attr.path={
        start:this.jtopo.nodeA,
        end:this.jtopo.nodeZ
    };
}
QTopo.util.inherits(Line,Element);
Line.prototype.getType=function(){
    return QTopo.constant.Line;
};
Line.prototype.setColor = function (color) {
    if (color) {
        this.jtopo.strokeColor = QTopo.util.transHex(color.toLowerCase());
    }
    this.attr.color=this.jtopo.strokeColor;
};
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
Line.prototype.setWidth=function(width){
    if($.isNumeric(width)){
        this.jtopo.lineWidth = width; // 线宽
    }
    this.attr.width=this.jtopo.lineWidth;
};
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
Line.prototype.setGap=function(gap){
    if(gap){
        this.jtopo.bundleGap = $.isNumeric(gap)?gap:0; // 线条之间的间隔
    }
    this.attr.gap=this.jtopo.bundleGap;
};
Line.prototype.setDashed=function(dashedPattern){
    if($.isNumeric(dashedPattern)&&dashedPattern>0){
        this.jtopo.dashedPattern=parseInt(dashedPattern);
    }else{
        this.jtopo.dashedPattern=null;
    }
    this.attr.dashed=this.jtopo.dashedPattern;
};

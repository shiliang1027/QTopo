/**
 * Created by qiyc on 2017/2/7.
 */
var Element=require("../Element.js");
Link.prototype = new Element();
module.exports =Link;
function Link() {
    this.getType=function(){
        return "link";
    };
    this.setColor = function (color) {
        if (color) {
            color = QTopo.util.transHex(color.toLowerCase());
            this.jtopo.strokeColor = color;
            this.attr.color=this.jtopo.strokeColor;
        }
    };
    this.setNum = function (num) {
        if ($.isNumeric(num)&&num > 1) {
            this.jtopo.text = '(+' + num + ')';
        } else {
            this.jtopo.text = '';
        }
        this.attr.num=num;
    };
    this.setWidth=function(width){
        this.jtopo.lineWidth = width; // 线宽
        this.attr.width=width;
    };
    this.setArrow = function(arrow){
        this.jtopo.arrowsRadius = $.isNumeric(arrow.size)?arrow.size:0;
        this.jtopo.arrowsOffset = $.isNumeric(arrow.offset)?arrow.offset:0;
        this.attr.arrow.size=this.jtopo.arrowsRadius;
        this.attr.arrow.offset=this.jtopo.arrowsOffset;
    };
    this.setGap=function(gap){
        this.jtopo.bundleGap = $.isNumeric(gap)?gap:0; // 线条之间的间隔
        this.attr.gap=this.jtopo.bundleGap;
    };
    this.setDashed=function(dashedPattern){
        if($.isNumeric(dashedPattern)&&dashedPattern>0){
            this.jtopo.dashedPattern=dashedPattern;
        }else{
            this.jtopo.dashedPattern=null;
        }
        this.attr.dashed=this.jtopo.dashedPattern;
    };
}


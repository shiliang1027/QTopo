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
            this.jtopo.strokeColor = QTopo.util.transHex(color.toLowerCase());
        }
        this.attr.color=this.jtopo.strokeColor;
    };
    this.setNum = function (num) {
        if ($.isNumeric(num)) {
            if(num > 1){
                this.jtopo.text = '(+' + num + ')';
            }else {
                this.jtopo.text = '';
            }
            this.attr.num=num;
        }
    };
    this.setWidth=function(width){
        if($.isNumeric(width)){
            this.jtopo.lineWidth = width; // 线宽
        }
        this.attr.width=this.jtopo.lineWidth;
    };
    this.setArrow = function(arrow){
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
    this.setGap=function(gap){
        if(gap){
            this.jtopo.bundleGap = $.isNumeric(gap)?gap:0; // 线条之间的间隔
        }
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
    this.getPath=function(){
        var path={
            start:this.jtopo.nodeA.qtopo,
            end:this.jtopo.nodeZ.qtopo
        };
        this.path=path;
        return path;
    }
}


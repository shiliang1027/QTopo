/**
 * Created by qiyc on 2017/2/7.
 */
Link.prototype =require("../Element.js");
module.exports = new Link();
function Link() {
    this.type = "link";
    this.setColor = function (color) {
        if (color) {
            color = QTopo.util.transHex(color.toLowerCase());
            this.jtopo.strokeColor = color;
        }
    };
    this.setNum = function (num) {
        if (num > 0) {
            this.jtopo.text = '(+' + num + ')';
        } else {
            this.jtopo.text = '';
        }
    };
    this.setWidth=function(width){
        this.jtopo.lineWidth = width; // 线宽
    };
    this.setArrow = function(arrow){
        this.jtopo.arrowsRadius = arrow.size;
        this.jtopo.arrowsOffset = arrow.offset;
    };
    this.setGap=function(gap){
        this.jtopo.bundleGap = gap; // 线条之间的间隔
    };
    this.setDashed=function(dashedPattern){
        if(dashedPattern&&dashedPattern>0){
            this.jtopo.dashedPattern=dashedPattern;
        }else{
            this.jtopo.dashedPattern=null;
        }
    };
    this.setDirection=function(direction){
        //折线方向 horizontal 水平 "vertical"垂直
        this.jtopo.direction=direction;
    };
    this._setLink=function(config,arr){
        var temp= ["num","font","color","alpha","arrow","gap","textOffset","width","dashed"];
        if(arr){
            this._setAttr($.merge(temp,arr),config);
        }else{
            this._setAttr(temp,config);
        }
    };
}


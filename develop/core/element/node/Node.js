/**
 * Created by qiyc on 2017/2/7.
 */
var Element=require("../Element.js");
Node.prototype = new Element();
module.exports =Node;
function Node() {
    this.getType=function(){
        return "node";
    };
    this.setColor = function (color) {
        if (color) {
            color = QTopo.util.transHex(color.toLowerCase());
            this.jtopo.fillColor = color;
            this.attr.color=this.jtopo.fillColor;
        }
    };
    this.setName=function(name){
        if(this.attr.textPosition!="hide"){
            this.jtopo.text=name;
            this.attr.name=this.jtopo.text;
        }
    };
}


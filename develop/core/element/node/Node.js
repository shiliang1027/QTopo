/**
 * Created by qiyc on 2017/2/7.
 */
var Element=require("../Element.js");
module.exports =Node;
function Node(jtopo) {
    if(jtopo){
        Element.call(this,jtopo);
    }else{
        QTopo.util.error("create Node without jtopo",this);
    }
    this.links={
        in:[],
        out:[]
    };
    reset(this);
}
QTopo.util.inherits(Node,Element);
function reset(element){
    var jtopoReset={
        paintText:function (cx) {
            var text = this.text;
            if (null != text && "" != text) {
                cx.beginPath();
                cx.font = this.font;
                var fontWidth = cx.measureText("田").width;
                var maxWidth = fontWidth;
                cx.fillStyle = "rgba(" + this.fontColor + "," + this.alpha + ")";//;名称永远不透明
                //换行检测
                var texts = text.split("\n");
                for (var i = 0; i < texts.length; i++) {
                    var width = cx.measureText(texts[i]).width;
                    if (width > maxWidth) {
                        maxWidth = width;
                    }
                }
                var e = this.getTextPostion(this.textPosition, maxWidth, fontWidth,texts.length);
                for(var j = 0; j < texts.length; j++){
                    var textWidth=cx.measureText(texts[j]).width;
                    cx.fillText(texts[j], e.x+(maxWidth-textWidth)/2, e.y+j*fontWidth);
                }

                cx.closePath();
            }
        }
    };
    element.jtopo.paintText = jtopoReset.paintText;
}
Node.prototype.getType=function(){
    return QTopo.constant.NODE;
};
Node.prototype.setColor = function (color) {
    if (color) {
        color = QTopo.util.transHex(color.toLowerCase());
        this.jtopo.fillColor = color;
    }
    this.attr.color=this.jtopo.fillColor;
};
Node.prototype.setName=function(name){
    if(name){
        if (this.attr.namePosition != "hide") {
            this.jtopo.text = (name+"").trim();
        }
        this.attr.name = (name+"").trim();
    }
};
Node.prototype.getSerializeProperties=function(){
    return $.extend({},this.extra,this.attr);
};
Node.prototype.getLinks=function(){
    var jtopo=this.jtopo;
    if(!this.links){
        this.links = {};
    }
    var links=this.links;
    links.in=[];
    links.out=[];
    if(jtopo.inLinks&&jtopo.inLinks.length>0){
        for(var i=0;i<jtopo.inLinks.length;i++){
            links.in.push(jtopo.inLinks[i].qtopo);
        }
    }
    if(jtopo.outLinks&&jtopo.outLinks.length>0){
        for(var j=0;j<jtopo.outLinks.length;j++){
            links.out.push(jtopo.outLinks[j].qtopo);
        }
    }
    return links;
};

/**
 * Created by qiyc on 2017/2/7.
 */
var Element=require("../Element.js");
module.exports =Node;
function Node(jtopo) {
    if(jtopo){
        Element.call(this,jtopo);
    }else{
        console.error("create Node without jtopo",this);
    }
    this.links={
        in:[],
        out:[]
    };
}
QTopo.util.inherits(Node,Element);
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
        if (this.attr.textPosition != "hide") {
            this.jtopo.text = name;
        }
        this.attr.name = name;
    }
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

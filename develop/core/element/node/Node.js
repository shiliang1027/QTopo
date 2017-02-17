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
        }
        this.attr.color=this.jtopo.fillColor;
    };
    this.setName=function(name){
        if(name){
            if (this.attr.textPosition != "hide") {
                this.jtopo.text = name;
            }
            this.attr.name = name;
        }
    };
    this.getLinks=function(){
        var jtopo=this.jtopo;
        var links={
            in:[],
            out:[]
        };
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
    }
}


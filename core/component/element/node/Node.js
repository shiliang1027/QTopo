/**
 * Created by qiyc on 2017/2/7.
 */
var Element = require("../Element.js");
Node.prototype = new Element();
module.exports = Node;
function Node() {
    this.type = "node";
    this.setColor = function (color) {
        if (color) {
            color = QTopo.util.transHex(color.toLowerCase());
            this.jtopo.fillColor = color;
        }
    };
    this.setName=function(name){
        if(this.attr.textPosition!="Hidden"){
            this.jtopo.text=name;
        }
    };
    this._setNode=function(config,arr){
        var temp= ["font","position","alpha","fontColor","zIndex"];
        if(arr){
            this._setAttr($.merge(temp,arr),config);
        }else{
            this._setAttr(temp,config);
        }
    }
}


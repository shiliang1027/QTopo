/**
 * Created by qiyc on 2017/2/7.
 */
Node.prototype = require("../Element.js");
module.exports = new Node();
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
        var temp= ["font","position","alpha","zIndex"];
        if(arr){
            this._setAttr($.merge(temp,arr),config);
        }else{
            this._setAttr(temp,config);
        }
    }
}


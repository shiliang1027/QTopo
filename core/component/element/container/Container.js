/**
 * Created by qiyc on 2017/2/7.
 */
Container.prototype = require("../Element.js");
module.exports = Container;
function Container() {
    this.type = "container";
    this.setColor = function (color) {
        if (color) {
            color = QTopo.util.transHex(color.toLowerCase());
            this.jtopo.fillColor = color;
        }
    };
    this.setBorder = function (border) {
        if(border.color&&border.width&&border.radius) {
            this.jtopo.borderColor = QTopo.util.transHex(border.color.toLowerCase());
            this.jtopo.borderWidth = parseInt(border.width);
            this.jtopo.borderRadius = parseInt(border.radius);
        }else{
            console.error("setBorder need params");
        }
    };
    this.setChildDragble=function(childDragble){
        this.jtopo.childDragble=childDragble;
    };
    this._setContainer = function (config, arr) {
        var temp = ["childDragble","dragable","color", "border", "font", "position", "alpha", "fontColor", "zIndex"];
        if (arr) {
            this._setAttr($.merge(temp, arr), config);
        } else {
            this._setAttr(temp, config);
        }
    }
}


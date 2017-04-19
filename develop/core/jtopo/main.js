/**
 * Created by qiyc on 2017/4/12.
 */
function Element() {
    this.elementType = "element";
    this.serializedProperties = ["elementType"];
    this.propertiesStack = [];
}
Element.prototype.removeHandler = function () {
};
Element.prototype.attr = function (name, value) {
    if (null != name && null != value){
        this[name] = value;
    }else if (null != name){
        return this[name];
    }
    return this
};
Element.prototype.save = function () {
    var a = this;
    var b = {};
    this.serializedProperties.forEach(function (properties) {
        b[properties] = a[properties];
    });
    this.propertiesStack.push(b);
};
Element.prototype.restore = function () {
    if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
        var a = this, b = this.propertiesStack.pop();
        this.serializedProperties.forEach(function (c) {
            a[c] = b[c]
        })
    }
};
/*a=this.x - this.borderWidth / 2 b=this.y - this.borderWidth / 2,*/
CanvasRenderingContext2D.prototype.JTopoRoundRect = function (x, y, width, height, borderRadius) {
    //画元素圆角边框
    if ("undefined" == typeof borderRadius) {
        borderRadius = 5;
    }
    this.beginPath();
    this.moveTo(x + borderRadius, y);
    this.lineTo(x + width - borderRadius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
    this.lineTo(x + width, y + height - borderRadius);
    this.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
    this.lineTo(x + borderRadius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
    this.lineTo(x, y + borderRadius);
    this.quadraticCurveTo(x, y, x + borderRadius, y);
    this.closePath();
};
var JTopo = {
    version: "0.4.8_01",
    zIndex_Container: 1,
    zIndex_Link: 2,
    zIndex_Node: 3,
    SceneMode: {normal: "normal", drag: "drag", edit: "edit", select: "select"}
};
JTopo.Element = Element;
module.exports = JTopo;
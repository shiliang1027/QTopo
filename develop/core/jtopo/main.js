/**
 * Created by qiyc on 2017/4/12.
 */
function Element() {
    this.initialize = function () {
        this.elementType = "element";
        this.serializedProperties = ["elementType"];
        this.propertiesStack = [];
    };
    this.removeHandler = function () {
    };
    this.attr = function (name, value) {
        if (null != name && null != value){
            this[name] = value;
        }else if (null != name){
            return this[name];
        }
        return this
    };
    this.save = function () {
        var a = this;
        var b = {};
        this.serializedProperties.forEach(function (properties) {
            b[properties] = a[properties];
        });
        this.propertiesStack.push(b);
    };
    this.restore = function () {
        if (null != this.propertiesStack && 0 != this.propertiesStack.length) {
            var a = this, b = this.propertiesStack.pop();
            this.serializedProperties.forEach(function (c) {
                a[c] = b[c]
            })
        }
    };
}

/*a=this.x - this.borderWidth / 2 b=this.y - this.borderWidth / 2,*/
CanvasRenderingContext2D.prototype.JTopoRoundRect = function (startX, startY, w_borderWidth, h_borderWidth, borderRadius) {
    //画元素圆角边框
    if ("undefined" == typeof borderRadius) {
        borderRadius = 5;
    }
    this.beginPath();
    this.moveTo(startX + borderRadius, startY);
    this.lineTo(startX + w_borderWidth - borderRadius, startY);
    this.quadraticCurveTo(startX + w_borderWidth, startY, startX + w_borderWidth, startY + borderRadius);
    this.lineTo(startX + w_borderWidth, startY + h_borderWidth - borderRadius);
    this.quadraticCurveTo(startX + w_borderWidth, startY + h_borderWidth, startX + w_borderWidth - borderRadius, startY + h_borderWidth);
    this.lineTo(startX + borderRadius, startY + h_borderWidth);
    this.quadraticCurveTo(startX, startY + h_borderWidth, startX, startY + h_borderWidth - borderRadius);
    this.lineTo(startX, startY + borderRadius);
    this.quadraticCurveTo(startX, startY, startX + borderRadius, startY);
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
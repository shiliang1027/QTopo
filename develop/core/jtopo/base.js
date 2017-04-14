/**
 * Created by qiyc on 2017/4/12.
 */
function Element() {
    this.initialize = function () {
        this.elementType = "element";
        this.serializedProperties = ["elementType"];
        this.propertiesStack = [];
        this._id = "" + (new Date).getTime();
    };
    this.distroy = function () {
    };
    this.removeHandler = function () {
    };
    this.attr = function (a, b) {
        if (null != a && null != b)this[a] = b; else if (null != a)return this[a];
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
CanvasRenderingContext2D.prototype.JTopoDashedLineTo = function (sX, sY, eX, eY, dashedPattern) {
    //画虚线
    if ("undefined" == typeof dashedPattern) {
        dashedPattern = 5;
    }
    var dX = eX - sX;
    var dY = eY - sY;
    var length = Math.floor(Math.sqrt(dX * dX + dY * dY));
    var dashL = 0 >= dashedPattern ? length : length / dashedPattern;
    var tY = dY / length * dashedPattern;
    var tX = dX / length * dashedPattern;
    this.beginPath();
    for (var m = 0; dashL > m; m++) {
        if (m % 2) {
            this.lineTo(sX + m * tX, sY + m * tY);
        } else {
            this.moveTo(sX + m * tX, sY + m * tY);
        }
    }
    this.stroke();
};
var JTopo = {
    version: "0.4.8_01",
    zIndex_Container: 1,
    zIndex_Link: 2,
    zIndex_Node: 3,
    SceneMode: {normal: "normal", drag: "drag", edit: "edit", select: "select"},
    MouseCursor: {
        normal: "default",
        pointer: "pointer",
        top_left: "nw-resize",
        top_center: "n-resize",
        top_right: "ne-resize",
        middle_left: "e-resize",
        middle_right: "e-resize",
        bottom_left: "ne-resize",
        bottom_center: "n-resize",
        bottom_right: "nw-resize",
        move: "move",
        open_hand: "default",
        closed_hand: "default"
    }
};
JTopo.Element = Element;
module.exports = JTopo;
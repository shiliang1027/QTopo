/**
 * Created by qiyc on 2017/4/12.
 */
function Element() {
    this.initialize = function () {
        this.elementType = "element", this.serializedProperties = ["elementType"], this.propertiesStack = [], this._id = "" + (new Date).getTime()
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
        var a = this, b = {};
        this.serializedProperties.forEach(function (c) {
            b[c] = a[c]
        }), this.propertiesStack.push(b)
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
CanvasRenderingContext2D.prototype.JTopoRoundRect = function (a, b, w_borderWidth, h_borderWidth, borderRadius) {
    //画元素圆角边框
    "undefined" == typeof borderRadius && (borderRadius = 5),
        this.beginPath(),
        this.moveTo(a + borderRadius, b),
        this.lineTo(a + w_borderWidth - borderRadius, b),
        this.quadraticCurveTo(a + w_borderWidth, b, a + w_borderWidth, b + borderRadius),
        this.lineTo(a + w_borderWidth, b + h_borderWidth - borderRadius),
        this.quadraticCurveTo(a + w_borderWidth, b + h_borderWidth, a + w_borderWidth - borderRadius, b + h_borderWidth),
        this.lineTo(a + borderRadius, b + h_borderWidth),
        this.quadraticCurveTo(a, b + h_borderWidth, a, b + h_borderWidth - borderRadius),
        this.lineTo(a, b + borderRadius),
        this.quadraticCurveTo(a, b, a + borderRadius, b),
        this.closePath()
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
module.exports=JTopo;
/**
 * Created by qiyc on 2017/2/7.
 */

var Node = require("./Node.js");
module.exports = {
    constructor: TextNode,
    setDefault: setDefault,
    getDefault: getDefault
};
//-
var DEFAULT = {
    position: [0, 0],
    font: {
        size: 16,
        type: '微软雅黑',
        color: "255,255,255"
    },
    border: {
        width: 0,
        radius: 0,//最大160 最小0
        color: "255,0,0"
    },
    zIndex: 200,//层级(10-999)
    alpha: 1,
    text: 'no text here',
    useType: QTopo.constant.node.TEXT
};
function setDefault(config) {
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault() {
    return QTopo.util.deepClone(DEFAULT);
}
//-
//----
//支持自动换行
var jtopoReset = {
    paint: function (a) {
        //自动换行
        var texts = this.text.split("\n");
        a.beginPath();
        a.font = this.font;
        var fontWidth = a.measureText("田").width;
        this.width = 0;
        for (var j = 0; j < texts.length; j++) {
            var width = a.measureText(texts[j]).width;
            if (width > this.width) {
                this.width = width;
            }
        }
        this.height = texts.length * fontWidth;
        a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        if (texts.length > 1) {
            for (var i = 0; i < texts.length; i++) {
                a.fillText(texts[i], -this.width / 2 + 0.15 * fontWidth, this.height / 2 + (i - texts.length + 0.85) * fontWidth);
            }
        } else {
            a.fillText(texts, -this.width / 2 + 0.03 * fontWidth, this.height / 2 - 0.15 * fontWidth);
        }
        a.closePath();
        this.paintBorder(a);
        this.paintCtrl(a);
        this.paintAlarmText(a);
    }
};
//----
function TextNode(config) {
    Node.call(this, new JTopo.TextNode());
    //函数
    this.attr = QTopo.util.extend(getDefault(), config || {});
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    reset(this);
}
QTopo.util.inherits(TextNode, Node);
//-
function setJTopo(config) {
    if (config) {
        //处理一般属性的设置
        if (!this.attr.text&&!config.text) {
            config.text = "not set text";
        }
        this._setAttr(config);
    }
}
//重写源码
function reset(node) {
    node.jtopo.paint = jtopoReset.paint;
}
//-
TextNode.prototype.getDefault = getDefault;
//-

var Node = require("./Node.js");
module.exports = {
    constructor: TextNode,
    setDefault: setDefault,
    getDefault: getDefault
};
//-
/**
 * 默认的全局配置
 *
 * 和创建传入的参数合并后合成元素的attr属性,(调用QTopo.util.extend函数进行合并)
 *
 * 仅全局中有的属性会覆盖合并,所有属性都有对应的setXXX函数
 *
 * 推荐使用元素自身的set({xx:..,xx:..})统一配置
 * @property attr {object}
 * @example
 *          默认全局参数:
 *              var DEFAULT = {
                    position: [0, 0],
                    font: {
                        size: 16,
                        type: '微软雅黑',
                        color: "255,255,255"
                    },
                    jsonId:"",
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
 */
var DEFAULT = {
    position: [0, 0],
    font: {
        size: 16,
        type: '微软雅黑',
        color: "255,255,255"
    },
    jsonId:"",
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
    this.attr = QTopo.util.extend(getDefault(), config || {});
    Node.call(this, new JTopo.TextNode());
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    reset(this);
}
QTopo.util.inherits(TextNode, Node);
//-
/**
 *  元素对属性的统一设置函数，推荐使用
 *
 *  参数可设置一项或多项,未设置部分参考全局配置
 *
 *  若传入参数的text未配置，则显示为  "not set text"
 *  @method set
 *  @param config
 *  @example
 *          实际参数参考attr内属性,只会修改有对应set函数的属性,若新增属性且添加了setXXX函数，也可用此函数配置
 *          如:name 对应 setName("..")
 *          参数格式如下
 *          config={
 *              xx:...,
 *              xx:...
 *          }
 */
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
/**
 *  获取全局设置
 *  @method getDefault
 *  @return config {object} 全局配置的克隆对象[只读]，修改该对象不会直接修改全局配置，若要修改全局配置请使用scene.setDefault
 */
TextNode.prototype.getDefault = getDefault;
//-

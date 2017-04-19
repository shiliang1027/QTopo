/**
 * @module core
 */
/**
 * 文本节点
 * @class  initTextNode
 * @constructor
 * @extends [N] Node
 * @param [config] 配置参数，无参则按全局配置创建
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
    jsonId:"",
    border: {
        width: 0,
        radius: 0,
        color: "255,0,0"
    },
    zIndex: 3,
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
function TextNode(config) {
    this.attr = QTopo.util.extend(getDefault(), config || {});
    Node.call(this, new JTopo.TextNode());
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
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
//-
/**
 *  获取全局设置
 *  @method getDefault
 *  @return config {object} 全局配置的克隆对象[只读]，修改该对象不会直接修改全局配置，若要修改全局配置请使用scene.setDefault
 *  @example
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
                    zIndex: 3,
                    alpha: 1,
                    text: 'no text here',
                    useType: QTopo.constant.node.TEXT
                };
 */
TextNode.prototype.getDefault = getDefault;
//-

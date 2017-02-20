/**
 * Created by qiyc on 2017/2/7.
 */

var Node=require("./Node.js");
module.exports = TextNode;
var defaults =function(){
    return {
        position:[0,0],
        font:{
            size:16,
            type: '微软雅黑',
            color:"255,255,255"
        },
        zIndex: 200,//层级(10-999)
        alpha: 1,
        text: 'no text here',
        useType: 'text'
    };
};
//一般节点
function TextNode(config) {
    Node.call(this,new JTopo.TextNode());
    //函数
    this.attr= QTopo.util.extend(defaults(), config || {});
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
}
QTopo.util.inherits(TextNode,Node);
function setJTopo(config) {
    if (config) {
        //处理一般属性的设置
        this._setAttr(config);
    }
}
//私有函数
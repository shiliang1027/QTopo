/**
 * Created by qiyc on 2017/2/7.
 */
Text.prototype=require("./Node.js");
module.exports = Text;
var defaults =function(){
    return {
        position:[0,0],
        font:{
            size:16,
            type: '微软雅黑'
        },
        zIndex: 200,//层级(10-999)
        alpha: 1,
        id: "",
        pid: '',
        text: 'no text here',
        type: 'text',
        weight: 1000000,
        fontColor: '255,255,255'
    };
};
//一般节点
function Text(config) {
    var self = this;
    self.attr = $.extend(true,defaults(), config || {});
    self.jtopo = new JTopo.TextNode();
    //函数
    self.set = setJTopo;
    //初始化
    self.set(self.attr);
}
function setJTopo(config) {
    if (config) {
        var self=this;
        $.extend(true, self.attr, config || {});
        //处理特殊属性的设置
        //处理一般属性的设置
        self._setNode(config,["text"]);
    }
}
//私有函数
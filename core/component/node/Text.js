/**
 * Created by qiyc on 2017/2/7.
 */
var common=require("../common.js");
module.exports = Text;
var defaults = {
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
//一般节点
function Text(config) {
    var self = this;
    config = $.extend(true,defaults, config || {});
    self.attr = config;
    self.jtopo = new JTopo.TextNode();
    //函数
    self.set = setJTopo;
    self.set(config);//初始化
}
function setJTopo(config) {
    if (config) {
        var self=this;
        $.extend(true, self.attr, config || {});
        //处理特殊属性的设置
        //处理一般属性的设置
        common.setAttr(self,["font","position","alpha","fontColor","zIndex"],config);
    }
}
//私有函数
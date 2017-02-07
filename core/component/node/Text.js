/**
 * Created by qiyc on 2017/2/7.
 */
var defaults = {
    position:[0,0],
    font: '20px 微软雅黑',
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
    config = $.extend(defaults, config || {});
    self.attr = config;
    self.jtopo = new JTopo.TextNode();
    //函数
    self.set = setJTopo;
    self.set(config);//初始化
}
module.exports = Text;

function setJTopo(attr) {
    if (attr) {
        var jtopo = this.jtopo;
        $.extend(true, jtopo, attr || {});
        if(attr.fontColor){
            setFontColor(attr.fontColor,this);
        }
        if(attr.font){
            setFont(attr.font,this);
        }
    }
}
function setFontColor(color,node) {
    node.jtopo.fontColor = QTopo.util.transHex(color.toLowerCase());
}
function setFont(font,node) {
    node.jtopo.font=font;
}
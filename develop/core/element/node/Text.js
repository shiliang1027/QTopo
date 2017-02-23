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
        useType: QTopo.constant.node.TEXT
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
    reset(this);
}
QTopo.util.inherits(TextNode,Node);
function setJTopo(config) {
    if (config) {
        //处理一般属性的设置
        this._setAttr(config);
    }
}
//重写源码
function reset(node){
    //支持自动换行
    node.jtopo.paint = function (a) {
        //自动换行
        var texts = this.text.split("\n");
        a.beginPath();
        a.font = this.font;
        var fontWidth=a.measureText("田").width;
        this.width = 0;
        if(texts.length>1){
            for(var j=0;j<texts.length;j++){
                var width=a.measureText(texts[j]).width;
                if( width>this.width){
                    this.width=width;
                }
            }
        }else{
            this.width=a.measureText(texts).width;
        }
        this.height = texts.length*fontWidth;
        a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
        if(texts.length>1){
            for(var i=0;i<texts.length;i++){
                a.fillText(texts[i], -this.width/2, fontWidth*(i-1)+5);
            }
        }else{
            a.fillText(texts, -this.width/2, 5);
        }
        a.closePath();
        this.paintBorder(a);
        this.paintCtrl(a);
        this.paintAlarmText(a);
    };
}
/**
 * @module core
 */
/**
 * 节点基类,用以继承
 * @class [N] Node
 * @constructor
 * @extends [E] Element
 * @param jtopo 元素核心的jtopo对象
 */
var Element=require("../Element.js");
module.exports =Node;

function Node(jtopo) {
    if(jtopo){
        Element.call(this,jtopo);
    }else{
        QTopo.util.error("create Node without jtopo",this);
    }
    /**
     * 链接记录
     * @property [N] links {object}
     * @param in {array} 自身为终点的链路对象
     * @param out {array} 自身为起点的链路对象
     */
    this.links={
        in:[],
        out:[]
    };
    reset(this);
}
QTopo.util.inherits(Node,Element);
function reset(element){
    var jtopoReset={
        //对节点名的绘制重写，让名称可以换行
        paintText:function (cx) {
            var text = this.text;
            if (null != text && "" != text) {
                cx.beginPath();
                cx.font = this.font;
                var fontWidth = cx.measureText("田").width;
                var maxWidth = fontWidth;
                cx.fillStyle = "rgba(" + this.fontColor + "," + this.alpha + ")";//;名称永远不透明
                //换行检测
                var texts = text.split("\n");
                for (var i = 0; i < texts.length; i++) {
                    var width = cx.measureText(texts[i]).width;
                    if (width > maxWidth) {
                        maxWidth = width;
                    }
                }
                var e = this.getTextPostion(this.textPosition, maxWidth, fontWidth,texts.length);
                for(var j = 0; j < texts.length; j++){
                    var textWidth=cx.measureText(texts[j]).width;
                    cx.fillText(texts[j], e.x+(maxWidth-textWidth)/2, e.y+j*fontWidth);
                }

                cx.closePath();
            }
        }
    };
    element.jtopo.paintText = jtopoReset.paintText;
}
/**
 *  获取元素基本类型,详细参考QTopo.constant中的类型定义
 *  @method [N] getType
 *  @return QTopo.constant.NODE
 */
Node.prototype.getType=function(){
    return QTopo.constant.NODE;
};
/**
 *  设置颜色,一般为设置自身填充颜色，节点有图片设置或为文字节点时无效
 *  @method [N] setColor
 *  @param color {string} "255,255,255"/"#ffffff"
 */
Node.prototype.setColor = function (color) {
    if (color) {
        color = QTopo.util.transHex(color.toLowerCase());
        this.jtopo.fillColor = color;
    }
    this.attr.color=this.jtopo.fillColor;
};
/**
 *  设置显示名称,删减首尾空格符
 *
 *  文字节点应调用setText处理文字显示
 *
 *  其他节点应用该函数处理名称，否则会出现隐藏后再显示而名称不符的Bug
 *  @method [N] setName
 *  @param name {string}
 */
Node.prototype.setName=function(name){
    if(name){
        if (this.attr.namePosition != "hide") {
            this.jtopo.text = (name+"").trim();
        }
        this.attr.name = (name+"").trim();
    }
};
/**
 *  单个对象的属性提取
 *  @method [N] toJson
 *  @return {object}
 */
Node.prototype.toJson=function(){
    var json=$.extend({},this.attr);
    json.extra=$.extend({},this.extra);
    return json;
};

/**
 * Created by qiyc on 2017/2/7.
 */
var Node=require("./Node.js");
NormalNode.prototype =new Node();
module.exports = NormalNode;
var defaults = function () {
    return {
        image: "",
        size: [30, 30],
        name: "node",
        alpha: 1,
        position: [0, 0],
        font: {
            size: 16,
            type: '微软雅黑',
            color: "255,255,255"
        },
        zIndex: 200,//层级(10-999)
        color: JTopo.util.randomColor(),
        textPosition: 'bottom',//Bottom_Center Top_Center Middle_Left Middle_Right Hidden
        type: 'normal',
        alarm: {
            show: false,
            text: "",
            color: "255,255,255",
            font: {
                size: 16,
                type: "微软雅黑"
            }
        }
    }
};
//一般节点
function NormalNode(config) {
    var self = this;
    self.attr = QTopo.util.extend(defaults(), config || {});
    self.jtopo = new JTopo.Node();
    //封装对象之间相互保持引用
    self.jtopo.qtopo = self;
    //函数
    self.set = setJTopo;
    //初始化
    self.set(self.attr);
}
function setJTopo(config) {
    if (config) {
        var self = this;
        //处理一般属性的设置
        this._setAttr(config);
        //处理特殊属性的设置
    }
}
NormalNode.prototype.setAlarm=function(config) {
    var jtopo = this.jtopo;
    var alarm=this.attr.alarm;
    if (config.show) {
        jtopo.alarm = config.text || "";
        alarm.text=jtopo.alarm;
        jtopo.alarmColor = QTopo.util.transHex(config.color.toLowerCase());
        alarm.color=jtopo.alarmColor;
        jtopo.alarmAlpha = 1;
        var size=alarm.font.size;
        var font=alarm.font.type;
        if(config.font&&config.font.size){
            size=config.font.size;
        }
        if(config.font&&config.font.type){
            font=config.font.type;
        }
        jtopo.alarmFont =  size+ 'px ' + font;
        alarm.font.size=size;
        alarm.font.type=font;
    } else {
        jtopo.alarm = null;
    }
};
NormalNode.prototype.setImage=function(image) {
    this.jtopo.setImage(image);
    this.attr.image=image;
};

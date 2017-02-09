/**
 * Created by qiyc on 2017/2/7.
 */
Normal.prototype=require("./Node.js");
module.exports = Normal;
var defaults = function () {
    return {
        image: "img/mo/wlan_4.png",
        size: [64, 64],
        name: "node",
        alpha: 1,
        position: [0, 0],
        font: {
            size: 16,
            type: '微软雅黑'
        },
        weight: 10,
        zIndex: 200,//层级(10-999)
        id: "",
        pid: '',
        color: JTopo.util.randomColor(),
        textPosition: 'Bottom_Center',//Bottom_Center Top_Center Middle_Left Middle_Right Hidden
        type: 'normal',
        fontColor: '255,255,255'
    }
};
//一般节点
function Normal(config) {
    var self = this;
    self.attr = $.extend(true, defaults(), config || {});
    self.jtopo = new JTopo.Node();
    //函数
    self.set = setJTopo;
    //初始化
    self.set(self.attr);
}
function setJTopo(config) {
    if (config) {
        var self = this;
        //处理一般属性的设置
        self._setNode(config,["name","textPosition","size","color"]);
        //处理特殊属性的设置
        if (config.image) {
            setImage.call(self, config.image);
        }
    }
}

//私有函数
function setImage(image) {
    this.jtopo.setImage(image);
}
function drawAlarm(set) {
    if (this.attr.scene) {
        var config = QTopo.config;
        var color = set.color ? set.color.toLowerCase() : (this.attr.alarmLevel ? config.alarm.color[this.attr.alarmLevel - 1] : '0,0,255');
        this.alarm = set.text || (this.alarm || 'No Alarm Text!');
        this.alarmColor = QTopo.util.transHex(color);
        this.alarmAlpha = 1;
        this.alarmFont = (set.size || 20) + 'px ' + (set.font || '微软雅黑');
        this.attr.alarmLevel = set.level || (this.attr.alarmLevel || config.alarm.color.length);
        this.attr.alarmColor = color;
        shadowFlash(this, this.alarmColor);
    }
}
function shadowFlash(node, color) {
    node.shadow = true;
    node.shadowOffsetX = 0;
    node.shadowOffsetY = 0;
    node.shadowColor = "rgba(" + color + ",1)";
    node.shadowBlur = 10;
    flash(node, true);
}
function flash(node, flag) {
    if (node.attr.flash) {
        clearInterval(node.attr.flash);
    }
    node.attr.flash = setInterval(function () {
        if (flag) {
            node.shadowBlur += 10;
            if (node.shadowBlur >= 100) {
                flag = false;
            }
        }
        else {
            node.shadowBlur -= 10;
            if (node.shadowBlur <= 10) {
                flag = true;
            }
        }
    }, 100);
}
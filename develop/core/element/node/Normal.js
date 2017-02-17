/**
 * Created by qiyc on 2017/2/7.
 */
var Node=require("./Node.js");
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
    Node.call(this,new JTopo.Node());
    this.attr = QTopo.util.extend(defaults(), config || {});
    //告警闪烁 ...paintChilds函数内,638行附近调用
    this.jtopo.alarmFlash=alarmFlash;
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
}
QTopo.util.inherits(NormalNode,Node);
function setJTopo(config) {
    if (config) {
        //处理一般属性的设置
        this._setAttr(config);
        //处理特殊属性的设置
    }
}
NormalNode.prototype.setImage=function(image) {
    if(image){
        this.jtopo.setImage(image);
        this.attr.image=image;
    }
};
NormalNode.prototype.setAlarm=function(config) {
    var jtopo = this.jtopo;
    alarmAttr(jtopo,this.attr.alarm,config);
};
function alarmAttr(jtopo,alarm,config){
    if(typeof config.show=="undefined"){
        config.show=alarm.show;
    }
    if (config.show) {
        jtopo.shadow = true;
        jtopo.alarm = config.text || "";
        alarm.text=jtopo.alarm;
        if(config.color){
            jtopo.alarmColor = QTopo.util.transHex(config.color.toLowerCase());
            alarm.color=jtopo.alarmColor;
        }
        jtopo.alarmAlpha = 1;
        var size=alarm.font.size;
        var font=alarm.font.type;
        if(config.font&&$.isNumeric(config.font.size)){
            size=config.font.size;
        }
        if(config.font&&config.font.type){
            font=config.font.type;
        }
        jtopo.alarmFont =  size+ 'px ' + font;
        alarm.font.size=size;
        alarm.font.type=font;
        toggleAlarmFlash(jtopo,true);
    } else {
        jtopo.alarm = null;
        toggleAlarmFlash(jtopo,false);
    }
    alarm.show=config.show;
}
function toggleAlarmFlash(node,show){
    //切换闪烁
    if(show){
        node.shadowOffsetX = 0;
        node.shadowOffsetY = 0;
        node.shadowColor = "rgba(" + node.alarmColor + ",1)";
        node.shadowBlur = 10;
        node.allowAlarmFlash=true;
    }else{
        node.shadowOffsetX = 3;
        node.shadowOffsetY = 6;
        node.shadowColor="rgba(0,0,0,0.1)";
        node.shadowBlur = 10;
        node.allowAlarmFlash=false;
    }
}
function alarmFlash() {
    //插入源码部分代码
    if(this.shadow&&this.allowAlarmFlash){
        if(typeof this.shadowDirection=="undefined"){
            this.shadowDirection=true;
        }
        move(this);
        function move(node){
            if (node.shadowDirection) {
                node.shadowBlur += 5;
                if(node.shadowBlur>100){
                    node.shadowDirection=false;
                }
            }
            else {
                node.shadowBlur -= 5;
                if(node.shadowBlur<=10){
                    node.shadowDirection=true;
                }
            }
        }
    }
}
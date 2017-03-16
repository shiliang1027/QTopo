/**
 * Created by qiyc on 2017/2/7.
 */
var Node=require("./Node.js");
module.exports = {
    constructor:ImageNode,
    setDefault:setDefault,
    getDefault:getDefault
};
//-
var DEFAULT= {
    image: "",
    size: [60, 60],
    name: "node",
    alpha: 1,
    position: [0, 0],
    font: {
        size: 16,
        type: '微软雅黑',
        color: "255,255,255"
    },
    border:{
        width:0,
        radius:0,//最大160 最小0
        color:"255,0,0"
    },
    zIndex: 200,//层级(10-999)
    color: JTopo.util.randomColor(),
    namePosition: 'bottom',//Bottom_Center Top_Center Middle_Left Middle_Right Hidden
    useType: QTopo.constant.node.IMAGE,
    alarm: {
        show: false,
        text: "",
        color: "255,255,255",
        font: {
            size: 16,
            type: "微软雅黑"
        }
    }
};
function setDefault(config){
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault(){
    return QTopo.util.deepClone(DEFAULT);
}
//-
//------
    var jtopoReset={
        paint:function (cx) {
            alarmFlash.call(this,cx);
            if (this.image) {
                var b = cx.globalAlpha;
                cx.globalAlpha = this.alpha;
                if(null != this.alarmImage&& null != this.alarm ){
                    cx.drawImage(this.alarmImage, -this.width / 2, -this.height / 2, this.width, this.height)
                }else{
                    cx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height)
                }
                cx.globalAlpha = b;
            } else{
                cx.beginPath();
                cx.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
                if(null == this.borderRadius || 0 == this.borderRadius){
                    cx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
                }else{
                    cx.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius);
                }
                cx.fill();
                cx.closePath();
            }
            this.paintText(cx);
            this.paintBorder(cx);
            this.paintCtrl(cx);
            this.paintAlarmText(cx);
        }
    };
//------
function ImageNode(config) {
    Node.call(this,new JTopo.Node());
    this.attr = QTopo.util.extend(getDefault(), config || {});
    //告警闪烁 ...paintChilds函数内,638行附近调用
    this.jtopo.alarmFlash=alarmFlash;
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    reset(this);
}
QTopo.util.inherits(ImageNode,Node);
//-
function setJTopo(config) {
    if (config) {
        //处理一般属性的设置
        this._setAttr(config);
        //处理特殊属性的设置
    }
}
function reset(node){
    node.jtopo.paint=jtopoReset.paint;
}

//-
ImageNode.prototype.setImage=function(image) {
    if(image){
        this.jtopo.setImage(image);
        this.attr.image=image;
    }
};
ImageNode.prototype.getDefault=getDefault;
//--
ImageNode.prototype.setAlarm=function(config) {
    alarmAttr(this,this.attr.alarm,config);
};
function alarmAttr(qtopo,alarm,config){
    var jtopo=qtopo.jtopo;
    if(typeof config.show=="undefined"){
        config.show=alarm.show;
    }
    if ((typeof config.show=="boolean"&&config.show)||(config.show=="true")) {
        qtopo.setAlpha(1);
        jtopo.shadow = true;
        jtopo.alarm = config.text || "";
        alarm.text=jtopo.alarm;
        if(config.color){
            jtopo.alarmColor = QTopo.util.transHex(config.color.toLowerCase());
            alarm.color=jtopo.alarmColor;
        }
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
//插入源码部分,启用告警后每次绘画执行修改阴影
function alarmFlash(cx) {
    if(this.shadow&&this.allowAlarmFlash){
        if(typeof this.shadowDirection=="undefined"){
            this.shadowDirection=true;
        }
        move(this);
        cx.shadowBlur = this.shadowBlur;
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
//--
//-
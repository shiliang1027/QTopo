/**
 * @module core
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
    jsonId:"",
    border:{
        width:0,
        radius:0,//最大160 最小0
        color:"255,0,0"
    },
    zIndex: 200,//层级(10-999)
    color: JTopo.util.randomColor(),
    namePosition: 'bottom',
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
    //重写绘制函数，优化告警效果
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
/**
 * 形状节点
 * @class  ShapeNode
 * @constructor
 * @extends [N] Node
 * @param [config] 配置参数，无参则按全局配置创建
 */
function ShapeNode(config) {
    this.attr = QTopo.util.extend(getDefault(), config || {});
    Node.call(this,new JTopo.Node());
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    reset(this);
}
QTopo.util.inherits(ImageNode,Node);
//-
/**
 *  元素对属性的统一设置函数，推荐使用
 *
 *  参数可设置一项或多项,未设置部分参考全局配置
 *  @method set
 *  @param config
 *  @example
 *          实际参数参考attr内属性,只会修改有对应set函数的属性,若新增属性且添加了setXXX函数，也可用此函数配置
 *          如:name 对应 setName("..")
 *          参数格式如下
 *          config={
 *              xx:...,
 *              xx:...
 *          }
 */
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
/**
 *  获取全局设置
 *  @method getDefault
 *  @return config {object} 全局配置的克隆对象[只读]，修改该对象不会直接修改全局配置，若要修改全局配置请使用scene.setDefault
 *  @example
 *          默认全局参数:
 *              var DEFAULT= {
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
                        jsonId:"",
                        border:{
                            width:0,
                            radius:0,//最大160 最小0
                            color:"255,0,0"
                        },
                        zIndex: 200,//层级(10-999)
                        color: JTopo.util.randomColor(),
                        namePosition: 'bottom',
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
 */
ImageNode.prototype.getDefault=getDefault;
//--
/**
 *  设置告警
 *
 *  参数可设置一项或多项,未设置部分参考全局配置
 *  @method setAlarm
 *  @param config {object}
 *  @example
 *          config={
 *              show: 是否显示告警{boolean},
                text: 节点右上角告警板中内容,可为空{string},
                color: 告警颜色{string} "255,255,255"/"#ffffff",
                font: {
                    size: 告警字体大小{number},
                    type: 告警字体类型{string} 如"微软雅黑"
                }
 *          }
 */
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
        alarm.text=jtopo.alarm = config.text || "";
        configAlarmColor(jtopo,alarm,config);
        configAlarmFont(jtopo,alarm,config);
        toggleAlarmFlash(jtopo,true);
    } else {//关闭告警
        jtopo.alarm = null;
        toggleAlarmFlash(jtopo,false);
    }
    alarm.show=config.show;

    function configAlarmColor(jtopo,alarm,config){
        if(config.color){
            jtopo.alarmColor = QTopo.util.transHex(config.color.toLowerCase());
            alarm.color=jtopo.alarmColor;
        }
    }
    function configAlarmFont(jtopo,alarm,config){
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
    }
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
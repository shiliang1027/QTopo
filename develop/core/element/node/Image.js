/**
 * @module core
 */
/**
 * 图形节点
 * @class  ImageNode
 * @constructor
 * @extends [N] Node
 * @param [config] 配置参数，无参则按全局配置创建
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
    draggable: true,
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
function ImageNode(config) {
    this.attr = QTopo.util.extend(getDefault(), config || {});
    Node.call(this,new JTopo.Node());
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
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
//-
/**
 *  设置节点图片,与setColor冲突，设了图片则颜色无效
 *
 *  未设置图片则显示方形节点，内部填充颜色
 *  @method setImage
 *  @param image {string} 图片相对路径
 */
ImageNode.prototype.setImage=function(image) {
    if(image){
        this.jtopo.setImage(image);
        this.attr.image=image;
    }
};
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
//--
//-
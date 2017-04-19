/**
 * @module core
 */
var Node=require("./Node.js");
module.exports = {
    constructor:ShapeNode,
    setDefault:setDefault,
    getDefault:getDefault
};
//-
var DEFAULT= {
    size: [200, 100],
    name: "shape",
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
        radius:0,
        color:"255,0,0"
    },
    shapeType:'ellipse',
    zIndex: 3,
    color: JTopo.util.randomColor(),
    namePosition: 'bottom',
    useType: QTopo.constant.node.SHAPE
};
function setDefault(config){
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault(){
    return QTopo.util.deepClone(DEFAULT);
}
//-
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
}
QTopo.util.inherits(ShapeNode,Node);
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
                        zIndex: 3,
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
ShapeNode.prototype.getDefault=getDefault;
//-
ShapeNode.prototype.setShapeType=function(type){
    var jtopo=this.jtopo;
    switch (type){
        case 'ellipse':
            this.attr.shapeType='ellipse';
            jtopo.paint=paintEllipse;
            break;
    }
};
function paintEllipse(ctx){
    ctx.save();
    ctx.beginPath();
    var radiusX = (this.width/0.75)/2,
        radiusY = this.height/2;
    ctx.moveTo(0, -radiusY);
    ctx.bezierCurveTo(radiusX, -radiusY, radiusX, radiusY, 0, radiusY);//右半边
    ctx.bezierCurveTo(-radiusX, radiusY, -radiusX, -radiusY, 0, -radiusY);//左半边
    ctx.closePath();
    if(this.jtopo.gradien){
        ctx.fillStyle=this.jtopo.gradien;
    }else{
        ctx.fillStyle = 'rgba('+this.fillColor+"," + this.alpha + ")";
    }
    ctx.fill();
    ctx.restore();
    this.paintCtrl(ctx);
    this.paintAlarmText(ctx);
    this.paintText(ctx);
}
//-
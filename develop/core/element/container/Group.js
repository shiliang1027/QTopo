/**
 * @module core
 */
/**
 * 图形节点
 * @class  Group
 * @constructor
 * @extends [C] Container
 * @param [config] 配置参数，无参则按全局配置创建
 */
var Container=require("./Container.js");
module.exports =  {
    constructor:Group,
    setDefault:setDefault,
    getDefault:getDefault
};
//-
var DEFAULT = {
        name: 'group',
        font:{
            size:16,
            type:"微软雅黑",
            color:'255,255,255'
        },
        color: '10,10,100',
        alpha: 0.5,
        draggable: true,
        zIndex: 10,
        jsonId:"",
        border:{
            width:0,
            radius:30,//最大160 最小0
            color:"255,0,0"
        },
        size:[500,500],
        position:[0,0],
        namePosition: 'bottom',//Bottom_Center Top_Center Middle_Left Middle_Right Hidden,
        layout: {
            type:"default"
        },
        children:{
            showLink: false,
            showName: true,
            draggable: true
        },
        useType:QTopo.constant.container.GROUP
};
function setDefault(config){
    QTopo.util.extend(DEFAULT, config || {});
}
function getDefault(){
    return QTopo.util.deepClone(DEFAULT);
}
//-
//----
//----
function Group(config) {
    this.attr =  QTopo.util.extend(getDefault(), config || {});
    Container.call(this, new JTopo.Container());
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
}
QTopo.util.inherits(Group,Container);
//-
var fixedLayout=function(group, children){
    if(this.qtopo){
        if(group.width==0||group.height==0){
            group.width=this.qtopo.attr.size[0];
            group.height=this.qtopo.attr.size[1];
        }
        if(group.width>0&&group.height>0){
            var groupBound=group.getBound();
            children.map(function(child){
                resetLocation(groupBound,child);
            });
        }else{
            //若未设置高宽则运行一次自动布局设置高宽
            JTopo.Layout.AutoBoundLayout()(group, children);
        }
    }else{
        QTopo.util.error("the container not wrap with qtopo",this);
    }
};
function resetLocation(groupBound,child){
    var childBound=child.getBound();
    var location=child.getLocation();
    if(childBound.bottom>groupBound.bottom){
        location.y=groupBound.bottom-childBound.height;
    }
    if(childBound.right>groupBound.right){
        location.x=groupBound.right-childBound.width;
    }
    if(childBound.left<groupBound.left){
        location.x=groupBound.left;
    }
    if(childBound.top<groupBound.top){
        location.y=groupBound.top;
    }
    child.setLocation(location.x,location.y);
}
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
        var self=this;
        self._setAttr(config);
    }
}
//-
/**
 *
 *  @method setLayout
 *  @param layout {object} 图片相对路径
 *      @param layout.type {string} flow(固定宽高,组员流式布局), grid(固定宽高,组员行列布局), fixed(固定宽高,组员可拖动), default(宽高自适应)
 *      @param [layout.row] {number} 当type=flow时,用以设置水平间隔 ,当type=grid时,用以设置行数
 *      @param [layout.column] {number} 当type=flow时,用以设置垂直间隔 ,当type=grid时,用以设置列数
 */
Group.prototype.setLayout=function(layout){
    var selected;
    if (layout) {
        switch (layout.type) {
            case 'flow':
                // 流式布局（水平,垂直间隔)
                selected = JTopo.layout.FlowLayout(parseInt(layout.row), parseInt(layout.column));
                this.attr.layout=layout;
                break;
            case 'grid':
                // 网格布局(行,列)
                var rows=parseInt(layout.row);
                var columns=parseInt(layout.column);
                if(rows*columns<this.children.length){
                    QTopo.util.error("GridLayout's row*column need bigger than group's children length");
                    columns=rows= Math.ceil(Math.sqrt(todo.target.children.length));
                }
                selected = JTopo.layout.GridLayout(rows,columns);
                this.attr.layout=layout;
                break;
            case 'fixed':
                //固定长宽布局
                selected = fixedLayout;
                this.attr.layout=layout;
                break;
            default:
                selected = JTopo.Layout.AutoBoundLayout();
                this.attr.layout={};
                this.attr.layout.type="default";
        }
    } else {
        selected = JTopo.Layout.AutoBoundLayout();
        this.attr.layout={};
        this.attr.layout.type="default";
    }
    this.jtopo.layout = selected;
};
/**
 *  获取全局设置
 *  @method getDefault
 *  @return config {object} 全局配置的克隆对象[只读]，修改该对象不会直接修改全局配置，若要修改全局配置请使用scene.setDefault
 *  @example
 *          默认全局参数:
 *              var DEFAULT = {
                                name: 'group',
                                font:{
                                    size:16,
                                    type:"微软雅黑",
                                    color:'255,255,255'
                                },
                                color: '10,10,100',
                                alpha: 0.5,
                                draggable: true,
                                zIndex: 10,
                                jsonId:"",
                                border:{
                                    width:0,
                                    radius:30,//最大160 最小0
                                    color:"255,0,0"
                                },
                                size:[500,500],
                                position:[0,0],
                                namePosition: 'bottom',//Bottom_Center Top_Center Middle_Left Middle_Right Hidden,
                                layout: {
                                    type:"default"
                                },
                                children:{//待定设置，未完全实现
                                    showLink: false,
                                    showName: true,
                                    draggable: true
                                },
                                useType:QTopo.constant.container.GROUP
                        };
 */
Group.prototype.getDefault=getDefault;
//-
/**
 * Created by qiyc on 2017/2/8.
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
        dragable: true,
        zIndex: 10,
        border:{
            width:0,
            radius:30,//最大160 最小0
            color:"255,0,0"
        },
        size:[0,0],
        position:[0,0],
        namePosition: 'bottom',//Bottom_Center Top_Center Middle_Left Middle_Right Hidden,
        layout: "",
        children:{
            showLink: false,
            showName: true,
            dragble: true
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
    Container.call(this, new JTopo.Container());
    this.attr =  QTopo.util.extend(getDefault(), config || {});
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
}
QTopo.util.inherits(Group,Container);
//-
var fixedLayout=function(group, children){
    if(this.qtopo){
        if(group.width>0&&group.height>0){
            var groupBound=group.getBound();
            children.map(function(child){
                resetLocation(groupBound,child);
            });
        }else{
            JTopo.Layout.AutoBoundLayout()(group, children);
            QTopo.util.error("the fixedLayout need set size,now change to defaultLayout");
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
function setJTopo(config) {
    if (config) {
        var self=this;
        self._setAttr(config);
    }
}
//-
Group.prototype.setLayout=function(layout){
    var selected;
    if (layout) {
        switch (layout.type) {
            case 'flow':
                // 流式布局（水平,垂直间隔)
                selected = JTopo.layout.FlowLayout(layout.row, layout.column);
                this.attr.layout=layout;
                break;
            case 'grid':
                // 网格布局(行,列)
                selected = JTopo.layout.GridLayout(layout.row, layout.column);
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
        this.attr.layout.type="set";
    }
    this.jtopo.layout = selected;
};
Group.prototype.getDefault=getDefault;
//-
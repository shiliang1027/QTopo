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
        serializeId:"",
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
Group.prototype.getDefault=getDefault;
//-
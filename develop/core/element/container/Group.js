/**
 * Created by qiyc on 2017/2/8.
 */
var Container=require("./Container.js");
module.exports = Group;
//曲线
var defaults = function () {
    return {
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
        textPosition: 'bottom',//Bottom_Center Top_Center Middle_Left Middle_Right Hidden,
        layout: "",
        children:{
            showLink: false,
            showName: true,
            dragble: true
        },
        useType:"group"
    };
};

function Group(config) {
    Container.call(this, new JTopo.Container());
    this.attr =  QTopo.util.extend(defaults(), config || {});
    //函数
    this.set = setJTopo;
    //初始化
    this.set(this.attr);
    //改写源码绘制曲线,可由curveOffset指定弧度
    reset(this);
}
QTopo.util.inherits(Group,Container);
var defaultLayout = function (container, children) {
    if (children.length > 0) {
        var left = 1e7,
            right = -1e7,
            top = 1e7,
            bottom = -1e7,
            width = right - left,
            height = bottom - top;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            child.x <= left && (left = child.x);
            (child.x+child.width) >= right && (right = child.x+child.width);
            child.y <= top && (top = child.y);
            (child.y+child.height) >= bottom && (bottom = child.y+child.height);
            width = right - left;
            height = bottom - top;
        }
        container.x = left;
        container.y = top;
        container.width = width;
        container.height = height;
    }
};
function setJTopo(config) {
    if (config) {
        var self=this;
        self._setAttr(config);
    }
}
function reset(group) {
    group.jtopo.layout=defaultLayout;
}
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
            default:
                selected = defaultLayout;
                this.attr.layout={};
                this.attr.layout.type="set";
        }
    } else {
        selected = defaultLayout;
        this.attr.layout={};
        this.attr.layout.type="set";
    }
    this.jtopo.layout = selected;
};
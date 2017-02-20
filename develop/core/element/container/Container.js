/**
 * Created by qiyc on 2017/2/7.
 */
var Element = require("../Element.js");
module.exports = Container;
function Container(jtopo) {
    if(jtopo){
        Element.call(this,jtopo);
    }else{
        console.error("create Container without jtopo",this);
    }
    this.children=[];
    this.links={
        in:[],
        out:[]
    };
}
QTopo.util.inherits(Container,Element);
Container.prototype.setName = function (name) {
    if (name) {
        if (this.attr.textPosition != "hide") {
            this.jtopo.text = name;
        }
        this.attr.name = name;
    }
};
Container.prototype.add = function (element) {
    if (!$.isArray(this.children)) {
        this.children = [];
    }
    if (element.jtopo && this.children.indexOf(element) < 0) {
        this.children.push(element);
        element.parent=this;
        this.jtopo.add(element.jtopo);
    }
};
Container.prototype.remove = function (element) {
    if ($.isArray(this.children) && this.children.indexOf(element) > 0) {
        this.children.splice(this.children.indexOf(element), 1);
        element.parent=null;
        this.jtopo.remove(element.jtopo);
    }
};
Container.prototype.getChildren = function () {
    var children = [];
    var self = this;
    if (self.jtopo && self.jtopo.childs) {
        $.each(self.jtopo.childs, function (i, v) {
            if (v.qtopo) {
                children.push(v.qtopo);
            } else {
                console.error(this, "the child not wraped by qtopo", v);
            }
        });
    }
    this.children = children;
    return children;
};
Container.prototype.getType = function () {
    return QTopo.constant.CONTAINER;
};
Container.prototype.setColor = function (color) {
    if (color) {
        color = QTopo.util.transHex(color.toLowerCase());
        this.jtopo.fillColor = color;
    }
    this.attr.color = this.jtopo.fillColor;
};
Container.prototype.setBorder = function (border) {
    var jtopo = this.jtopo;
    if (border.color) {
        jtopo.borderColor = QTopo.util.transHex(border.color.toLowerCase());
    }
    if ($.isNumeric(border.width)) {
        jtopo.borderWidth = parseInt(border.width);
    }
    if ($.isNumeric(border.radius)) {
        jtopo.borderRadius = parseInt(border.radius);
    }
    this.attr.border.color = jtopo.borderColor;
    this.attr.border.width = jtopo.borderWidth;
    this.attr.border.raidus = jtopo.borderRadius;
};
Container.prototype.setChildren = function (children) {
    var jtopo = this.jtopo;
    if (children) {
        this.jtopo.childDragble = typeof children.dragble == "boolean" ? children.dragble : true;
    }
    this.attr.children.dragble = jtopo.childDragble;
};
Container.prototype.getLinks = function () {
    var jtopo = this.jtopo;
    var links = {
        in: [],
        out: []
    };
    if (jtopo.inLinks && jtopo.inLinks.length > 0) {
        for (var i = 0; i < jtopo.inLinks.length; i++) {
            links.in.push(jtopo.inLinks[i].qtopo);
        }
    }
    if (jtopo.outLinks && jtopo.outLinks.length > 0) {
        for (var j = 0; j < jtopo.outLinks.length; j++) {
            links.out.push(jtopo.outLinks[j].qtopo);
        }
    }
    this.links = links;
    return links;
};
Container.prototype.toggle=function(){

};

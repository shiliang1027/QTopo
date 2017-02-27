/**
 * Created by qiyc on 2017/2/7.
 */
var Element = require("../Element.js");
module.exports = Container;
function Container(jtopo) {
    if (jtopo) {
        Element.call(this, jtopo);
    } else {
        console.error("create Container without jtopo", this);
    }
    this.children = [];
    this.links = {
        in: [],
        out: []
    };
    reset(this);
}
QTopo.util.inherits(Container, Element);
function reset(element) {
    element.jtopo.paintText = function (a) {
        var text = this.text;
        if (null != text && "" != text) {
            a.beginPath();
            a.font = this.font;
            var fontWidth = a.measureText("田").width;
            var maxWidth = fontWidth;
            a.fillStyle = "rgba(" + this.fontColor + ",1)"; //", " + this.alpha + ")";名称永远不透明
            //换行检测
            var texts = text.split("\n");
            for (var i = 0; i < texts.length; i++) {
                var width = a.measureText(texts[i]).width;
                if (width > maxWidth) {
                    maxWidth = width;
                }
            }
            var e = this.getTextPostion(this.textPosition, maxWidth, fontWidth);
            for (var j = 0; j < texts.length; j++) {
                var textWidth = a.measureText(texts[j]).width;
                a.fillText(texts[j], e.x + (maxWidth - textWidth) / 2, e.y + j * fontWidth);
            }

            a.closePath();
        }
    };
}
Container.prototype.setName = function (name) {
    if (name) {
        if (this.attr.namePosition != "hide") {
            this.jtopo.text = name.trim();
        }
        this.attr.name = name.trim();
    }
};
Container.prototype.add = function (element) {
    if (!$.isArray(this.children)) {
        this.children = [];
    }
    if (element.jtopo && this.children.indexOf(element) < 0) {
        this.children.push(element);
        element.parent = this;
        this.jtopo.add(element.jtopo);
        if (this.attr.children && typeof this.attr.children.dragble == "boolean") {
            //若分组不允许移动组内元素，手动设置元素不可移动
            element.setDragable(this.attr.children.dragble);
        }
    }
};
Container.prototype.remove = function (element) {
    if ($.isArray(this.children) && this.children.indexOf(element) > 0) {
        this.children.splice(this.children.indexOf(element), 1);
        element.parent = null;
        this.jtopo.remove(element.jtopo);
        //移除元素，应手动设回元素可移动
        element.setDragable(true);
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
Container.prototype.setChildren = function (children) {
    var jtopo = this.jtopo;
    if (children) {
        if (typeof children.dragble == "boolean") {
            this.jtopo.childDragble = children.dragble;
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].setDragable(children.dragble);
            }
        }
    }
    this.attr.children.dragble = jtopo.childDragble;
};
Container.prototype.getLinks = function () {
    var jtopo = this.jtopo;
    if (!this.links) {
        this.links = {};
    }
    var links = this.links;
    links.in = [];
    links.out = [];
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
    return links;
};
Container.prototype.toggle = function (flag) {
    if (this.toggleTo) {
        var gJtopo = this.jtopo;
        var nJtopo = this.toggleTo.jtopo;
        var todo = typeof flag == "boolean" ? flag : gJtopo.visible;
        if (todo) {
            //缩放
            this.hide();
            this.toggleTo.show();
            this.toggleTo.setPosition([gJtopo.cx - nJtopo.width / 2, gJtopo.cy - nJtopo.height / 2]);
        } else {
            //展开
            this.show();
            this.toggleTo.hide();
            this.setPosition([nJtopo.cx - gJtopo.width / 2, nJtopo.cy - gJtopo.height / 2]);
        }
    }
};

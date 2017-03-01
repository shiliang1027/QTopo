/**
 * Created by qiyc on 2017/2/7.
 */
module.exports = Element;
function Element(jtopo) {
    if (jtopo) {
        this.jtopo = jtopo;
        jtopo.qtopo = this;
        reset(this);
    }
    //设置额外属性处理对象
    this.extra={};
}
function reset(element) {
    //同步位置属性
    var preSetLocation = element.jtopo.setLocation;
    element.jtopo.setLocation = function (a, b) {
        if (this.qtopo && this.qtopo.attr && this.qtopo.attr.position) {
            this.qtopo.attr.position[0] = a;
            this.qtopo.attr.position[1] = b;
        }
        preSetLocation.call(this, a, b);
        return this;
    };
}
Element.prototype.show = function () {
    switch (this.getType()) {
        case QTopo.constant.NODE:
            toggleNode.call(this, true);
            break;
        case QTopo.constant.CONTAINER:
            toggleContainer.call(this, true);
            break;
        case QTopo.constant.LINK:
            toggleLink.call(this, true);
    }
};
Element.prototype.hide = function () {
    switch (this.getType()) {
        case QTopo.constant.NODE:
            toggleNode.call(this, false);
            break;
        case QTopo.constant.CONTAINER:
            toggleContainer.call(this, false);
            break;
        case QTopo.constant.LINK:
            toggleLink.call(this, false);
    }
};
Element.prototype.setUseType = function (type) {
    this.attr.useType = type;
};
Element.prototype.getUseType = function () {
    return this.attr.useType;
};
Element.prototype.setText = function (text) {
    if (text) {
        this.jtopo.text = text.trim();
    }
    this.attr.text = this.jtopo.text;
};
Element.prototype.setBorder = function (border) {
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
Element.prototype.on = function (name, fn) {
    this.jtopo.addEventListener(name, function (e) {
        if (e.target && e.target.qtopo) {
            fn(e, e.target.qtopo);
        } else {
            fn(e);
        }
    });
};
Element.prototype.off = function (name, fn) {
    this.jtopo.removeEventListener(name);
};
Element.prototype.setZIndex = function (zIndex) {
    if ($.isNumeric(zIndex)) {
        this.jtopo.zIndex = parseInt(zIndex);
    }
    this.attr.zIndex = this.jtopo.zIndex;
};
Element.prototype.setFont = function (font) {
    var type = this.attr.font.type;
    var size = this.attr.font.size;
    if (font) {
        if ($.isNumeric(font.size)) {
            size = font.size;
        }
        if (font.type) {
            type = font.type;
        }
        this.jtopo.font = (size ? size : 14) + "px " + type;
        if (font.color) {
            this.jtopo.fontColor = QTopo.util.transHex(font.color.toLowerCase());
        }
    }
    this.attr.font.type = type;
    this.attr.font.size = size;
    this.attr.font.color = this.jtopo.fontColor;
};
Element.prototype.setAlpha = function (alpha) {
    if ($.isNumeric(alpha) && alpha <= 1 && alpha > 0) {
        this.jtopo.alpha = alpha;
    } else {
        this.jtopo.alpha = 1;
    }
    this.attr.alpha = this.jtopo.alpha;
};
//已重写同步
Element.prototype.setPosition = function (position) {
    if ($.isArray(position) && position.length >= 2) {
        if ($.isNumeric(position[0]) && $.isNumeric(position[1])) {
            this.jtopo.setLocation(parseInt(position[0]), parseInt(position[1]));
        }
    }
};
Element.prototype.setSize = function (size) {
    if ($.isArray(size) && $.isNumeric(size[0]) && $.isNumeric(size[1])) {
        this.jtopo.setSize(parseInt(size[0]), parseInt(size[1]));
    } else {
        this.jtopo.setSize(64, 64);
    }
    this.attr.size = [this.jtopo.width, this.jtopo.height];
};
Element.prototype.setDragable = function (dragable) {
    if (typeof dragable == 'boolean') {
        this.jtopo.dragable = dragable;
    }
    this.attr.dragable = this.jtopo.dragable;
};
Element.prototype.setNamePosition = function (namePosition) {
    var jtopo = this.jtopo;
    jtopo.text = this.attr.name || "";
    switch (namePosition) {
        case 'hide':
            jtopo.text = '';
            this.attr.namePosition = "hide";
            break;
        case 'bottom':
            jtopo.textOffsetX = 0;
            jtopo.textOffsetY = 0;
            jtopo.textPosition = "Bottom_Center";
            this.attr.namePosition = "bottom";
            break;
        case 'top':
            jtopo.textOffsetX = 0;
            jtopo.textOffsetY = 0;
            jtopo.textPosition = "Top_Center";
            this.attr.namePosition = "top";
            break;
        case 'left':
            jtopo.textOffsetX = -5;
            jtopo.textOffsetY = 0;
            jtopo.textPosition = "Middle_Left";
            this.attr.namePosition = "left";
            break;
        case 'right':
            jtopo.textOffsetX = 5;
            jtopo.textOffsetY = 0;
            jtopo.textPosition = "Middle_Right";
            this.attr.namePosition = "right";
            break;
        case "center":
            jtopo.textOffsetX = 0;
            jtopo.textOffsetY = 0;
            jtopo.textPosition = "Middle_Center";
            this.attr.namePosition = "center";
            break;
        default:
            jtopo.textOffsetX = 0;
            jtopo.textOffsetY = 0;
            jtopo.textPosition = 'Bottom_Center';
            this.attr.namePosition = "bottom";
            console.error(this, "set wrong namePosition,default is bottom");
            break;
    }
};
//只要对应属性有方法则修改
Element.prototype._setAttr = function (config) {
    var self = this;
    $.each(config, function (k, v) {
        try {
            var fn = self['set' + QTopo.util.upFirst(k)];
            if (fn) {
                fn.call(self, v);
            }
        } catch (e) {
            console.error(self, "Element _setAttr error :" + k, e);
        }
    });
};
Element.prototype.getAttr=function(name){
    var result;
    if(name){
        if(this.attr[name]){
            result=this.attr[name];
        }else if(this.extra[name]){
            result=this.extra[name];
        }
    }
    return result;
};
/**对象links属性内的所有线进行切换
 *@links node/container的links属性
 * @fnName 'show'/'hide'方法名
 */
function toggle(links, fnName) {
    try {
        $.each(links, function (name, arr) {
            arr.forEach(function (item) {
                item[fnName]();
            });
        })
    } catch (e) {
        console.error("切换隐藏/显示时错误", e);
    }
}
//线的显示只有当其两端节点都显示时才显示
function toggleLink(flag) {
    if (flag) {
        if (this.path.start.jtopo && this.path.end.jtopo) {
            if (this.path.start.jtopo.visible && this.path.end.jtopo.visible) {
                this.jtopo.visible = true;
                this.attr.show = this.jtopo.visible;
            }
        }
    } else {
        this.jtopo.visible = false;
        this.attr.show = this.jtopo.visible;
    }
}
function toggleNode(flag) {
    this.jtopo.visible = flag;
    this.attr.show = this.jtopo.visible;
    var string = flag ? "show" : "hide";
    toggle(this.links, string);
}
function toggleContainer(flag) {
    this.jtopo.visible = flag;
    this.attr.show = this.jtopo.visible;
    var string = flag ? "show" : "hide";
    //切换子类显示隐藏
    for (var i = 0; i < this.children.length; i++) {
        this.children[i][string]();
    }
    toggle(this.links, string);
}
Element.prototype.getCenter=function(){
    return {
        x:this.jtopo.cx,
        y:this.jtopo.cy
    }
};

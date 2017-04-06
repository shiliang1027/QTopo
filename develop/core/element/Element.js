/**
 * @module core
 */
module.exports = Element;
/**
 * 基本元素对象
 * @class Element
 * @constructor
 * @param jtopo 元素核心的jtopo对象
 */
function Element(jtopo) {
    if (jtopo) {
        /**
         * 核心Jtopo对象
         * @property jtopo {Object}
         */
        this.jtopo = jtopo;
        jtopo.qtopo = this;
    }
    if (!this.attr.jsonId) {
        /**
         * 唯一标识
         * @property jsonId {string}
         */
        this.attr.jsonId = QTopo.util.makeId();
    }
    /**
     * 额外属性
     * @property extra {string}
     */
    this.extra = {};
}
/**
 *  设置jsonId
 *  @method setJsonId
 *  @param id {string} id
 */
Element.prototype.setJsonId = function (id) {
    this.attr.jsonId = id;
};
/**
 *  显示元素
 *  @method show
 */
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
/**
 *  隐藏元素
 *  @method hide
 */
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
/**
 *  设置使用类型
 *  @method setUseType
 *  @param type {string}
 */
Element.prototype.setUseType = function (type) {
    this.attr.useType = type;
};
/**
 *  获取使用类型
 *  @method getUseType
 *  @return {string}
 */
Element.prototype.getUseType = function () {
    return this.attr.useType;
};
/**
 *  设置元素文本
 *  @method setText
 *  @param text {string}
 */
Element.prototype.setText = function (text) {
    if (text) {
        this.jtopo.text = (text + "").trim();
    }
    this.attr.text = this.jtopo.text;
};
/**
 *  设置元素边框
 *  @method setBorder
 *  @param border {object}
 *  color:颜色,width:宽度,radius:角弧度
 */
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
    this.attr.border.radius = jtopo.borderRadius;
};
/**
 *  绑定事件,可用off删除对应事件
 *  @method on
 *  @param name {string} 事件名
 *
 *  click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup
 *
 *  @param fn {function} 处理函数
 */
Element.prototype.on = function (name, fn) {
    this.jtopo.addEventListener(name, function (e) {
        if (e.target && e.target.qtopo) {
            fn(e, e.target.qtopo);
        } else {
            fn(e);
        }
    });
};
/**
 *  解除事件，可删除on绑定的事件
 *  @method off
 *  @param name {string} 事件名
 *
 *  click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup
 *
 *   @param [fn]{function} 处理的函数对象，若无参则删除该事件下所有函数
 */
Element.prototype.off = function (name, fn) {
    this.jtopo.removeEventListener(name);
};
/**
 *  设置元素层级
 *  @method setZIndex
 *  @param zIndex {number} 值高的元素覆盖在值低的元素上,默认节点>链接>分组
 */
Element.prototype.setZIndex = function (zIndex) {
    if ($.isNumeric(zIndex)) {
        this.jtopo.zIndex = parseInt(zIndex);
    }
    this.attr.zIndex = this.jtopo.zIndex;
};
/**
 *  设置元素字体
 *  @method setFont
 *  @param font {object}
 *
 *  type:字体,
 *  color:颜色,
 *  size:大小
 */
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
/**
 *  设置元素透明度
 *  @method setAlpha
 *  @param alpha {number} 值域0-1
 */
Element.prototype.setAlpha = function (alpha) {
    if ($.isNumeric(alpha) && alpha <= 1 && alpha > 0) {
        this.jtopo.alpha = alpha;
    } else {
        this.jtopo.alpha = 1;
    }
    this.attr.alpha = this.jtopo.alpha;
};
/**
 *  设置元素位置
 *  @method setPosition
 *  @param position {array} [x,y]在图层上的坐标
 */
Element.prototype.setPosition = function (position) {
    if ($.isArray(position) && position.length >= 2) {
        if ($.isNumeric(position[0]) && $.isNumeric(position[1])) {
            this.jtopo.setLocation(parseInt(position[0]), parseInt(position[1]));
        }
    }
};
/**
 *  设置元素大小
 *  @method setSize
 *  @param size {array} [width,height]
 */
Element.prototype.setSize = function (size) {
    if ($.isArray(size) && $.isNumeric(size[0]) && $.isNumeric(size[1])) {
        this.jtopo.setSize(parseInt(size[0]), parseInt(size[1]));
    } else {
        this.jtopo.setSize(64, 64);
    }
    this.attr.size = [this.jtopo.width, this.jtopo.height];
};
/**
 *  元素是否锁定位置
 *  @method setDragable
 *  @param dragable {boolean}
 */
Element.prototype.setDragable = function (dragable) {
    if (typeof dragable == 'boolean') {
        this.jtopo.dragable = dragable;
    }
    this.attr.dragable = this.jtopo.dragable;
};
/**
 *  设置元素文字位置
 *  @method setNamePosition
 *  @param [namePosition] {string} 无参则设为bottom
 *
 *  hide,bottom,top,left,right,center
 *
 */
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
            QTopo.util.error(this, "set wrong namePosition,default is bottom");
            break;
    }
};
/**
 *  私有函数,设置元素属性,只要有对应函数则传入参数设置
 *  @method _setAttr
 *  @param config {object}
 */
Element.prototype._setAttr = function (config) {
    var self = this;
    $.each(config, function (k, v) {
        try {
            var fn = self['set' + QTopo.util.upFirst(k)];
            if (fn) {
                fn.call(self, v);
            }
        } catch (e) {
            QTopo.util.error(self, "Element _setAttr error :" + k, e);
        }
    });
};
/**
 * 获取元素基本属性
 *  @method get
 *  @param name {string} 属性名
 */
Element.prototype.get = function (name) {
    return this.attr[name];
};
/**
 * 获取/设置元素额外属性
 *  @method val
 *  @param key {string} 属性名
 *  @param [value] {string|object} 值,无参则为取值
 */
Element.prototype.val = function (key, value) {
    if (QTopo.util.getClass(key) == 'Object') {
        var self = this;
        $.each(key, function (name, value) {
            self.extra[name] = value;
        })
    } else {
        if (typeof value == 'undefined') {
            var result;
            if (this.extra[key]) {
                result = this.extra[key];
            } else if (this.attr[key]) {
                result = this.attr[key];
            } else {
                result = this[key];
            }
            return result;
        } else {
            this.extra[key] = value;
        }
    }
};
/*
 * 对象links属性内的所有线进行切换
 * @links node/container的links属性
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
        QTopo.util.error("切换隐藏/显示时错误", e);
    }
}
//线的显示只有当其两端节点都显示时才显示
function toggleLink(flag) {
    if (flag) {
        if (this.path.start.jtopo && this.path.end.jtopo) {
            if (this.path.start.jtopo.visible && this.path.end.jtopo.visible) {
                this.jtopo.visible = true;
            }
        }
    } else {
        this.jtopo.visible = false;
    }
}
function toggleNode(flag) {
    this.jtopo.visible = flag;
    var string = flag ? "show" : "hide";
    toggle(this.links, string);
}
function toggleContainer(flag) {
    this.jtopo.visible = flag;
    var string = flag ? "show" : "hide";
    //切换子类显示隐藏
    for (var i = 0; i < this.children.length; i++) {
        this.children[i][string]();
    }
    toggle(this.links, string);
}
/**
 * 获取元素中心坐标
 *  @method getCenterPosition
 *  @return {object} {x,y}
 */
Element.prototype.getCenterPosition = function () {
    return {
        x: this.jtopo.cx,
        y: this.jtopo.cy
    }
};

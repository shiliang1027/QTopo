/**
 * @module core
 */
module.exports = Element;
/**
 * 元素基类,用以继承
 * @class [E] Element
 * @constructor
 * @param jtopo 元素核心的jtopo对象
 */
function Element(jtopo) {
    if (jtopo) {
        /**
         * 核心Jtopo对象
         * @property [E] jtopo {Object}
         */
        this.jtopo = jtopo;
        jtopo.qtopo = this;
    }
    if (!this.attr.jsonId) {
        /**
         * 唯一标识
         * @property [E] jsonId {string}
         */
        this.attr.jsonId = QTopo.util.makeId();
    }
    /**
     * 预定义的额外属性,参考实际元素
     * @property [E] extra {object}
     */
    this.extra = {};
    /**
     * 预定义的基本属性，参考实际元素
     * @property [E] attr {object}
     */
}
/**
 *  设置jsonId
 *  @method [E] setJsonId
 *  @param id {string} id
 */
Element.prototype.setJsonId = function (id) {
    this.attr.jsonId = id;
};
/**
 *  显示元素
 *  @method [E] show
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
 *  @method [E] hide
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
 *  @method [E] setUseType
 *  @param type {string}
 */
Element.prototype.setUseType = function (type) {
    this.attr.useType = type;
};
/**
 *  获取使用类型
 *  @method [E] getUseType
 *  @return {string}
 */
Element.prototype.getUseType = function () {
    return this.attr.useType;
};
/**
 *  设置元素文本
 *  @method [E] setText
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
 *  @method [E] setBorder
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
 *  @method [E] on
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
 *  @method [E] off
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
 *  @method [E] setZIndex
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
 *  @method [E] setFont
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
 *  @method [E] setAlpha
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
 *  @method [E] setPosition
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
 *  @method [E] setSize
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
 *  @method [E] setDragable
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
 *  @method [E] setNamePosition
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
 *  私有函数,设置元素属性,只要有对应函数则传入参数设置,不应直接调用
 *
 *  实际元素中应重写set函数，在set函数中对特殊参数做处理后再调用该函数
 *  @method [E] _setAttr
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
 *  @method [E] get
 *  @param name {string} 属性名
 *  @example
 *          Element.setPosition([100,100])
 *          Element.get('position')       //[100,100]
 */
Element.prototype.get = function (name) {
    return this.attr[name];
};
/**
 * 获取元素的属性,修改/赋值元素额外属性
 *  @method [E] val
 *  @param key {string} 属性名
 *
 *  要操作的属性名,与get不同，该函数会在整个对象中查找与key匹配的属性
 *
 *  无论是额外属性还是基本属性又或是Element.xx属性，只要匹配成功即返回.
 *
 *  优先级为 额外属性>基本属性>Element.xx属性
 *
 *  用该函数赋予额外属性时，可以直接传入一个对象作为参数
 *
 *  该函数会遍历该参数对象将其内容全部覆盖到额外属性上
 *
 *  @param [value] {string|object|void} 值,无参则为取值
 *  @example
 *
 *       赋值操作   1. Element.val('pid','12345')
 *                  2. Element.val({
 *                          pid:"12345",
 *                          path:[]
 *                      })
 *       取属性操作 Element.val('pid')       //"12345"
 *                  Element.val('position') //[x,y]
 *                  Element.val('path')       //[]
 *                  Element.val('name')       //""
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
 *  @method [E] getCenterPosition
 *  @return {object} {x,y}
 */
Element.prototype.getCenterPosition = function () {
    return {
        x: this.jtopo.cx,
        y: this.jtopo.cy
    }
};

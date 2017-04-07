/**
 * @module core
 */
/**
 * 容器基类,用以继承 [E]开头继承于Element,[C]开头为自身api
 * @class [C] Container
 * @constructor
 * @extends [E] Element
 * @param jtopo 元素核心的jtopo对象
 */

var Element = require("../Element.js");
module.exports = Container;
var jtopoReset = {
    //重写名称绘制，用以换行显示
    paintText: function (a) {
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
            var e = this.getTextPostion(this.textPosition, maxWidth, fontWidth,texts.length);
            for (var j = 0; j < texts.length; j++) {
                var textWidth = a.measureText(texts[j]).width;
                a.fillText(texts[j], e.x + (maxWidth - textWidth) / 2, e.y + j * fontWidth);
            }

            a.closePath();
        }
    }
};
function Container(jtopo) {
    if (jtopo) {
        Element.call(this, jtopo);
    } else {
        QTopo.util.error("create Container without jtopo", this);
    }
    /**
     * 记录容器内的元素
     * @property [C] children {array}
     */
    this.children = [];
    /**
     * 记录容器上的链路
     * @property [C] links {array}
     * @param in 以容器为终点的链路
     * @param out 以容器为起点的链路
     */
    this.links = {
        in: [],
        out: []
    };
    reset(this);
}
QTopo.util.inherits(Container, Element);
function reset(element) {
    element.jtopo.paintText = jtopoReset.paintText;
}
/**
 *  设置容器名称
 *  @method [C] setName
 *  @param name {string}
 */
Container.prototype.setName = function (name) {
    if (name) {
        if (this.attr.namePosition != "hide") {
            this.jtopo.text = name.trim();
        }
        this.attr.name = name.trim();
    }
};
/**
 *  将元素加入容器内
 *  @method [C] add
 *  @param element {element|array} 一般为节点类型对象或数组，容器加入容器容易产生Bug
 */
Container.prototype.add = function (element) {
    var self=this;
    if (!$.isArray(this.children)) {
        this.children = [];
    }
    if ($.isArray(element)) {
        $.each(element,function(i,el){
            addOnce(el);
        });
    }else{
        addOnce(element);
    }
    function addOnce(element){
        if (element&&check(element)&&!self.isChild(element)) {
            self.children.push(element);
            element.parent = self;
            self.jtopo.add(element.jtopo);
            if (self.attr.children && typeof self.attr.children.dragble == "boolean") {
                //若分组不允许移动组内元素，手动设置元素不可移动
                element.setDragable(self.attr.children.dragble);
            }
        }
    }
    function check(element){
        return element.getType()==QTopo.constant.NODE&&element.getUseType()!=QTopo.constant.CASUAL&&!element.parent;
    }
};
/**
 * 将子元素从容器中删除
 * @method [C] remove
 * @param element {element}
 */
Container.prototype.remove = function (element) {
    if ($.isArray(this.children) && this.isChild(element)) {
        this.children.splice(this.children.indexOf(element), 1);
        delete element.parent;
        this.jtopo.remove(element.jtopo);
        //移除元素，应手动设回元素可移动
        element.setDragable(true);
    }
};
/**
 * 获取容器基本类型
 * @method [C] getType
 * @return QTopo.constant.CONTAINER
 */
Container.prototype.getType = function () {
    return QTopo.constant.CONTAINER;
};
/**
 * 设置容器背景色
 * @method [C] setColor
 * @param color {string} "255,255,255"/"#ffffff"
 */
Container.prototype.setColor = function (color) {
    if (color) {
        color = QTopo.util.transHex(color.toLowerCase());
        this.jtopo.fillColor = color;
    }
    this.attr.color = this.jtopo.fillColor;
};
/**
 * 设置容器内子元素一般行为,未完全实现
 * @method [C] setChildren
 * @param children {object}
 *          children={
 *                  dragble:是否可移动{boolean}
 *          }
 */
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
/**
 * 容器缩放切换,在scene创建时可选是否提供切换
 *
 * 可在创建时增加参数 toggle:{close:true}来创建一个不可切换的容器
 *
 * 若无切换对象，则该方法无动作
 * @method [C] toggle
 * @param [flag] 为true则强制缩放，为false则强制展开，无值则自适应切换,
 */
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
/**
 * 判断元素是否已是子元素
 * @method [C] isChild
 * @param element 判断的子元素
 * @return {boolean}
 */
Container.prototype.isChild = function (element) {
    if ($.isArray(this.children)) {
        var index=this.children.indexOf(element);
        if (element.parent != this&& index> -1) {
            QTopo.util.error("some group get error,the child's parent is not it and the child in its children,index is "+index, this,element);
        }
        return index>-1;
    } else {
        return false;
    }
};
/**
 * 判断元素是否在分组覆盖的范围内,临时元素不考虑
 * @method [C] isInside
 * @param element 判断的元素
 * @return {boolean}
 */
Container.prototype.isInside = function (element) {
    if (element && element.getType() != QTopo.constant.CASUAL) {
        var center = element.getCenterPosition();
        return !this.isChild(element) && center.x > this.x && center.x < (this.x + this.width) && center.y > this.y && center.y < (this.y + this.height);
    } else {
        return false;
    }
};
/**
 * 分组属性提取
 * @method [C] toJson
 * @return {object}
 */
Container.prototype.toJson=function(){
    var json=$.extend({},this.attr);
    json.extra=$.extend({},this.extra);
    json.children=[];
    this.children.map(function(child){
        json.children.push(child.get('jsonId'));
    });
    json.toggle=this.toggleTo.toJson();
    return json;
};
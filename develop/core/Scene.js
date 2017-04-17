/**
 * @module core
 */
//-
var Node = {
    Image: require("./element/node/Image.js"),
    Text: require("./element/node/Text.js"),
    Shape: require("./element/node/Shape.js")
};
var Link = {
    Curve: require("./element/link/Curve.js"),
    Direct: require("./element/link/Direct.js"),
    Flexional: require("./element/link/Flexional.js"),
    Fold: require("./element/link/Fold.js")
};

var Line = {
    Direct: require("./element/line/Direct.js")
};
var Container = {
    Group: require("./element/container/Group.js")
};
var events = require("./events.js");
module.exports = Scene;
//-
//画布对象
var defaults = function () {
    return {
        mode: QTopo.constant.mode.NORMAL,
        backgroundImage: ""
    };
};
/**
 * 图层对象
 * @class Scene
 * @constructor
 * @param canvas 绘图所在的canvas标签对象
 * @param config 图层的基本设置,参见attr属性
 */
function Scene(canvas, config) {
    var self = this;
    /**
     * 核心Jtopo对象
     * @property jtopo {Object}
     */
    self.jtopo = new JTopo.Scene();
    self.jtopo.qtopo = self;
    /**
     * 图层中有效记录的元素
     * @property children {object}
     * @param node {array}
     * @param link {array}
     * @param container {array}
     * @param line {array}
     */
    self.children = {
        node: [],
        link: [],
        container: [],
        line: []
    };
    /**
     * 图层的主要属性
     * @property attr {objcet}
     * @param [mode=QTopo.constant.mode.NORMAL],
     * @param [backgroundImage=''],
     * @param [backgroundColor=''],
     */
    self.attr = defaults();
    /**
     * 图层的额外属性
     * @property extra {objcet}
     */
    self.extra = config.extra || {};
    new JTopo.Stage(canvas).add(self.jtopo);
    events.init(self);
    //延时执行
    setTimeout(function () {
        if (config) {
            if (config.backgroundImage) {
                self.setBackgroundImage(config.backgroundImage);
            }
            if (config.backgroundColor) {
                self.setBackgroundColor(config.backgroundColor);
            }
            if (config.mode) {
                self.setMode(config.mode);
            }
        }
    });
}
//-
/**
 *  获取图层的基本属性
 *  @method get
 *  @param key {string} 要获取的属性名
 *  @returns {string|object} 属性值
 *  @example
 *          scene.get('mode')       //"normal"
 */
Scene.prototype.get = function (key) {
    return this.attr[key];
};
/**
 *  获取图层的属性,或添加/修改额外属性
 *  @method val
 *  @param key {string}
 *
 *  要操作的属性名,与get不同，该函数会在整个对象中查找与key匹配的属性
 *  无论是额外属性还是基本属性又或是Scene.xx属性，只要匹配成功即返回.
 *  优先级为 额外属性>基本属性>Scene.xx属性
 *
 *  用该函数赋予额外属性时，可以直接传入一个对象作为参数
 *  该函数会遍历该参数对象将其内容全部覆盖到额外属性上
 *
 *  @param [value] {string|object} 属性值，若无则函数为获取属性，若有则为修改/添加属性
 *  @returns {string|object|void}
 *  @example
 *
 *       赋值操作   1. scene.val('pid','12345')
 *                  2. scene.val({
 *                          pid:"12345",
 *                          path:[]
 *                      })
 *       取属性操作 scene.val('pid')       //"12345"
 *                  scene.val('position') //undefined
 *                  scene.val('path')       //[]
 *                  scene.val('mode')       //"normal"
 */
Scene.prototype.val = function (key, value) {
    if (QTopo.util.getClass(key) == 'Object') {
        var self = this;
        $.each(key, function (name, value) {
            self.extra[name] = value;
        })
    } else {
        if (!value) {
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
/**
 *  配置图层中元素全局样式
 *  @method setDefault
 *  @param type {string} 要配置的元素类型 例：QTopo.constant.node.IMAGE
 *  @param config {object} 样式属性，可参考对应的元素attr属性
 */
Scene.prototype.setDefault = function (type, config) {
    if (config) {
        var constant = QTopo.constant;
        switch (type) {
            case constant.node.IMAGE:
                Node.Image.setDefault(config);
                break;
            case constant.node.TEXT:
                Node.Text.setDefault(config);
                break;
            case constant.link.DIRECT:
                Link.Direct.setDefault(config);
                break;
            case constant.link.CURVE:
                Link.Curve.setDefault(config);
                break;
            case constant.link.FLEXIONAL:
                Link.Flexional.setDefault(config);
                break;
            case constant.link.FOLD:
                Link.Fold.setDefault(config);
                break;
            case constant.line.DIRECT:
                Line.Direct.setDefault(config);
                break;
            case constant.container.GROUP:
                Container.Group.setDefault(config);
                break;
        }
    }
};
/**
 *  获取图层中元素全局样式
 *  @method getDefault
 *  @param type {string} 要配置的元素类型 例：QTopo.constant.node.IMAGE
 *  @return {object} 样式属性，可参考对应的元素attr属性
 */
Scene.prototype.getDefault = function (type) {
    if (type) {
        var result;
        var constant = QTopo.constant;
        switch (type) {
            case constant.node.IMAGE:
                result = Node.Image.getDefault();
                break;
            case constant.node.TEXT:
                result = Node.Text.getDefault();
                break;
            case constant.link.DIRECT:
                result = Link.Direct.getDefault();
                break;
            case constant.link.CURVE:
                result = Link.Curve.getDefault();
                break;
            case constant.link.FLEXIONAL:
                result = Link.Flexional.getDefault();
                break;
            case constant.link.FOLD:
                result = Link.Fold.getDefault();
                break;
            case constant.line.DIRECT:
                result = Line.Direct.getDefault();
                break;
            case constant.container.GROUP:
                result = Container.Group.getDefault();
                break;
        }
        return result;
    }
};
/**
 *  设置图层背景图片，与setBackgroundColor冲突
 *  @method setBackgroundImage
 *  @param image {string} 图片url
 */
Scene.prototype.setBackgroundImage = function (image) {
    this.jtopo.background = image;
    this.attr.background = image;
};
/**
 *  设置图层背景颜色，与setBackgroundImage冲突
 *  @method setBackgroundColor
 *  @param color {string} #xxxxxx/255,255,255
 */
Scene.prototype.setBackgroundColor = function (color) {
    this.jtopo.backgroundColor = QTopo.util.transHex(color);
    this.jtopo.alpha = 1;
    this.attr.background = QTopo.util.transHex(color);
};
/**
 *  设置图层模式
 *  @method setMode
 *  @param mode {string} 例:QTopo.constant.mode.NORMAL
 */
Scene.prototype.setMode = function (mode) {
    if (["normal", "edit", "drag", "select"].indexOf(mode) > -1) {
        this.attr.mode = mode;
        this.jtopo.mode = mode;
    } else {
        QTopo.util.error("set wrong mode :", mode);
    }
};
/**
 *  图层清空，清除图层内所有元素
 *  @method clear
 */
Scene.prototype.clear = function () {
    QTopo.util.info("scene clear");
    this.children = {
        node: [],
        link: [],
        container: [],
        line: []
    };
    this.jtopo.clear();
};
/**
 *  获取类型，常用在右键菜单上对触发对象的识别
 *  @method getType
 *  @return QTopo.constant.SCENE
 */
Scene.prototype.getType = function () {
    return QTopo.constant.SCENE;
};
/**
 *  获取使用类型，常用在右键菜单上对触发对象的识别
 *  @method getUseType
 *  @return QTopo.constant.SCENE
 */
Scene.prototype.getUseType = function () {
    return QTopo.constant.SCENE;
};
/**
 *  绑定事件，可用off删除对应事件
 *  @method on
 *  @param name {string} 事件名
 *
 *  click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup
 *
 *  @param fn {function} 处理函数
 */
Scene.prototype.on = function (name, fn) {
    this.jtopo.addEventListener(name, fn);
};
/**
 *  删除事件，可删除on绑定的事件
 *  @method off
 *  @param name {string} 事件名
 *
 *  click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup
 *
 *  @param [fn]{function} 处理的函数对象，若无参则删除该事件下所有函数
 */
Scene.prototype.off = function (name, fn) {
    this.jtopo.removeEventListener(name, fn);
};
/**
 *  根据搜索当前图层，查找基本属性或额外属性满足条件的元素
 *  @method find
 *  @param scan {string} 查询条件,格式为"key=value,key=value",多个条件用,分割
 *  @param [type] {string} 可指定元素类型精确查找
 *  @return {array} 返回数组，数组成员为满足至少一个条件的元素
 */
Scene.prototype.find = function (scan, type) {
    var children = this.children;
    var result = [];
    var condition = typeof scan == "string" ? scan.split(",") : [];
    if (condition.length > 0) {
        $.each(condition, function (i, temp) {
            temp = temp.split("=");
            if (temp.length >= 2) {
                //制定了类型，缩小查找范围，未指定则全部遍历
                if (type) {
                    switch (type) {
                        case "node":
                            scanArr(children.node, temp[0], temp[1]);
                            break;
                        case "link":
                            scanArr(children.link, temp[0], temp[1]);
                            break;
                        case "container":
                            scanArr(children.container, temp[0], temp[1]);
                            break;
                        case "line":
                            scanArr(children.line, temp[0], temp[1]);
                            break;
                    }
                } else {
                    $.each(children, function (j, arr) {
                        scanArr(arr, temp[0], temp[1]);
                    });
                }
            }
        });
    }
    return result;
    //扫描数组中对象对应的属性是否相等
    function scanArr(arr, key, value) {
        $.each(arr, function (i, item) {
            //只扫描对象的attr和extra中的属性
            if (equal(item.extra, key, value) || equal(item.attr, key, value)) {
                //排除重复的
                if (result.indexOf(item) < 0) {
                    result.push(item);
                }
            }
        });
        return result;
    }

    function equal(object, key, value) {
        return object && object[key] && object[key] == value;
    }
};
/**
 *  获取当前图层在正常视角下(未放大缩小)最左上角的坐标
 *  @method getOrigin
 *  @return {object} 包含 x,y属性
 */
Scene.prototype.getOrigin = function () {
    return {
        x: 0 - this.jtopo.translateX,
        y: 0 - this.jtopo.translateY
    }
};
//-
function addJTopo(element) {
    try {
        this.jtopo.add(element.jtopo);
    } catch (e) {
        QTopo.util.error("In Scene, jtopo add error : ", e);
    }
}
function removeJTopo(element) {
    try {
        this.jtopo.remove(element.jtopo);
    } catch (e) {
        QTopo.util.error("In Scene, jtopo remove error : ", e);
    }
}
/**
 *  根据配置在当前图层上绘制节点
 *  @method createNode
 *  @param [config] {object}
 *
 *  无参则根据全局配置绘制QTopo.constant.node.IMAGE对应的节点,
 *
 *  config.type可指定绘制节点类型
 *
 *  参考QTopo.contant.node选择可绘制的种类
 *  @return {Node|boolean} 创建成功返回节点对象，失败返回false
 */
Scene.prototype.createNode = function (config) {
    var newNode;
    var constant = QTopo.constant.node;
    config = config || {};
    switch (config.type) {
        case constant.TEXT:
            newNode = new Node.Text.constructor(config);
            break;
        case constant.SHAPE:
            newNode = new Node.Shape.constructor(config);
            break;
        default:
            newNode = new Node.Image.constructor(config);
    }
    if (newNode && newNode.jtopo) {
        addJTopo.call(this, newNode);
        this.children.node.push(newNode);
        return newNode;
    } else {
        QTopo.util.error("create Node error", config);
        return false;
    }
};
/**
 *  根据配置在两个元素之间绘制新的链接
 *  @method createLink
 *  @param [config] {object}
 *  无参则根据全局配置绘制QTopo.constant.link.DIRECT对应的链接,
 *
 *  config.type可指定绘制链接类型
 *
 *  参考QTopo.contant.link选择可绘制的种类
 *  @return {Link|boolean} 创建成功返回链接对象，失败返回false
 */
Scene.prototype.createLink = function (config) {
    var newLink;
    var constant = QTopo.constant.link;
    config = config || {};
    switch (config.type) {
        case constant.CURVE:
            newLink = new Link.Curve.constructor(config);
            break;
        case constant.FLEXIONAL:
            newLink = new Link.Flexional.constructor(config);
            break;
        case constant.FOLD:
            newLink = new Link.Fold.constructor(config);
            break;
        default:
            newLink = new Link.Direct.constructor(config);
    }
    if (newLink && newLink.jtopo) {
        addJTopo.call(this, newLink);
        this.children.link.push(newLink);
        return newLink;
    } else {
        QTopo.util.error("create Link error", config);
        return false;
    }
};
//--
/**
 *  根据配置在两个元素之间创建链接,若两元素已有链接则原链接计数上加1,
 *  可操作于有展开功能的链接上，可自适应选择添加新链接或计数+1
 *  @method addLink
 *  @param config {object} 创建新链接时所依赖的配置，可参考createLink函数
 *  @param [fn] {function} 判断两元素间无链接时的可选操作，若无则调用createLink函数建立链接
 *  @return {Link|boolean} 创建成功返回链接对象，失败返回false
 */
Scene.prototype.addLink = function (config, fn) {
    if (config && config.start && config.end) {
        var links = this.linksBetween(config.start, config.end);//按number属性从大到小排列
        if (links.length == 0) {
            if ($.isFunction(fn)) {
                fn();
            } else {
                return this.createLink(config);
            }
        } else {
            //两点之间连线为1则认为是已有链接，超过1则认为是可以展开且已经展开的直线
            var number = 1;
            if ($.isNumeric(config.number)) {
                number = parseInt(config.number);
                if (number < 1) {
                    number = 1;
                }
            }
            if (links.length == 1) {
                links[0].set({
                    number: links[0].attr.number + number
                });
                return links[0];
            } else if (links.length > 1) {
                var parent = links[0].parent;
                if (parent) {
                    parent.attr.number += number;
                    parent.addChild(number);
                }
                return parent;
            }
        }
    }
};
/**
 *
 *  获取两元素之间所有的链接
 *  @method linksBetween
 *  @param start {element} 元素，起始无关
 *  @param end {element} 元素，起始无关
 *  @return {array} 元素间的链接集合，按链接的计数右大到小排列
 */
Scene.prototype.linksBetween = function (start, end) {
    var result = [];
    var links = start.links;
    //检测两元素间的连线是否已有
    if ($.isArray(links.out)) {
        $.each(links.out, function (i, linkOut) {
            if (linkOut.path.end == end) {
                result.push(linkOut);
            }
        });
    }
    if ($.isArray(links.in)) {
        $.each(links.in, function (j, linkIn) {
            if (linkIn.path.start == end) {
                result.push(linkIn);
            }
        });
    }
    return result.sort(function (a, b) {
        return b.attr.number - a.attr.number;
    });
};
//--
/**
 *
 *  在图层上绘制不可以移动的线元素
 *  @method createLine
 *  @param [config] {object} 配置参数,若无则按全局配置创建
 *  @return {Line|boolean} 创建成功返回线元素，失败返回false
 */
Scene.prototype.createLine = function (config) {
    var newLine;
    var constant = QTopo.constant.line;
    config = config || {};
    switch (config.type) {
        default:
            newLine = new Line.Direct.constructor(config);
    }
    if (newLine && newLine.jtopo) {
        addJTopo.call(this, newLine);
        this.children.line.push(newLine);
        return newLine;
    } else {
        QTopo.util.error("create Link error", config);
        return false;
    }
};
//--
/**
 *
 *  在图层上绘制分组元素
 *  @method createContainer
 *  @param [config] {object} 配置参数,若无则按全局配置创建
 *  @return {container|boolean} 创建成功返回线元素，失败返回false
 */
Scene.prototype.createContainer = function (config) {
    var newContainer;
    var constant = QTopo.constant.container;
    config = config || {};
    switch (config.type) {
        default:
            newContainer = new Container.Group.constructor(config);
    }
    if (newContainer && newContainer.jtopo) {
        //分组只加入其本身，切换节点不作数
        var nodeConfig = {};
        if (config.toggle) {
            nodeConfig = config.toggle
        }
        //可选禁用分组切换
        if (!(config.toggle && typeof config.toggle.close == "boolean" && config.toggle.close)) {
            addToggle(this, newContainer, nodeConfig);
        }
        this.children.container.push(newContainer);
        addJTopo.call(this, newContainer);
        return newContainer;
    } else {
        QTopo.util.error("create Container error", config);
        return false;
    }
};
function addToggle(scene, container, configToggle) {
    configToggle.useType = QTopo.constant.CASUAL;//标记用途
    container.toggleTo = new Node.Image.constructor(configToggle);
    container.toggleTo.toggleTo = container;//互相索引
    container.toggleTo.hide();//初始隐藏
    addJTopo.call(scene, container.toggleTo);//加入画布
}
//--
//-
/**
 *
 *  删除图层内元素,元素删除其上的链接也会删除和更新
 *  @method remove
 *  @param element {element}
 */
Scene.prototype.remove = function (element) {
    var self = this;
    if (element) {
        if ($.isArray(element)) {
            $.each(element, function (i, item) {
                removeOnce(item);
            });
        } else {
            removeOnce(element);
        }
        function removeOnce(oneElement) {
            if (oneElement.jtopo) {
                switch (oneElement.getType()) {
                    case QTopo.constant.NODE:
                        if (QTopo.util.arrayDelete(self.children.node, oneElement) || oneElement.getUseType() == QTopo.constant.CASUAL) {
                            removeNode.call(self, oneElement);
                        }
                        break;
                    case QTopo.constant.LINK:
                        if (QTopo.util.arrayDelete(self.children.link, oneElement) || oneElement.getUseType() == QTopo.constant.CASUAL) {
                            removeLink.call(self, oneElement);
                        }
                        break;
                    case QTopo.constant.LINE:
                        if (QTopo.util.arrayDelete(self.children.line, oneElement) || oneElement.getUseType() == QTopo.constant.CASUAL) {
                            removeLine.call(self, oneElement);
                        }
                        break;
                    case QTopo.constant.CONTAINER:
                        if (QTopo.util.arrayDelete(self.children.container, oneElement) || oneElement.getUseType() == QTopo.constant.CASUAL) {
                            removeContainer.call(self, oneElement);
                        }
                        break;
                }
            }
        }
    }
};
function upDataLinks(element) {
    var links = element.links;
    if (links) {
        //更新其上连线的另一方的links属性
        while (links.in.length > 0) {
            this.remove(links.in.pop());
        }
        while (links.out.length > 0) {
            this.remove(links.out.pop());
        }
    }
}
//线上删除时候,要更新node和container中的links属性
function removeLink(link) {
    try {
        QTopo.util.arrayDelete(link.path.start.links.out, link);
        QTopo.util.arrayDelete(link.path.end.links.in, link);
        removeJTopo.call(this, link);
    } catch (e) {
        QTopo.util.error("Scene removeLink error", e);
    }
}
function removeLine(line) {
    try {
        removeJTopo.call(this, line);
    } catch (e) {
        QTopo.util.error("Scene removeLine error", e);
    }
}
function removeNode(node) {
    //刷新一下现有的线
    try {
        //更新其上线另一头的links属性
        upDataLinks.call(this, node);
        //要更新其父的children属性,父删除子
        if (node.parent && $.isArray(node.parent.children)) {
            node.parent.remove(node);
        }
        //删除分组切换的节点时同时删除其切换的分组
        if (node.toggleTo) {
            //分组若隐藏了,应该展示
            node.toggleTo.toggle();
            this.remove(node.toggleTo);
        }
        removeJTopo.call(this, node);
    } catch (e) {
        QTopo.util.error("Scene removeNode error", e);
    }
}
//容器删除时,要更与其相连的线的另一端的links属性,要更新其子类的parent属性
function removeContainer(container) {
    try {
        //分组若隐藏了,应该展示
        container.toggle(true);
        //更新其上线另一头的links属性
        upDataLinks.call(this, container);
        //更新子元素的Parent属性
        if ($.isArray(container.children) && container.children.length > 0) {
            for (var i = 0; i < container.children.length; i++) {
                container.children[i].parent = null;
            }
        }
        //删除分组同时删除其切换节点
        if (container.toggleTo) {
            this.remove(container.toggleTo);
        }
        removeJTopo.call(this, container);
    } catch (e) {
        QTopo.util.error("Scene removeContainer error", e);
    }
}
//-
/**
 *
 *  图层信息转化为json
 *  @method toJson
 *  @return {object}
 */
Scene.prototype.toJson = function () {
    var json = $.extend({}, this.attr);
    json.extra = $.extend({}, this.extra);
    return json;
};
/**
 *
 *  判断元素是否在当前图层内
 *  @method isChildren
 *  @param element {element}
 *  @return {boolean}
 */
Scene.prototype.isChildren = function (element) {
    var result = false;
    if (element.jtopo) {
        $.each(this.children, function (name, arr) {
            if (arr.indexOf(element) > -1) {
                result = true;
                return false;
            }
        });
    }
    return result;
};
/**
 *
 * 图层缩放,元素一屏显示
 *  @method goCenter
 */
Scene.prototype.goCenter = function () {
    if (this.jtopo.childs && this.jtopo.childs.length > 0) {
        this.jtopo.stage.centerAndZoom();
    }
};
/**
 *
 * 图层缩放
 *  @method resize
 *  @param size {number} 根据比例放大或缩小 参数可 0-1缩小 1-n放大
 */
Scene.prototype.resize = function (size) {
    if ($.isNumeric(size)) {
        this.jtopo.scaleX = size;
        this.jtopo.scaleY = size;
    }
};
/**
 *
 * 启用/禁用鼠标缩放
 *  @method toggleZoom
 */
Scene.prototype.toggleZoom = function () {
    if (!this.jtopo.stage.wheelZoom) {
        this.jtopo.stage.wheelZoom = 0.85; // 设置鼠标缩放比例
    } else {
        this.jtopo.stage.wheelZoom = null;
    }
};
/**
 *
 * 启用/禁用鹰眼
 *  @method toggleEagleEye
 */
Scene.prototype.toggleEagleEye = function () {
    this.jtopo.stage.eagleEye.visible = !this.jtopo.stage.eagleEye.visible;
};
/**
 *
 * 获取当前图层的png格式图片在新的窗口打开
 *  @method getPicture
 */
Scene.prototype.getPicture = function () {
    //stage.saveImageInfo();
    //在新页面打开图片
    var image = this.jtopo.stage.canvas.toDataURL("image/png");
    var w = window.open('about:blank', 'image from canvas');
    w.document.write("<img src='" + image + "' alt='from canvas'/>");
    //下载图片
    // here is the most important part because if you dont replace you will get a DOM 18 exception.
    // var image =  stage.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition: attachment;filename=foobar.png");
    //var image = stage.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    //window.location.href=image; // it will save locally
};
/**
 * 切换元素的层次
 * @method toggleZIndex
 * @param element 待控制元素
 * @param [flag] true为降低false为提升，无参则默认提升，若已提升到最高则降至最低
 */
Scene.prototype.toggleZIndex = function (element, flag) {
    if (element) {
        var jtopo = element.jtopo;
        var scene = this.jtopo;
        if (jtopo && scene) {
            var map = scene.zIndexMap[jtopo.zIndex];
            var index = map.indexOf(jtopo);
            var todo = true;
            if (typeof flag == 'boolean') {
                todo = flag;
            } else {
                if (index == map.length - 1) {
                    todo = false;
                }
            }
            if (todo) {
                //提升层次
                map.push(map[index]);
                map.splice(index, 1);

            } else {
                //降低层次
                map.splice(0, 0, map[index]);
                map.splice(index + 1, 1);
            }
        }
    }
};
var selectedCatch = {
    jtopo: [],
    qtopo: []
};
/**
 * 获取被选中的元素
 * @method getSelected
 * @return {array} 返回图层中被选中的元素
 */
Scene.prototype.getSelected = function () {
    var jtopo = this.jtopo.selectedElements;
    if ($.isArray(jtopo)) {
        if (selectedCatch.jtopo != jtopo) {
            selectedCatch.jtopo = jtopo;
            selectedCatch.qtopo = [];
            jtopo.forEach(function (el) {
                if (el.qtopo && el.qtopo.getUseType() != QTopo.constant.CASUAL) {
                    selectedCatch.qtopo.push(el.qtopo);
                }
            });
        }
        return selectedCatch.qtopo;
    } else {
        return [];
    }
};
/**
 * 高亮目标隐藏其他
 * @method toggleLight
 * @param [target] 数组或对象,高亮其相关对象,无参则全部高亮
 * @param [flag] 若为true则只高亮传入的对象,不选则只对传入对象相关的对象高亮
 */
Scene.prototype.toggleLight = function (target, flag) {
    try {
        var alpha = 1;
        var lighting;
        if (target) {
            alpha = 0.1;
            if (flag) {
                if ($.isArray(target)) {
                    lighting = target;
                } else {
                    lighting = [target];
                }
            } else {
                if ($.isArray(target)) {
                    lighting = getConnectionLightings(target);
                } else {
                    lighting = getConnectionLightings([target]);
                }
            }
        }
        totalSetAlpha(this.children.node.concat(this.children.link), alpha);
        totalSetAlpha(lighting, 1);
    } catch (e) {
        QTopo.util.error("scene toggleLight error", e);
    }
    function getConnectionLightings(arr) {
        var lighting = [];
        $.each(arr, function (i, target) {
            if (target.getType() == QTopo.constant.NODE && target.getUseType() != QTopo.constant.CASUAL) {
                var links = target.links;
                QTopo.util.arrayPush(lighting, target);
                if (links) {
                    if ($.isArray(links.out)) {
                        $.each(links.out, function (l, outlink) {
                            QTopo.util.arrayPush(lighting, outlink);
                            QTopo.util.arrayPush(lighting, outlink.path.end);
                        });
                    }
                    if ($.isArray(links.in)) {
                        $.each(links.in, function (n, inlink) {
                            QTopo.util.arrayPush(lighting, inlink);
                            QTopo.util.arrayPush(lighting, inlink.path.start);
                        });
                    }
                }
            }
        });
        return lighting;
    }

    function totalSetAlpha(total, alpha) {
        //全部隐藏
        if ($.isArray(total)) {
            $.each(total, function (i, element) {
                element.set({
                    alpha: alpha
                });
            });
        }
    }
};
/**
 * 正常尺寸展示，并将视角移动到以参数节点为中心的位置
 * @method moveToNode
 * @param node 节点对象
 */
Scene.prototype.moveToNode = function (node) {
    // 查询到的节点居中显示
    if (this.children.node.indexOf(node) > -1) {
        var location = node.jtopo.getCenterLocation();
        this.resize(1);
        this.jtopo.setCenter(location.x, location.y);
        // 闪烁几下
        nodeFlash(node.jtopo, 5);
    }
    function nodeFlash(node, num) {
        if ($.isNumeric(num)) {
            if (num == 0) {
                node.selected = false;
            } else {
                node.selected = !node.selected;
                setTimeout(function () {
                    nodeFlash(node, num - 1);
                }, 300);
            }
        }
    }
};

/**
 * 自动布局
 * @method autoLayout
 * @param config 自动布局配置参数
 * @example
 *      参数配置:
 *          config:{
 *              type:
 *                  1.'round'   无需其他配置
 *                  2.'default' 需配置行数，列间距，行间距
 *              rows:行数
 *              rowSpace:行间距
 *              columnSpace:列间距
 *          }
 */
Scene.prototype.autoLayout = function (config) {
    if (config && config.type) {
        var needSort = [];
        var jtopos = [];
        this.children.node.forEach(function (v) {
            if (!v.parent) {
                needSort.push(v);
                jtopos.push(v.jtopo);
            }
        });
        switch (config.type) {
            case "round":
                layout_round(this.jtopo, jtopos);
                break;
            case "default":
                layout_default(needSort, parseInt(config.rows), parseInt(config.rowSpace), parseInt(config.columnSpace), this.getOrigin());
                break;
        }
    }
};
function layout_round(scene, jtopos) {
    JTopo.layout.circleLayoutNodes(jtopos, {animate: {time: 1000}});
}
function layout_default(elements, rows, rowSpace, columnSpace, begin) {
    if ($.isNumeric(rows)) {
        rows = parseInt(rows);
        if (rows < 1) {
            rows = 1;
        }
        $.each(elements.sort(function (a, b) {
            return getDegree(b) - getDegree(a);
        }), function (i, v) {
            //v.setLocation(begin.x + (i % rows) * columnSpace, begin.y);
            move(v, begin.x + (i % rows) * columnSpace, begin.y);
            if ((i + 1) % rows == 0) {
                begin.y += rowSpace;
            }
        });
    }
}
//-------工具函数
//获取节点的度
function getDegree(node) {
    var inLinks = node.links.in;
    var outLinks = node.links.out;
    var degree = 0;
    if (inLinks.length == 1) {
        degree += inLinks[0].attr.number;
    } else {
        degree += inLinks.length;
    }
    if (outLinks.length == 1) {
        degree += outLinks[0].attr.number;
    } else {
        degree += outLinks.length;
    }
    return degree;
}
//移动动画
function move(node, targetX, targetY) {
    targetX = parseInt(targetX);
    targetY = parseInt(targetY);
    var x = node.attr.position[0];
    var y = node.attr.position[1];
    var partX = parseInt((targetX - x)) / 10;
    var partY = parseInt((targetY - y)) / 10;
    var part = 0;
    var temp = setInterval(function () {
        if (Math.abs(targetX - x) > 1) {
            x += partX;
        }
        if (Math.abs(targetY - y) > 1) {
            y += partY;
        }
        node.setPosition([parseInt(x), parseInt(y)]);
        part++;
        if (Math.abs(targetX - x) <= 1 && Math.abs(targetY - y) <= 1) {
            clearInterval(temp);
        } else if (part >= 10) {
            clearInterval(temp);
        }
    }, 100);
}

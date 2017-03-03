/**
 * Created by qiyc on 2017/2/7.
 */
//-
var Node = {
    Image: require("./element/node/Image.js"),
    Text: require("./element/node/Text.js")
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
function Scene(stage, config) {
    var self = this;
    self.jtopo = new JTopo.Scene();
    self.jtopo.qtopo = self;
    self.children = {
        node: [],
        link: [],
        container: [],
        line: []
    };
    self.attr = defaults();
    self.extra=config.extra||{};
    stage.add(self.jtopo);
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
Scene.prototype.val=function(key,value){
    if(!value){
        var result;
        if(this.attr[key]){
            result=this.attr[key];
        }else if(this.extra[key]){
            result=this.extra[key];
        }else{
            result=this[key];
        }
        return result;
    }else{
        this.extra[key]=value;
    }
};
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
Scene.prototype.setBackgroundImage = function (image) {
    this.jtopo.background = image;
    this.attr.background = image;
};
Scene.prototype.setBackgroundColor = function (color) {
    this.jtopo.backgroundColor = QTopo.util.transHex(color);
    this.jtopo.alpha = 1;
    this.attr.background = QTopo.util.transHex(color);
};
Scene.prototype.setMode = function (mode) {
    if (["normal", "edit", "drag", "select"].indexOf(mode) > -1) {
        this.attr.mode = mode;
        this.jtopo.mode = mode;
    } else {
        QTopo.util.error("set wrong mode :", mode);
    }
};
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
Scene.prototype.getType = function () {
    return QTopo.constant.SCENE;
};
Scene.prototype.getUseType = function () {
    return QTopo.constant.SCENE;
};
Scene.prototype.on = function (name, fn) {
    this.jtopo.addEventListener(name, function (e) {
        if (e.target && e.target.qtopo) {
            fn(e, e.target.qtopo);
        } else {
            fn(e);
        }
    });
};
Scene.prototype.off = function (name, fn) {
    this.jtopo.removeEventListener(name);
};
Scene.prototype.find = function (scan, type) {
    var children = this.children;
    var result = [];
    var condition = typeof scan == "string" ? scan.split(",") : [];
    if (condition.length > 0) {
        $.each(condition, function (i, term) {
            term = term.split("=");
            //制定了类型，缩小查找范围，未指定则全部遍历
            if (type) {
                switch (type) {
                    case "node":
                        scanArr(children.node, term[0], term[1]);
                        break;
                    case "link":
                        scanArr(children.link, term[0], term[1]);
                        break;
                    case "container":
                        scanArr(children.container, term[0], term[1]);
                        break;
                    case "line":
                        scanArr(children.line, term[0], term[1]);
                        break;
                }
            } else {
                $.each(children, function (j, arr) {
                    scanArr(arr, term[0], term[1]);
                });
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
Scene.prototype.createNode = function (config) {
    var newNode;
    var constant = QTopo.constant.node;
    config = config || {};
    switch (config.type) {
        case constant.TEXT:
            newNode = new Node.Text.constructor(config);
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
 * 根据配置在两个元素之间创建新的链接
 * @param config
 * @returns {*}
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
 * 根据配置在两个元素之间创建链接,若两元素已有链接则原链接计数上加1,提供线路展开
 * @param config
 * @returns {*}
 */
Scene.prototype.addLink = function (config) {
    if (config && config.start && config.end) {
        var links = this.linksBetween(config.start, config.end);//按number属性从大到小排列
        if (links.length > 0) {
            var number = 1;
            if ($.isNumeric(config.number)) {
                number = parseInt(config.number);
            }
            links[0].set({
                number: links[0].attr.number + number
            });
        } else {
            this.createLink(config);
        }
    }
};
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
        if (!(typeof config.toggle.close == "boolean" && config.toggle.close)) {
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
Scene.prototype.remove = function (element) {
    var self=this;
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
Scene.prototype.toJson=function(){
    return this.jtopo.stage.tojson();
};

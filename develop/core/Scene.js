/**
 * Created by qiyc on 2017/2/7.
 */
var Node = {
    Normal: require("./element/node/Normal.js"),
    Text: require("./element/node/Text.js")
};
var Link = {
    Curve: require("./element/link/Curve.js"),
    Direct: require("./element/link/Direct.js"),
    Flexional: require("./element/link/Flexional.js"),
    Fold: require("./element/link/Fold.js")
};
var Container = {
    Group: require("./element/container/Group.js")
};
var events = require("./events.js");
module.exports = Scene;
//画布对象
var defaults = function () {
    return {
        name: '',
        path: [],
        mode: "normal",
        background: ""
    };
};
function Scene(stage, config) {
    var self = this;
    self.jtopo = new JTopo.Scene();
    self.jtopo.qtopo = self;
    self.children = {
        node: [],
        link: [],
        container: []
    };
    self.attr = defaults();
    stage.add(self.jtopo);
    events.init(self);
    //延时执行
    setTimeout(function () {
        if (config.background) {
            self.setBackGround(config.background);
        }
        if (config.mode) {
            self.setMode(config.mode);
        }
    });
}
//scan 格式 aaa=bb,ccc=dd条件之间以,分隔
Scene.prototype.clear = function () {
    console.info("scene clear");
    this.children = {
        node: [],
        link: [],
        container: []
    };
    this.jtopo.clear();
};
Scene.prototype.getType = function () {
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
                }
            } else {
                $.each(children, function (j, arr) {
                    scanArr(arr, term[0], term[1]);
                });
            }
        });
    }
    return result;
    function scanArr(arr, key, value) {
        $.each(arr, function (i, v) {
            if (equal(v, key, value) || equal(v.attr, key, value)) {
                result.push(v);
            }
        });
        return result;
    }

    function equal(object, key, value) {
        return object[key] && object[key] == value;
    }
};
function addJTopo(element) {
    try {
        this.jtopo.add(element.jtopo);
    } catch (e) {
        console.error("In Scene, jtopo add error : ", e);
    }
}
function removeJTopo(element) {
    try {
        this.jtopo.remove(element.jtopo);
    } catch (e) {
        console.error("In Scene, jtopo remove error : ", e);
    }
}
Scene.prototype.createNode = function (config) {
    var newNode;
    config = config || {};
    switch (config.type) {
        case "text":
            newNode = new Node.Text(config);
            break;
        default:
            newNode = new Node.Normal(config);
    }
    if (newNode && newNode.jtopo) {
        addJTopo.call(this, newNode);
        this.children.node.push(newNode);
        return newNode;
    } else {
        console.error("create Node error", config);
        return false;
    }
};
Scene.prototype.createLink = function (config) {
    var newLink;
    config = config || {};
    switch (config.type) {
        case "direct":
            newLink = new Link.Direct(config);
            break;
        case "curve":
            newLink = new Link.Curve(config);
            break;
        case "flexional":
            newLink = new Link.Flexional(config);
            break;
        case "fold":
            newLink = new Link.Fold(config);
            break;
        default:
            newLink = new Link.Direct(config);
    }
    if (newLink && newLink.jtopo) {
        addJTopo.call(this, newLink);
        this.children.link.push(newLink);
        return newLink;
    } else {
        console.error("create Link error", config);
        return false;
    }
};
Scene.prototype.createContainer = function (config) {
    var newContainer;
    config = config || {};
    switch (config.type) {
        default:
            newContainer = new Container.Group(config);
    }
    if (newContainer && newContainer.jtopo) {
        //分组只加入其本身，切换节点不作数
        var nodeConfig = {};
        if (config.toggle) {
            nodeConfig = config.toggle
        }
        nodeConfig.useType = QTopo.constant.CASUAL;
        newContainer.toggleTo = new Node.Normal(nodeConfig);
        newContainer.toggleTo.toggleTo = newContainer;//互相索引
        newContainer.toggleTo.hide();
        addJTopo.call(this, newContainer.toggleTo);

        this.children.container.push(newContainer);
        addJTopo.call(this, newContainer);
        return newContainer;
    } else {
        console.error("create Container error", config);
        return false;
    }
};
Scene.prototype.remove = function (element) {
    if (element && element.jtopo) {
        switch (element.getType()) {
            case QTopo.constant.NODE:
                //临时工不在列表中
                if (QTopo.util.arrayDelete(this.children.node, element) || element.getUseType() == QTopo.constant.CASUAL) {
                    removeNode.call(this, element);
                }
                break;
            case QTopo.constant.LINK:
                if (QTopo.util.arrayDelete(this.children.link, element) || element.getUseType() == QTopo.constant.CASUAL) {
                    removeLink.call(this, element);
                }
                break;
            case QTopo.constant.CONTAINER:
                if (QTopo.util.arrayDelete(this.children.container, element) || element.getUseType() == QTopo.constant.CASUAL) {
                    removeContainer.call(this, element);
                }
                break;
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
        console.error("Scene removeLink error", e);
    }
}
function removeNode(node) {
    //刷新一下现有的线
    try {
        //更新其上线另一头的links属性
        upDataLinks.call(this, node);
        //要更新其父的children属性
        if (node.parent && $.isArray(node.parent.children)) {
            QTopo.util.arrayDelete(node.parent.children, node);
        }
        //删除分组切换的节点时同时删除其切换的分组
        if (node.toggleTo) {
            //分组若隐藏了,应该展示
            node.toggleTo.toggle();
            this.remove(node.toggleTo);
        }
        removeJTopo.call(this, node);
    } catch (e) {
        console.error("Scene removeNode error", e);
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
        console.error("Scene removeContainer error", e);
    }
}
Scene.prototype.goCenter = function () {
    this.jtopo.stage.centerAndZoom();
};
Scene.prototype.setMode = function (mode) {
    this.attr.mode = mode;
    this.jtopo.mode = mode;
};
Scene.prototype.setBackGround = function (background) {
    this.jtopo.background = background;
    this.attr.background = background;
};
Scene.prototype.toggleZIndex = function (element, flag) {
    if (element) {
        var jtopo = element.jtopo;
        var scene = this.jtopo;
        if (jtopo && scene) {
            var map = scene.zIndexMap[jtopo.zIndex];
            var index = map.indexOf(jtopo);
            if (!flag) {
                map.push(map[index]);
                map.splice(index, 1);

            } else {
                map.splice(0, 0, map[index]);
                map.splice(index + 1, 1);
            }
        }
    }
};
Scene.prototype.getCenter=function(){
    return this.jtopo.getCenterLocation();
};
Scene.prototype.getSelected=function(){
    return this.jtopo.selectedElements;
};
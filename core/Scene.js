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
module.exports = Scene;
var Element = require("./element/Element.js");
//画布对象
var defaults = function () {
    return {
        name: '',
        id: '',
        pid: '',
        weight: 1,
        path: [],
        offsetX: 0,
        offsetY: 0,
        mode: "edit",
        background:""
    };
};
function Scene(stage, config) {
    var self = this;
    self.jtopo = new JTopo.Scene();
    self.children = {
        node: [],
        link: [],
        container: []
    };
    self.attr =  QTopo.util.extend(defaults(), config || {});
    self.createNode = createNode;
    self.createLink = createLink;
    self.createContainer = createContainer;
    self.add = add;
    self.on = Element.on;
    self.off = Element.off;
    self.set = setJTopo;
    self.set(config);
    self.center=center;
    self.find = find;
    stage.add(self.jtopo);
}
//scan 格式 aaa=bb,ccc=dd条件之间以,分隔
function find(scan, type) {
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
                $.each(children,function(j,arr){
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
}
function createNode(config) {
    var newNode;
    config = config || {};
    switch (config.type) {
        case "text":
            newNode = new Node.Text(config);
            break;
        default:
            newNode = new Node.Normal(config);
    }
    if (newNode.jtopo) {
        this.add(newNode.jtopo);
        this.children.node.push(newNode);
        return newNode;
    } else {
        console.error("create Node error", config);
        return false;
    }
}
function createLink(config) {
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
    if (newLink.jtopo) {
        this.add(newLink.jtopo);
        this.children.link.push(newLink);
        return newLink;
    } else {
        console.error("create Link error", config);
        return false;
    }
}
function createContainer(config) {
    var newContainer;
    config = config || {};
    switch (config.type) {
        default:
            newContainer = new Container.Group(config);
    }
    if (newContainer.jtopo) {
        this.add(newContainer.jtopo);
        this.children.container.push(newContainer);
        return newContainer;
    } else {
        console.error("create Container error", config);
        return false;
    }
}
function add(element) {
    if (element) {
        this.jtopo.add(element);
    }
}
function setJTopo(config) {
    if (config) {
        var jtopo = this.jtopo;
        QTopo.util.extend(this.attr, config || {});
        if (config.mode) {
            setMode(config.mode);
        }
        if (config.background) {
            jtopo.background = config.background;
        }
    }
}
function center(){
    this.jtopo.stage.centerAndZoom();
}
function setMode(mode) {
    this.attr.mode = mode;
    this.jtopo.mode = mode;
}
//私有函数
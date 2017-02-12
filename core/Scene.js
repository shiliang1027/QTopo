/**
 * Created by qiyc on 2017/2/7.
 */
var Node = {
    Normal: require("./element/node/Normal.js"),
    Text: require("./element/node/Text.js")
};
var Link={
    Curve: require("./element/link/Curve.js"),
    Direct: require("./element/link/Direct.js"),
    Flexional:require("./element/link/Flexional.js"),
    Fold:require("./element/link/Fold.js")
};
var Container={
    Group:require("./element/container/Group.js")
};
module.exports = Scene;
//画布对象
function Scene(stage) {
    var self = this;
    self.jtopo = new JTopo.Scene();
    self.children = {
        node: [],
        link: [],
        group: []
    };
    self.attr = {
        name: '',
        id: '',
        pid: '',
        weight: 1,
        path: [],
        offsetX: 0,
        offsetY: 0
    };
    self.createNode = createNode;
    self.createLink=createLink;
    self.add = add;
    self.on=addEventListener;
    self.set = setJTopo;
    self.setMode=setMode;
    self.setMode("edit");
    stage.add(self.jtopo);
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
    if(newNode.jtopo){
        this.add(newNode.jtopo);
        this.children.node.push(newNode);
        return newNode;
    }else{
        console.error("create Node error",config);
        return false;
    }
}
function createLink(config){
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
    if(newLink.jtopo){
        this.add(newLink.jtopo);
        this.children.link.push(newLink);
        return newLink;
    }else{
        console.error("create Link error",config);
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
        $.extend(true, this.attr, config || {});
        if (config.mode) {
            setMode(config.mode);
        }
        if(config.background){
            jtopo.background = config.background;
        }
    }
}
function setMode(mode) {
    this.attr.mode=mode;
    this.jtopo.mode = mode;
}
function addEventListener(name,fn){
    this.jtopo.addEventListener(name,fn);
}
//私有函数
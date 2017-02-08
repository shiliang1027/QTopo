/**
 * Created by qiyc on 2017/2/7.
 */
var common=require("./common.js");
var Node = require("./node/Node.js");
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
    self.add = add;
    self.set = setJTopo;
    self.setMode=setMode;
    self.on = common.on;
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
    this.add(newNode.jtopo);
    this.children.node.push(newNode);
    return newNode;
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
//私有函数
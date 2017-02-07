/**
 * Created by qiyc on 2017/2/7.
 */
var Node=require("./node/Node.js");
//画布对象
function Scene(stage) {
    var self = this;
    self.jtopo=new JTopo.Scene();
    self.children=[];
    self.attr = {
        name: '',
        id: '',
        pid: '',
        weight: 1,
        path: [],
        offsetX: 0,
        offsetY: 0
    };
    self.createNode=createNode;
    self.add=add;
    self.set=setJTopo;
    self.setMode=setMode;
    self.on=addEventListener;
    self.setMode("edit");
    stage.add(self.jtopo);
}
module.exports =Scene;

function createNode(config){
    var newNode;
    config=config||{};
    switch (config.type){
        case "text":newNode=new Node.Text(config);break;
        default: newNode=new Node.Normal(config);
    }
    this.add(newNode.jtopo);
    this.children.push(newNode);
}
function add(element){
    if(element){
        this.jtopo.add(element);
    }
}
function setJTopo(config){
    if(config){
        var jtopo=this.jtopo;
        $.extend(true, this.attr, config||{});
        if(config.mode){
            setMode(config.mode);
        }
        jtopo.background=config.background;
    }
}
function setMode(mode){
    this.jtopo.mode=mode;
}
function addEventListener(name,fn){
    this.jtopo.addEventListener(name,fn);
}
/**
 * Created by qiyc on 2017/2/7.
 */
var Element=require("../Element.js");
Container.prototype = new Element();
module.exports =Container;
function Container() {
    this.setName=function(name){
        if(this.attr.textPosition!="hide"){
            this.jtopo.text=name;
            this.attr.name=name;
        }
    };
    this.add = function (element) {
        if (!$.isArray(this.children)) {
            this.children = [];
        }
        if(element.jtopo&&this.children.indexOf(element)<0){
            this.children.push(element);
            this.jtopo.add(element.jtopo);
        }
    };
    this.remove=function(element){
        if($.isArray(this.children)&&this.children.indexOf(element)>0){
            this.children.splice(this.children.indexOf(element),1);
            this.jtopo.remove(element.jtopo);
        }
    };
    this.getChildren=function(){
        var children=[];
        var self=this;
        if(self.jtopo&&self.jtopo.childs){
            $.each(self.jtopo.childs,function(i,v){
                if(v.qtopo){
                    children.push(v.qtopo);
                }else{
                    console.error(this,"the child not wraped by qtopo",v);
                }
            });
        }
        this.children=children;
        return children;
    };
    this.getType = function () {
        return "container"
    };
    this.setColor = function (color) {
        if (color) {
            color = QTopo.util.transHex(color.toLowerCase());
            this.jtopo.fillColor = color;
            this.attr.color=color;
        }
    };
    this.setBorder = function (border) {
        if (border.color && $.isNumeric(border.width) && $.isNumeric(border.radius)) {
            this.jtopo.borderColor = QTopo.util.transHex(border.color.toLowerCase());
            this.jtopo.borderWidth = parseInt(border.width);
            this.jtopo.borderRadius = parseInt(border.radius);
            this.attr.border.color=this.jtopo.borderColor;
            this.attr.border.width=this.jtopo.borderWidth;
            this.attr.border.raidus=this.jtopo.borderRadius;
        } else {
            console.error(this,"setBorder need params", border);
        }
    };
    this.setChildren = function (children) {
        if (children) {
            this.jtopo.childDragble = typeof children.dragble == "boolean" ? children.dragble : true;
            this.attr.children.dragble=this.jtopo.childDragble;
        }
    };
}


/**
 * Created by qiyc on 2017/2/20.
 */
    require("./style.css");
var temp=require("./win.html");
var util=require("../util.js");
module.exports={
    init:init
};
function init(dom,scene){
    var node=$(temp);
    util.initBase(dom,node,hide);
    util.colorSelect(node.find(".color-selected"),node.find("[name=color_palette]"));
    util.formSubmit(node.find("form"),function(data){
        scene.createNode({
            font:{
                color:data.color,
                size:data.nameSize
            },
            textPosition:data.textPosition,
            size:[data.size,data.size],
            image:data.image
        });
        hide();
    });
    //唤醒图片选择框
    util.callImageSelect(
        node.find(".image-select-group img"),
        function(data){
            //TODO
        }
    );
    return {
        win:node,
        show:show,
        hide:hide
    };
    function show(){
        node.show();
    }
    function hide(){
        util.clearWin(node);
        node.hide();
    }
}

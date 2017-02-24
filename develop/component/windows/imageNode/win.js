/**
 * Created by qiyc on 2017/2/20.
 */
    require("./style.css");
var temp=require("./win.html");
var util=require("../util.js");
module.exports={
    init:main
};
var defaultAttr={
    name:"",
    color:"255,255,255",
    nameSize:14,
    textPosition:"bottom",
    size:70,
    image:""
};
function main(dom, scene, imageSelect){
    var win=$(temp);
    //窗口打开和关闭事件
    initEvent(win);
    //基本窗口属性初始化
    util.initBase(dom,win);
    //颜色选择框初始化
    util.initColorSelect(win.find(".color-selected"),win.find("[name=color_palette]"));
    //劫持表单
    util.initFormSubmit(win.find("form"),function(data){
        doWithForm(win.todo,scene,data);
        win.trigger("window.close");
    });
    //绑定图片选择框
    doWithImageSelect(win,imageSelect);
    return win;
}
function initEvent(win){
    win.on("window.open",function(e,data){
        if(data){
            switch (data.type){
                case "create":
                    createWindow(win,data.position);
                    break;
                case "edit":
                    editWindow(win,data.target);
                    break;
                default:delete win.todo;
            }
        }
        util.defaultPosition(win);
        win.show();
    });
    win.on("window.close",function(e,data){
        win.hide();
    });
}

function doWithImageSelect(win, imageSelect){
    var btn=win.find(".image-select-group button");
    var input=win.find(".image-select-group input");
    var img=win.find(".image-select-group img");
    btn.click(function(){
        imageSelect.open().then(function(data){
            input.val(data);
            input.attr("title",data);
            img.attr("src",data);
        });
    });
}

function doWithForm(config, scene, data){
    if(config){
        switch (config.type){
            case "create":
                scene.createNode({
                    position:config.position,
                    name:data.name,
                    font:{
                        color:data.color,
                        size:data.nameSize
                    },
                    textPosition:data.textPosition,
                    size:[data.size,data.size],
                    image:data.image
                });
                break;
            case "edit":
                if(config.target&&config.target.getUseType()==QTopo.constant.node.IMAGE){
                    config.target.set({
                        name:data.name,
                        font:{
                            color:data.color,
                            size:data.nameSize
                        },
                        textPosition:data.textPosition,
                        size:[data.size,data.size],
                        image:data.image
                    });
                }
                break;
        }
    }
}
function createWindow(win,position){
    win.todo={
        type:"create",
        position:position
    };
    util.setFormInput(win.find("form"),defaultAttr)
}
function editWindow(win,target){
    win.todo={
        type:"edit",
        target:target
    };
    var attr=target.attr;
    util.setFormInput(win.find("form"),{
        position:attr.position,
        name:attr.name,
        color:attr.font.color,
        nameSize:attr.font.size,
        textPosition:attr.textPosition,
        size:attr.size[0],
        image:attr.image
    });
    win.find(".image-select-group img").attr("src",attr.image);
}
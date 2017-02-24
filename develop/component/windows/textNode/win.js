/**
 * Created by qiyc on 2017/2/20.
 */
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
/**
 * 初始化文字节点的属性操作窗口
 * @param dom  topo对象包裹外壳
 * @param scene topo对象图层
 * @returns {*|jQuery|HTMLElement} 返回初始化后的窗口对象,包含open和close函数
 */
function main(dom, scene){
    var win=$(temp);
    //注册窗口打开和关闭事件
    initEvent(dom,win);
    //基本窗口属性初始化
    util.initBase(dom,win);
    //颜色选择框初始化
    util.initColorSelect(win);
    //劫持表单
    util.initFormSubmit(win.find("form"),function(data){
        doWithForm(win.todo,scene,data);
        win.trigger("window.close");
    });
    return win;
}
function initEvent(dom,win){
    win.on("window.open",function(e,data){
        if(data){
            switch (data.type){
                case "create":
                    createWindow(win,data.position);
                    break;
                case "edit":
                    editWindow(win,data.target);
                    break;
                default:
                    console.error("invalid type of imageWindow,open function need to config like { type:'create' or 'edit'}");
                    if(win.todo){
                        //错误开启窗口，则仅警告且什么也不做
                        delete win.todo;
                    }
            }
        }else{
            console.error("invalid open imageWindow");
        }
        util.defaultPosition(dom,win);
        win.show();
    });
    win.on("window.close",function(e,data){
        win.hide();
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
    if(!position){
        console.error("invalid open imageWindow,need set position to create");
    }
    win.todo={
        type:"create",
        position:position
    };
    util.setFormInput(win.find("form"),defaultAttr)
}
function editWindow(win,target){
    if(!target){
        console.error("invalid open imageWindow,need set target to edit");
    }
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
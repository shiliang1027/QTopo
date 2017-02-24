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
    fontColor:"255,255,255",
    fontSize:14,
    namePosition:"bottom",
    size:70,
    image:""
};
/**
 * 初始化图片节点的属性操作窗口
 * @param dom  topo对象包裹外壳
 * @param scene topo对象图层
 * @param imageSelect 需要支持的一般窗口组件
 * @returns {*|jQuery|HTMLElement} 返回初始化后的窗口对象,包含open和close函数
 */
function main(dom, scene, imageSelect){
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
        win.close();
    });
    //绑定图片选择框
    doWithImageSelect(win,imageSelect);
    return win;
}
function initEvent(dom,win){
    win.on("window.open",function(e,data){
        if(data){
            switch (data.type){
                case "create":
                    win.find(".panel-title").html("创建图片节点");
                    createWindow(win,data.position);
                    break;
                case "edit":
                    win.find(".panel-title").html("修改图片节点");
                    editWindow(win,data.target);
                    break;
                default:
                    console.error("invalid type of imageNodeWindow,open function need to config like { type:'create' or 'edit'}");
                    if(win.todo){
                        //错误开启窗口，则仅警告且什么也不做
                        delete win.todo;
                    }
            }
        }else{
            win.find(".panel-title").html("图片节点");
            console.error("invalid open imageNodeWindow");
        }
        util.defaultPosition(dom,win);
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
                        color:data.fontColor,
                        size:data.fontSize
                    },
                    namePosition:data.namePosition,
                    size:[data.size,data.size],
                    image:data.image
                });
                break;
            case "edit":
                if(config.target&&config.target.getUseType()==QTopo.constant.node.IMAGE){
                    config.target.set({
                        name:data.name,
                        font:{
                            color:data.fontColor,
                            size:data.fontSize
                        },
                        namePosition:data.namePosition,
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
        console.error("invalid open imageNodeWindow,need set position to create");
    }
    win.todo={
        type:"create",
        position:position
    };
    util.setFormInput(win.find("form"),defaultAttr)
}
function editWindow(win,target){
    if(!target){
        console.error("invalid open imageNodeWindow,need set target to edit");
    }
    win.todo={
        type:"edit",
        target:target
    };
    var attr=target.attr;
    util.setFormInput(win.find("form"),{
        position:attr.position,
        name:attr.name,
        fontColor:attr.font.color,
        fontSize:attr.font.size,
        namePosition:attr.namePosition,
        size:attr.size[0],
        image:attr.image
    });
    win.find(".image-select-group img").attr("src",attr.image);
}
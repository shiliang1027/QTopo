/**
 * Created by qiyc on 2017/2/20.
 */
var temp=require("./win.html");
var util=require("../util.js");
module.exports={
    init:main
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
    initEvent(dom,win,scene);
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
    win.find(".image-select-group button").click(function(){
        imageSelect.open().then(function(data){
            setImageBtn(win,data);
        });
    });
    return win;
}
function initEvent(dom,win,scene){
    win.on("window.open",function(e,data){
        if(data){
            switch (data.type){
                case "create":
                    win.find(".panel-title").html("创建图片节点");
                    createWindow(win,data.position,scene);
                    break;
                case "edit":
                    win.find(".panel-title").html("修改图片节点");
                    editWindow(win,data.target,scene);
                    break;
                default:
                    QTopo.util.error("invalid type of imageNodeWindow,open function need to config like { type:'create' or 'edit'}");
                    if(win.todo){
                        //错误开启窗口，则仅警告且什么也不做
                        delete win.todo;
                    }
            }
        }else{
            win.find(".panel-title").html("图片节点非正常打开");
            QTopo.util.error("invalid open imageNodeWindow");
        }
        util.defaultPosition(dom,win);
        win.show();
    });
    win.on("window.close",function(e,data){
        win.hide();
    });
}
function setImageBtn(win,image){
    win.find(".image-select-group input").attr("title",image).val(image);
    win.find(".image-select-group img").attr("src",image);
}
function doWithForm(config, scene, data){
    if(config){
        switch (config.type){
            case "create":
                scene.createNode({
                    type:QTopo.constant.node.IMAGE,
                    position:config.position,
                    name:data.name,
                    font:{
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
function createWindow(win,position,scene){
    if(!position){
        QTopo.util.error("invalid open imageNodeWindow,need set position to create");
    }
    win.todo={
        type:"create",
        position:position
    };
    var DEFAULT=scene.getDefault(QTopo.constant.node.IMAGE);
    util.setFormInput(win.find("form"),{
        name:DEFAULT.name,
        fontSize:DEFAULT.font.size,
        namePosition:DEFAULT.namePosition,
        size:DEFAULT.size[0],
        image:DEFAULT.image
    });
    setImageBtn(win,DEFAULT.image);
}
function editWindow(win,target,scene){
    if(!target){
        QTopo.util.error("invalid open imageNodeWindow,need set target to edit");
    }
    win.todo={
        type:"edit",
        target:target
    };
    var attr=target.attr;
    util.setFormInput(win.find("form"),{
        position:attr.position,
        name:attr.name,
        fontSize:attr.font.size,
        namePosition:attr.namePosition,
        size:attr.size[0],
        image:attr.image
    });
    win.find(".image-select-group img").attr("src",attr.image);
}
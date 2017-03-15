/**
 * Created by qiyc on 2017/3/6.
 */
/**
 * Created by qiyc on 2017/2/20.
 */
var temp=require("./win.html");
var util=require("../util.js");
module.exports={
    init:main
};
/**
 * 初始化分组的属性操作窗口
 * @param dom  topo对象包裹外壳
 * @param scene topo对象图层
 * @param tools 需要支持的一般窗口组件
 * @returns {*|jQuery|HTMLElement} 返回初始化后的窗口对象,包含open和close函数
 */
function main(dom, scene, tools){
    var win=$(temp);
    var imageSelect=tools.imageSelect;
    //注册窗口打开和关闭事件
    initEvent(dom,win,scene);
    //基本窗口属性初始化
    util.initBase(dom,win);
    //劫持表单
    util.initFormSubmit(win.find("form"),function(data){
        doWithForm(win,scene,data);
        win.close();
    });
    //绑定图片选择框
    win.find(".image-select-group button").click(function(){
        imageSelect.open().then(function(data){
            setImageBtn(win,data);
        });
    });
    win.find("button.style-open").click(function(){
        tools.styleSelect.open(win.data("styleSelect"))
            .then(function(data){
                win.data("styleSelect",data);
            });
    });
    return win;
}
function initEvent(dom,win,scene){
    win.on("window.open",function(e,data){
        if(data){
            switch (data.type){
                case "create":
                    win.find(".panel-title").html("创建分组");
                    createWindow(win,data.targets,scene);
                    break;
                case "edit":
                    win.find(".panel-title").html("修改分组");
                    editWindow(win,data.target,scene);
                    break;
                default:
                    QTopo.util.error("invalid type of group,open function need to config like { type:'create' or 'edit'}");
                    if(win.todo){
                        //错误开启窗口，则仅警告且什么也不做
                        delete win.todo;
                    }
            }
        }else{
            win.find(".panel-title").html("分组非正常打开");
            QTopo.util.error("invalid open groupWindow");
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
function doWithForm(win, scene, data){
    var style=getStyle(win);
    var todo=win.todo;
    if(todo){
        switch (todo.type){
            case "create":
                $.extend(true,style,{
                    type:QTopo.constant.node.IMAGE,
                    position:todo.position,
                    name:data.name,
                    image:data.image
                });
                var container=scene.createContainer(style);
                container.add(todo.targets);
                break;
            case "edit":
                if(todo.target&&todo.target.getUseType()==QTopo.constant.container.GROUP){
                    $.extend(true,style,{
                        name:data.name,
                        namePosition:data.namePosition
                    });
                    todo.target.set(style);
                    todo.target.toggleTo.set({
                        name:data.name,
                        image:data.image
                    });
                }
                break;
        }
    }
}
function createWindow(win,targets,scene){
    if(!targets){
        QTopo.util.error("invalid open containerWindow,need set targets to create");
    }
    win.todo={
        type:"create",
        targets:targets
    };
    var DEFAULT=scene.getDefault(QTopo.constant.container.GROUP);
    setStyle(win,DEFAULT);
    var DEFAULTNODE=scene.getDefault(QTopo.constant.node.IMAGE);
    util.setFormInput(win.find("form"),{
        name:DEFAULT.name,
        namePosition:DEFAULT.namePosition,
        image:DEFAULTNODE.image
    });
    setImageBtn(win,DEFAULTNODE.image);
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
    setStyle(win,attr);
    util.setFormInput(win.find("form"),{
        name:attr.name,
        namePosition:attr.namePosition,
        image:target.toggleTo.attr.image
    });
    setImageBtn(win,target.toggleTo.attr.image);
}
function setStyle(win,attr){
    win.data("styleSelect",{
        namePosition:attr.namePosition,
        width:attr.size[0],
        height:attr.size[1],
        fontColor:attr.font.color,
        fontSize:attr.font.size,
        borderColor:attr.border.color,
        borderWidth:attr.border.width,
        borderRadius:attr.border.radius
    });
}
function getStyle(win){
    var data=win.data("styleSelect");
    if(data){
        return {
            namePosition:data.namePosition,
            size:[data.width,data.height],
            font:{
                color:data.fontColor,
                size:data.fontSize
            },
            border:{
                color:data.borderColor,
                width:data.borderWidth,
                radius:data.borderRadius
            }
        };
    }
    return {};
}
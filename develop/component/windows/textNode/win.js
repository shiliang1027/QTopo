/**
 * Created by qiyc on 2017/2/20.
 */
var temp=require("./win.html");
var util=require("../util.js");
module.exports={
    init:main
};
/**
 * 初始化文字节点的属性操作窗口
 * @param dom  topo对象包裹外壳
 * @param scene topo对象图层
 * @param tools topo工具窗口
 * @returns {*|jQuery|HTMLElement} 返回初始化后的窗口对象,包含open和close函数
 */
function main(dom, scene,tools){
    var win=$(temp);
    var styleSelect=tools.styleSelect;
    //注册窗口打开和关闭事件
    initEvent(dom,win,scene);
    //基本窗口属性初始化
    util.initBase(dom,win);
    //劫持表单
    util.initFormSubmit(win.find("form"),function(data){
        doWithForm(win,scene,data);
        win.close();
    });
    //绑定样式选择窗口
    win.find("button.style-open").click(function(){
        styleSelect.open(win.data("styleSelect"))
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
                    win.find(".panel-title").html("创建文本节点");
                    openCreateWindow(win,data.position,scene);
                    break;
                case "edit":
                    win.find(".panel-title").html("修改文本节点");
                    openEditWindow(win,data.target,scene);
                    break;
                default:
                    QTopo.util.error("invalid type of textNodeWindow,open function need to config like { type:'create' or 'edit'}");
                    if(win.todo){
                        //错误开启窗口，则仅警告且什么也不做
                        delete win.todo;
                    }
            }
        }else{
            win.find(".panel-title").html("文本节点非正常打开");
            QTopo.util.error("invalid open textNodeWindow");
        }
        util.defaultPosition(dom,win);
        win.show();
    });
    win.on("window.close",function(e,data){
        win.hide();
    });
}
function doWithForm(win, scene, data){
    var config=win.todo;
    var style=getStyle(win);
    if(config){
        switch (config.type){
            case "create":
                $.extend(style,{
                    type:QTopo.constant.node.TEXT,
                    position:config.position,
                    text:data.text
                });
                scene.createNode(style);
                break;
            case "edit":
                if(config.target&&config.target.getUseType()==QTopo.constant.node.TEXT){
                    $.extend(style,{
                        text:data.text
                    });
                    config.target.set(style);
                }
                break;
        }
    }
}
function openCreateWindow(win, position,scene){
    if(!position){
        QTopo.util.error("invalid open textNodeWindow,need set position to create");
    }
    win.todo={
        type:"create",
        position:position
    };
    var DEFAULT=scene.getDefault(QTopo.constant.node.TEXT);
    setStyle(win,DEFAULT);
    util.setFormInput(win.find("form"),{
        text:""
    })
}
function openEditWindow(win, target,scene){
    if(!target){
        QTopo.util.error("invalid open textNodeWindow,need set target to edit");
    }
    win.todo={
        type:"edit",
        target:target
    };
    var attr=target.attr;
    setStyle(win,attr);
    util.setFormInput(win.find("form"),{
        text:attr.text
    });
}
function setStyle(win,attr){
    win.data("styleSelect",{
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
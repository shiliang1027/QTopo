/**
 * Created by qiyc on 2017/2/20.
 */
var temp=require("./win.html");
var util=require("../util.js");
module.exports={
    init:main
};
var defaultAttr={
    number:"",
    type:"direct",
    color: '22,124,255',
    width:2,
    curveOffset:200,
    direction:"horizontal",
    arrow_start:"false",
    arrow_end:"false",
    dashed:"false"
};
/**
 * 初始化对链接的属性操作窗口
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
    //选择框切换
    initSelect(win);
    //劫持表单
    util.initFormSubmit(win.find("form"),function(data){
        //doWithForm(win.todo,scene,data);
        console.info(data);
        win.close();
    });
    return win;
}
function initEvent(dom,win){
    win.on("window.open",function(e,data){
        if(data){
            switch (data.type){
                case "create":
                    win.find(".panel-title").html("创建链接");
                    createWindow(win,data.path);
                    break;
                case "edit":
                    win.find(".panel-title").html("修改链接");
                    editWindow(win,data.target);
                    break;
                default:
                    console.error("invalid type of linkAttrWindow,open function need to config like { type:'create' or 'edit'}");
                    if(win.todo){
                        //错误开启窗口，则仅警告且什么也不做
                        delete win.todo;
                    }
            }
        }else{
            win.find(".panel-title").html("链接属性");
            console.error("invalid open linkWindow");
        }
        util.defaultPosition(dom,win);
        win.show();
    });
    win.on("window.close",function(e,data){
        win.hide();
    });
}
function initSelect(win){
    var curveOffset=win.find("[name=curveOffset]").closest(".form-group").hide();
    var direction=win.find("[name=direction]").closest(".form-group").hide();
    win.find("select[name=type]").change(function(e,value){
        var self=$(this);
        if(value){
            self.val(value);
        }
        switch (self.val()){
            case "direct":curveOffset.hide();direction.hide();break;
            case "fold":curveOffset.hide();direction.show();break;
            case "flexional":curveOffset.hide();direction.show();break;
            case "curve":curveOffset.show();direction.hide();break;
        }
    });
}
function doWithForm(config, scene, data){
    if(config){
        switch (config.type){
            case "create":
                break;
            case "edit":
                if(config.target&&config.target.getType()==QTopo.constant.LINK&&config.target.getUseType()!=QTopo.constant.CASUAL){
                    config.target.set({

                    });
                }
                break;
        }
    }
}
function createWindow(win,path){
    if(!path||!path.start||!path.end){
        console.error("invalid open linkAttrWindow,need set path.start and path.end to create");
    }
    win.todo={
        type:"create",
        path:path
    };
    win.find("select[name=type]").attr("disabled","false");
    util.setFormInput(win.find("form"),defaultAttr)
}
function editWindow(win,target){
    if(!target){
        console.error("invalid open linkAttrWindow,need set target to edit");
    }
    win.todo={
        type:"edit",
        target:target
    };
    var selectType=win.find("select[name=type]");
    var attr=target.attr;
    util.setFormInput(win.find("form"),{
        number:attr.num,
        type:choseType(target),
        color: attr.color,
        width:attr.width,
        curveOffset:attr.curveOffset,
        arrow_start:attr.arrow.start+"",
        arrow_end:attr.arrow.end+"",
        dashed: ($.isNumeric(attr.dashed)?true:false)+""
    });
    selectType.change(attr.direction);
    selectType.attr("disabled","true");
    function choseType(target){
        var type="";
        switch (target.getUseType()){
            case QTopo.constant.link.DIRECT:
                type="direct";break;
            case QTopo.constant.link.CURVE:
                type="curve";break;
            case QTopo.constant.link.FLEXIONAL:
                type="flexional";break;
            case QTopo.constant.link.FOLD:
                type="fold";break;
        }
        return type;
    }
}
var temp = require("./win.html");
var util = require("../util.js");
module.exports = {
    init: init
};
/*
 * 初始化对链接的属性操作窗口
 * @param dom  topo对象包裹外壳
 * @param scene topo对象图层
 * @param tools topo工具窗口
 * @returns {*|jQuery|HTMLElement} 返回初始化后的窗口对象,包含open和close函数
 */
function init(dom, scene, tools) {
    var win = $(temp);
    //选择框切换
    //注册窗口打开和关闭事件
    initEvent(dom, win,scene);
    //基本窗口属性初始化
    util.initBase(dom, win);
    //劫持表单
    util.initFormSubmit(win.find("form"), function (data) {
        doWithForm(win, scene, data);
        win.close();
    });
    //绑定样式选择窗口
    win.find("button.style-open").click(function(){
        tools.styleSelect
            .open(openStyle(win,scene))
            .then(function(data){
                doWithSyle(win,scene,data)
            });
    });
    //类型选择框
    win.find("select[name=type]").change(function (e) {
        changeType(win,$(this).val());
    });
    return win;
}
function initEvent(dom, win,scene) {
    win.on("window.open", function (e) {
        var todo=win.data("todo");
        if (todo) {
            switch (todo.type) {
                case "create":
                    win.find(".panel-title").html("创建链接");
                    createWindow(win, todo.path,scene);
                    break;
                case "edit":
                    win.find(".panel-title").html("修改链接");
                    editWindow(win, todo.target,scene);
                    break;
                default:
                    QTopo.util.error("invalid type of linkAttrWindow,open function need to config like { type:'create' or 'edit'}");
            }
        } else {
            win.find(".panel-title").html("链接属性");
            QTopo.util.error("invalid open linkWindow");
        }
    });
}
function changeType(win,type){
    win.data("selectedType",type||"direct");
}
function doWithForm(win, scene, data) {
    var todo=win.data("todo");
    var linkType=win.data("selectedType");
    if (todo) {
        var linkSet=getSet(data);
        linkSet.type=toQTopoType(linkType);
        switch (todo.type) {
            case "create":
                linkSet.start=todo.path.start;
                linkSet.end=todo.path.end;
                scene.createLink(linkSet);
                break;
            case "edit":
                if (todo.target && todo.target.getType() == QTopo.constant.LINK && todo.target.getUseType() != QTopo.constant.CASUAL) {
                    todo.target.set(linkSet);
                }
                break;
        }
    }
}
function doWithSyle(win, scene, data){
    var todo=win.data("todo");
    var linkType=win.data("selectedType");
    var style=getStyle(data,linkType);
    switch (todo.type){
        case'edit':
            todo.target.set(style);
            break;
        case 'create':
            scene.setDefault(toQTopoType(linkType),style);
            break;
    }
}
function getSet(data) {
    return {
        arrow: {
            start: data.arrow_start||"false",
            end: data.arrow_end||"false"
        },
        number: data.number
    };
}
function toQTopoType(type) {
    var newType="";
    switch (type) {
        case "direct" :
            newType = QTopo.constant.link.DIRECT;
            break;
        case "curve":
            newType = QTopo.constant.link.CURVE;
            break;
        case "flexional":
            newType = QTopo.constant.link.FLEXIONAL;
            break;
        case "fold":
            newType = QTopo.constant.link.FOLD;
            break;
    }
    return newType;
}
function toSelectType(target) {
    var type = "";
    switch (target.getUseType()) {
        case QTopo.constant.link.DIRECT:
            type = "direct";
            break;
        case QTopo.constant.link.CURVE:
            type = "curve";
            break;
        case QTopo.constant.link.FLEXIONAL:
            type = "flexional";
            break;
        case QTopo.constant.link.FOLD:
            type = "fold";
            break;
    }
    return type;
}
function createWindow(win, path,scene) {
    if (!path || !path.start || !path.end) {
        QTopo.util.error("invalid open linkAttrWindow,need set path.start and path.end to create");
    }
    win.find("select[name=type]").attr("disabled", false);
    var DEFAULT=scene.getDefault(QTopo.constant.link.DIRECT);
    util.setFormInput(win.find("form"), {
        number: DEFAULT.number,
        type: "direct",
        arrow_start: DEFAULT.arrow.start+"",
        arrow_end: DEFAULT.arrow.end+""
    });
    changeType(win,"direct");
}
function editWindow(win, target,scene) {
    if (!target) {
        QTopo.util.error("invalid open linkAttrWindow,need set target to edit");
    }
    var selectType = win.find("select[name=type]");
    var attr = target.attr;
    var type=toSelectType(target);
    util.setFormInput(win.find("form"), {
        number: attr.number,
        type: type,
        arrow_start: attr.arrow.start + "",
        arrow_end: attr.arrow.end + ""
    });
    selectType.attr("disabled", true);
    changeType(win,type);
}
function openStyle(win,scene){
    var todo=win.data("todo");
    var linkType=win.data("selectedType");
    var DEFAULT=scene.getDefault(toQTopoType(linkType));
    var style="";
    switch (todo.type){
        case'edit':
            style=setStyle(todo.target.attr,linkType);
            break;
        case 'create':
            style=setStyle(DEFAULT,linkType);
            break;
    }
    return style;
}
function setStyle(attr,type){
    var data={
        width:attr.width,
        fontColor:attr.font.color,
        fontSize:attr.font.size,
        linkGap:attr.gap,
        linkDash:attr.dashed,
        color:attr.color,
        arrowSize:attr.arrow.size,
        arrowOffset:attr.arrow.offset,
        arrowType:attr.arrow.type
    };
    switch (type){
        case "direct" :
            data.linkOffset=attr.offset;
            break;
        case "curve":
            data.linkOffset=attr.offset;
            break;
        case "flexional":
            data.linkOffset=attr.offset;
            data.linkRadius=attr.radius;
            data.direction=attr.direction;
            break;
        case "fold":
            data.linkRadius=attr.radius;
            data.direction=attr.direction;
            break;
    }
    return data;
}
function getStyle(data,type){
    if(data){
        var result={
            width:data.width,
            font:{
                color:data.fontColor,
                size:data.fontSize
            },
            gap:data.linkGap,
            dashed:data.linkDash,
            color:data.color,
            arrow:{
                size:data.arrowSize,
                offset:data.arrowOffset,
                type:data.arrowType
            }
        };
        switch (type){
            case "direct" :
                result.offset=data.linkOffset;
                break;
            case "curve":
                result.offset=data.linkOffset;
                break;
            case "flexional":
                result.offset=data.linkOffset;
                result.radius=data.linkRadius;
                result.direction=data.direction;
                break;
            case "fold":
                result.radius=data.linkRadius;
                result.direction=data.direction;
                break;
            default:
                result.offset=data.linkOffset;
        }
        return result;
    }
    return {};
}
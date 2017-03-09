/**
 * Created by qiyc on 2017/2/20.
 */
var temp = require("./win.html");
var util = require("../util.js");
module.exports = {
    init: main
};
/**
 * 初始化对链接的属性操作窗口
 * @param dom  topo对象包裹外壳
 * @param scene topo对象图层
 * @returns {*|jQuery|HTMLElement} 返回初始化后的窗口对象,包含open和close函数
 */
function main(dom, scene) {
    var win = $(temp);
    //选择框切换
    var changeSelect=initSelect(win);
    //注册窗口打开和关闭事件
    initEvent(dom, win,scene,changeSelect);
    //基本窗口属性初始化
    util.initBase(dom, win);
    //初始化颜色选择
    util.initColorSelect(win);
    //劫持表单
    util.initFormSubmit(win.find("form"), function (data) {
        doWithForm(win.todo, scene, data);
        win.close();
    });
    return win;
}
function initEvent(dom, win,scene,changeSelect) {
    win.on("window.open", function (e, data) {
        if (data) {
            switch (data.type) {
                case "create":
                    win.find(".panel-title").html("创建链接");
                    createWindow(win, data.path,scene);
                    break;
                case "edit":
                    win.find(".panel-title").html("修改链接");
                    editWindow(win, data.target,scene,changeSelect);
                    break;
                default:
                    QTopo.util.error("invalid type of linkAttrWindow,open function need to config like { type:'create' or 'edit'}");
                    if (win.todo) {
                        //错误开启窗口，则仅警告且什么也不做
                        delete win.todo;
                    }
            }
        } else {
            win.find(".panel-title").html("链接属性");
            QTopo.util.error("invalid open linkWindow");
        }
        util.defaultPosition(dom, win);
        win.show();
    });
    win.on("window.close", function (e, data) {
        win.hide();
    });
}
function initSelect(win) {
    var curveOffset = win.find("[name=curveOffset]").closest(".form-group").hide();
    var direction = win.find("[name=direction]").closest(".form-group").hide();
    win.find("select[name=type]").change(function (e, value) {
        var self = $(this);
        if (value) {
            self.val(value);
        }
        changeSelect(self.val());
    });
    function changeSelect(value){
        switch (value) {
            case "direct":
                curveOffset.hide();
                direction.hide();
                break;
            case "fold":
                curveOffset.hide();
                direction.show();
                break;
            case "flexional":
                curveOffset.hide();
                direction.show();
                break;
            case "curve":
                curveOffset.show();
                direction.hide();
                break;
        }
    }
    return changeSelect;
}
function doWithForm(config, scene, data) {
    if (config) {
        switch (config.type) {
            case "create":
                var set=getSet(data);
                if(!data.type){
                    set.type="direct";
                }else{
                    set.type=choseType(data.type);
                }
                set.start=config.path.start;
                set.end=config.path.end;
                scene.createLink(set);
                break;
            case "edit":
                if (config.target && config.target.getType() == QTopo.constant.LINK && config.target.getUseType() != QTopo.constant.CASUAL) {
                    config.target.set(getSet(data));
                }
                break;
        }
    }
    function choseType(type) {
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
}
function getSet(data) {
    var set = {
        arrow: {
            start: data.arrow_start,
            end: data.arrow_end
        },
        color:data.color,
        direction: data.direction,
        curveOffset: data.curveOffset,
        number: data.number,
        dashed:data.dashed=="true"?10:null
    };
    if (data.arrow_start == "true" || data.arrow_end == "true") {
        set.arrow.size = 10;
    } else {
        set.arrow.size = 0;
    }
    return set;
}
function createWindow(win, path,scene) {
    if (!path || !path.start || !path.end) {
        QTopo.util.error("invalid open linkAttrWindow,need set path.start and path.end to create");
    }
    win.todo = {
        type: "create",
        path: path
    };
    win.find("select[name=type]").attr("disabled", false);
    var DEFAULT=scene.getDefault(QTopo.constant.link.DIRECT);
    util.setFormInput(win.find("form"), {
        number: DEFAULT.number,
        type: "direct",
        color: DEFAULT.color,
        curveOffset: 200,
        direction: "horizontal",
        arrow_start: DEFAULT.arrow.start+"",
        arrow_end: DEFAULT.arrow.end+"",
        dashed: $.isNumeric(DEFAULT.dashed).toString()
    });
}
function editWindow(win, target,scene,changeSelect) {
    if (!target) {
        QTopo.util.error("invalid open linkAttrWindow,need set target to edit");
    }
    win.todo = {
        type: "edit",
        target: target
    };
    var selectType = win.find("select[name=type]");
    var attr = target.attr;
    var type=choseType(target);
    util.setFormInput(win.find("form"), {
        number: attr.number,
        type: type,
        color: attr.color,
        direction: attr.direction,
        curveOffset: attr.curveOffset,
        arrow_start: attr.arrow.start + "",
        arrow_end: attr.arrow.end + "",
        dashed: $.isNumeric(attr.dashed).toString()
    });
    changeSelect(type);
    selectType.attr("disabled", true);
    function choseType(target) {
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
}
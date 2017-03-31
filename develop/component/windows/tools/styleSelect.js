var temp = require("./styleSelect.html");
var util = require("../util.js");
module.exports = {
    init: init
};
/*
 * 公用的样式选择窗口
 * @param dom
 * @param scene
 * @returns {*}窗口的Jquery对象 包含open函数，函数返回一个延迟函数，在确认按钮点击后释放
 */
function init(dom, scene) {
    temp = $(temp);
    initChildren(temp);
    var styleBoxs = getStyleBoxs(temp);
    var body = temp.find(".modal-body");
    var deferred;
    var callBack;
    //隐藏时清空active类
    temp.on("hide.bs.modal", function (e) {
        if (deferred && deferred.state() == "pending") {
            deferred.reject();
        }
    });
    //暴露的接口
    temp.open = function (config) {
        deferred = $.Deferred();
        temp.modal('show');
        callBack = filterBox(config, styleBoxs);
        return deferred.promise();
    };
    //点击确认按钮后用选中图片释放延迟函数
    temp.find(".ok").on("click", function () {
        if (deferred && deferred.state() == "pending") {
            var result = getResult(callBack);
            deferred.resolve(result);
        }
        temp.modal('hide');
    });
    return temp
}
function initChildren(win) {
    //颜色选择框初始化
    util.initColorSelect(win.find(".color-group"));
}
function getStyleBoxs(win) {
    var boxs = {};
    win.find(".style-box").each(function () {
        var self = $(this);
        boxs[self.attr("name")] = self;
    });
    return boxs;
}
//根据参数决定显示哪些属性
function filterBox(config, styleBoxs) {
    var callBack = {};
    var value;
    $.each(styleBoxs, function (name, box) {
        if (config) {
            value=config[name];
            if (typeof value!='undefined') {
                box.show();
                callBack[name] = box;
                boxValue(box,value);
            } else {
                box.hide();
            }
        } else {
            callBack = styleBoxs;
            box.show();
        }
    });
    return callBack;
}
function getResult(callBack) {
    var result = {};
    if (callBack) {
        $.each(callBack, function (name, box) {
            result[name] = boxValue(box);
        })
    }
    return result;
}
function boxValue(box, value) {
    var output = box.find(".row-item input");
    if (output.length == 0) {
        output = box.find(".row-item select");
    }
    if (value) {
        output.val(value);
    } else {
        return output.val();
    }
}
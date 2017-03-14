/**
 * Created by qiyc on 2017/2/20.
 */
require("./tools/style.css");
require("./windows.css");
require("./tools.css");
//-----工具类窗口
var tools = {
    imageSelect: require("./tools/imageSelect.js"),
    styleSelect:require("./tools/styleSelect.js"),
    confirm: require("./tools/confirm.js"),
    view: require("./tools/view.js"),
    tips: require("./tools/tips.js"),
    progress: require("./tools/progress.js"),
    loading: require("./tools/loading.js")
};
//-----设置类窗口
var wins = {
    imageNode: require("./imageNode/win.js"),
    textNode: require("./textNode/win.js"),
    linkAttr: require("./link/win.js"),
    autoLayout: require("./autoLayout/win.js"),
    container: require("./container/win.js")
};
module.exports = {
    init: init,
    set: set
};
/**
 * 初始化窗口组件
 * @param instance topo实例化对象
 */
function init(instance) {
    var wrap = getWrap(instance.document, "qtopo-windows");
    //公用窗口
    var tools = initToolsWindow(wrap, instance.document, instance.scene);
    //私有窗口
    var wins = initPrivateWin(wrap, tools, instance.document, instance.scene);
    return {
        windows: wins,
        tools: tools
    };
}

function initToolsWindow(wrap, dom, scene) {
    var commonWrap = getWrap(wrap, "qtopo-windows-tools");
    var result = {};
    $.each(tools, function (name, jq) {
            result[name] = jq.init(dom, scene);
            commonWrap.append(result[name]);
    });
    return result;
}
function initPrivateWin(wrap, tools, dom, scene) {
    //---windows
    var elementWrap = getWrap(wrap, "qtopo-windows-elements");
    var result={};
    $.each(wins,function(name,jq){
        result[name]=jq.init(dom, scene, tools);
        elementWrap.append(result[name]);
    });
    return result;
}
function getWrap(dom, clazz) {
    //添加外壳
    dom = $(dom);
    var wrap = dom.find("." + clazz);
    if (wrap.length == 0) {
        wrap = $("<div class='" + clazz + "'></div>");
        dom.append(wrap);
    }
    return wrap;
}
function set(config) {

}
/**
 * Created by qiyc on 2017/2/20.
 */
require("./common/style.css");
require("./windows.css");
//-----
var imageSelect = require("./common/imageSelect.js");
//-----
var imageNode = require("./imageNode/win.js");
var textNode=require("./textNode/win.js");
var linkAttr=require("./link/win.js");
module.exports = {
    init: init
};
var images = [
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png"
];
/**
 * 初始化窗口组件
 * @param instance topo实例化对象
 */
function init(instance) {
    var wrap = getWrap(instance.document, "qtopo-windows");
    //公用窗口
    var tools=initToolsWindow(wrap);
    //私有窗口
    return initPrivateWin(wrap,tools,instance.document,instance.scene);
}
function initToolsWindow(wrap){
    var commonWrap = getWrap(wrap, "qtopo-windows-common");
    var imageSelectWin = imageSelect.init(images);
    commonWrap.append(imageSelectWin);
    return{
        imageSelect:imageSelectWin
    }
}
function initPrivateWin(wrap,tools,dom,scene){
    //---node windows
    var nodeWrap = getWrap(wrap, "qtopo-windows-node");
    var imageNodeWin = imageNode.init(dom, scene, tools.imageSelect);
    nodeWrap.append(imageNodeWin);
    //---
    var textNodeWin= textNode.init(dom, scene);
    nodeWrap.append(textNodeWin);
    //---
    var linkWin=linkAttr.init(dom, scene);
    nodeWrap.append(linkWin);
    return {
        node:{
            image:imageNodeWin,
            text:textNodeWin
        },
        link:linkWin
    }
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
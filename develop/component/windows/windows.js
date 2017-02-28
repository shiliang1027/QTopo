/**
 * Created by qiyc on 2017/2/20.
 */
require("./tools/style.css");
require("./windows.css");
//-----工具类窗口
var imageSelect = require("./tools/imageSelect.js");
var confirm=require("./tools/confirm.js");
var view=require("./tools/view.js");
var tips=require("./tools/tips.js");
var progress=require("./tools/progress.js");
//-----设置类窗口
var imageNode = require("./imageNode/win.js");
var textNode=require("./textNode/win.js");
var linkAttr=require("./link/win.js");
var autoLayout=require("./autoLayout/win.js");
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
    var tools=initToolsWindow(wrap,instance.document,instance.scene);
    //私有窗口
    var wins=initPrivateWin(wrap,tools,instance.document,instance.scene);
    return {
        windows:wins,
        tools:tools
    };
}

function initToolsWindow(wrap,dom,scene){
    var commonWrap = getWrap(wrap, "qtopo-windows-tools");
    var imageSelectWin = imageSelect.init(images);
    var progressWin=progress.init(dom);
    var confirmWin=confirm.init(dom);
    var viewWin=view.init(dom);
    var tipsWin=tips.init(scene);
    commonWrap.append(imageSelectWin);
    commonWrap.append(progressWin);
    commonWrap.append(confirmWin);
    commonWrap.append(viewWin);
    commonWrap.append(tipsWin);
    return{
        imageSelect:imageSelectWin,
        confirm:confirmWin,
        tips:tipsWin,
        progress:progressWin,
        view:viewWin
    }
}
function initPrivateWin(wrap,tools,dom,scene){
    //---node windows
    var nodeWrap = getWrap(wrap, "qtopo-windows-elements");
    var imageNodeWin = imageNode.init(dom, scene, tools.imageSelect);
    nodeWrap.append(imageNodeWin);
    //---
    var textNodeWin= textNode.init(dom, scene);
    nodeWrap.append(textNodeWin);
    //---
    var linkWin=linkAttr.init(dom, scene);
    nodeWrap.append(linkWin);
    //---
    var autoLayoutWin=autoLayout.init(dom, scene);
    nodeWrap.append(autoLayoutWin);
    return {
        node:{
            image:imageNodeWin,
            text:textNodeWin
        },
        link:linkWin,
        autoLayout:autoLayoutWin
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
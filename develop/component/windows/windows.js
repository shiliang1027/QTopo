/**
 * Created by qiyc on 2017/2/20.
 */
require("./common/style.css");
require("./windows.css");
var normalNode=require("./normalNode/win.js");
var imageSelect=require("./common/imageSelect.js");
module.exports={
    init:init
};
var images=[
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png",
    "img/mo/eNodeB.png","img/mo/eNodeB_1.png","img/mo/eNodeB_2.png","img/mo/eNodeB_3.png","img/mo/eNodeB_4.png"
];

function init(dom,scene){
    var wrap=getWrap(dom,"qtopo-windows");
    var commonWrap=getWrap(wrap,"qtopo-windows-common");
    var nodeWrap=getWrap(wrap,"qtopo-windows-node");
    commonWrap.append(imageSelect.init(images));
    var normalNodeWin=normalNode.init(dom,scene);
    nodeWrap.append(normalNodeWin.win);
}
function getWrap(dom,clazz){
    dom=$(dom);
    var wrap=dom.find("."+clazz);
    if(wrap.length==0){
        wrap=$("<div class='"+clazz+"'></div>");
        dom.append(wrap);
    }
    return wrap;
}
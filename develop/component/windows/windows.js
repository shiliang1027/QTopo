/**
 * Created by qiyc on 2017/2/20.
 */
    require("./windows.css");
var normalNode=require("./normalNode/win.js");
var imageSelect=require("./common/imageSelect.html");
module.exports={
    init:init
};
function init(dom,scene){
    var wrap=getWrap(dom,"qtopo-windows");
    var commonWrap=getWrap(wrap,"qtopo-windows-common");
    var nodeWrap=getWrap(wrap,"qtopo-windows-node");
    console.info(commonWrap.append(imageSelect));
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
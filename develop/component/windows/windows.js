/**
 * Created by qiyc on 2017/2/20.
 */
    require("./css/windows.css");
var node=require("./node.js");
module.exports={
    init:init
};
function init(dom,scene){
    var wrap=$(dom).find(".qtopo-windows");
    if(wrap.length==0){
        wrap=$("<div class='qtopo-windows'></div>");
        $(dom).append(wrap);
    }
    var nodeWin=node.init();
    moveAble(nodeWin);
    wrap.append(nodeWin);
}
function moveAble(win){
    //移动
    win.movement = false;
    win.mousedown(function (e) {
        e.stopPropagation();
        win.movePageX = e.pageX - win.offset().left;
        win.movePageY = e.pageY - win.offset().top;
        win.movement = true;
    });
    win.mouseup(function (e) {
        e.stopPropagation();
        win.movement = false;
    });
    $('body').mousemove(function (e) {
        e.stopPropagation();
        if (win.movement) {
            win.css({
                left: e.pageX - win.movePageX,
                top: e.pageY - win.movePageY
            });
        }
    });
    //互斥
    //base.mutex.push(win);
    //win.show = function () {
    //    $(win).show();
    //    $.each(base.mutex, function (i, v) {
    //        if (win != v&& v.css("display")!="none") {
    //            v.find(".close").click();
    //        }
    //    });
    //}
}
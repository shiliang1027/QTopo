/**
 * Created by Administrator on 2017/2/17 0017.
 */
require("./toolBar.css");
var toolBar=require("./toolBar.html");
var editBar=require("./editBar.html");
module.exports={
    init:init
};
function init(dom,scene){
    var wrap=$(dom).find(".qtopo-toolBar");
    if(wrap.length==0){
        wrap=$("<div class='qtopo-toolBar'></div>");
        $(dom).append(wrap);
    }
    toolBar=$(toolBar);
    editBar=$(editBar);
    wrap.append(toolBar);
    wrap.append(editBar);
    wrap.find("[data-toggle*='tooltip']").tooltip();//开启提示框
    //切换模式和子菜单栏显示位置
    wrap.find("[name=topo_mode]").click(function (e) {
        var mode=$(this).find("input").val();
        scene.setMode(mode);
        if (mode == "normal") {
            var left = toolBar.find(".mode-edit").offset().left + 17 - editBar.width() / 2;
            var top = toolBar.offset().top + toolBar.height() + 2;
            editBar.css({'left': left, 'top': top});
            editBar.show();
        } else {
            editBar.hide();
        }
    });
    //居中展示
    toolBar.find("button[name=center]").click(function(){
        scene.goCenter();
    });
    //还原正常比例
    toolBar.find("button[name=common]").click(function(){
        scene.resize(1);
    });
    //鼠标缩放
    toolBar.find("button[name=zoom_checkbox]").click(function(){
        scene.toggleZoom();
    });
    //鹰眼
    toolBar.find("button[name=eagle_eye]").click(function(){
        scene.toggleEagleEye();
    });
    //导出png
    toolBar.find("button[name=export_image]").click(function(){
        scene.getPicture();
    });

}
function toggleClick(botton, aClass, bClass) {
    botton.click(function () {
        if (!botton._isClick) {
            botton.find('span').removeClass(aClass).addClass(bClass);
            botton._isClick = true;
        } else {
            botton.find('span').removeClass(bClass).addClass(aClass);
            botton._isClick = false;
        }
    });
}
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
        if (mode == "edit") {
            var left = toolBar.find(".mode-edit").offset().left + 17 - editBar.width() / 2;
            var top = toolBar.offset().top + toolBar.height() + 2;
            editBar.css({'left': left, 'top': top});
            editBar.show();
        } else {
            editBar.hide();
        }
    });

}
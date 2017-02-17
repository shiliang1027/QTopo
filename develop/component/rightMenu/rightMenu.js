/**
 * Created by qiyc on 2017/2/17.
 */
var Menu=require("./Menu.js");
var fns=require("./repertory.js");//右键菜单函数仓库
module.exports = {
        init:initRigheMenu
};
function initRigheMenu(dom,scene){
    var wrap=$(dom).find(".qtopo-rightMenu");
    if(wrap.length==0){
        wrap=$("<div class='qtopo-rightMenu'></div>");
        $(dom).append(wrap);
    }
    var rightMenu=new Menu(wrap);
    rightMenu.init(scene);
    $.each(fns.item,function(name,fn){
        var menu=fn(rightMenu);//按钮获取父对象
        rightMenu.addItem({
            name:menu.name,
            click:menu.click,
            filter:menu.filter
        });
    });
}
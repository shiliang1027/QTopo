/**
 * Created by qiyc on 2017/2/17.
 */
require("./rightMenu.css");
var Menu=require("./Menu.js");
var fns=require("./repertory.js");//右键菜单函数仓库
module.exports = {
        init:initRigheMenu
};
/**
 * 从函数仓库中取数据构造菜单栏
 * @param dom topo的包裹外壳
 * @param scene topo图层
 */
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
    if($.isArray(fns.subMenu)){
        $.each(fns.subMenu,function(i,v){
            var subMenu=rightMenu.addSubMenu({
                name: v.name,
                click:v.click,
                filter:v.filter
            });
            if(v.item){
                $.each(v.item,function(j,item){
                    var menu=item(rightMenu);//按钮获取父对象
                    subMenu.addItem({
                        name:menu.name,
                        click:menu.click,
                        filter:menu.filter
                    });
                });
            }
        });
    }
}
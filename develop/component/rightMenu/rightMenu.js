/**
 * Created by qiyc on 2017/2/17.
 */
require("./rightMenu.css");
var Menu=require("./Menu.js");
var getMenus=require("./repertory.js");//右键菜单函数仓库
module.exports = {
        init:initRigheMenu
};
/**
 * 从函数仓库中取数据构造菜单栏
 * @param dom topo的包裹外壳
 * @param scene topo图层
 * @param windows 可能操作到的窗口
 */
function initRigheMenu(dom,scene,windows){
    var wrap=$(dom).find(".qtopo-rightMenu");
    if(wrap.length==0){
        wrap=$("<div class='qtopo-rightMenu'></div>");
        $(dom).append(wrap);
    }
    var rightMenu=new Menu(wrap);
    rightMenu.init(scene);
    if(!windows){
        console.error("windows is not init ,menu options about windows may not work");
    }
    var menus=getMenus(rightMenu,scene,windows.windows,windows.tools);
    $.each(menus.item,function(name,fn){
        var menu=fn(rightMenu);//按钮获取父对象
        if(menu){
            rightMenu.addItem({
                name:menu.name,
                click:menu.click,
                filter:menu.filter
            });
        }else{
            console.error(name+" invalid menu define");
        }
    });
    if($.isArray(menus.subMenu)){
        $.each(menus.subMenu,function(i,sub){
            if(sub){
                var subMenu=rightMenu.addSubMenu({
                    name: sub.name,
                    click:sub.click,
                    filter:sub.filter
                });
                if(sub.item){
                    $.each(sub.item,function(name,item){
                        var menu=item(rightMenu);//按钮获取父对象
                        if(menu){
                            subMenu.addItem({
                                name:menu.name,
                                click:menu.click,
                                filter:menu.filter
                            });
                        }else{
                            console.error(name+" invalid menu define in subMenu "+sub.name);
                        }
                    });
                }
            }else{
                console.error("index: "+i+" is invalid subMenu define");
            }
        });
    }
}
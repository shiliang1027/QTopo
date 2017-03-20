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
 * @param instance topo实例对象
 * @param windows 可能操作到的窗口
 * @param filter 过滤右键菜单
 */
function initRigheMenu(instance,windows,filter){
    var dom=instance.document;
    var scene=instance.scene;
    var wrap=$(dom).find(".qtopo-rightMenu");
    if(wrap.length==0){
        wrap=$("<div class='qtopo-rightMenu'></div>");
        $(dom).append(wrap);
    }
    var rightMenu=new Menu(wrap);
    rightMenu.init(scene);
    if(!windows){
        QTopo.util.error("windows is not init ,menu options about windows may not work");
    }
    var add=makeAdd(instance,scene,rightMenu,windows.windows,windows.tools);
    add(getMenus,filter);
    //测试窗口
    //add(function(){
    //    var sub={
    //        item:{},
    //        subMenu:[{
    //            name:"test",
    //            item:{
    //
    //            }
    //        }]
    //    };
    //    $.each(windows.tools,function(i,tool){
    //        sub.subMenu[0].item[i]={
    //            name: i,
    //            click: function () {
    //                if(tool.open){
    //                    tool.open();
    //                }
    //            }
    //        }
    //    });
    //    $.each(windows.windows,function(i,tool){
    //        sub.subMenu[0].item[i]={
    //            name: i,
    //            click: function () {
    //                if(tool.open){
    //                    tool.open();
    //                }
    //            }
    //        }
    //    });
    //    return sub;
    //});
    return add;
}
function makeAdd(instance,scene, rightMenu, windows, tools){
    return function(fn,filter){
        if($.isFunction(fn)){
            var menus=fn(scene,rightMenu,windows,tools);
            makeMenus(rightMenu,menus,filter);
        }
        return instance;
    }
}
function makeMenus(rightMenu, menus,filter){
    if($.isArray(menus.item)){
        $.each(menus.item,function(name,menu){
            if(menu&&filterMenu(filter,menu)){
                rightMenu.addItem({
                    name:menu.name,
                    click:menu.click,
                    filter:menu.filter
                });
            }else{
                QTopo.util.info(name+" hide menu");
            }
        });
    }
    if($.isArray(menus.subMenu)){
        $.each(menus.subMenu,function(i,sub){
            if(sub&&filterMenu(filter,sub)){
                var subMenu=rightMenu.addSubMenu({
                    name: sub.name,
                    click:sub.click,
                    filter:sub.filter
                });
                if($.isArray(sub.item)&&filterMenu(filter,sub.item)){
                    $.each(sub.item,function(name,menu){
                        if(menu){
                            subMenu.addItem({
                                name:menu.name,
                                click:menu.click,
                                filter:menu.filter
                            });
                        }else{
                            QTopo.util.info(name+" hide menu in subMenu "+sub.name);
                        }
                    });
                }
            }else{
                QTopo.util.info("index: "+i+" hide subMenu");
            }
        });
    }
}
function filterMenu(arr,menu){
    return !(arr&&arr.indexOf(menu.name)>-1);
}
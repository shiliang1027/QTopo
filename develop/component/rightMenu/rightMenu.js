require("./rightMenu.css");
var Menu = require("./Menu.js");
var getMenus = require("./repertory.js");//右键菜单函数仓库
module.exports = {
    init: initRigheMenu
};
/*
 * 从函数仓库中取数据构造菜单栏
 * @param instance topo实例对象
 * @param windows 可能操作到的窗口
 * @param filter 过滤右键菜单
 */
function initRigheMenu(instance, windows, filter) {
    var dom = instance.document;
    var scene = instance.scene;
    var wrap = $(dom).find(".qtopo-rightMenu");
    if (wrap.length == 0) {
        wrap = $("<div class='qtopo-rightMenu'></div>");
        $(dom).append(wrap);
    }
    var rightMenu = new Menu(wrap);
    rightMenu.init(scene);
    if (!windows) {
        QTopo.util.error("windows is not init ,menu options about windows may not work");
    }
    var add = makeAdd(instance, scene, rightMenu, windows.windows, windows.tools);
    if(!(filter&&filter=='all')){
        add(getMenus, filter);
    }
    return {
        addMenu: add,
        reOrder: makeOrder(rightMenu)
    };
}
function makeAdd(instance, scene, rightMenu, windows, tools) {
    return function (fn, filter) {
        if ($.isFunction(fn)) {
            var menus = fn(scene, rightMenu, windows, tools);
            if ($.isArray(filter)) {
                menus = menus.filter(function (v) {
                    return filter.indexOf(v.name) < 0;
                });
            }
            makeRightMenu(rightMenu, menus);
        }
        return instance;
    }
}
function makeRightMenu(father, menus) {
    if (father && $.isArray(menus)) {
        menus.map(function (menu) {
            if ($.isArray(menu.item)) {
                if (father && menu) {
                    makeRightMenu(father.addSubMenu(menu), menu.item);
                }
            } else {
                if (father && menu) {
                    father.addItem(menu);
                }
            }
        });
    }
}
function filterMenu(arr, menu) {
    return !(arr && arr.indexOf(menu.name) > -1);
}
function makeOrder(rightMenu) {
    return function (sort) {
        if ($.isFunction(sort)) {
            rightMenu.item.sort(function (a, b) {
                return sort(a.order, b.order);
            });
            rightMenu.item.forEach(function (item) {
                rightMenu.body.append(item.body);
            });
        }
    }
}

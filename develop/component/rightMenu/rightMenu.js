/**
 * @module component
 */
/**
 * 右键菜单模块
 * @class rightMenu
 * @static
 */
require("./rightMenu.css");
var Menu = require("./Menu.js");
var getMenus = require("./repertory.js");//右键菜单函数仓库
module.exports = {
    init: initRigheMenu
};
/*
 * 初始化右键菜单
 * @param instance topo实例对象
 * @param filter 过滤右键菜单
 */
function initRigheMenu(instance, config) {
    config=config||{};
    var dom = instance.document;
    var scene = instance.scene;
    var wrap = $(dom).find(".qtopo-rightMenu");
    if (wrap.length == 0) {
        wrap = $("<div class='qtopo-rightMenu'></div>");
        $(dom).append(wrap);
    }
    var rightMenu = new Menu(wrap);
    rightMenu.init(scene);
    if (!$.isFunction(instance.open)) {
        QTopo.util.error("windows component is not init ,menu options about windows may not work");
    }
    var add = makeAdd(instance, scene, rightMenu);
    if(!(config&&config.filter&&config.filter=='all')){
        add(getMenus, config.filter);
    }
    return {
        /**
         * 添加自定义右键菜单
         * 通过instance.setComponent函数添加
         * @method add
         * @param fn {function}
         * @example
         *          instance.setComponent({
         *              rightMenu:{
         *                          执行过程中会传入当前实例对象，图层对象，右键菜单对象,其中右键菜单对象记录有触发的目标以及位置信息
         *                      add:function (instance,scene, menu) {
         *                                  return [
         *                                           {
                                                        name: "刷新",//菜单名称
                                                        order: 3,   //可选,在配置了order函数时作为参数传入,用作菜单位置排序
                                                        click: function () {
                                                            //点击该菜单时的处理
                                                            menu.target为当前触发菜单的元素
                                                            menu.x
                                                            menu.y 为当前触发菜单时鼠标在图层上的坐标
                                                        },
                                                        filter: function (target) {
                                                            //返回值为boolean类型，根据返回值决定何时显示该菜单,传入的target为当前触发菜单的元素
                                                            //该属性可不设置，不设置则默认为一直显示
                                                            return QTopo.util.isScene(target);
                                                        }
                                                     },
                                                     {  //嵌套菜单,菜单中有item属性时，则将菜单设为子菜单栏,子菜单同样可以设置点击事件和显示规则
                                                        //当子菜单的成员菜单都不显示时，子菜单也不显示
                                                        //可无限嵌套.
                                                            name: "添加",
                                                            order: 10,
                                                            item: [
                                                                {
                                                                    name: "网段",
                                                                    click: function () {
                                                                        ...
                                                                    },
                                                                    filter:function(){
                                                                        //若无返回值。。则是没通过过滤
                                                                    }
                                                                },
                                                                {
                                                                    name: "设备",
                                                                    click: function () {
                                                                        ...
                                                                    }
                                                                }
                                                            ],
                                                            filter: function (target) {
                                                                return true;
                                                            }
                                                    },
         *                                      ]
         *                              }
         *              }
         *          });
         */
        addMenu: add,
        /**
         * 菜单栏顺序变更
         * 通过instance.setComponent函数添加
         * @method order
         * @param fn {function}
         * @example
         *          instance.setComponent({
                            rightMenu: {
                                order: function (a, b) {
                                        return a - b;//参考数组排序,穿进来的是add函数中添加的order值
                                }
                            }
                     })
         */
        reOrder: makeOrder(rightMenu)
    };
}
function makeAdd(instance, scene, rightMenu) {
    return function (fn, filter) {
        if ($.isFunction(fn)) {
            var menus = fn(instance,scene, rightMenu);
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

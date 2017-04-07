/**
 * @module component
 */
/**
 * QTopo.init的配置参数中可初始化设置
 *
 * 选择过滤掉哪些预设右键菜单功能
 *
 * filterMenu: ["创建节点", "添加链路", "删除", "编辑", "元素切换","分组操作"]
 *
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
        /**
         * 添加自定义右键菜单
         * 通过instance.setComponent函数添加
         * @method add
         * @param fn {function}
         * @example
         *          IPOSS.setComponent({
         *              rightMenu:{
         *                          参数列表分别为 图层元素,右键菜单对象,可调用的窗口对象,可调用的工具窗口
         *                      add:function (scene, menu, windows, tools) {
         *                                  return [
         *                                           {
                                                        name: "刷新",//菜单名称
                                                        order: 3,   //菜单顺序权值
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
         *          IPOSS.setComponent({
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

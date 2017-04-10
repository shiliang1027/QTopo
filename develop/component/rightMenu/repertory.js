/**
 * @module component
 */
/**
 * 右键菜单模块
 * @class rightMenu
 * @static
 */
function getMenus(instance,scene, menu) {
    var Qutil=QTopo.util;
    //高亮控制
    var lighting = false;
    var lockedGroup;

    function hasWindows(type){
        return $.isFunction(instance.open);
    }
    function editImageNode() {
        if (hasWindows()) {
            instance.open('imageNode',{
                type: "edit",
                target: menu.target
            });
        }
    }

    function createImageNode() {
        if (hasWindows()) {
            instance.open("imageNode",{
                type: "create",
                position: [menu.x, menu.y]
            });
        }
    }

    function editTextNode() {
        if (hasWindows()) {
            instance.open('textNode',{
                type: "edit",
                target: menu.target
            });
        }
    }

    function createTextNode() {
        if (hasWindows()) {
            instance.open('textNode',{
                type: "create",
                position: [menu.x, menu.y]
            });
        }
    }

    function editLink() {
        if (hasWindows()) {
            instance.open('link',{
                type: "edit",
                target: menu.target
            });
        }
    }

    //画链接控制
    var link = {
        start: "",
        end: ""
    };

    function addLink() {
        if (link && link.start && link.end&&hasWindows()) {
            scene.addLink(link, function () {
                instance.open('link',{
                    type: "create",
                    path: link
                });
            });
            link = {};
        }
    }

    //分组
    function createGroup() {
        if (hasWindows()) {
            instance.open('container',{
                type: "create",
                targets: scene.getSelected()
            });
        }
    }

    function editGroup() {
        if (hasWindows()) {
            instance.open('container',{
                type: "edit",
                target: menu.target
            });
        }
    }

    return [
        {
            /**
             * 将目标打印到控制台
             * @property Debug
             */
            name: "Debug",
            order:0,
            click: function (e) {
                if (menu.target) {
                    var index;
                    switch (menu.target.getType()) {
                        case QTopo.constant.NODE:
                            index = scene.children.node.indexOf(menu.target);
                            break;
                        case QTopo.constant.CONTAINER:
                            index = scene.children.container.indexOf(menu.target);
                            break;
                        case QTopo.constant.LINK:
                            index = scene.children.link.indexOf(menu.target);
                    }
                    console.info(index, menu.target);
                }
            }
        },
        {
            /**
             * 根据元素类型自适应打开编辑窗口
             * @property 编辑
             */
            name: "编辑",
            order:10,
            click: function () {
                switch (menu.target.getType()) {
                    case QTopo.constant.NODE:
                        switch (menu.target.getUseType()) {
                            case QTopo.constant.node.IMAGE:
                                editImageNode();
                                break;
                            case QTopo.constant.node.TEXT:
                                editTextNode();
                                break;
                        }
                        break;
                    case QTopo.constant.LINK:
                        editLink();
                        break;
                    case QTopo.constant.CONTAINER:
                        editGroup();
                        break;
                }
            },
            filter: function (target) {
                return Qutil.isElement(target);
            }
        },
        {
            /**
             * 删除元素
             * @property 删除
             */
            name: '删除',
            order:10,
            click: function () {
                if(hasWindows()){
                    instance.open('confirm',{
                        title: "删除确认",
                        content: "确认删除？",
                        width: 200,
                        ok: function () {
                            scene.remove(menu.target);
                        },
                        cancel: function () {
                            console.info("cancel");
                        }
                    });
                }else{
                    scene.remove(menu.target);
                }
            },
            filter: function (target) {
                //可以删除分组缩放的节点，但不可以删除链路切换的临时线
                return target.getType() != QTopo.constant.SCENE && (target.getUseType() != QTopo.constant.CASUAL || target.getType() == QTopo.constant.NODE);
            }
        },
        {
            /**
             * 将所有元素高亮
             * @property 取消高亮
             */
            name: "取消高亮",
            order:10,
            click: function () {
                scene.toggleLight();
                lighting = false;
            },
            filter: function (target) {
                return lighting;
            }
        },
        {
            /**
             * 元素的一般操作子菜单
             * @property 元素切换
             *  @param 层次切换
             *  @param 相关高亮
             */
            name: "元素切换",
            order:10,
            item: [
                {
                    /**
                     * 元素的显示层级切换,首次切换成最高级，已到最高级的降至最低级
                     * @property 层次切换
                     */
                    name: "层次切换",
                    click: function () {
                        scene.toggleZIndex(menu.target);
                    },
                    filter: function (target) {
                        return Qutil.isElement(target);
                    }
                },
                {
                    /**
                     * 将与元素相关联的元素以及链路高亮，其他元素和链路透明度降低
                     * @property 相关高亮
                     */
                    name: "相关高亮",
                    click: function () {
                        scene.toggleLight(menu.target);
                        lighting = true;
                    },
                    filter: function (target) {
                        return !lighting && Qutil.isNode(target);
                    }
                }
            ]
        },
        {
            /**
             * 打开节点对应的创建窗口
             * @property 创建节点
             *  @param 图片节点
             *  @param 文字节点
             */
            name: "创建节点",
            order:10,
            item: [
                {
                    /**
                     * 打开创建图形节点窗口
                     * @property 图片节点
                     */
                    name: "图片节点",
                    click: function () {
                        createImageNode();
                    }
                },
                {
                    /**
                     * 打开创建文本节点窗口
                     * @property 文字节点
                     */
                    name: "文字节点",
                    click: function () {
                        createTextNode();
                    }
                }
            ],
            filter: function (target) {
                return Qutil.isScene(target);
            }
        },
        {
            /**
             * 打开设置链路窗口,只有同时存在起点和终点设置时才开启窗口
             * @property 添加链路
             *  @param 设为起点
             *  @param 设为终点
             */
            name: "添加链路",
            order:10,
            item: [
                {
                    /**
                     * 设置起点，窗口关闭后清空
                     * @property 设为起点
                     */
                    name: "设为起点",
                    click: function () {
                        link.start = menu.target;
                        addLink();
                    }
                },
                {
                    /**
                     * 设置终点，窗口关闭后清空
                     * @property 设为终点
                     */
                    name: "设为终点",
                    click: function () {
                        link.end = menu.target;
                        addLink();
                    }
                }
            ],
            filter: function (target) {
                return Qutil.isNode(target)||Qutil.isContainer(target);
            }
        },
        {
            /**
             * 分组相关操作子菜单,
             * @property 分组操作
             *  @param 锁定
             *  @param 加入分组
             *  @param 移出分组
             *  @param 创建分组
             */
            name: "分组操作",
            order:10,
            item: [
                {
                    /**
                     * 选定一个分组用以后续操作,用以加入分组操作
                     * @property 锁定
                     */
                    name: "锁定",
                    click: function () {
                        lockedGroup = menu.target;
                    },
                    filter: function (target) {
                        return Qutil.isContainer(target);
                    }
                },
                {
                    /**
                     * 为锁定的分组加入目标元素,
                     * @property 加入分组
                     */
                    name: "加入分组",
                    click: function () {
                        lockedGroup.add(menu.target);
                    },
                    filter: function (target) {
                        return lockedGroup && Qutil.isNode(target)&& !target.parent;
                    }
                },
                {
                    /**
                     * 将目标元素移出所在分组,
                     * @property 移出分组
                     */
                    name: "移出分组",
                    click: function () {
                        menu.target.parent.remove(menu.target);
                    },
                    filter: function (target) {
                        return Qutil.isElement(target) && target.parent;
                    }
                },
                {
                    /**
                     * 当选中了2个或2个以上的节点时，出现该选项，打开创建分组窗口
                     * @property 创建分组
                     */
                    name: "创建分组",
                    click: function () {
                        createGroup();
                    },
                    filter: function () {
                        //只有当两个以上没有被分组的节点被选中时才能创建分组
                        var flag = false;
                        var selected = scene.getSelected();
                        if (selected.length > 1) {
                            var num = 0;
                            $.each(selected, function (i, el) {
                                if (el.getType() == QTopo.constant.NODE && !el.parent) {
                                    num++;
                                }
                                if (num >= 2) {
                                    flag = true;
                                    return false;
                                }
                            });
                        }
                        return flag;
                    }
                }
            ]
        }
    ];
}
module.exports = getMenus;
/**
 * Created by qiyc on 2017/2/17.
 */
function getMenus(scene, menu, windows, tools) {
    //高亮控制
    var lighting = false;
    var lockedGroup;

    function editImageNode() {
        if (windows && windows.imageNode) {
            windows.imageNode.open({
                type: "edit",
                target: menu.target
            });
        }
    }

    function createImageNode() {
        if (windows && windows.imageNode) {
            windows.imageNode.open({
                type: "create",
                position: [menu.x, menu.y]
            });
        }
    }

    function editTextNode() {
        if (windows && windows.textNode) {
            windows.textNode.open({
                type: "edit",
                target: menu.target
            });
        }
    }

    function createTextNode() {
        if (windows && windows.textNode) {
            windows.textNode.open({
                type: "create",
                position: [menu.x, menu.y]
            });
        }
    }

    function editLink() {
        if (windows && windows.link) {
            windows.link.open({
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
        if (link && link.start && link.end) {
            scene.addLink(link, function () {
                windows.link.open({
                    type: "create",
                    path: link
                });
            });
            link = {};
        }
    }

    //分组
    function createGroup() {
        if (windows && windows.container) {
            windows.container.open({
                type: "create",
                targets: scene.getSelected()
            });
        }
    }

    function editGroup() {
        if (windows && windows.container) {
            windows.container.open({
                type: "edit",
                target: menu.target
            });
        }
    }

    return {
        item: {
            DEBUG: {
                name: "Debug",
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
            EDIT: {
                name: "编辑",
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
                    return target && target.getType() != QTopo.constant.SCENE && target.getUseType() != QTopo.constant.CASUAL;
                }
            },
            DELETE: {
                name: '删除',
                click: function () {
                    tools.confirm.open({
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
                },
                filter: function (target) {
                    //可以删除分组缩放的节点，但不可以删除链路切换的临时线
                    return target.getType() != QTopo.constant.SCENE && (target.getUseType() != QTopo.constant.CASUAL || target.getType() == QTopo.constant.NODE);
                }
            }
        },
        subMenu: [
            {
                name: "元素切换",
                item: {
                    TOGGLE_ZINDEX: {
                        name: "层次切换",
                        click: function () {
                            scene.toggleZIndex(menu.target);
                        },
                        filter: function (target) {
                            return target && target.getType() != QTopo.constant.SCENE && target.getUseType() != QTopo.constant.CASUAL;
                        }
                    },
                    LIGHTING: {
                        name: "相关高亮",
                        click: function () {
                            scene.toggleLight(menu.target);
                            lighting = true;
                        },
                        filter: function (target) {
                            return !lighting && target && target.getType() == QTopo.constant.NODE && target.getUseType() != QTopo.constant.CASUAL;
                        }
                    },
                    NO_LIGHTING: {
                        name: "取消高亮",
                        click: function () {
                            scene.toggleLight();
                            lighting = false;
                        },
                        filter: function (target) {
                            return lighting;
                        }
                    }
                }
            },
            {
                name: "创建节点",
                item: {
                    CREATE_IMAGE_NODE: {
                        name: "图片节点",
                        click: function () {
                            createImageNode();
                        }
                    },
                    CREATE_TEXT_NODE: {
                        name: "文字节点",
                        click: function () {
                            createTextNode();
                        }
                    }
                },
                filter: function (target) {
                    return !target || target.getType() == QTopo.constant.SCENE;
                }
            },
            {
                name: "添加链路",
                item: {
                    SET_START: {
                        name: "设为起点",
                        click: function () {
                            link.start = menu.target;
                            addLink();
                        }
                    },
                    SET_END: {
                        name: "设为终点",
                        click: function () {
                            link.end = menu.target;
                            addLink();
                        }
                    }
                },
                filter: function (target) {
                    return target && (target.getType() == QTopo.constant.NODE || target.getType() == QTopo.constant.CONTAINER) && target.getUseType() != QTopo.constant.CASUAL;
                }
            },
            {
                name: "分组操作",
                item: {
                    SET_END: {
                        name: "锁定",
                        click: function () {
                            lockedGroup = menu.target;
                        },
                        filter: function (target) {
                            return target && target.getType() == QTopo.constant.CONTAINER && target.getUseType() != QTopo.constant.CASUAL;
                        }
                    },
                    ADD_IN_GROUP: {
                        name: "加入分组",
                        click: function () {
                            lockedGroup.add(menu.target);
                        },
                        filter: function (target) {
                            return lockedGroup && target.getType() == QTopo.constant.NODE && !target.parent && target.getUseType() != QTopo.constant.CASUAL;
                        }
                    },
                    REMOVE_FROM_GROUP: {
                        name: "移出分组",
                        click: function () {
                            menu.target.parent.remove(menu.target);
                        },
                        filter: function (target) {
                            return target && target.getUseType() != QTopo.constant.CASUAL && target.parent;
                        }
                    },
                    CREATE_GROUP: {
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
                }
            }
        ]
    };
}
module.exports = getMenus;
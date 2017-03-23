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
        if (link && link.start && link.end&&windows && windows.link) {
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

    return [
        {
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
                return isElement(target);
            }
        },
        {
            name: '删除',
            order:10,
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
        },
        {
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
            name: "元素切换",
            order:10,
            item: [
                {
                    name: "层次切换",
                    click: function () {
                        scene.toggleZIndex(menu.target);
                    },
                    filter: function (target) {
                        return isElement(target);
                    }
                },
                {
                    name: "相关高亮",
                    click: function () {
                        scene.toggleLight(menu.target);
                        lighting = true;
                    },
                    filter: function (target) {
                        return !lighting && isNode(target);
                    }
                }
            ]
        },
        {
            name: "创建节点",
            order:10,
            item: [
                {
                    name: "图片节点",
                    click: function () {
                        createImageNode();
                    }
                },
                {
                    name: "文字节点",
                    click: function () {
                        createTextNode();
                    }
                }
            ],
            filter: function (target) {
                return isScene(target);
            }
        },
        {
            name: "添加链路",
            order:10,
            item: [
                {
                    name: "设为起点",
                    click: function () {
                        link.start = menu.target;
                        addLink();
                    }
                },
                {
                    name: "设为终点",
                    click: function () {
                        link.end = menu.target;
                        addLink();
                    }
                }
            ],
            filter: function (target) {
                return isNode(target)||isContainer(target);
            }
        },
        {
            name: "分组操作",
            order:10,
            item: [
                {
                    name: "锁定",
                    click: function () {
                        lockedGroup = menu.target;
                    },
                    filter: function (target) {
                        return isContainer(target);
                    }
                },
                {
                    name: "加入分组",
                    click: function () {
                        lockedGroup.add(menu.target);
                    },
                    filter: function (target) {
                        return lockedGroup && isNode(target)&& !target.parent;
                    }
                },
                {
                    name: "移出分组",
                    click: function () {
                        menu.target.parent.remove(menu.target);
                    },
                    filter: function (target) {
                        return isElement(target) && target.parent;
                    }
                },
                {
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
function isElement(target){
    return target&&target.getType()!=QTopo.constant.SCENE&&target.getUseType() != QTopo.constant.CASUAL;
}
function isScene(target){
    return !target||target.getType()==QTopo.constant.SCENE;
}
function isNode(target){
    return target&&target.getType() == QTopo.constant.NODE&&target.getUseType() != QTopo.constant.CASUAL;
}
function isContainer(target){
    return target&&target.getType() == QTopo.constant.CONTAINER&&target.getUseType() != QTopo.constant.CASUAL;
}
function isLink(target){
    return target&&target.getType() == QTopo.constant.LINK&&target.getUseType() != QTopo.constant.CASUAL;
}
module.exports = getMenus;
/**
 * Created by qiyc on 2017/2/17.
 */
function getMenus(menu, scene, windows,tools) {
    //画链接控制
    var link = {
        start: "",
        end: ""
    };
    //高亮控制
    var lighting=false;
    function editImageNode() {
        if (windows && windows.node && windows.node.image) {
            windows.node.image.open({
                type: "edit",
                target: menu.target
            });
        }
    }

    function createImageNode() {
        if (windows && windows.node && windows.node.image) {
            windows.node.image.open({
                type: "create",
                position: [menu.x, menu.y]
            });
        }
    }

    function editTextNode() {
        if (windows && windows.node && windows.node.text) {
            windows.node.text.open({
                type: "edit",
                target: menu.target
            });
        }
    }

    function createTextNode() {
        if (windows && windows.node && windows.node.text) {
            windows.node.text.open({
                type: "create",
                position: [menu.x, menu.y]
            });
        }
    }

    function editLink() {
        if (windows && windows.node && windows.node.image) {
            windows.link.open({
                type: "edit",
                target: menu.target
            });
        }
    }

    return {
        item: {
            DEBUG: function () {
                return {
                    name: "Debug",
                    click: function (e) {
                        if (menu.target) {
                            console.info(menu.target);
                        }
                    }
                }
            },
            TEST:function(){
                return {
                    name:"test",
                    click:function(e){
                        windows.autoLayout.open();
                    }
                }
            },
            EDIT: function () {
                return {
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
                        }
                    },
                    filter: function (target) {
                        return target &&target.getType() != QTopo.constant.SCENE&& target.getUseType() != QTopo.constant.CASUAL;
                    }
                }
            },
            DELETE: function () {
                return {
                    name: '删除',
                    click: function () {
                        tools.confirm.open({
                            title:"删除确认",
                            content:"确认删除？",
                            width:200,
                            ok:function(){
                                scene.remove(menu.target);
                            },
                            cancel:function(){
                                console.info("cancel");
                            }
                        });
                    },
                    filter: function (target) {
                        return target.getType() != QTopo.constant.SCENE;
                    }
                }
            },
            UPZINDEX: function () {
                return {
                    name: "提升层级",
                    click: function () {
                        scene.toggleZIndex(menu.target);
                    },
                    filter:function(target){
                        return target &&target.getType() != QTopo.constant.SCENE&& target.getUseType() != QTopo.constant.CASUAL;
                    }
                }
            },
            DOWNZINDEX: function () {
                return {
                    name: "降低层级",
                    click: function () {
                        scene.toggleZIndex(menu.target, true);
                    },
                    filter:function(target){
                        return target &&target.getType() != QTopo.constant.SCENE&& target.getUseType() != QTopo.constant.CASUAL;
                    }
                }
            },
            LIGHTING:function(){
                return {
                    name:"相关高亮",
                    click:function(){
                        scene.toggleLight(menu.target);
                        lighting=true;
                    },
                    filter:function(target){
                        return !lighting&&target &&target.getType() == QTopo.constant.NODE&& target.getUseType() != QTopo.constant.CASUAL;
                    }
                }
            },
            NOTLIGHTING:function(){
                return {
                    name:"取消高亮",
                    click:function(){
                        scene.toggleLight();
                        lighting=false;
                    },
                    filter:function(target){
                        return lighting;
                    }
                }
            },
            REMOVEFROMGROUP:function(){
                return {
                    name:"移出分组",
                    click:function(){
                        menu.target.parent.remove(menu.target);
                    },
                    filter:function(target){
                        return target.parent&&true;
                    }
                }
            }
        },
        subMenu: [
            {
                name: "创建节点",
                item: {
                    CREATE_IMAGE_NODE: function () {
                        return {
                            name: "图片节点",
                            click: function () {
                                createImageNode();
                            }
                        }
                    },
                    CREATE_TEXT_NODE: function () {
                        return {
                            name: "文字节点",
                            click: function () {
                                createTextNode();
                            }
                        }
                    }
                },
                filter: function (target) {
                    return !target || target.getType() == QTopo.constant.SCENE;
                }
            },
            {
                name: "创建链接",
                item: {
                    SET_START: function () {
                        return {
                            name: "设为起点",
                            click: function () {
                                link.start = menu.target;
                                if (link && link.start && link.end) {
                                    windows.link.open({
                                        type: "create",
                                        path: link
                                    });
                                    link = {};
                                }
                            }
                        }
                    },
                    SET_END: function () {
                        return {
                            name: "设为终点",
                            click: function () {
                                link.end = menu.target;
                                if (link && link.start && link.end) {
                                    windows.link.open({
                                        type: "create",
                                        path: link
                                    });
                                    link = {};
                                }
                            }
                        }
                    }
                },
                filter: function (target) {
                    return target && (target.getType() == QTopo.constant.NODE || target.getType() == QTopo.constant.CONTAINER) && target.getUseType() != QTopo.constant.CASUAL;
                }
            }
        ]
    };
}
module.exports = getMenus;
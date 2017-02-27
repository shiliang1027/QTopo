/**
 * Created by qiyc on 2017/2/17.
 */
function getMenus(menu, scene, windows) {
    var link={
        start:"",
        end:""
    };
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
            DELETE: function () {
                return {
                    name: '删除对象',
                    click: function () {
                        scene.remove(menu.target);
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
                    }
                }
            },
            DOWNZINDEX: function () {
                return {
                    name: "降低层级",
                    click: function () {
                        scene.toggleZIndex(menu.target, true);
                    }
                }
            }
        },
        subMenu: [
            {
                name: "节点操作",
                item: {
                    CREATE_IMAGE_NODE: function () {
                        return {
                            name: "创建图片节点",
                            click: function () {
                                if (windows && windows.node && windows.node.image) {
                                    windows.node.image.open({
                                        type: "create",
                                        position: [menu.x, menu.y]
                                    });
                                }
                            }
                        }
                    },
                    EDIT_IMAGE_NODE: function () {
                        return {
                            name: "修改图片节点",
                            click: function () {
                                if (windows && windows.node && windows.node.image) {
                                    windows.node.image.open({
                                        type: "edit",
                                        target: menu.target
                                    });
                                }
                            },
                            filter: function (target) {
                                return target.getType() == QTopo.constant.NODE && target.getUseType() == QTopo.constant.node.IMAGE;
                            }
                        }
                    },
                    CREATE_TEXT_NODE: function () {
                        return {
                            name: "创建文字节点",
                            click: function () {
                                if (windows && windows.node && windows.node.text) {
                                    windows.node.text.open({
                                        type: "create",
                                        position: [menu.x, menu.y]
                                    });
                                }
                            }
                        }
                    },
                    EDIT_TEXT_NODE: function () {
                        return {
                            name: "修改文字节点",
                            click: function () {
                                if (windows && windows.node && windows.node.text) {
                                    windows.node.text.open({
                                        type: "edit",
                                        target: menu.target
                                    });
                                }
                            },
                            filter: function (target) {
                                return target && target.getType() == QTopo.constant.NODE && target.getUseType() == QTopo.constant.node.TEXT;
                            }
                        }
                    }
                }
            },
            {
                name:"链接操作",
                item:{
                    SET_START:function(){
                        return {
                            name:"设为起点",
                            click:function(){
                                link.start=menu.target;
                                if(link&&link.start&&link.end){
                                    windows.link.open({
                                        type:"create",
                                        path:link
                                    });
                                    link={};
                                }
                            },
                            filter:function(target){
                                return target && (target.getType() == QTopo.constant.NODE ||target.getType() == QTopo.constant.CONTAINER)&&target.getUseType() != QTopo.constant.CASUAL;
                            }
                        }
                    },
                    SET_END:function(){
                        return {
                            name:"设为终点",
                            click:function(){
                                link.end=menu.target;
                                if(link&&link.start&&link.end){
                                    windows.link.open({
                                        type:"create",
                                        path:link
                                    });
                                    link={};
                                }
                            },
                            filter:function(target){
                                return target && (target.getType() == QTopo.constant.NODE ||target.getType() == QTopo.constant.CONTAINER)&&target.getUseType() != QTopo.constant.CASUAL;
                            }
                        }
                    },
                    EDIT_LINKS: function () {
                        return {
                            name: "修改链接",
                            click: function () {
                                if (windows && windows.node && windows.node.image) {
                                    windows.link.open({
                                        type: "edit",
                                        target: menu.target
                                    });
                                }
                            },
                            filter: function (target) {
                                return target.getType() == QTopo.constant.LINK&&target.getUseType() != QTopo.constant.CASUAL;
                            }
                        }
                    }
                }
            }
        ]
    };
}
module.exports = getMenus;
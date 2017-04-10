/**
 * @module QTopo
 */
/**
 * @class QTopo
 * @static
 */
var toolBar = require("./toolBar/toolBar.js");
var windows=require("./windows/windows.js");
var rightMenu=require("./rightMenu/rightMenu.js");
var windowUtil=require("./windows/util.js");
$(document).ready(function (e) {
    //自写的jquery插件
    require("./jquery-tools");
    if (QTopo) {
        /**
         * 初始化组件模块,加载组件包后可用
         * @method initComponent
         * @param instance {instance} QTopo生成的实例对象
         * @param config {object} 配置参数
         *  @param [config.hideMenu] {boolean} 不载入右键菜单
         *  @param [config.hideToolbar] {boolean} 不载入工具条
         *  @param [config.hideWindows] {boolean} 则不载入窗口模块
         *  @param config.rightMenu {object} 右键菜单初始化参数
         *      @param config.rightMenu.filter {array} 过滤掉的菜单的集合
         *  @param config.windows {object} 窗口管理初始化参数
         *      @param config.windows.filter {array} 过滤掉的窗口的集合
         *  @param config.toolbar {object} 工具条初始化参数
         *      @param config.toolbar.hideDefaultSearch {boolean} 不加载默认搜索功能
         * @return {instance} 实例对象，支持链式调用
         *  @example
         *      IPOSS = QTopo.init(dom, {
                        backgroundColor: "#06243e"
                });
         *      QTopo.initComponent(IPOSS,
                        {
                            rightMenu: {
                                filter: ["创建节点", "添加链路", "删除", "编辑", "元素切换", "分组操作"]
                            },
                            toolBar: {
                                hideDefaultSearch: true
                            },
                            windows:{
                                filter:["link","imageNode"]
                            }
                        }
                )
         */
        QTopo.initComponent=init;
        QTopo.windowUtil = windowUtil;
    }
});
function init(instance, config) {
    /**
     * @class QTopo.instance
     * @static
     */
    config=config||{};
    var wins;
    var rightMenuCallBack;
    var toolBarCallBack;
    if(!config.hideWindows){
        wins = windows.init(instance,config.windows);
        /**
         * 开启/管理窗口,加载组件包后且组件初始化完毕后可用
         * @method open
         * @param type {string}窗口名
         * @param config {object} 窗口配置，窗口不同配置不同，参考component中的windows api
         */
        instance.open=wins.open;
    }
    if(!config.hideMenu){
        rightMenuCallBack = rightMenu.init(instance, config.rightMenu);
    }
    if(!config.hideToolbar){
        toolBarCallBack = toolBar.init(instance, config.toolBar);
    }
    /**
     * 随时配置组件属性,加载组件包后且组件初始化完毕后可用
     * @method setComponent
     * @param config {object} 详细配置参考组件说明
     *      @param config.toolBar {object} 工具条配置
     *      @param config.rightMenu {object} 右键菜单配置
     *      @param config.windows {object} 窗口配置
     */
    instance.setComponent = function (config) {
        if (config) {
            configToolBar(toolBarCallBack,config.toolBar);
            configRightMenu(rightMenuCallBack,config.rightMenu);
            configWindows(wins,config.windows);
        }
        return instance;
    };
    return instance;
}
function configToolBar(toolBar,config){
    if(toolBar&&config){
        if (config.addSearch) {
            toolBar.addSearch(config.addSearch);
        }
        if(config.save){
            toolBar.save(config.save);
        }
    }
}
function configRightMenu(rightMenu,config){
    if(rightMenu&&config){
        if (config.add) {
            rightMenu.addMenu(config.add);
        }
        if(config.order){
            rightMenu.reOrder(config.order);
        }
    }
}
function configWindows(windows,config){
    if(windows&&config){
        if(config.tips){
            windows.open("tips",config.tips);
        }
        if(config.images){
            windows.open('imageSelect',{
                images:config.images,
                isSet:true
            });
        }
    }
}

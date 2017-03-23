/**
 * Created by qiyc on 2017/2/16.
 */
//自写的jquery插件
require("./jquery-tools");
var rightMenu = require("./rightMenu/rightMenu.js");
var toolBar = require("./toolBar/toolBar.js");
var windows = require("./windows/windows.js");
var util = require("./windows/util.js");
//组装
$(document).ready(function (e) {
    if (QTopo) {
        var preInit = QTopo.init;
        QTopo.init = function (dom, config) {
            var instance = preInit.call(QTopo, dom, config);
            if (instance) {
                init(instance, config);
            }
            return instance;
        };
        QTopo.windowUtil = util;
    }
});
function init(instance, config) {
    var wins = windows.init(instance,config.filterWindow);
    var rightMenuCallBack = rightMenu.init(instance, wins, config.filterMenu);
    var toolBarCallBack = toolBar.init(instance, wins,config.hideDefaultSearch);

    instance.setComponent = function (config) {
        if (config) {
            configToolBar(toolBarCallBack,config.toolBar);
            configRightMenu(rightMenuCallBack,config.rightMenu);
            configWindows(wins,config.windows);
        }
        return instance;
    };
    instance.open = function (type, config) {
        if(wins.tools[type]){
            return wins.tools[type].open(config);
        }
    }
}
function configToolBar(toolBar,config){
    if(config){
        if (config.search) {
            toolBar.addSearch(config.search);
        }
        if(config.save){
            toolBar.save(config.save);
        }
    }
}
function configRightMenu(rightMenu,config){
    if(config){
        if (config.add) {
            rightMenu.addMenu(config.add);
        }
        if(config.order){
            rightMenu.reOrder(config.order);
        }
    }
}
function configWindows(windows,config){
    if(config){
        if(config.tips){
            windows.tools.tips.open(config.tips);
        }
        if(config.images){
            windows.tools.imageSelect.setImage(config.images);
        }
    }
}

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
    var addRightMenu = rightMenu.init(instance, wins, config.filterMenu);
    var addSearch = toolBar.init(instance, wins);
    instance.setComponent = function (config) {
        if (config) {
            if (config.search) {
                addSearch(config.search);
            }
            if (config.rightMenu) {
                addRightMenu(config.rightMenu);
            }
            if(config.tips){
                wins.tools.tips.open(config.tips);
            }
            if(config.images){
                wins.tools.imageSelect.setImage(config.images);
            }
        }
        return instance;
    };
    instance.open = function (type, config) {
        var result;
        switch (type) {
            case'imageSelect':
                result=wins.tools.imageSelect.open(config);
                break;
            case'styleSelect':
                result=wins.tools.styleSelect.open(config);
                break;
            case'confirm':
                result=wins.tools.confirm.open(config);
                break;
            case'view':
                result=wins.tools.view.open(config);
                break;
            case'progress':
                result=wins.tools.progress.open(config);
                break;
            case'loading':
                result= wins.tools.loading.open(config);
        }
        return result;
    }
}

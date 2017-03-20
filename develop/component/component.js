/**
 * Created by qiyc on 2017/2/16.
 */
//自写的jquery插件
require("./jquery-tools");
var rightMenu = require("./rightMenu/rightMenu.js");
var toolBar = require("./toolBar/toolBar.js");
var windows=require("./windows/windows.js");
var util=require("./windows/util.js");
//组装
$(document).ready(function (e) {
    if(QTopo){
        var preInit=QTopo.init;
        QTopo.init=function(dom, config){
            var instance=preInit.call(QTopo,dom, config);
            if(instance){
                init(instance,config);
            }
            return instance;
        };
        QTopo.windowUtil=util;
    }
});
function init(instance,config) {
    var wins=windows.init(instance);
    var addRightMenu=rightMenu.init(instance,wins,config.filterMenu);
    var addSearch=toolBar.init(instance,wins);
    instance.component={
        tools:wins.tools,
        addSearch:addSearch,
        addRightMenu:addRightMenu
    };
}

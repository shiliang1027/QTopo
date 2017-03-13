/**
 * Created by qiyc on 2017/2/16.
 */
//自写的jquery插件
require("./jquery-tools");
var rightMenu = require("./rightMenu/rightMenu.js");
var toolBar = require("./toolBar/toolBar.js");
var windows=require("./windows/windows.js");
//组装
$(document).ready(function () {
    if(QTopo){
        var preInit=QTopo.init;
        QTopo.init=function(dom, config){
            var instance=preInit.call(QTopo,dom, config);
            if(instance){
                init(instance);
            }
            return instance;
        }
    }
});

function init(instance) {
    var wins=windows.init(instance);
    var addRightMenu=rightMenu.init(instance.document, instance.scene,wins);
    var addSearch=toolBar.init(instance.document, instance.scene,wins);
    instance.component={
        tools:wins.tools,
        addSearch:addSearch,
        addRightMenu:addRightMenu
    };
}

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
        QTopo.component=init;
    }
});
function init(instance) {
    rightMenu.init(instance.document, instance.scene);
    toolBar.init(instance.document, instance.scene);
    windows.init(instance.document, instance.scene);
}

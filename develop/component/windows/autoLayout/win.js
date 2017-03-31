var temp=require("./win.html");
var util=require("../util.js");
module.exports={
    init:init
};
var defaultAttr={
    name:"",
    fontSize:14,
    namePosition:"bottom",
    size:70,
    image:""
};
/*
 * 初始化图片节点的属性操作窗口
 * @param dom  topo对象包裹外壳
 * @param scene topo对象图层
 * @param imageSelect 需要支持的一般窗口组件
 * @returns {*|jQuery|HTMLElement} 返回初始化后的窗口对象,包含open和close函数
 */
function init(dom, scene, imageSelect){
    var win=$(temp);
    var select=initSelect(win);
    //注册窗口打开和关闭事件
    initEvent(dom,win,select);
    //基本窗口属性初始化
    util.initBase(dom,win);
    //劫持表单
    util.initFormSubmit(win.find("form"),function(data){
        scene.autoLayout(data);
    });
    return win;
}
function initSelect(win) {
    var rowSpace = win.find("[name=rowSpace]").closest(".form-group").hide();
    var rows = win.find("[name=rows]").closest(".form-group").hide();
    var columnSpace = win.find("[name=columnSpace]").closest(".form-group").hide();
    var radius = win.find("[name=radius]").closest(".form-group").hide();
    var order=win.find(".order").hide();
    var select=win.find("select[name=type]");
    select.change(function (e) {
        var self = $(this);
        selected(self.val());
    });
    return selected;
    function selected(value){
        switch (value) {
            case "default":
                rows.show();
                rowSpace.show();
                columnSpace.show();
                radius.hide();
                order.hide();
                break;
            case "star":
                rows.hide();
                rowSpace.hide();
                columnSpace.hide();
                radius.show();
                order.show();
                break;
            case "round":
                rowSpace.hide();
                columnSpace.hide();
                radius.hide();
                order.hide();
                rows.hide();
                break;
        }
    }
}
function initEvent(dom,win,selected){
    win.on("window.open",function(e){
        win.find("select[name=type]").val("default");
        selected("default");
    });
}
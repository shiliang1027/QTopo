var temp = require("./view.html");
var util = require("../util.js");
module.exports = {
    init: init
};
/**
 * @module component
 * @class windows
 */
/**
 * 信息弹出框
 * @method view
 * @param config{object} 配置参数
 *  @param [config.title] {html} 窗口的标题
 *  @param [config.content] {html} 窗口的提示内容
 *  @param [config.width] {number} 窗口宽度
 * @example
       instance.open('view',{
           title:"提示",
           content:"<h1>展示内容</h1>",
           width:200
       });
 */
function init(dom,scene) {
    temp = $(temp);
    var body = temp.find('.modal-body');
    var title = temp.find('.modal-title');
    var okBtn = temp.find('.ok');
    var cssMaker = temp.find('.modal-dialog');//窗体大小和位置只有修改content才有效
    temp.open = function (config) {
        temp.removeAttr("style");
        cssMaker.removeAttr("style");
        config=config||{};
        if (config.content) {
            body.html("");
            body.append(config.content);
        }
        if (config.title) {
            title.html(config.title);
        }
        if(config.width){
            if($.isNumeric(config.width)){
                config.width=config.width+"px";
            }
            cssMaker.css({
                width:config.width
            });
        }
        //确定位置
        util.makeCenter(dom, cssMaker);
        temp.modal("show");
    };
    okBtn.click(function () {
        temp.modal("hide");
    });
    return temp;
}
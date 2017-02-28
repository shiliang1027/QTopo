/**
 * Created by qiyc on 2017/2/27.
 */
var temp = require("./view.html");
var util = require("../util.js");
module.exports = {
    init: init
};
function init(dom) {
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
            body.html(config.content);
        }
        if (config.title) {
            title.html(config.title);
        }
        if(config.css){
            cssMaker.css(css);
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
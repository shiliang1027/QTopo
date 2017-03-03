/**
 * Created by qiyc on 2017/2/27.
 */
var temp = require("./confirm.html");
var util = require("../util.js");
module.exports = {
    init: init
};
function init(dom) {
    temp = $(temp);
    var body = temp.find('.modal-body');
    var title = temp.find('.modal-title');
    var okBtn = temp.find('.ok');
    var cancelBtn = temp.find('.cancel');
    var cssMaker = temp.find('.modal-dialog');//窗体大小和位置只有修改content才有效
    var deferred;
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
        deferred = $.Deferred();
        if ($.isFunction(config.ok)) {
            deferred.done(config.ok);
        }
        if ($.isFunction(config.cancel)) {
            deferred.fail(config.cancel);
        }
        if (config.width) {
            if($.isNumeric(config.width)){
                config.width=config.width+"px";
            }
            cssMaker.css({
                width: config.width
            });
        }
        //确定位置
        util.makeCenter(dom, cssMaker);
        temp.modal({
            keyboard: false,
            backdrop: 'static',
            show: true
        });
    };
    okBtn.click(function () {
        if (deferred && deferred.state() == "pending") {
            deferred.resolve();
        }
        temp.modal("hide");
    });
    cancelBtn.click(function () {
        if (deferred && deferred.state() == "pending") {
            deferred.reject();
        }
        temp.modal("hide");
    });
    return temp;
}
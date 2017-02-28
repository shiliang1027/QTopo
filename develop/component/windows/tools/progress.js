/**
 * Created by qiyc on 2017/2/22.
 */
var temp=require("./progress.html");
var util=require("../util.js");
module.exports={
    init:init
};
function init(dom){
    temp=$(temp);
    var bar=temp.find('.progress-bar');
    var position=temp.find(".modal-dialog");
    temp.open=function(config){
        if (config) {
            var now = config.now;
            var text = config.text;
            var error = config.error;
            var time = 1000;
            if (now >= 0 && now <= 100) {
                if (error) {
                    bar.removeClass('progress-bar-info').addClass('progress-bar-danger');
                    time = 3000;
                } else {
                    bar.removeClass('progress-bar-danger').addClass('progress-bar-info');
                }
                bar.css({width: now + '%'});
                bar.html(text);
                util.makeCenter(dom,position,{
                    height:30,
                    width:600
                });
                temp.modal({
                    keyboard: false,
                    backdrop: 'static',
                    show: true
                });
                if (now == 100) {
                    setTimeout(function () {
                        temp.modal('hide');
                    }, time);
                }
            } else {
                temp.modal('hide');
            }
        } else {
            temp.modal('hide');
        }
    };
    return temp;
}
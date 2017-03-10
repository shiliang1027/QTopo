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
    var stateShow=temp.find('.progress-state');
    var infoShow=temp.find('.progress-info');
    temp.open=function(config){
        if (config) {
            var state = config.state;
            var info = config.info;
            var error = config.error;
            var time = 1000;
            if (state >= 0 && state <= 100) {
                if (error) {
                    bar.removeClass('progress-bar-info').addClass('progress-bar-danger');
                    time = 3000;
                } else {
                    bar.removeClass('progress-bar-danger').addClass('progress-bar-info');
                }
                bar.css({width: state + '%'});
                stateShow.html(state + '%');
                infoShow.html(info);
                util.makeCenter(dom,temp.find(".modal-dialog"),{
                    height:30,
                    width:600
                });
                temp.modal({
                    keyboard: false,
                    backdrop: 'static',
                    show: true
                });

                if (state == 100) {
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
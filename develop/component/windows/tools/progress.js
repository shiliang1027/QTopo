var temp=require("./progress.html");
var util=require("../util.js");
module.exports={
    init:init
};
/**
 * @module component
 * @class windows
 */
/**
 * 进度条工具
 * @method progress
 * @param [config] {object} 配置参数,未配置时不显示进度条
 *  @param config.state {number} 当前进度,值域0-100(为100时，error未设或为false则延迟1秒后消失,error=true则延迟3秒后消失),未配置时不显示进度条
 *  @param [config.info] {html} 进度条小标题内容
 *  @param [config.error] {boolean} 是否是错误提示,为true时更改进度条样式
 * @example
 *      instance.open("progress", {state: 100, info: "<h5>出现错误!</h5>", error: true});
 */
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
function moveTo(bar,end){

}
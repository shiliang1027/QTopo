var temp = require("./loading.html");
var util=require("../util.js");
module.exports = {
    init: init
};
/**
 * @module component
 * @class windows
 */
/**
 * 进度条工具,常用于全局配置ajax执行时显示,ajax结束隐藏
 * @method loading
 * @param [config] {object} 配置参数,未配置时隐藏
 *  @param [config.type] {number} 默认为0,暂时有2种,0和1
 *  @param [config.position] {string} 出现在图上的位置,center,left,right,默认为right
 *  @param [config.logo] {string}type=0时，图中央的logo图标
 * @example
        $(document)
                .ajaxStart(function () {
                        instance.open("loading", {
 *                      type:0,
                        logo: "img/logo.png",
                        postion:"right"
                    });
                })
                .ajaxError(function (e) {
                        console.error(e);
                })
                .ajaxStop(function () {
                        instance.open("loading");
                })
 */
function init(dom,scene) {
    temp = $(temp).hide();
    var logo = temp.find(".loading-logo");
    var type=[{
        body:temp.find(".loading-body-a").hide()
    },{
        body:temp.find(".loading-body-b").hide()
    }];
    temp.open = function (config) {
        if(config){
            var body;
            if($.isNumeric(config.type)){
                body=type[config.type].body;
            }else{
                body=type[0].body;
            }
            if (config.logo) {
                logo.attr("src",config.logo);
            }
            switch (config.position) {
                case "center":
                    util.makeCenter(dom, body,{
                        height:200,
                        width:200
                    });
                    break;
                case "left":
                    body.css({left:"20px",bottom:"20px",top:"auto",right:"auto"});
                    break;
                default:
                    body.css({right:"20px",bottom:"20px",top:"auto",left:"auto"});
                    break;
            }
            body.show();
            temp.show();
        }else{
            type.forEach(function(v){
                v.body.hide();
            });
            temp.hide();
        }
    };
    return temp;
}
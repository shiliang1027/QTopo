/**
 * Created by qiyc on 2017/3/10.
 */
var temp = require("./loading.html");
var util=require("../util.js");
module.exports = {
    init: init
};
function init(dom,scene) {
    temp = $(temp).hide();
    var logo = temp.find(".loading-logo");
    var body=temp.find(".loading-body");
    temp.open = function (config) {
        config=config||{};
        if (config.logo) {
            logo.attr("src",config.logo);
        }
        switch (config.position) {
            case "center":
                util.makeCenter(dom, body,{
                    height:160,
                    width:160
                });
                break;
            case "left":
                body.css({left:"20px",bottom:"20px"});
                break;
            default:
                body.css({right:"20px",bottom:"20px"});
                break;
        }
        temp.modal({
            keyboard: false,
            backdrop: 'static',
            show: true
        });
    };
    temp.close=function(){
        temp.modal("hide");
    };
    return temp;
}
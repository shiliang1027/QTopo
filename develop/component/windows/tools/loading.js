/**
 * Created by qiyc on 2017/3/10.
 */
var temp = require("./loading.html");
var util=require("../util.js");
module.exports = {
    init: init
};
function init(dom,scene) {
    temp = $(temp);
    var logo = temp.find(".loading-logo");
    temp.open = function (config) {
        if (config.log) {
            logo.src = config.log;
        }
        switch (config.position) {
            case "center":
                util.makeCenter(dom, temp,{
                    height:300,
                    width:300
                });
                break;
            case "left":
                temp.css({left:"20px",bottom:"20px"});
                break;
            default:
                temp.css({right:"20px",bottom:"20px"});
                break;
        }
    };
    temp.close=function(){
        temp.hide();
    };
    return temp;
}
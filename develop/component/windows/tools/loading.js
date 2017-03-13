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
    var type=[{
        body:temp.find(".loading-body-a").hide()
    },{
        body:temp.find(".loading-body-b").hide()
    }];
    temp.open = function (config) {
        config=config||{};
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
        body.show();
        temp.modal({
            keyboard: false,
            backdrop: 'static',
            show: true
        });
    };
    temp.close=function(){
        type.forEach(function(v){
            v.body.hide();
        });
        temp.modal("hide");
    };
    return temp;
}
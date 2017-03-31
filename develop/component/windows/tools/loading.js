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
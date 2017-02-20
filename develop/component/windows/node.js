/**
 * Created by qiyc on 2017/2/20.
 */
    require("./css/node.css");
var temp=require("./template/node.html");
module.exports={
    init:init
};

function init(){
    var node=$(temp);
    node.find("form").submit(function (e) {
        console.info($(this).serializeJson());
        return false;
    });

    node.find("[name=color_palette]").colorPalette().on('selectColor', function (e) {
        node.find(".color-selected").val(e.color);
    });
    return node;
}
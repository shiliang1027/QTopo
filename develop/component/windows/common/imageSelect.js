/**
 * Created by qiyc on 2017/2/22.
 */
var temp=require("./imageSelect.html");
var util=require("../util.js");
module.exports={
    init:init
};

function init(images){
    temp=$(temp);
    var body=temp.find(".modal-body");
    if($.isArray(images)){
        $.each(images,function(i,v){
            body.append(imageButton(v));
        });
    }
    util.addScroll(body);
    body.find(".img-btn").on("click",function(e){
        body.find(".active").removeClass("active");
        $(this).addClass("active");
    });
    return temp;
}
function imageButton(src){
    return $("<div class='img-btn'><img src="+src+"></div>");
}
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
    temp.on("hide.bs.modal",function(e){
        body.find(".active").removeClass("active");
    });
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
    temp.find(".ok-btn").on("click",function(){
        var callBack=temp.data("callBack");
        if($.isFunction(callBack)){
            callBack(body.find(".active img").attr("src"));
        }
        temp.modal('hide');
    });
    return temp;
}
function imageButton(src){
    return $("<div class='img-btn'><img src="+src+"></div>");
}
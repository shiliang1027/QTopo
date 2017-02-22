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
    var deferred;
    temp.on("window.open",function(e,fn){
        deferred=$.Deferred();
        if($.isFunction(fn)){
            deferred.done(fn);
        }
        temp.modal('show');
    });
    temp.on("window.close",function(e,data){
        if(deferred&&deferred.state()=="pending"){
            deferred.resolve(data);
        }
        temp.modal('hide');
    });
    temp.on("hide.bs.modal",function(e){
        body.find(".active").removeClass("active");
    });
    temp.find("button").on("click",function(){
        temp.trigger("window.close",body.find(".active img").attr("src"));
    });
    return temp;
}
function imageButton(src){
    return $("<div class='img-btn'><img src="+src+"></div>");
}
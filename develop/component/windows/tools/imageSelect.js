/**
 * Created by qiyc on 2017/2/22.
 */
var temp=require("./imageSelect.html");
var util=require("../util.js");
module.exports={
    init:init
};
/**
 * 公用的图片选择窗口
 * @param dom
 * @param scene
 * @returns {*}窗口的Jquery对象 包含open函数，函数返回一个延迟函数，在确认按钮点击后释放
 */
var temp_image;
function init(dom, scene){
    temp=$(temp);
    var body=temp.find(".modal-body");
    //构造图片按钮们
    temp.setImage=makeImageBtn(body);
    temp.getImage=function(){
        return temp_image;
    };
    var deferred;
    //隐藏时清空active类
    temp.on("hide.bs.modal",function(e){
        body.find(".active").removeClass("active");
        if(deferred&&deferred.state()=="pending"){
            deferred.reject();
        }
    });
    //------
    //点击确认按钮后用选中图片释放延迟函数
    temp.find(".ok").on("click",function(){
        if(deferred&&deferred.state()=="pending"){
            deferred.resolve(body.find(".active img").attr("src"));
        }
        temp.modal('hide');
    });
    //暴露的接口
    temp.open=function(){
        deferred=$.Deferred();
        temp.modal('show');
        return deferred.promise();
    };

    return temp;
}
function makeImageBtn(body){
    return function(images){
        if($.isArray(images)){
            body.html("");//清空
            temp_image=images;
            $.each(images,function(i,src){
                body.append(imageButton(src));
            });
            //选中图片之间互斥
            body.find(".img-btn").on("click",function(e){
                body.find(".active").removeClass("active");
                $(this).addClass("active");
            });
        }
    }
}
function imageButton(src){
    return $("<div class='img-btn'><img src="+src+"></div>");
}
var temp=require("./imageSelect.html");
var util=require("../util.js");
module.exports={
    init:init
};
var temp_image;
/**
 * @module component
 * @class windows
 */
/**
 * 开启图片选择框,无参
 *
 * 需初始化组件模块后配置图片数组,配置参考样例
 * @method imageSelect
 * @param [config] {object} 配置参数,无参数则只开启不设置
 *   @param [config.images] {array} 窗口内应用的图片集合,不设置则沿用上次设置
 *   @param [config.isSet] {boolean} 确认是打开窗口还是设置窗口,为ture则不打开窗口只设置，false或不设则默认开启
 * @return  {deferred} jquery的延迟执行函数
 * @example
 *      两种设置窗口内容的方式:
 *      1.instance.setComponent({
                    windows: {
                        images: ["img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png"]
                    }
             });
        2.instance.open('imageSelect',{
                images: ["img/mo/eNodeB.png", "img/mo/eNodeB_1.png", "img/mo/eNodeB_2.png", "img/mo/eNodeB_3.png", "img/mo/eNodeB_4.png"],
                isSet:true
            });
 *      instance.open("imageSelect")
                 .then(function(src){
                    console.info(src);选中的图片
                });
 */
function init(dom, scene){
    temp=$(temp);
    var body=temp.find(".modal-body");
    //构造图片按钮们
    var setImage=makeImageBtn(body);
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
    temp.open=function(config){
        config=config||{};
        if(config.images){
            setImage(config.images);
        }
        if(!config.isSet){
            deferred=$.Deferred();
            temp.modal('show');
            return deferred.promise();
        }
    };

    return temp;
}
function makeImageBtn(body){
    body.on("click",function(e){
        body.find(".active").removeClass("active");
        if(e.target){
            switch (e.target.tagName) {
                case "IMG":
                    $(e.target).parent(".img-btn").addClass("active");
                    break;
                case "DIV":
                    if(e.target.className.indexOf("img-btn")>-1){
                        $(e.target).addClass("active");
                    }
                    break;
            }
        }
    });
    return function(images){
        if($.isArray(images)){
            body.html("");//清空
            temp_image=images;
            $.each(images,function(i,src){
                body.append(imageButton(src));
            });
        }
    }
}
function imageButton(src){
    return $("<div class='img-btn'><img src="+src+"></div>");
}
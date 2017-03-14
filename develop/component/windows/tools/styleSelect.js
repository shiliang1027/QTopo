/**
 * Created by qiyc on 2017/3/14.
 */
var temp=require("./styleSelect.html");
var util=require("../util.js");
module.exports={
    init:init
};
/**
 * 公用的样式选择窗口
 * @param dom
 * @param scene
 * @returns {*}窗口的Jquery对象 包含open函数，函数返回一个延迟函数，在确认按钮点击后释放
 */
function init(dom, scene){
    temp=$(temp);
    var body=temp.find(".modal-body");
    var deferred;
    //隐藏时清空active类
    temp.on("hide.bs.modal",function(e){

    });
    //------
    //点击确认按钮后用选中图片释放延迟函数
    temp.find(".ok").on("click",function(){
        if(deferred&&deferred.state()=="pending"){
            deferred.resolve({

            });
        }
        temp.modal('hide');
    });
    temp.find(".close").on("click",function(){
        if(deferred&&deferred.state()=="pending"){
            deferred.reject();
        }
    });
    //暴露的接口
    temp.open=function(){
        deferred=$.Deferred();
        temp.modal('show');
        return deferred.promise();
    };
    return temp
}
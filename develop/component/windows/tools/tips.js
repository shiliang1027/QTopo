/**
 * Created by qiyc on 2017/2/27.
 */
var temp=require("./tips.html");
module.exports={
    init:init
};
function init(scene){
    temp=$(temp);
    temp.hide();
    var body=temp.find(".panel-body");
    var first=true;
    temp.open=function(fn,filter){
        if(first){
            if($.isFunction(fn)){
                scene.on("mousemove",function(e,target){
                    if(target){
                        if($.isFunction(filter)){
                            if(filter(target)){
                                showContent(target,fn,e);
                            }
                        }else{
                            showContent(target,fn,e);
                        }
                    }else{
                        temp.hide();
                    }
                });
                first=false;
            }
        }else{
            console.error("tips only config once");
        }
        function showContent(target,fn,e){
            var content=fn(target);
            body.html(content);
            temp.css({
                left: e.pageX + 20,
                top: e.pageY + 20
            }).show();
        }
    };
    return temp;
}
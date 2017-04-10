var temp = require("./tips.html");
module.exports = {
    init: init
};
/**
 * @module component
 * @class windows
 */
/**
 * 鼠标移动提示框
 * @method tips
 * @param config{object} 配置参数
 *  @param [config.show] {function} 未配置则认为要关闭该功能,展示面板内的内容,传入的参数为当前鼠标指向的元素
 *  @param [config.filter] {function} 指定何时显示,未配置则一直显示,传入的参数为当前鼠标指向的元素
 * @example
 *      两种配置方式,重复设置会替换上次设置
 *      1.instance.setComponent({
                windows: {
                    tips: {
                        show: function (target) {
                            return "<div>名: " + target.val("name") + "</div>" + "<div> id: " + target.val("id") + "</div>"
                        },
                        filter: function (target) {
                            return target.getType() == QTopo.constant.NODE;
                        }
                    }
                }
            });
        2.instance.open('tips',{
                    show: function (target) {
                        return "<div>名: " + target.val("name") + "</div>" + "<div> id: " + target.val("id") + "</div>"
                    },
                    filter: function (target) {
                        return target.getType() == QTopo.constant.NODE;
                    }
                });

 */
function init(dom, scene) {
    temp = $(temp);
    temp.hide();
    var body = temp.find(".panel-body");
    var configed=false;
    temp.open = function (config) {
        config=config||{};
        var fn=config.show;
        var filter=config.filter;
        if ($.isFunction(fn)) {
            temp.data('show',fn);
            configed=true;
            if($.isFunction(filter)){
                temp.data('filter',filter);
            }else{
                temp.data('filter','');
            }
        }else{
            temp.data('show','');
            configed=false;
        }
    };
    function showContent(target, fn, e) {
        var content = fn(target);
        body.html(content);
        temp.css({
            left: e.pageX + 20,
            top: e.pageY + 20
        }).show();
    }
    scene.on("mousemove", function (e, qtopo) {
        if (configed&&qtopo) {
            var show=temp.data('show');
            var filter= temp.data('filter');
            if ($.isFunction(filter)) {
                if (filter(qtopo)) {
                    showContent(qtopo, show, e);
                }
            } else {
                showContent(qtopo, show, e);
            }
        } else {
            temp.hide();
        }
    });
    scene.on("mousedown",function(){
        if(configed){
            temp.hide();
        }
    });
    return temp;
}
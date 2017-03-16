/**
 * Created by qiyc on 2017/2/27.
 */
var temp = require("./tips.html");
module.exports = {
    init: init
};
function init(dom, scene) {
    temp = $(temp);
    temp.hide();
    var body = temp.find(".panel-body");
    var temp_fn;
    var temp_filter;
    temp.open = function (fn, filter) {
        if ($.isFunction(fn)) {
            temp_fn = fn;
            scene.on("mousemove", function (e, qtopo) {
                if (qtopo) {
                    if ($.isFunction(filter)) {
                        temp_filter = filter;
                        if (temp_filter(qtopo)) {
                            showContent(qtopo, temp_fn, e);
                        }
                    } else {
                        showContent(qtopo, temp_fn, e);
                    }
                } else {
                    temp.hide();
                }
            });
            scene.on("mousedown",function(){
                temp.hide();
            });
        }else{
            QTopo.util.error("you need set function and [filter] to tell tips how to work");
        }
        function showContent(target, fn, e) {
            var content = fn(target);
            body.html(content);
            temp.css({
                left: e.pageX + 20,
                top: e.pageY + 20
            }).show();
        }
    };
    return temp;
}
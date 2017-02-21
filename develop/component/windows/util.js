/**
 * Created by qiyc on 2017/2/21.
 */
module.exports = {
    //颜色选择框绑定
    colorSelect: function (input, div) {
        div.colorPalette().on('selectColor', function (e) {
            input.val(e.color);
        });
    },
    //阻止form发送，同时转化为Json操作,对应转化的标签应该有name属性用以指明json的key
    formSubmit: function (dom, fn) {
        dom.submit(function (e) {
            try {
                if ($.isFunction(fn)) {
                    fn($(this).serializeJson());
                }
            } catch (e) {
                console.error("form trans json error : ", dom, fn, e);
            }
            return false;
        });

    },
    initBase:function(dom, win,close){
        var head=win.find(".panel-heading");
        head.find(".close").click(function(e){
            if($.isFunction(close)){
                close(e);
            }
        });
        moveAble(dom, win,head);
        function moveAble(dom, win,head) {
            win.movement = false;
            head.mousedown(function (e) {
                win.movePageX = e.pageX - win.offset().left;
                win.movePageY = e.pageY - win.offset().top;
                win.movement = true;
            });
            head.mouseup(function (e) {
                win.movement = false;
            });
            $(dom).mousemove(function (e) {
                if (win.movement) {
                    win.css({
                        left: e.pageX - win.movePageX,
                        top: e.pageY - win.movePageY
                    });
                }
            });
            //互斥
            //base.mutex.push(win);
            //win.show = function () {
            //    $(win).show();
            //    $.each(base.mutex, function (i, v) {
            //        if (win != v&& v.css("display")!="none") {
            //            v.find(".close").click();
            //        }
            //    });
            //}
        }
    },
    //使窗体可以移动,dom topo:外包裹的div,win:窗体
    callImageSelect: function (trigger, click) {
        var imageWin = $(".qtopo-windows-common .image_select");
        if (imageWin.length == 0) {
            console.error("not found image_select window");
        } else {
            trigger.click(function (e) {
                imageWin.modal('toggle');
            });
        }
    },
    //清理窗口中的input内的值
    clearWin: function (win) {
        var inputs=win.find("input");
        for (var i = 0; i < inputs.length; i++) {
            inputs.val('');
        }
    }
};
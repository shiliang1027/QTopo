/**
 * Created by qiyc on 2017/2/21.
 */
    var mutex=[];
var util={
    defaultPosition:function(dom){
        dom.css({
            top:($(window).height()-$(dom).height())/2,
            left:0
        });
    },
    //颜色选择框绑定
    initColorSelect: function (input, div) {
        div.colorPalette().on('selectColor', function (e) {
            input.val(e.color);
        });
    },
    //阻止form发送，同时转化为Json操作,对应转化的标签应该有name属性用以指明json的key
    initFormSubmit: function (dom, fn) {
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
    setFormInput:function(dom,json){
        dom.setForm(json);
    },
    initBase:function(dom, win){
        win.hide();
        var head=win.find(".panel-heading");
        head.find(".close").click(function(e){
            win.trigger("window.close");
        });
        //窗体可移动
        moveAble(dom, win,head);
        //窗口互斥
        mutex.push(win);
        win.on("window.open",function () {
            $.each(mutex, function (i, v) {
                if (win != v&& v.css("display")!="none") {
                    v.trigger("window.close");
                }
            });
        });
        //提供api触发窗口开关
        win.close=function(data){
            win.trigger("window.close",data);
        };
        win.open=function(data){
            win.trigger("window.open",data);
        };
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
        }
    },
    //清理窗口中的input内的值
    clearWin: function (win) {
        var inputs=win.find("input");
        for (var i = 0; i < inputs.length; i++) {
            inputs.val('');
        }
    },
    addScroll:function(element){
        $(element).niceScroll({
            cursorcolor: "#659ae6",//滚动滑块颜色
            cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
            touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
            cursorwidth: "5px", //像素光标的宽度
            cursorborderradius: "6px",//以像素为光标边界半径
            autohidemode: false, //是否隐藏滚动条,
            background: "#0e1c39",
            cursorborder: "1px solid #0e1c39"
        });
    }
};
module.exports = util;
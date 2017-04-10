/**
 * @module QTopo
 */
/**
 * 组件包中的窗口管理模块的窗口工具包
 * @class QTopo.windowUtil
 * @static
 */
var mutex = [];
var util = {
    /**
     * 根据窗口以及topo包裹外壳的高度确认窗口位置
     *
     * 统一的窗口显示位置
     * @method defaultPosition
     * @param dom {dom} topo外层包裹
     * @param win {dom} 设定高度的窗口
     */
    defaultPosition: function (dom, win) {
        win.css({
            top: ($(dom).height() - $(win).height()) / 2,
            left: 0
        });
    },
    /**
     * 基于Bootstrap下拉列表的颜色选择框绑定
     *
     * 颜色选择面板应 name=color_palette
     * 选中值存放在最近的input.color-selected 内
     * @method initColorSelect
     * @param win {dom} 初始化的窗口的jquery对象
     */
    initColorSelect: function (win) {
        //被控制的下拉列表中的div,用以插入颜色按钮
        win.each(function(){
            var self=$(this);
            var input=self.find("input.color-selected");
            self.find("[name=color_palette]").colorPalette().on('selectColor', function (e) {
                input.val(e.color);//选中颜色按钮后将值赋予的input框
            });
        });
    },
    /**
     * 阻止form发送，同时转化为Json操作,对应转化的标签应该有name属性用以指明json的key
     * @method initFormSubmit
     * @param dom{dom} form表单的jquery对象
     * @param fn{function} 处理json对象的函数
     */
    initFormSubmit: function (dom, fn) {
        dom.submit(function (e) {
            try {
                if ($.isFunction(fn)) {
                    fn($(this).serializeJson());
                }
            } catch (e) {
                QTopo.util.error("form trans json error : ", dom, fn, e);
            }
            return false;
        });
    },
    /**
     * json组装form表单
     * @method setFormInput
     * @param dom {dom} form表单的jquery对象
     * @param json {object} 对象中的键对应表单中的name，自动将值赋上
     */
    setFormInput: function (dom, json) {
        dom.setForm(json);
    },
    /**
     * 初始化一个窗口,定义开关接口，注册窗口互斥，窗口移动
     * @method initBase
     * @param dom{dom} topo存在的包裹dom,用以注册包裹空间内窗口移动
     * @param win{dom} 需要初始化的窗口的jquery对象
     */
    initBase: function (dom, win) {
        win.hide();
        var head = win.find(".panel-heading");
        head.find(".close").click(function (e) {
            win.trigger("window.close");
        });
        //窗体可移动
        moveAble(dom, win, head);
        //窗口互斥
        mutex.push(win);
        win.on("window.open", function () {
            $.each(mutex, function (i, v) {
                if (win != v && v.css("display") != "none") {
                    v.trigger("window.close");
                }
            });
        });
        //提供api触发窗口开关
        var name = head.text().trim();
        win.on("window.close",function(){
            win.data("todo","");
            win.hide();
        });
        win.on("window.open",function(){
            util.defaultPosition(dom,win);
            win.show();
        });
        win.close = function () {
            try {
                win.trigger("window.close");
            } catch (e) {
                QTopo.util.error("window close error : " + name,e);
            }
        };
        win.open = function (data) {
            try {
                win.data("todo",data);
                win.trigger("window.open");
            } catch (e) {
                QTopo.util.error("window open error : " + name,e);
            }
        };
        function moveAble(dom, win, head) {
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
    /**
     * 封装统一的jquery-niceScroll插件的设定值
     * @method addScroll
     * @param win 需要添加滚动条的窗口
     */
    addScroll: function (win) {
        $(win).niceScroll({
            cursorcolor: "#659ae6",//滚动滑块颜色
            cursoropacitymax: 1, //改变不透明度非常光标处于活动状态（scrollabar“可见”状态），范围从1到0
            touchbehavior: false, //使光标拖动滚动像在台式电脑触摸设备
            cursorwidth: "5px", //像素光标的宽度
            cursorborderradius: "6px",//以像素为光标边界半径
            autohidemode: false, //是否隐藏滚动条,
            background: "#0e1c39",
            cursorborder: "1px solid #0e1c39"
        });
    },

    /**
     * 让子窗口在父窗口的正中
     * @method makeCenter
     * @param dom 父窗口
     * @param win 子窗口
     * @param fixed 高宽写定
     *      @param fixed.height {number} 高
     *      @param fixed.width {number} 宽
     */
    makeCenter:function(dom,win,fixed){
        var height=win.height()||300;
        var width=win.width()||300;
        if(fixed){
            if($.isNumeric(fixed.height)){
                height=fixed.height;
            }
            if($.isNumeric(fixed.width)){
                width=fixed.width;
            }
        }
        win.css({
            top:($(dom).height()-height)/2,
            left:($(dom).width()-width)/2,
            bottom:"auto",
            right:"auto"
        });
    }
};
module.exports = util;
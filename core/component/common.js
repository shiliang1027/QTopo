/**
 * Created by qiyc on 2017/2/8.
 */
var common = {
    setAttr: function (element, attrs, config) {
        if ($.isArray(attrs) && element) {
            $.each(attrs, function (k, v) {
                var attr = config ? config[v] : element.attr[v];//如果有设置就读设置，无就读自身属性
                var fn = common["set" + v.replace(/(^|\s+)\w/g, function (s) {
                    return s.toUpperCase();//首字母大寫
                })];//判断设置函数是否存在
                if (attr && fn) {
                    try{
                        fn.call(element, attr);
                    }catch (e){
                        console.error("common-setAttr error:",e);
                    }
                }
            });
        }
    },
    setTextPosition: function (textPosition) {
        var jtopo = this.jtopo;
        jtopo.textPosition = textPosition;
        jtopo.text = this.attr.name;
        switch (textPosition) {
            case 'Hidden':
                jtopo.text = '';
                break;
            case 'Bottom_Center':
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                break;
            case 'Top_Center':
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                break;
            case 'Middle_Left':
                jtopo.textOffsetX = -5;
                jtopo.textOffsetY = 0;
                break;
            case 'Middle_Right':
                jtopo.textOffsetX = 5;
                jtopo.textOffsetY = 0;
                break;
        }
    },
    setPosition: function (position, fix) {
        this.jtopo.setLocation(position[0], position[1]);
    },
    setSize: function (size) {
        this.jtopo.setSize(size[0], size[1]);
    },
    setFont: function (font) {
        this.jtopo.font = font.size + "px " + font.type;
    },
    setAlpha: function (alpha) {
        if (alpha > 1 || alpha < 0) {
            this.jtopo.alpha = 1;
        } else {
            this.jtopo.alpha = alpha;
        }
    },
    setFontColor: function (color) {
        this.jtopo.fontColor = QTopo.util.transHex(color.toLowerCase());
    },
    setZIndex:function(zIndex){
        this.jtopo.zIndex=zIndex;
    },
    on:function(name, fn){
        this.jtopo.addEventListener(name, fn);
    }
};
module.exports = common;
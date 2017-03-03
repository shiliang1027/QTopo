/**
 * Created by qiyc on 2017/2/20.
 */
/**
 * 将form里面的内容序列化成json
 * 相同的checkbox用分号拼接起来
 * @param {dom} 指定的选择器
 * @method serializeJson
 * */
$.fn.serializeJson = function () {
    var serializeObj = {},
        array = this.serializeArray();
    $(array).each(function () {
        if (serializeObj[this.name]) {
            serializeObj[this.name] += ';' + this.value;
        } else {
            serializeObj[this.name] = this.value;
        }
    });

    return serializeObj;
};

/**
 * 将josn对象赋值给form
 * @param {dom} 指定的选择器
 * @param {obj} 需要给form赋值的json对象
 * @method serializeJson
 * */
$.fn.setForm = function (jsonValue) {
    var obj = this;
    $.each(jsonValue, function (name, ival) {
        var $oinput = obj.find("input[name=" + name + "]");
        if ($oinput.attr("type") == "checkbox") {
            if (ival !== null) {
                var checkboxObj = $("[name=" + name + "]");
                var checkArray = ival.split(";");
                for (var i = 0; i < checkboxObj.length; i++) {
                    for (var j = 0; j < checkArray.length; j++) {
                        if (checkboxObj[i].value == checkArray[j]) {
                            $(checkboxObj[i]).attr("checked",true);
                        }else{
                            $(checkboxObj[i]).attr("checked",false);
                        }
                    }
                }
            }
        }
        else if ($oinput.attr("type") == "radio") {
            $oinput.each(function () {
                var radioObj = $("[name=" + name + "]");
                for (var i = 0; i < radioObj.length; i++) {
                    if (radioObj[i].value == ival) {
                        radioObj[i].click();
                    }
                }
            });
        }
        else if ($oinput.attr("type") == "textarea"&&ival) {
            obj.find("[name=" + name + "]").html(ival);
        }
        else if(ival){
            obj.find("[name=" + name + "]").val(ival);
        }
    })
};
inteColorPalette();
/**
 * 颜色选择器插件初始化
 * */
function inteColorPalette() {
    "use strict";
    var aaColor = [
        ['#000000', '#424242', '#636363', '#9C9C94', '#CEC6CE', '#EFEFEF', '#F7F7F7', '#FFFFFF'],
        ['#FF0000', '#FF9C00', '#FFFF00', '#00FF00', '#00FFFF', '#0000FF', '#9C00FF', '#FF00FF'],
        ['#F7C6CE', '#FFE7CE', '#FFEFC6', '#D6EFD6', '#CEDEE7', '#CEE7F7', '#D6D6E7', '#E7D6DE'],
        ['#E79C9C', '#FFC69C', '#FFE79C', '#B5D6A5', '#A5C6CE', '#9CC6EF', '#B5A5D6', '#D6A5BD'],
        ['#E76363', '#F7AD6B', '#FFD663', '#94BD7B', '#73A5AD', '#6BADDE', '#8C7BC6', '#C67BA5'],
        ['#CE0000', '#E79439', '#EFC631', '#6BA54A', '#4A7B8C', '#3984C6', '#634AA5', '#A54A7B'],
        ['#9C0000', '#B56308', '#BD9400', '#397B21', '#104A5A', '#085294', '#311873', '#731842'],
        ['#630000', '#7B3900', '#846300', '#295218', '#083139', '#003163', '#21104A', '#4A1031']
    ];

    var createPaletteElement = function (element, _aaColor) {
        element.addClass('bootstrap-colorpalette');
        var aHTML = [];
        $.each(_aaColor, function (i, aColor) {
            aHTML.push('<div>');
            $.each(aColor, function (i, sColor) {
                var sButton = ['<button type="button" class="btn-color" style="background-color:', sColor,
                    '" data-value="', sColor,
                    '" title="', sColor,
                    '"></button>'].join('');
                aHTML.push(sButton);
            });
            aHTML.push('</div>');
        });
        element.html(aHTML.join(''));
    };

    var attachEvent = function (palette) {
        palette.element.on('click', function (e) {
            var welTarget = $(e.target),
                welBtn = welTarget.closest('.btn-color');

            if (!welBtn[0]) {
                return;
            }

            var value = welBtn.attr('data-value');
            palette.value = value;
            palette.element.trigger({
                type: 'selectColor',
                color: value,
                element: palette.element
            });
        });
    };

    var Palette = function (element, options) {
        this.element = element;
        createPaletteElement(element, options && options.colors || aaColor);
        attachEvent(this);
    };

    $.fn.extend({
        colorPalette: function (options) {
            this.each(function () {
                var $this = $(this),
                    data = $this.data('colorpalette');
                if (!data) {
                    $this.data('colorpalette', new Palette($this, options));
                }
            });
            return this;
        }
    });
}

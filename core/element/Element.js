/**
 * Created by qiyc on 2017/2/7.
 */
module.exports = new Element();
function Element() {
    this.show = function () {
        this.jtopo.visible = true;
    };
    this.hide = function () {
        this.jtopo.visible = false;
    };
    this.setText = function (text) {
        this.jtopo.text = text;
    };
    this.on = function (name, fn) {
        this.jtopo.addEventListener(name, function(e){
            fn(e.target.qtopo,e);
        });
    };
    this.off = function (name, fn) {
        this.jtopo.removeEventListener(name);
    };
    this.setZIndex = function (zIndex) {
        this.jtopo.zIndex = parseInt($.isNumeric(zIndex) ? zIndex : 10);
    };
    this.setFont = function (font) {
        if ($.isNumeric(font.size) && font.type) {
            this.jtopo.font = font.size + "px " + font.type;
        } else {
            console.error("setFont need size and type");
        }
        if (font.color) {
            this.jtopo.fontColor = QTopo.util.transHex(font.color.toLowerCase());
        } else {
            console.error("setFontColor has no param");
        }
    };
    this.setAlpha = function (alpha) {
        if ($.isNumeric(alpha) && alpha <= 1 && alpha > 0) {
            this.jtopo.alpha = alpha;
        } else {
            this.jtopo.alpha = 1;
        }
    };
    this.setTextOffset = function (arr) {
        if ($.isArray(arr) && arr.length >= 2) {
            this.jtopo.textOffsetX = arr[0];
            this.jtopo.textOffsetY = arr[1];
        } else {
            console.error("textOffset need be array and 2 length");
        }
    };
    this.setPosition = function (position, fix) {
        if ($.isArray(position) && position.length >= 2) {
            this.jtopo.setLocation(position[0], position[1]);
        } else {
            console.error("position need be array and 2 length");
        }
    };
    this.setSize = function (size) {
        if ($.isArray(size) && size.length >= 2) {
            this.jtopo.setSize(size[0], size[1]);
        } else {
            console.error("size need be array and 2 length");
        }
    };
    this.setDragable = function (dragable) {
        this.jtopo.dragable = dragable;
    };
    this.setTextPosition = function (textPosition) {
        var jtopo = this.jtopo;
        jtopo.text = this.attr.name;
        switch (textPosition) {
            case 'hide':
                jtopo.text = '';
                break;
            case 'bottom':
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                jtopo.textPosition = "Bottom_Center";
                break;
            case 'top':
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                jtopo.textPosition = "Top_Center";
                break;
            case 'left':
                jtopo.textOffsetX = -5;
                jtopo.textOffsetY = 0;
                jtopo.textPosition = "Middle_Left";
                break;
            case 'right':
                jtopo.textOffsetX = 5;
                jtopo.textOffsetY = 0;
                jtopo.textPosition = "Middle_Right";
                break;
            default:
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                jtopo.text = this.attr.name;
                jtopo.textPosition = 'Bottom_Center';
                this.attr.textPosition="bottom";
                console.error("set wrong textPosition,default is bottom");
                break;
        }
    };
    //限制所能修改的属性,arr为所能修改的属性列表
    this._setAttr = function (arr, config) {
        var self = this;
        try {
            $.each(arr, function (i, v) {
                var fn = self['set' + QTopo.util.upFirst(v)];
                var attr = config[v];
                if (attr && fn) {
                    fn.call(self, attr);
                    self.attr[v] = attr;
                }
            });
        } catch (e) {
            console.info("Element _setAttr error :" + e);
        }
    }
}


/**
 * Created by qiyc on 2017/2/7.
 */
module.exports = Element;
function Element() {
    this.show = function () {
        switch (this.getType()) {
            case "node":
                toggleNode.call(this, true);
                break;
            case "container":
                toggleContainer.call(this, true);
                break;
            case "link":
                toggleLink.call(this, true);
        }
    };
    this.hide = function () {
        switch (this.getType()) {
            case "node":
                toggleNode.call(this, false);
                break;
            case "container":
                toggleContainer.call(this, false);
                break;
            case "link":
                toggleLink.call(this, false);
        }
    };
    this.setText = function (text) {
        if (text) {
            this.jtopo.text = text;
        }
        this.attr.text = this.jtopo.text;
    };
    this.on = function (name, fn) {
        this.jtopo.addEventListener(name, function (e) {
            if (e.target && e.target.qtopo) {
                fn(e, e.target.qtopo);
            } else {
                fn(e);
            }
        });
    };
    this.off = function (name, fn) {
        this.jtopo.removeEventListener(name);
    };
    this.setZIndex = function (zIndex) {
        if ($.isNumeric(zIndex)) {
            this.jtopo.zIndex = parseInt(zIndex);
        }
        this.attr.zIndex = this.jtopo.zIndex;
    };
    this.setFont = function (font) {
        var type = this.attr.font.type;
        var size = this.attr.font.size;
        if (font) {
            if ($.isNumeric(font.size)) {
                size = font.size;
            }
            if (font.type) {
                type = font.type;
            }
            this.jtopo.font = size + "px " + type;
            if (font.color) {
                this.jtopo.fontColor = QTopo.util.transHex(font.color.toLowerCase());
            }
        }
        this.attr.font.type = font.type;
        this.attr.font.size = font.size;
        this.attr.font.color = this.jtopo.fontColor;
    };
    this.setAlpha = function (alpha) {
        if ($.isNumeric(alpha) && alpha <= 1 && alpha > 0) {
            this.jtopo.alpha = alpha;
        } else {
            this.jtopo.alpha = 1;
        }
        this.attr.alpha = this.jtopo.alpha;
    };
    this.setTextOffset = function (arr) {
        if ($.isArray(arr) && arr.length >= 2) {
            this.jtopo.textOffsetX = arr[0];
            this.jtopo.textOffsetY = arr[1];
        }
        this.attr.textOffset = [this.jtopo.textOffsetX, this.jtopo.textOffsetY];
    };
    this.setPosition = function (position) {
        if ($.isArray(position) && position.length >= 2) {
            if ($.isNumeric(position[0]) && $.isNumeric(position[1])) {
                this.jtopo.setLocation(parseInt(position[0]), parseInt(position[1]));
            }
        }
        this.attr.position = [this.jtopo.x, this.jtopo.y];
    };
    this.setSize = function (size) {
        if ($.isArray(size) && size.length >= 2) {
            this.jtopo.setSize(size[0], size[1]);
        }
        this.attr.size = [this.jtopo.width, this.jtopo.height];
    };
    this.setDragable = function (dragable) {
        if (typeof dragable == 'boolean') {
            this.jtopo.dragable = dragable;
        }
        this.attr.dragable = this.jtopo.dragable;
    };
    this.setTextPosition = function (textPosition) {
        var jtopo = this.jtopo;
        jtopo.text = this.attr.name || "";
        switch (textPosition) {
            case 'hide':
                jtopo.text = '';
                this.attr.textPosition = "hide";
                break;
            case 'bottom':
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                jtopo.textPosition = "Bottom_Center";
                this.attr.textPosition = "bottom";
                break;
            case 'top':
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                jtopo.textPosition = "Top_Center";
                this.attr.textPosition = "top";
                break;
            case 'left':
                jtopo.textOffsetX = -5;
                jtopo.textOffsetY = 0;
                jtopo.textPosition = "Middle_Left";
                this.attr.textPosition = "left";
                break;
            case 'right':
                jtopo.textOffsetX = 5;
                jtopo.textOffsetY = 0;
                jtopo.textPosition = "Middle_Right";
                this.attr.textPosition = "right";
                break;
            default:
                jtopo.textOffsetX = 0;
                jtopo.textOffsetY = 0;
                jtopo.textPosition = 'Bottom_Center';
                this.attr.textPosition = "bottom";
                console.error(this, "set wrong textPosition,default is bottom");
                break;
        }
    };
    //只要对应属性有方法则修改
    this._setAttr = function (config) {
        var self = this;
        $.each(config, function (k, v) {
            try {
                var fn = self['set' + QTopo.util.upFirst(k)];
                if (fn) {
                    //v=QTopo.util.merge(self.attr[k],v);
                    fn.call(self, v);
                }
            } catch (e) {
                console.error(self, "Element _setAttr error :" + k, e);
            }
        });
    }
}
function toggle(arr, fn) {
    for (var i = 0; i < arr.length; i++) {
        arr[i][fn]();
    }
}
function toggleLink(flag) {
    this.getPath();
    if(flag){//线的显示只有当其两端节点都显示时才显示
        if (this.path.start.jtopo && this.path.end.jtopo) {
            if (this.path.start.jtopo.visible && this.path.end.jtopo.visible) {
                this.jtopo.visible = true;
                this.attr.show = this.jtopo.visible;
            }
        }
    }else{
        this.jtopo.visible = false;
        this.attr.show = this.jtopo.visible;
    }

}
function toggleNode(flag) {
    this.jtopo.visible = flag;
    this.attr.show = this.jtopo.visible;
    this.getLinks();
    var string=flag?"show":"hide";
    toggle(this.links.in, string);
    toggle(this.links.out, string);
}
function toggleContainer(flag) {
    this.jtopo.visible = flag;
    this.attr.show = this.jtopo.visible;
    this.getChildren();
    this.getLinks();
    var string=flag?"show":"hide";
    toggle(this.children, string);
    toggle(this.links.in, string);
    toggle(this.links.out, string);
}


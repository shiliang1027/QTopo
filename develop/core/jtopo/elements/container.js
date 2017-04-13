module.exports = function (jtopo) {
    function Container(c) {
        this.initialize = function (c) {
            Container.prototype.initialize.apply(this, null);
                this.elementType = "container";
            this.zIndex = jtopo.zIndex_Container;
            this.width = 100;
            this.height = 100;
            this.childs = [];
            this.alpha = .5;
            this.dragable = !0;
            this.childDragble = !0;
            this.visible = !0;
            this.fillColor = "10,100,80";
            this.borderWidth = 0;
            this.borderColor = "255,255,255";
            this.borderRadius = null;
            this.font = "12px Consolas";
            this.fontColor = "255,255,255";
            this.text = c;
            this.textPosition = "Bottom_Center";
            this.textOffsetX = 0;
            this.textOffsetY = 0;
            this.layout = new jtopo.layout.AutoBoundLayout;
        };
        this.initialize(c);
        this.add = function (a) {
            this.childs.push(a);
            a.dragable = this.childDragble;
        };
        this.remove = function (a) {
            for (var b = 0; b < this.childs.length; b++)if (this.childs[b] === a) {
                a.parentContainer = null;
                this.childs = this.childs.del(b);
                a.lastParentContainer = this;
                break;
            }
        };
        this.removeAll = function () {
            this.childs = []
        };
        this.setLocation = function (setX, setY) {
            var oX = setX - this.x;
            var oY = setY - this.y;
            this.x = setX;
            this.y = setY;
            if (this.qtopo && this.qtopo.attr && this.qtopo.attr.position) {
                this.qtopo.attr.position[0] = setX;
                this.qtopo.attr.position[1] = setY;
            }
            for (var e = 0; e < this.childs.length; e++) {
                var child = this.childs[e];
                child.setLocation(child.x + oX, child.y + oY)
            }
        };
        this.doLayout = function (a) {
            a && a(this, this.childs)
        };
        this.paint = function (a) {
            if (this.visible) {
                if (this.layout) {
                    this.layout(this, this.childs);
                }
                a.beginPath();
                a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
                if (null == this.borderRadius || 0 == this.borderRadius) {
                    a.rect(this.x, this.y, this.width, this.height);
                } else {
                    a.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius);
                }
                a.fill();
                a.closePath();
                this.paintText(a);
                this.paintBorder(a);
            }
        };
        this.paintBorder = function (a) {
            if (0 != this.borderWidth) {
                a.beginPath(), a.lineWidth = this.borderWidth, a.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
                var b = this.borderWidth / 2;
                null == this.borderRadius || 0 == this.borderRadius ? a.rect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth) : a.JTopoRoundRect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius), a.stroke(), a.closePath()
            }
        };
        this.paintText = function (a) {
            var text = this.text;
            if (null != text && "" != text) {
                a.beginPath();
                a.font = this.font;
                var fontWidth = a.measureText("田").width;
                var maxWidth = fontWidth;
                a.fillStyle = "rgba(" + this.fontColor + ",1)"; //", " + this.alpha + ")";名称永远不透明
                //换行检测
                var textlines = text.split("\n");
                for (var i = 0; i < textlines.length; i++) {
                    var width = a.measureText(textlines[i]).width;
                    if (width > maxWidth) {
                        maxWidth = width;
                    }
                }
                var e = this.getTextPostion(this.textPosition, maxWidth, fontWidth, textlines.length);
                for (var j = 0; j < textlines.length; j++) {
                    var textWidth = a.measureText(textlines[j]).width;
                    a.fillText(textlines[j], e.x + (maxWidth - textWidth) / 2, e.y + j * fontWidth);
                }

                a.closePath();
            }
        };
        this.getTextPostion = function (textPosition, maxWidth, fontWidth, textLines) {
            var position = null;
            switch (textPosition) {
                case'Top_Center':
                    position = {
                        x: this.x + this.width / 2 - maxWidth / 2,
                        y: this.y - fontWidth / 2 - fontWidth * (textLines - 1)
                    };
                    break;
                case'Top_Right':
                    position = {x: this.x + this.width - maxWidth, y: this.y - fontWidth / 2};
                    break;
                case'Top_Left':
                    position = {
                        x: this.x,
                        y: this.y - fontWidth / 2
                    };
                    break;
                case'Bottom_Right':
                    position = {
                        x: this.x + this.width - maxWidth,
                        y: this.y + this.height + fontWidth
                    };
                    break;
                case'Bottom_Left':
                    position = {x: this.x, y: this.y + this.height + fontWidth};
                    break;
                case'Middle_Center':
                    position = {
                        x: this.x + this.width / 2 - maxWidth / 2,
                        y: this.y + this.height / 2 + fontWidth / 2
                    };
                    break;
                case'Middle_Right':
                    position = {
                        x: this.x + this.width,
                        y: this.y + this.height / 2 + fontWidth / 2
                    };
                    break;
                case'Middle_Left':
                    position = {
                        x: this.x-maxWidth,
                        y: this.y + this.height / 2 + fontWidth / 2
                    };
                    break;
                default://'Bottom_Center'
                    position = {
                        x: this.x + this.width / 2 - maxWidth / 2,
                        y: this.y + this.height + fontWidth
                    };
            }
            if (null != this.textOffsetX) {
                position.x += this.textOffsetX;
            }
            if (null != this.textOffsetY) {
                position.y += this.textOffsetY;
            }
            return position
        };
        this.paintMouseover = function () {
        };
        this.paintSelected = function (a) {
            a.shadowBlur = 10, a.shadowColor = "rgba(0,0,0,1)", a.shadowOffsetX = 0, a.shadowOffsetY = 0
        }
    }

    Container.prototype = new jtopo.InteractiveElement;
    jtopo.Container = Container;
};
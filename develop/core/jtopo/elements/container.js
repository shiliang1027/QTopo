module.exports=function (jtopo) {
    function container(c) {
        this.initialize = function (c) {
            container.prototype.initialize.apply(this, null),
                this.elementType = "container",
                this.zIndex = jtopo.zIndex_Container,
                this.width = 100,
                this.height = 100,
                this.childs = [],
                this.alpha = .5,
                this.dragable = !0,
                this.childDragble = !0,
                this.visible = !0,
                this.fillColor = "10,100,80",
                this.borderWidth = 0,
                this.borderColor = "255,255,255",
                this.borderRadius = null,
                this.font = "12px Consolas",
                this.fontColor = "255,255,255",
                this.text = c,
                this.textPosition = "Bottom_Center",
                this.textOffsetX = 0,
                this.textOffsetY = 0,
                this.layout = new jtopo.layout.AutoBoundLayout
        }, this.initialize(c), this.add = function (a) {
            this.childs.push(a), a.dragable = this.childDragble
        }, this.remove = function (a) {
            for (var b = 0; b < this.childs.length; b++)if (this.childs[b] === a) {
                a.parentContainer = null, this.childs = this.childs.del(b), a.lastParentContainer = this;
                break
            }
        }, this.removeAll = function () {
            this.childs = []
        }, this.setLocation = function (a, b) {
            var c = a - this.x, d = b - this.y;
            this.x = a, this.y = b;
            if (this.qtopo && this.qtopo.attr && this.qtopo.attr.position) {
                this.qtopo.attr.position[0] = a;
                this.qtopo.attr.position[1] = b;
            }
            for (var e = 0; e < this.childs.length; e++) {
                var f = this.childs[e];
                f.setLocation(f.x + c, f.y + d)
            }
        }, this.doLayout = function (a) {
            a && a(this, this.childs)
        }, this.paint = function (a) {
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
        }, this.paintBorder = function (a) {
            if (0 != this.borderWidth) {
                a.beginPath(), a.lineWidth = this.borderWidth, a.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
                var b = this.borderWidth / 2;
                null == this.borderRadius || 0 == this.borderRadius ? a.rect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth) : a.JTopoRoundRect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius), a.stroke(), a.closePath()
            }
        }, this.paintText = function (a) {
            var b = this.text;
            if (null != b && "" != b) {
                a.beginPath(), a.font = this.font;
                var c = a.measureText(b).width, d = a.measureText("田").width;
                a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
                var e = this.getTextPostion(this.textPosition, c, d);
                a.fillText(b, e.x, e.y), a.closePath()
            }
        }, this.getTextPostion = function (textPosition, maxWidth, fontWidth, height) {
            var d = null;
            return null == textPosition || "Bottom_Center" == textPosition ? d = {
                x: this.x + this.width / 2 - maxWidth / 2,
                y: this.y + this.height + fontWidth
            } : "Top_Center" == textPosition ? d = {
                x: this.x + this.width / 2 - maxWidth / 2,
                y: this.y - fontWidth / 2 - fontWidth * (height - 1)
            } : "Top_Right" == textPosition ? d = {x: this.x + this.width - maxWidth, y: this.y - fontWidth / 2} : "Top_Left" == textPosition ? d = {
                x: this.x,
                y: this.y - fontWidth / 2
            } : "Bottom_Right" == textPosition ? d = {
                x: this.x + this.width - maxWidth,
                y: this.y + this.height + fontWidth
            } : "Bottom_Left" == textPosition ? d = {x: this.x, y: this.y + this.height + fontWidth} : "Middle_Center" == textPosition ? d = {
                x: this.x + this.width / 2 - maxWidth / 2,
                y: this.y + this.height / 2 + fontWidth / 2
            } : "Middle_Right" == textPosition ? d = {x: this.x + this.width - maxWidth, y: this.y + this.height / 2 + fontWidth / 2} : "Middle_Left" == textPosition && (d = {
                x: this.x,
                y: this.y + this.height / 2 + fontWidth / 2
            }), null != this.textOffsetX && (d.x += this.textOffsetX), null != this.textOffsetY && (d.y += this.textOffsetY), d
        }, this.paintMouseover = function () {
        }, this.paintSelected = function (a) {
            a.shadowBlur = 10, a.shadowColor = "rgba(0,0,0,1)", a.shadowOffsetX = 0, a.shadowOffsetY = 0
        }
    }

    container.prototype = new jtopo.InteractiveElement;
    jtopo.Container = container;
}
module.exports = function (jtopo) {
    jtopo.Container = Container;
    function Container(c) {
        jtopo.InteractiveElement.call(this);
        this.elementType = "container";
        this.zIndex = jtopo.zIndex_Container;
        this.width = 100;
        this.height = 100;
        this.childs = [];
        this.alpha = .5;
        this.draggable = !0;
        this.childDraggable = !0;
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
    }
    jtopo.util.inherits(Container,jtopo.InteractiveElement);
    Container.prototype.add = function (element) {
        this.childs.push(element);
        element.draggable = this.childDraggable;
    };
    Container.prototype.remove = function (element) {
        element.parentContainer = null;
        this.childs = this.childs.del(element);
        element.lastParentContainer = this;
    };
    Container.prototype.removeAll = function () {
        this.childs = []
    };
    Container.prototype.setLocation = function (setX, setY) {
        var oX = setX - this.x;
        var oY = setY - this.y;
        this.x = setX;
        this.y = setY;
        if (this.qtopo && this.qtopo.attr && this.qtopo.attr.position) {
            this.qtopo.attr.position[0] = setX;
            this.qtopo.attr.position[1] = setY;
        }
        this.childs.forEach(function(element){
            element.setLocation(element.x + oX, element.y + oY);
        });
    };
    Container.prototype.doLayout = function (layout) {
        if(layout &&typeof layout =='function'){
            layout(this, this.childs)
        }
    };
    Container.prototype.paint = function (context) {
        if (this.visible) {
            this.doLayout(this.layout);
            context.beginPath();
            context.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
            if (null == this.borderRadius || 0 == this.borderRadius) {
                context.rect(this.x, this.y, this.width, this.height);
            } else {
                context.JTopoRoundRect(this.x, this.y, this.width, this.height, this.borderRadius);
            }
            context.fill();
            context.closePath();
            this.paintText(context);
            this.paintBorder(context);
        }
    };
    Container.prototype.paintBorder = function (context) {
        if (0 != this.borderWidth) {
            context.beginPath();
            context.lineWidth = this.borderWidth;
            context.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
            var b = this.borderWidth / 2;
            if(null == this.borderRadius || 0 == this.borderRadius){
                context.rect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth)
            }else{
                context.JTopoRoundRect(this.x - b, this.y - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius);
            }
            context.stroke();
            context.closePath();
        }
    };
    Container.prototype.paintText = function (context) {
        var text = this.text;
        if (null != text && "" != text) {
            context.beginPath();
            context.font = this.font;
            var fontWidth = context.measureText("田").width;
            var maxWidth = fontWidth;
            context.fillStyle = "rgba(" + this.fontColor + ",1)"; //", " + this.alpha + ")";名称永远不透明
            //换行检测
            var textlines = text.split("\n");
            for (var i = 0; i < textlines.length; i++) {
                var width = context.measureText(textlines[i]).width;
                if (width > maxWidth) {
                    maxWidth = width;
                }
            }
            var e = this.getTextPostion(this.textPosition, maxWidth, fontWidth, textlines.length);
            for (var j = 0; j < textlines.length; j++) {
                var textWidth = context.measureText(textlines[j]).width;
                context.fillText(textlines[j], e.x + (maxWidth - textWidth) / 2, e.y + j * fontWidth);
            }

            context.closePath();
        }
    };
    Container.prototype.getTextPostion = function (textPosition, maxWidth, fontWidth, textLines) {
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
    Container.prototype.paintMouseover = function () {
    };
    Container.prototype.paintSelected = function (a) {
        a.shadowBlur = 10;
        a.shadowColor = "rgba(0,0,0,1)";
        a.shadowOffsetX = 0;
        a.shadowOffsetY = 0;
    }
};
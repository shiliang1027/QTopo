module.exports=function(jtopo){
    jtopo.Node = Node;
    function Node(text) {
        jtopo.EditableElement.call(this);
        this.elementType = "node";
        this.zIndex = jtopo.zIndex_Node;
        this.text = text;
        this.font = "12px Consolas";
        this.fontColor = "255,255,255";
        this.borderWidth = 0;
        this.borderColor = "255,255,255";
        this.borderRadius = null;
        this.draggable = !0;
        this.textPosition = "Bottom_Center";
        this.textOffsetX = 0;
        this.textOffsetY = 0;
        this.transformAble = !0;
        this.inLinks = null;
        this.outLinks = null;
        var d = "text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius".split(",");
        this.serializedProperties = this.serializedProperties.concat(d);
    }
    jtopo.util.inherits(Node,jtopo.EditableElement);
    Object.defineProperties(Node.prototype, {
        alarmColor: {
            get: function () {
                return this._alarmColor;
            },
            set: function (color) {
                this._alarmColor = color;
                if (null != this.image) {
                    var c = jtopo.util.genImageAlarm(this.image, color);
                    if (c) {
                        this.alarmImage = c;
                    }
                }
            }
        }
    });
    //自定义新增,启用告警后每次绘画执行修改阴影
    Node.prototype.paintAlarmFlash = function (context) {
        if (this.shadow == 1 && this.allowAlarmFlash == 1) {
            if (this.shadowDirection == null) {
                this.shadowDirection = true;
            }
            move(this);
            context.shadowBlur = this.shadowBlur;
            function move(node) {
                if (node.shadowDirection) {
                    node.shadowBlur += 5;
                    if (node.shadowBlur > 100) {
                        node.shadowDirection = false;
                    }
                }
                else {
                    node.shadowBlur -= 5;
                    if (node.shadowBlur <= 10) {
                        node.shadowDirection = true;
                    }
                }
            }
        }
    };
    Node.prototype.paint = function (context) {
        this.paintAlarmFlash(context);
        if (this.image) {
            var gobalAlpha = context.globalAlpha;
            context.globalAlpha = this.alpha;
            if (null != this.alarmImage && null != this.alarm) {
                context.drawImage(this.alarmImage, -this.width / 2, -this.height / 2, this.width, this.height)
            } else {
                context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height)
            }
            context.globalAlpha = gobalAlpha;
        } else {
            context.beginPath();
            context.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
            if (null == this.borderRadius || 0 == this.borderRadius) {
                context.rect(-this.width / 2, -this.height / 2, this.width, this.height)
            } else {
                context.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius);
            }
            context.fill();
            context.closePath();
        }
        this.paintText(context);
        this.paintBorder(context);
        this.paintCtrl(context);
        this.paintAlarmText(context);
    };
    Node.prototype.paintAlarmText = function (context) {
        if (null != this.alarm && "" != this.alarm) {
            context.font = this.alarmFont || "12px 微软雅黑";
            var lineWidth = context.measureText(this.alarm).width + 6;
            var fontWidth = context.measureText("田").width + 6;
            var startX = this.width / 2 - lineWidth / 2;
            var startY = -this.height / 2 - fontWidth - 8;
            paintAlarmPanel(
                startX,startY,
                this.alarmColor || "255,0,0",
                this.alarmAlpha || .5,
                lineWidth,fontWidth
            );
            context.beginPath();
            context.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            context.fillText(this.alarm, startX + 2, startY + fontWidth - 4);
            context.closePath();
        }
        function paintAlarmPanel(x,y,color,alpha,lineWidth,fontWidth){
            context.beginPath();
            context.strokeStyle = "rgba(" + color + ", " + alpha + ")";
            context.fillStyle = "rgba(" + color + ", " + alpha + ")";
            context.lineCap = "round";
            context.lineWidth = 1;
            context.moveTo(x, y);
            context.lineTo(x + lineWidth, y);
            context.lineTo(x + lineWidth, y + fontWidth);
            context.lineTo(x + lineWidth / 2 + 6, y + fontWidth);
            context.lineTo(x + lineWidth / 2, y + fontWidth + 8);
            context.lineTo(x + lineWidth / 2 - 6, y + fontWidth);
            context.lineTo(x, y + fontWidth);
            context.lineTo(x, y);
            context.fill();
            context.stroke();
            context.closePath();
        }
    };
    Node.prototype.paintText = function (context) {
        var text = this.text;
        if (null != text && "" != text) {
            context.beginPath();
            context.font = this.font;
            var fontWidth = context.measureText("田").width;
            var maxWidth = fontWidth;
            context.fillStyle = "rgba(" + this.fontColor + "," + this.alpha + ")";
            //换行检测
            var textlines = text.split("\n");
            textlines.forEach(function(line){
                var width = context.measureText(line).width;
                if (width > maxWidth) {
                    maxWidth = width;
                }
            });
            var e = this.getTextPostion(this.textPosition, maxWidth, fontWidth, textlines.length);
            textlines.forEach(function(line,i){
                context.fillText(line, e.x + (maxWidth - context.measureText(line).width) / 2, e.y + i * fontWidth);
            });
            context.closePath();
        }
    };
    Node.prototype.paintBorder = function (context) {
        if (0 != this.borderWidth) {
            context.beginPath();
            context.lineWidth = this.borderWidth;
            context.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
            var b = this.borderWidth / 2;
            if (null == this.borderRadius || 0 == this.borderRadius) {
                context.rect(-this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth);
            } else {
                context.JTopoRoundRect(-this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius);
            }
            context.stroke();
            context.closePath();
        }
    };
    Node.prototype.getTextPostion = function (position, maxWidth, fontWidth, textLines) {
        var d = null;
        switch (position) {
            case "Bottom_Center":
                d = {
                    x: -this.width / 2 + (this.width - maxWidth) / 2,
                    y: this.height / 2 + fontWidth
                };
                break;
            case "Top_Center":
                d = {
                    x: -this.width / 2 + (this.width - maxWidth) / 2,
                    y: -this.height / 2 - fontWidth / 2 - fontWidth * (textLines - 1)
                };
                break;
            case "Top_Right":
                d = {
                    x: this.width / 2,
                    y: -this.height / 2 - fontWidth / 2
                };
                break;
            case "Top_Left":
                d = {
                    x: -this.width / 2 - maxWidth,
                    y: -this.height / 2 - fontWidth / 2
                };
                break;
            case "Bottom_Right":
                d = {
                    x: this.width / 2,
                    y: this.height / 2 + fontWidth
                };
                break;
            case "Bottom_Left":
                d = {
                    x: -this.width / 2 - maxWidth,
                    y: this.height / 2 + fontWidth
                };
                break;
            case "Middle_Center":
                d = {
                    x: -this.width / 2 + (this.width - maxWidth) / 2,
                    y: fontWidth / 2
                };
                break;
            case "Middle_Right":
                d = {
                    x: this.width / 2,
                    y: fontWidth / 2
                };
                break;
            default:
                d = {//"Middle_Left"
                    x: -this.width / 2 - maxWidth,
                    y: fontWidth / 2
                };
        }
        if (null != this.textOffsetX) {
            d.x += this.textOffsetX
        }
        if (null != this.textOffsetY) {
            d.y += this.textOffsetY
        }
        return d;
    };
    var imageCache = {};
    Node.prototype.setImage = function (paramImage, asImageSize) {
        if (null == paramImage)throw new Error("Node.setImage(): 参数Image对象为空!");
        var self = this;
        if ("string" == typeof paramImage) {
            var image = imageCache[paramImage];
            if (null == image) {
                image = new Image();
                image.src = paramImage;
                image.onload = function () {
                    imageCache[paramImage] = image;
                    initImage(image);
                }
            } else {
                initImage(image);
            }
        } else {
            initImage(paramImage)
        }
        function initImage(newImage){
            self.image = newImage;
            self.alarmColor = self.alarmColor || "255,0,0";
            if (asImageSize==1) {
                self.setSize(newImage.width, newImage.height)
            }
        }
    };
    Node.prototype.removeHandler = function (scene) {
        var self = this;
        if (this.outLinks) {
            this.outLinks.forEach(function (c) {
                if (c.nodeA === self) {
                    scene.remove(c)
                }
            });
            this.outLinks = null;
        }
        if (this.inLinks) {
            this.inLinks.forEach(function (c) {
                c.nodeZ === self && scene.remove(c)
            });
            this.inLinks = null;
        }
    };
};

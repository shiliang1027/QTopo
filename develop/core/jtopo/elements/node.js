module.exports = function (jtopo) {
    var imageCache = {};
    BaseNode.prototype = new jtopo.EditableElement();
    Node.prototype = new BaseNode();
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
    TextNode.prototype = new Node();
    LinkNode.prototype = new TextNode();
    CircleNode.prototype = new Node();
    Object.defineProperties(CircleNode.prototype, {
        radius: {
            get: function () {
                return this._radius
            },
            set: function (a) {
                this._radius = a;
                var b = 2 * this.radius;
                var c = 2 * this.radius;
                this.width = b;
                this.height = c;
            }
        }, width: {
            get: function () {
                return this._width
            },
            set: function (a) {
                this._radius = a / 2;
                this._width = a;
            }
        }, height: {
            get: function () {
                return this._height;
            },
            set: function (a) {
                this._radius = a / 2;
                this._height = a;
            }
        }
    });
    animateBaseNodeA.prototype = new Node();
    animateBaseNodeB.prototype = new Node();
    AnimateNode.prototype = new Node();
    jtopo.Node = Node;
    jtopo.TextNode = TextNode;
    jtopo.LinkNode = LinkNode;
    jtopo.CircleNode = CircleNode;
    jtopo.AnimateNode = AnimateNode;

    function BaseNode(text) {
        this.initialize = function (text) {
            BaseNode.prototype.initialize.apply(this, arguments);
            this.elementType = "node";
            this.zIndex = jtopo.zIndex_Node;
            this.text = text;
            this.font = "12px Consolas";
            this.fontColor = "255,255,255";
            this.borderWidth = 0;
            this.borderColor = "255,255,255";
            this.borderRadius = null;
            this.dragable = !0;
            this.textPosition = "Bottom_Center";
            this.textOffsetX = 0;
            this.textOffsetY = 0;
            this.transformAble = !0;
            this.inLinks = null;
            this.outLinks = null;
            var d = "text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius".split(",");
            this.serializedProperties = this.serializedProperties.concat(d);
        };
        this.initialize(text);
        this.paint = function (context) {
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
        this.paintAlarmText = function (context) {
            if (null != this.alarm && "" != this.alarm) {
                var b = this.alarmColor || "255,0,0", c = this.alarmAlpha || .5;
                context.beginPath(), context.font = this.alarmFont || "10px 微软雅黑";
                var d = context.measureText(this.alarm).width + 6, e = context.measureText("田").width + 6, f = this.width / 2 - d / 2, g = -this.height / 2 - e - 8;
                context.strokeStyle = "rgba(" + b + ", " + c + ")", context.fillStyle = "rgba(" + b + ", " + c + ")", context.lineCap = "round", context.lineWidth = 1, context.moveTo(f, g), context.lineTo(f + d, g), context.lineTo(f + d, g + e), context.lineTo(f + d / 2 + 6, g + e), context.lineTo(f + d / 2, g + e + 8), context.lineTo(f + d / 2 - 6, g + e), context.lineTo(f, g + e), context.lineTo(f, g), context.fill(), context.stroke(), context.closePath(), context.beginPath(), context.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", context.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", context.fillText(this.alarm, f + 2, g + e - 4), context.closePath()
            }
        };
        //自定义新增,启用告警后每次绘画执行修改阴影
        this.paintAlarmFlash = function (context) {
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
        this.paintText = function (context) {
            var text = this.text;
            if (null != text && "" != text) {
                context.beginPath();
                context.font = this.font;
                var fontWidth = context.measureText("田").width;
                var maxWidth = fontWidth;
                context.fillStyle = "rgba(" + this.fontColor + "," + this.alpha + ")";
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
        this.paintBorder = function (context) {
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
        this.getTextPostion = function (position, maxWidth, fontWidth, textLines) {
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
        this.setImage = function (paramImage, asImageSize) {
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
        this.removeHandler = function (scene) {
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
    }

    function Node() {
        Node.prototype.initialize.apply(this, arguments)
    }

    function TextNode(text) {
        this.initialize();
        this.text = text;
        this.elementType = "TextNode";
        this.paint = function (context) {
            //自动换行
            var texts = this.text.split("\n");
            context.beginPath();
            context.font = this.font;
            var fontWidth = context.measureText("田").width;
            this.width = 0;
            for (var j = 0; j < texts.length; j++) {
                var width = context.measureText(texts[j]).width;
                if (width > this.width) {
                    this.width = width;
                }
            }
            this.height = texts.length * fontWidth;
            context.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            if (texts.length > 1) {
                for (var i = 0; i < texts.length; i++) {
                    context.fillText(texts[i], -this.width / 2 + 0.15 * fontWidth, this.height / 2 + (i - texts.length + 0.85) * fontWidth);
                }
            } else {
                context.fillText(texts, -this.width / 2 + 0.03 * fontWidth, this.height / 2 - 0.15 * fontWidth);
            }
            context.closePath();
            this.paintBorder(context);
            this.paintCtrl(context);
            this.paintAlarmText(context);
        }
    }

    function LinkNode(a, b, c) {
        this.initialize();
        this.text = a;
        this.href = b;
        this.target = c;
        this.elementType = "LinkNode";
        this.isVisited = !1;
        this.visitedColor = null;
        this.paint = function (a) {
            a.beginPath();
            a.font = this.font;
            this.width = a.measureText(this.text).width;
            this.height = a.measureText("田").width;
            if (this.isVisited && null != this.visitedColor) {
                a.strokeStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")";
                a.fillStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")";
            } else {
                a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
                a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")";
            }
            a.fillText(this.text, -this.width / 2, this.height / 2);
            if (this.isMouseOver) {
                a.moveTo(-this.width / 2, this.height);
                a.lineTo(this.width / 2, this.height);
                a.stroke();
            }
            a.closePath();
            this.paintBorder(a);
            this.paintCtrl(a);
            this.paintAlarmText(a);
        };
        this.mousemove(function () {
            var a = document.getElementsByTagName("canvas");
            if (a && a.length > 0)for (var b = 0; b < a.length; b++)a[b].style.cursor = "pointer"
        });
        this.mouseout(function () {
            var a = document.getElementsByTagName("canvas");
            if (a && a.length > 0)for (var b = 0; b < a.length; b++)a[b].style.cursor = "default"
        });
        this.click(function () {
            "_blank" == this.target ? window.open(this.href) : location = this.href, this.isVisited = !0
        })
    }

    function CircleNode(text) {
        this.initialize(arguments);
        this._radius = 20;
        this.beginDegree = 0;
        this.endDegree = 2 * Math.PI;
        this.text = text;
        this.paint = function (context) {
            context.save();
            context.beginPath();
            context.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
            context.arc(0, 0, this.radius, this.beginDegree, this.endDegree, !0);
            context.fill();
            context.closePath();
            context.restore();
            this.paintText(context);
            this.paintBorder(context);
            this.paintCtrl(context);
            this.paintAlarmText(context);
        };
        this.paintSelected = function (context) {
            context.save();
            context.beginPath();
            context.strokeStyle = "rgba(168,202,255, 0.9)";
            context.fillStyle = "rgba(168,202,236,0.7)";
            context.arc(0, 0, this.radius + 3, this.beginDegree, this.endDegree, !0);
            context.fill();
            context.stroke();
            context.closePath();
            context.restore();
        }
    }

    function animateBaseNodeA(frameImages, b, c) {
        this.initialize();
        this.frameImages = frameImages || [];
        this.frameIndex = 0;
        this.isStop = !0;
        var d = b || 1e3;
        this.repeatPlay = !1;
        var e = this;
        this.nextFrame = function () {
            if (!this.isStop && null != this.frameImages.length) {
                this.frameIndex++;
                if (this.frameIndex >= this.frameImages.length) {
                    if (!this.repeatPlay)return;
                    this.frameIndex = 0;
                }
                this.setImage(this.frameImages[this.frameIndex], c);
                setTimeout(function () {
                    e.nextFrame();
                }, d / frameImages.length);
            }
        }
    }

    function animateBaseNodeB(a, b, c, d, e) {
        this.initialize();
        var f = this;
        this.setImage(a), this.frameIndex = 0, this.isPause = !0, this.repeatPlay = !1;
        var g = d || 1e3;
        e = e || 0, this.paint = function (a) {
            if (this.image) {
                var b = this.width, d = this.height;
                a.save(), a.beginPath(), a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
                var f = (Math.floor(this.frameIndex / c) + e) * d, g = Math.floor(this.frameIndex % c) * b;
                a.drawImage(this.image, g, f, b, d, -b / 2, -d / 2, b, d), a.fill(), a.closePath(), a.restore(), this.paintText(a), this.paintBorder(a), this.paintCtrl(a), this.paintAlarmText(a)
            }
        }, this.nextFrame = function () {
            if (!this.isStop) {
                if (this.frameIndex++, this.frameIndex >= b * c) {
                    if (!this.repeatPlay)return;
                    this.frameIndex = 0
                }
                setTimeout(function () {
                    f.isStop || f.nextFrame()
                }, g / (b * c))
            }
        }
    }

    function AnimateNode() {
        var a = null;
        if (arguments.length <= 3) {
            a = new animateBaseNodeA(arguments[0], arguments[1], arguments[2]);
        } else {
            a = new animateBaseNodeB(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
        }
        a.stop = function () {
            a.isStop = !0
        };
        a.play = function () {
            a.isStop = !1;
            a.frameIndex = 0;
            a.nextFrame();
        };
        return a
    }
};
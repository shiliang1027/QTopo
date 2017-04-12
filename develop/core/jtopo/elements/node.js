module.exports=function (jtopo) {
    function baseNode(c) {
        this.initialize = function (c) {
            baseNode.prototype.initialize.apply(this, arguments), this.elementType = "node", this.zIndex = jtopo.zIndex_Node, this.text = c, this.font = "12px Consolas", this.fontColor = "255,255,255", this.borderWidth = 0, this.borderColor = "255,255,255", this.borderRadius = null, this.dragable = !0, this.textPosition = "Bottom_Center", this.textOffsetX = 0, this.textOffsetY = 0, this.transformAble = !0, this.inLinks = null, this.outLinks = null;
            var d = "text,font,fontColor,textPosition,textOffsetX,textOffsetY,borderRadius".split(",");
            this.serializedProperties = this.serializedProperties.concat(d)
        }, this.initialize(c), this.paint = function (a) {
            if (this.image) {
                var b = a.globalAlpha;
                a.globalAlpha = this.alpha, null != this.alarmImage && null != this.alarm ? a.drawImage(this.alarmImage, -this.width / 2, -this.height / 2, this.width, this.height) : a.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height), a.globalAlpha = b
            } else a.beginPath(), a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")", null == this.borderRadius || 0 == this.borderRadius ? a.rect(-this.width / 2, -this.height / 2, this.width, this.height) : a.JTopoRoundRect(-this.width / 2, -this.height / 2, this.width, this.height, this.borderRadius), a.fill(), a.closePath();
            this.paintText(a), this.paintBorder(a), this.paintCtrl(a), this.paintAlarmText(a)
        }, this.paintAlarmText = function (a) {
            if (null != this.alarm && "" != this.alarm) {
                var b = this.alarmColor || "255,0,0", c = this.alarmAlpha || .5;
                a.beginPath(), a.font = this.alarmFont || "10px 微软雅黑";
                var d = a.measureText(this.alarm).width + 6, e = a.measureText("田").width + 6, f = this.width / 2 - d / 2, g = -this.height / 2 - e - 8;
                a.strokeStyle = "rgba(" + b + ", " + c + ")", a.fillStyle = "rgba(" + b + ", " + c + ")", a.lineCap = "round", a.lineWidth = 1, a.moveTo(f, g), a.lineTo(f + d, g), a.lineTo(f + d, g + e), a.lineTo(f + d / 2 + 6, g + e), a.lineTo(f + d / 2, g + e + 8), a.lineTo(f + d / 2 - 6, g + e), a.lineTo(f, g + e), a.lineTo(f, g), a.fill(), a.stroke(), a.closePath(), a.beginPath(), a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillText(this.alarm, f + 2, g + e - 4), a.closePath()
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
        }, this.paintBorder = function (a) {
            if (0 != this.borderWidth) {
                a.beginPath();
                a.lineWidth = this.borderWidth;
                a.strokeStyle = "rgba(" + this.borderColor + "," + this.alpha + ")";
                var b = this.borderWidth / 2;
                if (null == this.borderRadius || 0 == this.borderRadius) {
                    a.rect(-this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth);
                } else {
                    a.JTopoRoundRect(-this.width / 2 - b, -this.height / 2 - b, this.width + this.borderWidth, this.height + this.borderWidth, this.borderRadius);
                }
                a.stroke();
                a.closePath();
            }
        }, this.getTextPostion = function (position, maxWidth, fontWidth, height) {
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
                        y: -this.height / 2 - fontWidth / 2 - fontWidth * (height - 1)
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
                case "Middle_Left":
                    d = {
                        x: -this.width / 2 - maxWidth,
                        y: fontWidth / 2
                    };
                    break;
                default:
                    d = {
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
        }, this.setImage = function (a, b) {
            if (null == a)throw new Error("Node.setImage(): 参数Image对象为空!");
            var c = this;
            if ("string" == typeof a) {
                var d = j[a];
                null == d ? (d = new Image, d.src = a, d.onload = function () {
                    j[a] = d, 1 == b && c.setSize(d.width, d.height), c.image = d, c.alarmColor = null == c.alarmColor ? "255,0,0" : c.alarmColor
                }) : (b && this.setSize(d.width, d.height), c.image = d, c.alarmColor = null == c.alarmColor ? "255,0,0" : c.alarmColor)
            } else this.image = a, c.alarmColor = null == c.alarmColor ? "255,0,0" : c.alarmColor, 1 == b && this.setSize(a.width, a.height)
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
        }
    }

    function Node() {
        Node.prototype.initialize.apply(this, arguments)
    }

    function TextNode(a) {
        this.initialize(), this.text = a, this.elementType = "TextNode", this.paint = function (a) {
            a.beginPath(), a.font = this.font, this.width = a.measureText(this.text).width, this.height = a.measureText("田").width, a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillText(this.text, -this.width / 2, this.height / 2), a.closePath(), this.paintBorder(a), this.paintCtrl(a), this.paintAlarmText(a)
        }
    }

    function LinkNode(a, b, c) {
        this.initialize(), this.text = a, this.href = b, this.target = c, this.elementType = "LinkNode", this.isVisited = !1, this.visitedColor = null, this.paint = function (a) {
            a.beginPath(), a.font = this.font, this.width = a.measureText(this.text).width, this.height = a.measureText("田").width, this.isVisited && null != this.visitedColor ? (a.strokeStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")", a.fillStyle = "rgba(" + this.visitedColor + ", " + this.alpha + ")") : (a.strokeStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")", a.fillStyle = "rgba(" + this.fontColor + ", " + this.alpha + ")"), a.fillText(this.text, -this.width / 2, this.height / 2), this.isMouseOver && (a.moveTo(-this.width / 2, this.height), a.lineTo(this.width / 2, this.height), a.stroke()), a.closePath(), this.paintBorder(a), this.paintCtrl(a), this.paintAlarmText(a)
        }, this.mousemove(function () {
            var a = document.getElementsByTagName("canvas");
            if (a && a.length > 0)for (var b = 0; b < a.length; b++)a[b].style.cursor = "pointer"
        }), this.mouseout(function () {
            var a = document.getElementsByTagName("canvas");
            if (a && a.length > 0)for (var b = 0; b < a.length; b++)a[b].style.cursor = "default"
        }), this.click(function () {
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
        }, this.paintSelected = function (context) {
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

    function g(a, b, c) {
        this.initialize();
        this.frameImages = a || [];
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
                }, d / a.length);
            }
        }
    }

    function h(a, b, c, d, e) {
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
        return a = arguments.length <= 3 ? new g(arguments[0], arguments[1], arguments[2]) : new h(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]), a.stop = function () {
            a.isStop = !0
        }, a.play = function () {
            a.isStop = !1, a.frameIndex = 0, a.nextFrame()
        }, a
    }

    var j = {};
    baseNode.prototype = new jtopo.EditableElement;
    Node.prototype = new baseNode;
    Object.defineProperties(Node.prototype, {
        alarmColor: {
            get: function () {
                return this._alarmColor
            }, set: function (color) {
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
    TextNode.prototype = new Node;
    LinkNode.prototype = new TextNode;
    CircleNode.prototype = new Node;
    Object.defineProperties(CircleNode.prototype, {
        radius: {
            get: function () {
                return this._radius
            }, set: function (a) {
                this._radius = a;
                var b = 2 * this.radius, c = 2 * this.radius;
                this.width = b, this.height = c
            }
        }, width: {
            get: function () {
                return this._width
            }, set: function (a) {
                this._radius = a / 2, this._width = a
            }
        }, height: {
            get: function () {
                return this._height
            }, set: function (a) {
                this._radius = a / 2, this._height = a
            }
        }
    });
    g.prototype = new Node;
    h.prototype = new Node;
    AnimateNode.prototype = new Node;
    jtopo.Node = Node;
    jtopo.TextNode = TextNode;
    jtopo.LinkNode = LinkNode;
    jtopo.CircleNode = CircleNode;
    jtopo.AnimateNode = AnimateNode;
}
module.exports=function (jtopo) {
    function DisplayElement() {
        this.initialize = function () {
            DisplayElement.prototype.initialize.apply(this, arguments);
            this.elementType = "displayElement";
            this.x = 0;
            this.y = 0;
            this.width = 32;
            this.height = 32;
            this.visible = !0;
            this.alpha = 1;
            this.rotate = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.strokeColor = "22,124,255";
            this.borderColor = "22,124,255";
            this.fillColor = "22,124,255";
            this.shadow = !1;
            this.shadowBlur = 5;
            this.shadowColor = "rgba(0,0,0,0.5)";
            this.shadowOffsetX = 3;
            this.shadowOffsetY = 6;
            this.transformAble = !1;
            this.zIndex = 0;
            var a = "x,y,width,height,visible,alpha,rotate,scaleX,scaleY,strokeColor,fillColor,shadow,shadowColor,shadowOffsetX,shadowOffsetY,transformAble,zIndex".split(",");
            this.serializedProperties = this.serializedProperties.concat(a)
        };
        this.initialize();
        this.paint = function (a) {
            a.beginPath();
            a.fillStyle = "rgba(" + this.fillColor + "," + this.alpha + ")";
            a.rect(-this.width / 2, -this.height / 2, this.width, this.height);
            a.fill();
            a.stroke();
            a.closePath();
        };
        this.getLocation = function () {
            return {
                x: this.x,
                y: this.y
            }
        };
        this.setLocation = function (a, b) {
            if (this.qtopo && this.qtopo.attr && this.qtopo.attr.position) {
                this.qtopo.attr.position[0] = a;
                this.qtopo.attr.position[1] = b;
            }
            return this.x = a, this.y = b, this
        };
        this.getCenterLocation = function () {
            return {
                x: this.x + this.width / 2,
                y: this.y + this.height / 2
            }
        };
        this.setCenterLocation = function (a, b) {
            this.x = a - this.width / 2;
            this.y = b - this.height / 2;
            return this;
        };
        this.getSize = function () {
            return {
                width: this.width,
                height: this.heith
            }
        };
        this.setSize = function (a, b) {
            this.width = a;
            this.height = b;
            return this;
        };
        this.getBound = function () {
            return {
                left: this.x,
                top: this.y,
                right: this.x + this.width,
                bottom: this.y + this.height,
                width: this.width,
                height: this.height
            }
        };
        this.setBound = function (a, b, c, d) {
            this.setLocation(a, b);
            this.setSize(c, d);
            return this;
        };
        this.getDisplayBound = function () {
            return {
                left: this.x,
                top: this.y,
                right: this.x + this.width * this.scaleX,
                bottom: this.y + this.height * this.scaleY
            }
        };
        this.getDisplaySize = function () {
            return {
                width: this.width * this.scaleX,
                height: this.height * this.scaleY
            }
        };
        this.getPosition = function (a) {
            var position,
                c = this.getBound();
            switch (a) {
                case "Top_Left":
                    position = {x: c.left, y: c.top};
                    break;
                case "Top_Center":
                    position = {x: this.cx, y: c.top};
                    break;
                case "Top_Right":
                    position = {x: c.right, y: c.top};
                    break;
                case "Middle_Left":
                    position = {x: c.left, y: this.cy};
                    break;
                case "Middle_Center":
                    position = {x: this.cx, y: this.cy};
                    break;
                case "Middle_Right":
                    position = {x: c.right, y: this.cy};
                    break;
                case "Bottom_Left":
                    position = {x: c.left, y: c.bottom};
                    break;
                case "Bottom_Center":
                    position = {x: this.cx, y: c.bottom};
                    break;
                case  "Bottom_Right":
                    position = {x: c.right, y: c.bottom};
                    break;
                default:
                    position = {x: c.left, y: c.top};
            }
            return position;
        };
    }

    function interactiveElement() {
        this.initialize = function () {
            interactiveElement.prototype.initialize.apply(this, arguments);
            this.elementType = "interactiveElement";
            this.dragable = !1;
            this.selected = !1;
            this.showSelected = !0;
            this.selectedLocation = null;
            this.isMouseOver = !1;
            var a = "dragable,selected,showSelected,isMouseOver".split(",");
            this.serializedProperties = this.serializedProperties.concat(a);
        };
        this.initialize();
        this.paintSelected = function (a) {
            if (0 != this.showSelected) {
                a.save();
                a.beginPath();
                a.strokeStyle = "rgba(168,202,255, 0.9)";
                a.fillStyle = "rgba(168,202,236,0.7)";
                a.rect(-this.width / 2 - 3, -this.height / 2 - 3, this.width + 6, this.height + 6);
                a.fill();
                a.stroke();
                a.closePath();
                a.restore();
            }
            return this;
        };
        this.paintMouseover = function (a) {
            return this.paintSelected(a);
        };
        this.isInBound = function (pointX, pointY) {
            return pointX > this.x && pointX < this.x + this.width * Math.abs(this.scaleX) && pointY > this.y && pointY < this.y + this.height * Math.abs(this.scaleY)
        };
        this.selectedHandler = function () {
            this.selected = !0;
            this.selectedLocation = {
                x: this.x,
                y: this.y
            };
            return this;
        };
        this.unselectedHandler = function () {
            this.selected = !1;
            this.selectedLocation = null;
            return this;
        };
        this.dbclickHandler = function (a) {
            this.dispatchEvent("dbclick", a);
            return this;
        };
        this.clickHandler = function (a) {
            this.dispatchEvent("click", a);
            return this;
        };
        this.mousedownHander = function (a) {
            this.dispatchEvent("mousedown", a);
            return this;
        };
        this.mouseupHandler = function (a) {
            this.dispatchEvent("mouseup", a);
            return this;
        };
        this.mouseoverHandler = function (a) {
            this.isMouseOver = !0;
            this.dispatchEvent("mouseover", a);
            return this;
        };
        this.mousemoveHandler = function (a) {
            this.dispatchEvent("mousemove", a);
            return this;
        };
        this.mouseoutHandler = function (a) {
            this.isMouseOver = !1;
            this.dispatchEvent("mouseout", a);
            return this;
        };
        this.mousedragHandler = function (a) {
            var b = this.selectedLocation.x + a.dx;
            var c = this.selectedLocation.y + a.dy;
            this.setLocation(b, c);
            this.dispatchEvent("mousedrag", a);
            return this;
        };
        this.addEventListener = function (event, fn) {
            if (!this.messageBus) {
                this.messageBus = new jtopo.util.MessageBus;
            }
            this.messageBus.subscribe(event, fn);
            return this;
        };
        this.dispatchEvent = function (event, e) {
            if (this.messageBus) {
                this.messageBus.publish(event, e);
                return this;
            }
        };
        this.removeEventListener = function (event, fn) {
            this.messageBus.unsubscribe(event, fn);
        };
        this.removeAllEventListener = function () {
            this.messageBus = new jtopo.util.MessageBus
        };
        var self = this;
        "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,touchstart,touchmove,touchend".split(",")
            .forEach(function (eventName) {
                self[eventName] = function (e) {
                    if (null != e) {
                        this.addEventListener(eventName, e);
                    } else {
                        this.dispatchEvent(eventName);
                    }
                }
            });
    }

    function EditableElement() {
        this.initialize = function () {
            EditableElement.prototype.initialize.apply(this, arguments);
            this.editAble = !1;
            this.selectedPoint = null;
        };
        this.getCtrlPosition = function (a) {
            var b = 5;
            var c = 5;
            var d = this.getPosition(a);
            return {
                left: d.x - b,
                top: d.y - c,
                right: d.x + b,
                bottom: d.y + c
            }
        };
        this.selectedHandler = function (b) {
            EditableElement.prototype.selectedHandler.apply(this, arguments), this.selectedSize = {
                width: this.width,
                height: this.height
            };
            if (b.scene.mode == jtopo.SceneMode.edit) {
                this.editAble = !0
            }
        };
        this.unselectedHandler = function () {
            EditableElement.prototype.unselectedHandler.apply(this, arguments);
            this.selectedSize = null;
            this.editAble = !1;
        };
        var b = ["Top_Left", "Top_Center", "Top_Right", "Middle_Left", "Middle_Right", "Bottom_Left", "Bottom_Center", "Bottom_Right"];
        this.paintCtrl = function (cx) {
            if (0 != this.editAble) {
                cx.save();
                for (var c = 0; c < b.length; c++) {
                    var d = this.getCtrlPosition(b[c]);
                    d.left -= this.cx;
                    d.right -= this.cx;
                    d.top -= this.cy;
                    d.bottom -= this.cy;
                    var e = d.right - d.left;
                    var f = d.bottom - d.top;
                    cx.beginPath();
                    cx.strokeStyle = "rgba(0,0,0,0.8)";
                    cx.rect(d.left, d.top, e, f);
                    cx.stroke();
                    cx.closePath();
                    cx.beginPath();
                    cx.strokeStyle = "rgba(255,255,255,0.3)";
                    cx.rect(d.left + 1, d.top + 1, e - 2, f - 2);
                    cx.stroke();
                    cx.closePath();
                }
                cx.restore();
            }
        };
        this.isInBound = function (a, c) {
            if (this.selectedPoint = null, 1 == this.editAble)for (var e = 0; e < b.length; e++) {
                var f = this.getCtrlPosition(b[e]);
                if (a > f.left && a < f.right && c > f.top && c < f.bottom)return this.selectedPoint = b[e], !0
            }
            return EditableElement.prototype.isInBound.apply(this, arguments)
        };
        this.mousedragHandler = function (a) {
            if (null == this.selectedPoint) {
                var b = this.selectedLocation.x + a.dx, c = this.selectedLocation.y + a.dy;
                this.setLocation(b, c), this.dispatchEvent("mousedrag", a)
            } else {
                if ("Top_Left" == this.selectedPoint) {
                    var d = this.selectedSize.width - a.dx, e = this.selectedSize.height - a.dy, b = this.selectedLocation.x + a.dx, c = this.selectedLocation.y + a.dy;
                    b < this.x + this.width && (this.x = b, this.width = d), c < this.y + this.height && (this.y = c, this.height = e)
                } else if ("Top_Center" == this.selectedPoint) {
                    var e = this.selectedSize.height - a.dy, c = this.selectedLocation.y + a.dy;
                    c < this.y + this.height && (this.y = c, this.height = e)
                } else if ("Top_Right" == this.selectedPoint) {
                    var d = this.selectedSize.width + a.dx, c = this.selectedLocation.y + a.dy;
                    c < this.y + this.height && (this.y = c, this.height = this.selectedSize.height - a.dy), d > 1 && (this.width = d)
                } else if ("Middle_Left" == this.selectedPoint) {
                    var d = this.selectedSize.width - a.dx, b = this.selectedLocation.x + a.dx;
                    b < this.x + this.width && (this.x = b), d > 1 && (this.width = d)
                } else if ("Middle_Right" == this.selectedPoint) {
                    var d = this.selectedSize.width + a.dx;
                    d > 1 && (this.width = d)
                } else if ("Bottom_Left" == this.selectedPoint) {
                    var d = this.selectedSize.width - a.dx, b = this.selectedLocation.x + a.dx;
                    d > 1 && (this.x = b, this.width = d);
                    var e = this.selectedSize.height + a.dy;
                    e > 1 && (this.height = e)
                } else if ("Bottom_Center" == this.selectedPoint) {
                    var e = this.selectedSize.height + a.dy;
                    e > 1 && (this.height = e)
                } else if ("Bottom_Right" == this.selectedPoint) {
                    var d = this.selectedSize.width + a.dx;
                    d > 1 && (this.width = d);
                    var e = this.selectedSize.height + a.dy;
                    e > 1 && (this.height = e)
                }
                this.dispatchEvent("resize", a)
            }
        }
    }

    DisplayElement.prototype = new jtopo.Element, Object.defineProperties(DisplayElement.prototype, {
        cx: {
            get: function () {
                return this.x + this.width / 2
            }, set: function (a) {
                this.x = a - this.width / 2
            }
        }, cy: {
            get: function () {
                return this.y + this.height / 2
            }, set: function (a) {
                this.y = a - this.height / 2
            }
        }
    });
    interactiveElement.prototype = new DisplayElement;
    EditableElement.prototype = new interactiveElement;
    jtopo.DisplayElement = DisplayElement;
    jtopo.InteractiveElement = interactiveElement;
    jtopo.EditableElement = EditableElement;
}
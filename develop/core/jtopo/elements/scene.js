module.exports=function (jtopo) {
    function scene(c) {
        function d(a, b, c, d) {
            return function (e) {
                e.beginPath(), e.strokeStyle = "rgba(0,0,236,0.5)", e.fillStyle = "rgba(0,0,236,0.1)", e.rect(a, b, c, d), e.fill(), e.stroke(), e.closePath()
            }
        }

        var scene_self = this;
        this.initialize = function () {
            scene.prototype.initialize.apply(this, arguments);
            this.messageBus = new jtopo.util.MessageBus;
            this.elementType = "scene";
            this.childs = [];
            this.zIndexMap = {};
            this.zIndexArray = [];
            this.backgroundColor = "255,255,255";
            this.visible = !0;
            this.alpha = 0;
            this.scaleX = 1;
            this.scaleY = 1;
            this.mode = jtopo.SceneMode.normal;
            this.translate = !0;
            this.translateX = 0;
            this.translateY = 0;
            this.lastTranslateX = 0;
            this.lastTranslateY = 0;
            this.mouseDown = !1;
            this.mouseDownX = null;
            this.mouseDownY = null;
            this.mouseDownEvent = null;
            this.areaSelect = !0;
            this.operations = [];
            this.selectedElements = [];
            this.paintAll = !1;
            var c = "background,backgroundColor,mode,paintAll,areaSelect,translate,translateX,translateY,lastTranslatedX,lastTranslatedY,alpha,visible,scaleX,scaleY".split(",");
            this.serializedProperties = this.serializedProperties.concat(c);
        };
        this.initialize();
        this.setBackground = function (a) {
            this.background = a
        };
        this.addTo = function (a) {
            this.stage !== a && null != a && (this.stage = a)
        };
        null != c && (c.add(this), this.addTo(c)), this.show = function () {
            this.visible = !0
        };
        this.hide = function () {
            this.visible = !1
        };
        this.paint = function (a) {
            if (0 != this.visible && null != this.stage) {
                if (a.save(), this.paintBackgroud(a), a.restore(), a.save(), a.scale(this.scaleX, this.scaleY), 1 == this.translate) {
                    var b = this.getOffsetTranslate(a);
                    a.translate(b.translateX, b.translateY)
                }
                this.paintChilds(a), a.restore(), a.save(), this.paintOperations(a, this.operations), a.restore()
            }
        };
        this.repaint = function (a) {
            0 != this.visible && this.paint(a)
        };
        this.paintBackgroud = function (a) {
            null != this.background ? a.drawImage(this.background, 0, 0, a.canvas.width, a.canvas.height) : (a.beginPath(), a.fillStyle = "rgba(" + this.backgroundColor + "," + this.alpha + ")", a.fillRect(0, 0, a.canvas.width, a.canvas.height), a.closePath())
        };
        this.getDisplayedElements = function () {
            for (var a = [], b = 0; b < this.zIndexArray.length; b++)for (var c = this.zIndexArray[b], d = this.zIndexMap[c], e = 0; e < d.length; e++) {
                var f = d[e];
                this.isVisiable(f) && a.push(f)
            }
            return a
        };
        this.getDisplayedNodes = function () {
            for (var b = [], c = 0; c < this.childs.length; c++) {
                var d = this.childs[c];
                d instanceof jtopo.Node && this.isVisiable(d) && b.push(d)
            }
            return b
        };
        this.paintChilds = function (context) {
            for (var i = 0; i < this.zIndexArray.length; i++) {
                var zIndex = this.zIndexArray[i];
                var zIndexElements = this.zIndexMap[zIndex];
                for (var j = 0; j < zIndexElements.length; j++) {
                    var element = zIndexElements[j];
                    if (1 == this.paintAll || this.isVisiable(element)) {
                        context.save();
                        if (1 == element.transformAble) {
                            var center = element.getCenterLocation();
                            context.translate(center.x, center.y);
                            if (element.rotate) {
                                context.rotate(element.rotate);
                            }
                            if (element.scaleX && element.scaleY) {
                                context.scale(element.scaleX, element.scaleY)
                            } else if (element.scaleX) {
                                context.scale(element.scaleX, 1);
                            } else if (element.scaleY) {
                                context.scale(1, element.scaleY);
                            }
                        }
                        if (1 == element.shadow) {
                            context.shadowBlur = element.shadowBlur;
                            context.shadowColor = element.shadowColor;
                            context.shadowOffsetX = element.shadowOffsetX;
                            context.shadowOffsetY = element.shadowOffsetY;
                        }
                        if (element instanceof jtopo.InteractiveElement) {
                            if (element.selected && 1 == element.showSelected) {
                                element.paintSelected(context)
                            }
                            if (1 == element.isMouseOver) {
                                element.paintMouseover(context)
                            }
                        }
                        element.paint(context);
                        context.restore();
                    }
                }
            }
        };
        this.getOffsetTranslate = function (a) {
            var b = this.stage.canvas.width, c = this.stage.canvas.height;
            null != a && "move" != a && (b = a.canvas.width, c = a.canvas.height);
            var d = b / this.scaleX / 2, e = c / this.scaleY / 2, f = {translateX: this.translateX + (d - d * this.scaleX), translateY: this.translateY + (e - e * this.scaleY)};
            return f
        };
        this.isVisiable = function (b) {
            if (1 != b.visible)return !1;
            if (b instanceof jtopo.Link)return !0;
            var c = this.getOffsetTranslate(), d = b.x + c.translateX, e = b.y + c.translateY;
            d *= this.scaleX, e *= this.scaleY;
            var f = d + b.width * this.scaleX, g = e + b.height * this.scaleY;
            return d > this.stage.canvas.width || e > this.stage.canvas.height || 0 > f || 0 > g ? !1 : !0
        };
        this.paintOperations = function (a, b) {
            for (var c = 0; c < b.length; c++)b[c](a)
        };
        this.findElements = function (a) {
            for (var b = [], c = 0; c < this.childs.length; c++)1 == a(this.childs[c]) && b.push(this.childs[c]);
            return b
        };
        this.getElementsByClass = function (a) {
            return this.findElements(function (b) {
                return b instanceof a
            })
        };
        this.addOperation = function (a) {
            return this.operations.push(a), this
        };
        this.clearOperations = function () {
            return this.operations = [], this
        };
        this.getElementByXY = function (b, c) {
            for (var d = null, e = this.zIndexArray.length - 1; e >= 0; e--)for (var f = this.zIndexArray[e], g = this.zIndexMap[f], h = g.length - 1; h >= 0; h--) {
                var i = g[h];
                if (i instanceof jtopo.InteractiveElement && this.isVisiable(i) && i.isInBound(b, c))return d = i
            }
            return d
        };
        this.add = function (a) {
            this.childs.push(a);
            if (null == this.zIndexMap[a.zIndex]) {
                this.zIndexMap[a.zIndex] = [];
                this.zIndexArray.push(a.zIndex);
                this.zIndexArray.sort(function (a, b) {
                    return a - b
                });
            }
            this.zIndexMap["" + a.zIndex].push(a);
        };
        this.remove = function (item) {
            this.childs = jtopo.util.removeFromArray(this.childs, item);
            var elements = this.zIndexMap[item.zIndex];
            if (elements) {
                this.zIndexMap[item.zIndex] = jtopo.util.removeFromArray(elements, item);
            }
            item.removeHandler(this);
        };
        this.clear = function () {
            var self = this;
            this.childs.forEach(function (child) {
                child.removeHandler(self);
            });
            this.childs = [];
            this.operations = [];
            this.zIndexArray = [];
            this.zIndexMap = {};
        };
        this.addToSelected = function (a) {
            this.selectedElements.push(a)
        };
        this.cancleAllSelected = function (a) {
            for (var b = 0; b < this.selectedElements.length; b++)this.selectedElements[b].unselectedHandler(a);
            this.selectedElements = []
        };
        this.notInSelectedNodes = function (a) {
            for (var b = 0; b < this.selectedElements.length; b++)if (a === this.selectedElements[b])return !1;
            return !0
        };
        this.removeFromSelected = function (a) {
            for (var b = 0; b < this.selectedElements.length; b++) {
                var c = this.selectedElements[b];
                a === c && (this.selectedElements = this.selectedElements.del(b))
            }
        };
        this.toSceneEvent = function (b) {
            var c = jtopo.util.clone(b);
            if (c.x /= this.scaleX, c.y /= this.scaleY, 1 == this.translate) {
                var d = this.getOffsetTranslate();
                c.x -= d.translateX, c.y -= d.translateY
            }
            return null != c.dx && (c.dx /= this.scaleX, c.dy /= this.scaleY), null != this.currentElement && (c.target = this.currentElement), c.scene = this, c
        };
        this.selectElement = function (a) {
            var b = scene_self.getElementByXY(a.x, a.y);
            if (null != b)if (a.target = b, b.mousedownHander(a), b.selectedHandler(a), scene_self.notInSelectedNodes(b))a.ctrlKey || scene_self.cancleAllSelected(), scene_self.addToSelected(b); else {
                1 == a.ctrlKey && (b.unselectedHandler(), this.removeFromSelected(b));
                for (var c = 0; c < this.selectedElements.length; c++) {
                    var d = this.selectedElements[c];
                    d.selectedHandler(a)
                }
            } else a.ctrlKey || scene_self.cancleAllSelected();
            this.currentElement = b
        };
        this.mousedownHandler = function (b) {
            var c = this.toSceneEvent(b);
            if (this.mouseDown = !0, this.mouseDownX = c.x, this.mouseDownY = c.y, this.mouseDownEvent = c, this.mode == jtopo.SceneMode.normal)this.selectElement(c), (null == this.currentElement || this.currentElement instanceof jtopo.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY); else {
                if (this.mode == jtopo.SceneMode.drag && 1 == this.translate)return this.lastTranslateX = this.translateX, void(this.lastTranslateY = this.translateY);
                this.mode == jtopo.SceneMode.select ? this.selectElement(c) : this.mode == jtopo.SceneMode.edit && (this.selectElement(c), (null == this.currentElement || this.currentElement instanceof jtopo.Link) && 1 == this.translate && (this.lastTranslateX = this.translateX, this.lastTranslateY = this.translateY))
            }
            scene_self.dispatchEvent("mousedown", c)
        };
        this.mouseupHandler = function (b) {
            this.stage.cursor != jtopo.MouseCursor.normal && (this.stage.cursor = jtopo.MouseCursor.normal), scene_self.clearOperations();
            var c = this.toSceneEvent(b);
            null != this.currentElement && (c.target = scene_self.currentElement, this.currentElement.mouseupHandler(c)), this.dispatchEvent("mouseup", c), this.mouseDown = !1
        };
        this.dragElements = function (b) {
            if (null != this.currentElement && 1 == this.currentElement.dragable)for (var c = 0; c < this.selectedElements.length; c++) {
                var d = this.selectedElements[c];
                if (0 != d.dragable) {
                    var e = jtopo.util.clone(b);
                    e.target = d, d.mousedragHandler(e)
                }
            }
        };
        this.mousedragHandler = function (b) {
            var c = this.toSceneEvent(b);
            this.mode == jtopo.SceneMode.normal ? null == this.currentElement || this.currentElement instanceof jtopo.Link ? 1 == this.translate && (this.stage.cursor = jtopo.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.dragElements(c) : this.mode == jtopo.SceneMode.drag ? 1 == this.translate && (this.stage.cursor = jtopo.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.mode == jtopo.SceneMode.select ? null != this.currentElement ? 1 == this.currentElement.dragable && this.dragElements(c) : 1 == this.areaSelect && this.areaSelectHandle(c) : this.mode == jtopo.SceneMode.edit && (null == this.currentElement || this.currentElement instanceof jtopo.Link ? 1 == this.translate && (this.stage.cursor = jtopo.MouseCursor.closed_hand, this.translateX = this.lastTranslateX + c.dx, this.translateY = this.lastTranslateY + c.dy) : this.dragElements(c)), this.dispatchEvent("mousedrag", c)
        };
        this.areaSelectHandle = function (a) {
            var b = a.offsetLeft, c = a.offsetTop, f = this.mouseDownEvent.offsetLeft, g = this.mouseDownEvent.offsetTop, h = b >= f ? f : b, i = c >= g ? g : c, j = Math.abs(a.dx) * this.scaleX, k = Math.abs(a.dy) * this.scaleY, l = new d(h, i, j, k);
            scene_self.clearOperations().addOperation(l), b = a.x, c = a.y, f = this.mouseDownEvent.x, g = this.mouseDownEvent.y, h = b >= f ? f : b, i = c >= g ? g : c, j = Math.abs(a.dx), k = Math.abs(a.dy);
            for (var m = h + j, n = i + k, o = 0; o < scene_self.childs.length; o++) {
                var p = scene_self.childs[o];
                p.x > h && p.x + p.width < m && p.y > i && p.y + p.height < n && scene_self.notInSelectedNodes(p) && (p.selectedHandler(a), scene_self.addToSelected(p))
            }
        };
        this.mousemoveHandler = function (b) {
            this.mousecoord = {
                x: b.x,
                y: b.y
            };
            var c = this.toSceneEvent(b);
            if (this.mode == jtopo.SceneMode.drag) {
                return void(this.stage.cursor = jtopo.MouseCursor.open_hand);
            }
            if (this.mode == jtopo.SceneMode.normal) {
                this.stage.cursor = jtopo.MouseCursor.normal;
            } else if (this.mode == jtopo.SceneMode.select) {
                this.stage.cursor = jtopo.MouseCursor.normal;
            }

            var d = scene_self.getElementByXY(c.x, c.y);
            if (null != d) {
                if (scene_self.mouseOverelement && scene_self.mouseOverelement !== d) {
                    c.target = d, scene_self.mouseOverelement.mouseoutHandler(c)
                }
                scene_self.mouseOverelement = d;
                if (0 == d.isMouseOver) {
                    c.target = d;
                    d.mouseoverHandler(c);
                    scene_self.dispatchEvent("mouseover", c);
                } else {
                    c.target = d;
                    d.mousemoveHandler(c);
                    scene_self.dispatchEvent("mousemove", c);
                }
            } else {
                if (scene_self.mouseOverelement) {
                    c.target = d;
                    scene_self.mouseOverelement.mouseoutHandler(c);
                    scene_self.mouseOverelement = null;
                    scene_self.dispatchEvent("mouseout", c);
                } else {
                    c.target = null;
                    scene_self.dispatchEvent("mousemove", c)
                }
            }
        }, this.mouseoverHandler = function (a) {
            var b = this.toSceneEvent(a);
            this.dispatchEvent("mouseover", b)
        }, this.mouseoutHandler = function (a) {
            var b = this.toSceneEvent(a);
            this.dispatchEvent("mouseout", b)
        }, this.clickHandler = function (a) {
            var b = this.toSceneEvent(a);
            this.currentElement && (b.target = this.currentElement, this.currentElement.clickHandler(b)), this.dispatchEvent("click", b)
        }, this.dbclickHandler = function (a) {
            var b = this.toSceneEvent(a);
            this.currentElement ? (b.target = this.currentElement, this.currentElement.dbclickHandler(b)) : scene_self.cancleAllSelected(), this.dispatchEvent("dbclick", b)
        }, this.mousewheelHandler = function (a) {
            var b = this.toSceneEvent(a);
            this.dispatchEvent("mousewheel", b)
        }, this.touchstart = this.mousedownHander, this.touchmove = this.mousedragHandler, this.touchend = this.mousedownHander, this.keydownHandler = function (a) {
            this.dispatchEvent("keydown", a)
        }, this.keyupHandler = function (a) {
            this.dispatchEvent("keyup", a)
        }, this.addEventListener = function (eventName, fn) {
            var self = this;
            var b = function (e) {
                fn.call(self, e);
            };
            this.messageBus.subscribe(eventName, fn);
            return this;
        }, this.removeEventListener = function (a, f) {
            this.messageBus.unsubscribe(a, f)
        }, this.removeAllEventListener = function () {
            this.messageBus = new jtopo.util.MessageBus
        }, this.dispatchEvent = function (a, b) {
            return this.messageBus.publish(a, b), this
        };
        var f = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","), g = this;
        return f.forEach(function (a) {
            g[a] = function (b) {
                null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
            }
        }), this.zoom = function (a, b) {
            null != a && 0 != a && (this.scaleX = a), null != b && 0 != b && (this.scaleY = b)
        }, this.zoomOut = function (a) {
            0 != a && (null == a && (a = .8), this.scaleX /= a, this.scaleY /= a)
        }, this.zoomIn = function (a) {
            0 != a && (null == a && (a = .8), this.scaleX *= a, this.scaleY *= a)
        }, this.getBound = function () {
            return {left: 0, top: 0, right: this.stage.canvas.width, bottom: this.stage.canvas.height, width: this.stage.canvas.width, height: this.stage.canvas.height}
        }, this.getElementsBound = function () {
            return jtopo.util.getElementsBound(this.childs)
        }, this.translateToCenter = function (a) {
            var b = this.getElementsBound(), c = this.stage.canvas.width / 2 - (b.left + b.right) / 2, d = this.stage.canvas.height / 2 - (b.top + b.bottom) / 2;
            a && (c = a.canvas.width / 2 - (b.left + b.right) / 2, d = a.canvas.height / 2 - (b.top + b.bottom) / 2), this.translateX = c, this.translateY = d
        }, this.setCenter = function (a, b) {
            var c = a - this.stage.canvas.width / 2, d = b - this.stage.canvas.height / 2;
            this.translateX = -c, this.translateY = -d
        }, this.centerAndZoom = function (a, b, c) {
            if (this.translateToCenter(c), null == a || null == b) {
                var d = this.getElementsBound(), e = d.right - d.left, f = d.bottom - d.top, g = this.stage.canvas.width / e, h = this.stage.canvas.height / f;
                c && (g = c.canvas.width / e, h = c.canvas.height / f);
                var i = Math.min(g, h);
                if (i > 1)return;
                this.zoom(i, i)
            }
            this.zoom(a, b)
        }, this.getCenterLocation = function () {
            return {x: scene_self.stage.canvas.width / 2, y: scene_self.stage.canvas.height / 2}
        }, this.doLayout = function (a) {
            a && a(this, this.childs)
        }, this.toJson = function () {
            {
                var a = this, b = "{";
                this.serializedProperties.length
            }
            this.serializedProperties.forEach(function (c) {
                var d = a[c];
                "background" == c && (d = a._background.src), "string" == typeof d && (d = '"' + d + '"'), b += '"' + c + '":' + d + ","
            }), b += '"childs":[';
            var c = this.childs.length;
            return this.childs.forEach(function (a, d) {
                b += a.toJson(), c > d + 1 && (b += ",")
            }), b += "]", b += "}"
        }, scene_self
    }

    scene.prototype = new jtopo.Element;
    var c = {};
    Object.defineProperties(scene.prototype, {
        background: {
            get: function () {
                return this._background
            }, set: function (a) {
                if ("string" == typeof a) {
                    var b = c[a];
                    null == b && (b = new Image, b.src = a, b.onload = function () {
                        c[a] = b
                    }), this._background = b
                } else this._background = a
            }
        }
    }), jtopo.Scene = scene
}
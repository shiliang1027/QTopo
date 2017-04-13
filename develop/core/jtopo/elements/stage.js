module.exports = function (jtopo) {
    function initEagleEye(stage) {
        return {
            hgap: 16,
            visible: !1,
            exportCanvas: document.createElement("canvas"),
            getImage: function (b, c) {
                var d = stage.getBound();
                var e = 1;
                var f = 1;
                this.exportCanvas.width = stage.canvas.width;
                this.exportCanvas.height = stage.canvas.height;
                if (null != b && null != c) {
                    this.exportCanvas.width = b;
                    this.exportCanvas.height = c;
                    e = b / d.width;
                    f = c / d.height;
                } else {
                    if (d.width > stage.canvas.width) {
                        this.exportCanvas.width = d.width;
                    }
                    if (d.height > stage.canvas.height) {
                        this.exportCanvas.height = d.height;
                    }
                }
                var g = this.exportCanvas.getContext("2d");
                if (stage.childs.length > 0) {
                    g.save();
                    g.clearRect(0, 0, this.exportCanvas.width, this.exportCanvas.height);
                    stage.childs.forEach(function (a) {
                        if (1 == a.visible) {
                            a.save();
                            a.translateX = 0;
                            a.translateY = 0;
                            a.scaleX = 1;
                            a.scaleY = 1;
                            g.scale(e, f);
                            if (d.left < 0) {
                                a.translateX = Math.abs(d.left)
                            }
                            if (d.top < 0) {
                                a.translateY = Math.abs(d.top)
                            }
                            a.paintAll = !0;
                            a.repaint(g);
                            a.paintAll = !1;
                            a.restore();
                        }
                    });
                    g.restore();
                }
                return this.exportCanvas.toDataURL("image/png");
            },
            canvas: document.createElement("canvas"),
            update: function () {
                this.eagleImageDatas = this.getData(stage);
            },
            setSize: function (a, b) {
                this.width = this.canvas.width = a;
                this.height = this.canvas.height = b;
            },
            getData: function (b, c) {
                function d(a) {
                    var b = a.stage.canvas.width, c = a.stage.canvas.height, d = b / a.scaleX / 2, e = c / a.scaleY / 2;
                    return {translateX: a.translateX + d - d * a.scaleX, translateY: a.translateY + e - e * a.scaleY}
                }

                null != j && null != k ? this.setSize(b, c) : this.setSize(200, 160);
                var e = this.canvas.getContext("2d");
                if (stage.childs.length > 0) {
                    e.save(), e.clearRect(0, 0, this.canvas.width, this.canvas.height), stage.childs.forEach(function (a) {
                        1 == a.visible && (a.save(), a.centerAndZoom(null, null, e), a.repaint(e), a.restore())
                    });
                    var f = d(stage.childs[0]), g = f.translateX * (this.canvas.width / stage.canvas.width) * stage.childs[0].scaleX, h = f.translateY * (this.canvas.height / stage.canvas.height) * stage.childs[0].scaleY, i = stage.getBound(), j = stage.canvas.width / stage.childs[0].scaleX / i.width, k = stage.canvas.height / stage.childs[0].scaleY / i.height;
                    j > 1 && (j = 1), k > 1 && (j = 1), g *= j, h *= k, i.left < 0 && (g -= Math.abs(i.left) * (this.width / i.width)), i.top < 0 && (h -= Math.abs(i.top) * (this.height / i.height)), e.save(), e.lineWidth = 1, e.strokeStyle = "rgba(255,0,0,1)", e.strokeRect(-g, -h, e.canvas.width * j, e.canvas.height * k), e.restore();
                    var l = null;
                    try {
                        l = e.getImageData(0, 0, e.canvas.width, e.canvas.height)
                    } catch (m) {
                    }
                    return l
                }
                return null
            },
            paint: function () {
                if (null != this.eagleImageDatas) {
                    var b = stage.graphics;
                    b.save();
                    b.fillStyle = "rgba(211,211,211,0.3)";
                    b.fillRect(stage.canvas.width - this.canvas.width - 2 * this.hgap, stage.canvas.height - this.canvas.height - 1, stage.canvas.width - this.canvas.width, this.canvas.height + 1);
                    b.fill();
                    b.save();
                    b.lineWidth = 1;
                    b.strokeStyle = "rgba(0,0,0,1)";
                    b.rect(stage.canvas.width - this.canvas.width - 2 * this.hgap, stage.canvas.height - this.canvas.height - 1, stage.canvas.width - this.canvas.width, this.canvas.height + 1);
                    b.stroke();
                    b.restore();
                    b.putImageData(this.eagleImageDatas, stage.canvas.width - this.canvas.width - this.hgap, stage.canvas.height - this.canvas.height);
                    b.restore()
                } else {
                    this.eagleImageDatas = this.getData(stage);
                }
            },
            eventHandler: function (a, b, c) {
                var d = b.x, e = b.y;
                if (d > c.canvas.width - this.canvas.width && e > c.canvas.height - this.canvas.height) {
                    if (d = b.x - this.canvas.width, e = b.y - this.canvas.height, "mousedown" == a && (this.lastTranslateX = c.childs[0].translateX, this.lastTranslateY = c.childs[0].translateY), "mousedrag" == a && c.childs.length > 0) {
                        var f = b.dx, g = b.dy, h = c.getBound(), i = this.canvas.width / c.childs[0].scaleX / h.width, j = this.canvas.height / c.childs[0].scaleY / h.height;
                        c.childs[0].translateX = this.lastTranslateX - f / i, c.childs[0].translateY = this.lastTranslateY - g / j
                    }
                }
            }
        }
    }

    function stage(canvas) {
        function getEventObject(event) {
            var eventPosition = jtopo.util.getEventPosition(event);
            var offsetPosition = jtopo.util.getOffsetPosition(self.canvas);
            eventPosition.offsetLeft = eventPosition.pageX - offsetPosition.left;
            eventPosition.offsetTop = eventPosition.pageY - offsetPosition.top;
            eventPosition.x = eventPosition.offsetLeft;
            eventPosition.y = eventPosition.offsetTop;
            eventPosition.target = null;
            return eventPosition;
        }

        function mouseOver(event) {
            document.onselectstart = function () {
                return !1
            }, this.mouseOver = !0;
            var b = getEventObject(event);
            self.dispatchEventToScenes("mouseover", b), self.dispatchEvent("mouseover", b)
        }

        function mouseOut(a) {
            p = setTimeout(function () {
                o = !0
            }, 500), document.onselectstart = function () {
                return !0
            };
            var b = getEventObject(a);
            self.dispatchEventToScenes("mouseout", b), self.dispatchEvent("mouseout", b), self.needRepaint = 0 == self.animate ? !1 : !0
        }

        function mouseDown(a) {
            var b = getEventObject(a);
            self.mouseDown = !0, self.mouseDownX = b.x, self.mouseDownY = b.y, self.dispatchEventToScenes("mousedown", b), self.dispatchEvent("mousedown", b)
        }

        function mouseUp(a) {
            var b = getEventObject(a);
            self.dispatchEventToScenes("mouseup", b), self.dispatchEvent("mouseup", b), self.mouseDown = !1, self.needRepaint = 0 == self.animate ? !1 : !0
        }

        function mouseMove(event) {
            if (p) {
                window.clearTimeout(p);
                p = null;
            }
            o = !1;
            var b = getEventObject(event);
            if (self.mouseDown) {
                if (0 == event.button) {
                    b.dx = b.x - self.mouseDownX;
                    b.dy = b.y - self.mouseDownY;
                    self.dispatchEventToScenes("mousedrag", b);
                    self.dispatchEvent("mousedrag", b);
                    if (1 == self.eagleEye.visible) {
                        self.eagleEye.update();
                    }
                }
            } else {
                self.dispatchEventToScenes("mousemove", b);
                self.dispatchEvent("mousemove", b);
            }
        }

        function click(a) {
            var b = getEventObject(a);
            self.dispatchEventToScenes("click", b), self.dispatchEvent("click", b)
        }

        function dbclick(a) {
            var b = getEventObject(a);
            self.dispatchEventToScenes("dbclick", b), self.dispatchEvent("dbclick", b)
        }

        function mouseWheel(a) {
            var b = getEventObject(a);
            self.dispatchEventToScenes("mousewheel", b), self.dispatchEvent("mousewheel", b), null != self.wheelZoom && (a.preventDefault ? a.preventDefault() : (a = a || window.event, a.returnValue = !1), 1 == self.eagleEye.visible && self.eagleEye.update())
        }

        function addEventInCanvas(canvas) {
            if (jtopo.util.isIE || !window.addEventListener) {
                canvas.onmouseout = mouseOut;
                canvas.onmouseover = mouseOver;
                canvas.onmousedown = mouseDown;
                canvas.onmouseup = mouseUp;
                canvas.onmousemove = mouseMove;
                canvas.onclick = click;
                canvas.ondblclick = dbclick;
                canvas.onmousewheel = mouseWheel;
                canvas.touchstart = mouseDown;
                canvas.touchmove = mouseMove;
                canvas.touchend = mouseUp;
            } else {
                canvas.addEventListener("mouseout", mouseOut);
                canvas.addEventListener("mouseover", mouseOver);
                canvas.addEventListener("mousedown", mouseDown);
                canvas.addEventListener("mouseup", mouseUp);
                canvas.addEventListener("mousemove", mouseMove);
                canvas.addEventListener("click", click);
                canvas.addEventListener("dblclick", dbclick);
                if (jtopo.util.isFirefox) {
                    canvas.addEventListener("DOMMouseScroll", mouseWheel);
                } else {
                    canvas.addEventListener("mousewheel", mouseWheel);
                }
            }
            if (window.addEventListener) {
                window.addEventListener("keydown", function (event) {
                    self.dispatchEventToScenes("keydown", jtopo.util.cloneEvent(event));
                    var keyCode = event.keyCode;
                    if (37 == keyCode || 38 == keyCode || 39 == keyCode || 40 == keyCode) {
                        if (event.preventDefault) {
                            event.preventDefault()
                        } else {
                            event = event || window.event;
                            event.returnValue = !1;
                        }
                    }
                }, !0);
                window.addEventListener("keyup", function (event) {
                    self.dispatchEventToScenes("keyup", jtopo.util.cloneEvent(event));
                    var keyCode = event.keyCode;
                    if (37 == keyCode || 38 == keyCode || 39 == keyCode || 40 == keyCode) {
                        if (event.preventDefault) {
                            event.preventDefault()
                        } else {
                            event = event || window.event;
                            event.returnValue = !1;
                        }
                    }
                }, !0);
            }
        }

        jtopo.stage = this;
        var self = this;
        this.initialize = function (canvas) {
            addEventInCanvas(canvas);
            this.canvas = canvas;
            this.graphics = canvas.getContext("2d");
            this.childs = [];
            this.frames = 24;
            this.messageBus = new jtopo.util.MessageBus;
            this.eagleEye = initEagleEye(this);
            this.wheelZoom = null;
            this.mouseDownX = 0;
            this.mouseDownY = 0;
            this.mouseDown = !1;
            this.mouseOver = !1;
            this.needRepaint = !0;
            this.serializedProperties = ["frames", "wheelZoom"];
        };
        if (null != canvas) {
            this.initialize(canvas);
        }
        var o = !0, p = null;
        document.oncontextmenu = function () {
            return o
        };
        this.dispatchEventToScenes = function (a, b) {
            if (0 != this.frames && (this.needRepaint = !0), 1 == this.eagleEye.visible && -1 != a.indexOf("mouse")) {
                var c = b.x, d = b.y;
                if (c > this.width - this.eagleEye.width && d > this.height - this.eagleEye.height)return void this.eagleEye.eventHandler(a, b, this)
            }
            this.childs.forEach(function (c) {
                if (1 == c.visible) {
                    var d = c[a + "Handler"];
                    if (null == d)throw new Error("Function not found:" + a + "Handler");
                    d.call(c, b)
                }
            })
        };
        this.add = function (scene) {
            for (var i = 0; i < this.childs.length; i++){
                if (this.childs[i] === scene){
                    return;
                }
            }
            scene.addTo(this);
            this.childs.push(scene);
        };
        this.remove = function (scene) {
            if (null == scene)throw new Error("Stage.remove出错: 参数为null!");
            for (var i = 0; i < this.childs.length; i++){
                if (this.childs[i] === scene){
                    scene.stage = null;
                    this.childs = this.childs.del(i);
                    return  this;
                }
            }
            return this
        };
        this.clear = function () {
            this.childs = []
        };
        this.addEventListener = function (eventName, fn) {
            var self = this;
            var b = function (e) {
                fn.call(self, e);
            };
            this.messageBus.subscribe(eventName, fn);
            return this;
        };
        this.removeEventListener = function (a, f) {
            this.messageBus.unsubscribe(a, f)
        };
        this.removeAllEventListener = function () {
            this.messageBus = new jtopo.util.MessageBus();
        };
        this.dispatchEvent = function (a, b) {
            this.messageBus.publish(a, b);
            return this;
        };
        var q = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","), r = this;
        q.forEach(function (a) {
            r[a] = function (b) {
                null != b ? this.addEventListener(a, b) : this.dispatchEvent(a)
            }
        });
        this.saveImageInfo = function (a, b) {
            var c = this.eagleEye.getImage(a, b), d = window.open("about:blank");
            return d.document.write("<img src='" + c + "' alt='from canvas'/>"), this
        };
        this.saveAsLocalImage = function (a, b) {
            var c = this.eagleEye.getImage(a, b);
            return c.replace("image/png", "image/octet-stream"), window.location.href = c, this
        };
        this.paint = function () {
            null != this.canvas && (this.graphics.save(), this.graphics.clearRect(0, 0, this.width, this.height), this.childs.forEach(function (a) {
                1 == a.visible && a.repaint(self.graphics)
            }), 1 == this.eagleEye.visible && this.eagleEye.paint(this), this.graphics.restore())
        };
        this.repaint = function () {
            0 != this.frames && (this.frames < 0 && 0 == this.needRepaint || (this.paint(), this.frames < 0 && (this.needRepaint = !1)))
        };
        this.zoom = function (a) {
            this.childs.forEach(function (b) {
                0 != b.visible && b.zoom(a)
            })
        };
        this.zoomOut = function (a) {
            this.childs.forEach(function (b) {
                0 != b.visible && b.zoomOut(a)
            })
        };
        this.zoomIn = function (a) {
            this.childs.forEach(function (b) {
                0 != b.visible && b.zoomIn(a)
            })
        };
        this.centerAndZoom = function () {
            this.childs.forEach(function (a) {
                0 != a.visible && a.centerAndZoom()
            })
        };
        this.setCenter = function (a, b) {
            var c = this;
            this.childs.forEach(function (d) {
                var e = a - c.canvas.width / 2, f = b - c.canvas.height / 2;
                d.translateX = -e, d.translateY = -f
            })
        };
        this.getBound = function () {
            var bound = {
                left: Number.MAX_VALUE,
                right: Number.MIN_VALUE,
                top: Number.MAX_VALUE,
                bottom: Number.MIN_VALUE
            };
            this.childs.forEach(function (child) {
                var childBound = child.getElementsBound();
                if (childBound.left < bound.left) {
                    bound.left = childBound.left;
                    bound.leftNode = childBound.leftNode
                }
                if (childBound.top < bound.top) {
                    bound.top = childBound.top;
                    bound.topNode = childBound.topNode
                }
                if (childBound.right > bound.right) {
                    bound.right = childBound.right;
                    bound.rightNode = childBound.rightNode
                }
                if (childBound.bottom > bound.bottom) {
                    bound.bottom = childBound.bottom;
                    bound.bottomNode = childBound.bottomNode;
                }
            });
            bound.width = bound.right - bound.left;
            bound.height = bound.bottom - bound.top;
            return bound;
        };
        !function () {
            if (0 == self.frames) {
                setTimeout(arguments.callee, 100);
            } else if (self.frames < 0) {
                self.repaint();
                setTimeout(arguments.callee, 1e3 / -self.frames);
            } else {
                self.repaint();
                setTimeout(arguments.callee, 1e3 / self.frames);
            }
        }();
        self.mousewheel(function (a) {
            var direction = null == a.wheelDelta ? a.detail : a.wheelDelta;
            if (null != self.wheelZoom) {
                if (direction < 0) {
                    self.zoomIn(self.wheelZoom);
                } else {
                    self.zoomOut(self.wheelZoom);
                }
            }
        });
        self.paint();
    }

    stage.prototype = {
        get width() {
            return this.canvas.width
        }, get height() {
            return this.canvas.height
        }, set cursor(a) {
            this.canvas.style.cursor = a
        }, get cursor() {
            return this.canvas.style.cursor
        }, set mode(a) {
            this.childs.forEach(function (b) {
                b.mode = a
            })
        }
    };
    jtopo.Stage = stage;
};
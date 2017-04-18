var initEagleEye=require("./eagleEye.js");
var canvasEvent=require("event.js");
module.exports = function (jtopo) {
    function stage(canvas) {
        jtopo.stage = this;
        var self = this;

        this.initialize = function (canvas) {
            canvasEvent(this,canvas);
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
        var flag = !0, innerTimeOutId = null;
        document.oncontextmenu = function () {
            return flag
        };
        this.dispatchEventToScenes = function (name, event) {
            if(0 != this.frames){
                this.needRepaint = !0;
            }
            if (1 == this.eagleEye.visible && -1 != name.indexOf("mouse")) {
                var eventX = event.x;
                var eventY = event.y;
                if (eventX > this.width - this.eagleEye.width && eventY > this.height - this.eagleEye.height){
                    return void this.eagleEye.eventHandler(name, event, this);
                }
            }
            this.childs.forEach(function (scene) {
                if (1 == scene.visible) {
                    var handler = scene[name + "Handler"];
                    if (null == handler)throw new Error("Function not found:" + name + "Handler");
                    handler.call(scene, event)
                }
            })
        };
        this.add = function (scene) {
            for (var i = 0; i < this.childs.length; i++){
                if (this.childs[i] === scene){
                    return;
                }
            }
            scene.stage = this;
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
        var eventList = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(","), r = this;
        eventList.forEach(function (eventName) {
            r[eventName] = function (e) {
                null != e ? this.addEventListener(eventName, e) : this.dispatchEvent(eventName)
            }
        });
        this.paint = function () {
            if(null != this.canvas){
                this.graphics.save();
                this.graphics.clearRect(0, 0, this.width, this.height);
                this.childs.forEach(function (scene) {
                    if(1 == scene.visible){
                        scene.repaint(self.graphics);
                    }
                });
                if(1 == this.eagleEye.visible){
                    this.eagleEye.paint(this)
                }
                this.graphics.restore();
            }
        };
        this.repaint = function () {
            if(0 != this.frames){
                if(this.frames > 0 || 1 == this.needRepaint){
                    this.paint();
                    if(this.frames < 0){
                        this.needRepaint = !1;
                    }
                }
            }
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
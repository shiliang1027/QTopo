var initEagleEye = require("./eagleEye.js");
var canvasEvent = require("./event.js");
module.exports = function (jtopo) {
    function Stage(canvas) {
        if (null != canvas) {
            var self = this;
            this.initialize(canvas);
            !function () {
                if(self.frames<0){
                    self.frames=-self.frames;
                }
                if (0 == self.frames) {
                    setTimeout(arguments.callee, 1000);
                } else {
                    self.paint();
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
    }
    Object.defineProperties(Stage.prototype,{
        width:{
            get:function () {
                return this.canvas.width
            }
        },
        height:{
            get:function() {
                return this.canvas.height
            }
        },
        cursor:{
            set:function(cursor){
                this.canvas.style.cursor = cursor
            },
            get:function(){
                return this.canvas.style.cursor
            }
        },
        mode:{
            set:function(mode){
                this.childs.forEach(function (scene) {
                    scene.mode = mode
                })
            }
        }
    });
    Stage.prototype.initialize = function (canvas) {
        canvasEvent(this, canvas, jtopo);
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
    };
    Stage.prototype.dispatchEventToScenes = function (name, event) {
        if (1 == this.eagleEye.visible && -1 != name.indexOf("mouse")) {
            var eventX = event.x;
            var eventY = event.y;
            if (eventX > this.width - this.eagleEye.width && eventY > this.height - this.eagleEye.height) {
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
    Stage.prototype.add = function (scene) {
        for (var i = 0; i < this.childs.length; i++) {
            if (this.childs[i] === scene) {
                return;
            }
        }
        scene.stage = this;
        this.childs.push(scene);
    };
    Stage.prototype.remove = function (scene) {
        if (null == scene)throw new Error("Stage.remove出错: 参数为null!");
        for (var i = 0; i < this.childs.length; i++) {
            if (this.childs[i] === scene) {
                scene.stage = null;
                this.childs = this.childs.del(i);
                return this;
            }
        }
        return this
    };
    Stage.prototype.clear = function () {
        this.childs = []
    };
    Stage.prototype.addEventListener = function (eventName, fn) {
        var self = this;
        var b = function (e) {
            fn.call(self, e);
        };
        this.messageBus.subscribe(eventName, fn);
        return this;
    };
    Stage.prototype.removeEventListener = function (a, f) {
        this.messageBus.unsubscribe(a, f)
    };
    Stage.prototype.removeAllEventListener = function () {
        this.messageBus = new jtopo.util.MessageBus();
    };
    Stage.prototype.dispatchEvent = function (a, b) {
        this.messageBus.publish(a, b);
        return this;
    };
    Stage.prototype.paint = function () {
        var self = this;
        if (null != this.canvas&&this.frames > 0) {
            this.graphics.save();
            this.graphics.clearRect(0, 0, this.width, this.height);
            this.childs.forEach(function (scene) {
                if (1 == scene.visible) {
                    scene.paint(self.graphics);
                }
            });
            if (1 == this.eagleEye.visible) {
                this.eagleEye.paint(this)
            }
            this.graphics.restore();
        }
    };
    Stage.prototype.zoom = function (scale) {
        this.childs.forEach(function (scene) {
            if (0 != scene.visible) {
                scene.zoom(scale);
            }
        })
    };
    Stage.prototype.zoomOut = function (scale) {
        this.childs.forEach(function (scene) {
            if (0 != scene.visible) {
                scene.zoomOut(scale);
            }
        })
    };
    Stage.prototype.zoomIn = function (scale) {
        this.childs.forEach(function (scene) {
            if (0 != scene.visible) {
                scene.zoomIn(scale)
            }
        })
    };
    Stage.prototype.centerAndZoom = function () {
        this.childs.forEach(function (a) {
            0 != a.visible && a.centerAndZoom()
        })
    };
    Stage.prototype.setCenter = function (a, b) {
        var c = this;
        this.childs.forEach(function (d) {
            var e = a - c.canvas.width / 2, f = b - c.canvas.height / 2;
            d.translateX = -e, d.translateY = -f
        })
    };
    Stage.prototype.getBound = function () {
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
    ['click', 'dbclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'mousedrag', 'mousewheel', 'touchstart', 'touchmove', 'touchend', 'keydown', 'keyup'].forEach(function (eventName) {
        Stage.prototype[eventName] = function (e) {
            null != e ? this.addEventListener(eventName, e) : this.dispatchEvent(eventName);
        }
    });
    jtopo.Stage = Stage;
};
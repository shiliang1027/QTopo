module.exports = function (jtopo) {
    jtopo.Scene = Scene;
    function Scene(stage) {
        jtopo.Element.call(this);
        if (null != stage) {
            stage.add(this);
        }
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
    }
    jtopo.util.inherits(Scene,jtopo.Element);
    Object.defineProperties(Scene.prototype, {
        background: {
            get: function () {
                return this._background
            },
            set: (function () {
                var imgCatch = {};
                return function (img) {
                    if ("string" == typeof img) {
                        var catched = imgCatch[img];
                        if (null == catched) {
                            catched = new Image;
                            catched.src = img;
                            catched.onload = function () {
                                imgCatch[img] = catched
                            }
                        }
                        this._background = catched;
                    } else {
                        this._background = img;
                    }
                }
            })()
        }
    });
    ['click', 'dbclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'mousedrag', 'mousewheel', 'touchstart', 'touchmove', 'touchend', 'keydown', 'keyup']
        .forEach(function (name) {
            Scene.prototype[name] = function (fn) {
                if (null != fn) {
                    this.addEventListener(name, fn);
                } else {
                    this.dispatchEvent(name);
                }
            }
        });
    Scene.prototype.setBackground = function (background) {
        this.background = background;
    };
    Scene.prototype.show = function () {
        this.visible = !0
    };
    Scene.prototype.hide = function () {
        this.visible = !1
    };
    Scene.prototype.paint = function (context) {
        if (0 != this.visible && null != this.stage) {
            context.save();
            this.paintBackgroud(context);
            context.restore();
            context.save();
            context.scale(this.scaleX, this.scaleY);
            if (1 == this.translate) {
                var translated = this.getOffsetTranslate();
                context.translate(translated.translateX, translated.translateY)
            }
            this.paintChilds(context);
            context.restore();
            context.save();
            this.paintOperations(context);
            context.restore();
        }
    };
    Scene.prototype.paintBackgroud = function (context) {
        if (null != this.background) {
            context.drawImage(this.background, 0, 0, context.canvas.width, context.canvas.height)
        } else {
            context.beginPath();
            context.fillStyle = "rgba(" + this.backgroundColor + "," + this.alpha + ")";
            context.fillRect(0, 0, context.canvas.width, context.canvas.height);
            context.closePath();
        }
    };
    Scene.prototype.getDisplayedElements = function () {
        var self = this;
        var elements = [];
        this.zIndexArray.forEach(function (zIndex) {
            self.zIndexMap[zIndex].forEach(function (element) {
                if (self.needPaint(element)) {
                    elements.push(element)
                }
            });
        });
        return elements
    };
    Scene.prototype.getDisplayedNodes = function () {
        var self = this;
        return this.childs.filter(function (child) {
            return child instanceof jtopo.Node && self.needPaint(child);
        });
    };
    Scene.prototype.paintChilds = function (context) {
        var self = this;
        this.zIndexArray.forEach(function (zIndex) {
            self.zIndexMap[zIndex].forEach(function (element) {
                if (1 == self.paintAll || self.needPaint(element)) {
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
            });
        });
    };
    Scene.prototype.getOffsetTranslate = function () {
        var width = this.stage.canvas.width;
        var height = this.stage.canvas.height;
        var centerX = width / this.scaleX / 2;
        var centerY = height / this.scaleY / 2;
        return {
            translateX: this.translateX + (centerX - centerX * this.scaleX),
            translateY: this.translateY + (centerY - centerY * this.scaleY)
        };
    };
    Scene.prototype.needPaint = function (element) {
        var self = this;
        if (1 == element.visible) {
            if (element instanceof jtopo.Link) {
                return self.needPaint(element.nodeA) || self.needPaint(element.nodeZ);
            } else {
                var sceneOffset = this.getOffsetTranslate();
                var positionX = element.x + sceneOffset.translateX;
                var positionY = element.y + sceneOffset.translateY;
                positionX *= this.scaleX;
                positionY *= this.scaleY;
                var rightX = positionX + element.width * this.scaleX;
                var rightY = positionY + element.height * this.scaleY;
                return positionX < this.stage.canvas.width && positionY < this.stage.canvas.height && 0 < rightX && 0 < rightY;
            }
        }
        return false;
    };
    Scene.prototype.paintOperations = function (context) {
        this.operations.forEach(function (option) {
            if (typeof option == 'function') {
                option(context);
            }
        })
    };
    Scene.prototype.addOperation = function (a) {
        this.operations.push(a);
        return this;
    };
    Scene.prototype.clearOperations = function () {
        this.operations = [];
        return this;
    };
    Scene.prototype.findElements = function (fn) {
        return typeof fn == 'function' ?
            this.childs.filter(function (child) {
                return 1 == fn(child);
            })
            : [];
    };
    Scene.prototype.getElementsByClass = function (clazz) {
        return this.findElements(function (element) {
            return element instanceof clazz
        })
    };
    Scene.prototype.getElementByXY = function (x, y) {
        var element = null;
        for (var i = this.zIndexArray.length - 1; i >= 0; i--) {
            var zIndex = this.zIndexArray[i];
            var elements = this.zIndexMap[zIndex];
            for (var j = elements.length - 1; j >= 0; j--) {
                var el = elements[j];
                if (el instanceof jtopo.InteractiveElement && this.needPaint(el) && el.isInBound(x, y)) {
                    return el;
                }
            }
        }
        return element
    };
    Scene.prototype.add = function (element) {
        this.childs.push(element);
        if (null == this.zIndexMap[element.zIndex]) {
            this.zIndexMap[element.zIndex] = [];
            this.zIndexArray.push(element.zIndex);
            this.zIndexArray.sort(function (a, b) {
                return a - b
            });
        }
        this.zIndexMap["" + element.zIndex].push(element);
    };
    Scene.prototype.remove = function (element) {
        this.childs = jtopo.util.removeFromArray(this.childs, element);
        var elements = this.zIndexMap[element.zIndex];
        if (elements) {
            this.zIndexMap[element.zIndex] = jtopo.util.removeFromArray(elements, element);
        }
        element.removeHandler(this);
    };
    Scene.prototype.clear = function () {
        var self = this;
        this.childs.forEach(function (child) {
            child.removeHandler(self);
        });
        this.childs = [];
        this.operations = [];
        this.zIndexArray = [];
        this.zIndexMap = {};
    };
    Scene.prototype.zoom = function (x, y) {
        if (typeof x !== 'undefined') {
            this.scaleX = x > 0 ? x : 1;
        }
        if (typeof y !== 'undefined') {
            this.scaleY = y > 0 ? y : 1;
        }
    };
    Scene.prototype.zoomOut = function (scale) {
        if (typeof scale == 'undefined' || scale <= 0) {
            scale = 0.8;
        }
        this.scaleX /= scale;
        this.scaleY /= scale;
    };
    Scene.prototype.zoomIn = function (scale) {
        if (typeof scale == 'undefined' || scale <= 0) {
            scale = 0.8;
        }
        this.scaleX *= scale;
        this.scaleY *= scale;
    };
    Scene.prototype.getBound = function () {
        return {
            left: 0,
            top: 0,
            right: this.stage.canvas.width,
            bottom: this.stage.canvas.height,
            width: this.stage.canvas.width,
            height: this.stage.canvas.height
        }
    };
    Scene.prototype.getElementsBound = function () {
        return jtopo.util.getElementsBound(this.childs)
    };
    Scene.prototype.translateToCenter = function (stage) {
        var bound = this.getElementsBound();
        var tanselateX = this.stage.canvas.width / 2 - (bound.left + bound.right) / 2;
        var translateY = this.stage.canvas.height / 2 - (bound.top + bound.bottom) / 2;
        if (stage) {
            tanselateX = stage.canvas.width / 2 - (bound.left + bound.right) / 2;
            translateY = stage.canvas.height / 2 - (bound.top + bound.bottom) / 2;
        }
        this.translateX = tanselateX;
        this.translateY = translateY;
    };
    Scene.prototype.setCenter = function (x, y) {
        this.translateX = (this.stage.canvas.width / 2) - x;
        this.translateY = (this.stage.canvas.height / 2) - y;
    };
    Scene.prototype.centerAndZoom = function (scaleX, scaleY, stage) {
        this.translateToCenter(stage);
        if (null == scaleX || null == scaleY) {
            var bound = this.getElementsBound();
            scaleX = this.stage.canvas.width / bound.width;
            scaleY = this.stage.canvas.height / bound.height;
            if (stage) {
                scaleX = stage.canvas.width / bound.width;
                scaleY = stage.canvas.height / bound.height;
            }
            var scale = Math.min(scaleX, scaleY);
            if (scale > 1)return;
            this.zoom(scale, scale);
        } else {
            this.zoom(scaleX, scaleY);
        }
    };
    Scene.prototype.getCenterLocation = function () {
        return {
            x: this.stage.canvas.width / 2,
            y: this.stage.canvas.height / 2
        }
    };
    Scene.prototype.doLayout = function (fn) {
        if (fn) {
            fn(this, this.childs);
        }
    };
};
module.exports = function (jtopo) {
    function Scene(stage) {
        var self = this;
        var eventName = "click,dbclick,mousedown,mouseup,mouseover,mouseout,mousemove,mousedrag,mousewheel,touchstart,touchmove,touchend,keydown,keyup".split(",");
        eventName.forEach(function (name) {
            self[name] = function (fn) {
                if (null != fn) {
                    self.addEventListener(name, fn);
                } else {
                    self.dispatchEvent(name);
                }
            }
        });
        if (null != stage) {
            stage.add(this);
        }
        this.initialize = function () {
            Scene.prototype.initialize.apply(this, arguments);
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
        this.setBackground = function (background) {
            this.background = background;
        };
        this.show = function () {
            this.visible = !0
        };
        this.hide = function () {
            this.visible = !1
        };
        this.paint = function (context) {
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
        this.repaint = function (a) {
            if (0 != this.visible) {
                this.paint(a);
            }
        };
        this.paintBackgroud = function (context) {
            if (null != this.background) {
                context.drawImage(this.background, 0, 0, context.canvas.width, context.canvas.height)
            } else {
                context.beginPath();
                context.fillStyle = "rgba(" + this.backgroundColor + "," + this.alpha + ")";
                context.fillRect(0, 0, context.canvas.width, context.canvas.height);
                context.closePath();
            }
        };
        this.getDisplayedElements = function () {
            var elements = [];
            this.zIndexArray.forEach(function(zIndex){
                self.zIndexMap[zIndex].forEach(function(element){
                    if (self.needPaint(element)) {
                        elements.push(element)
                    }
                });
            });
            return elements
        };
        this.getDisplayedNodes = function () {
            var self = this;
            return this.childs.filter(function (child) {
                return child instanceof jtopo.Node && self.needPaint(child);
            });
        };
        this.paintChilds = function (context) {
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
        this.getOffsetTranslate = function () {
            var width = this.stage.canvas.width;
            var height = this.stage.canvas.height;
            var centerX = width / this.scaleX / 2;
            var centerY = height / this.scaleY / 2;
            return {
                translateX: this.translateX + (centerX - centerX * this.scaleX),
                translateY: this.translateY + (centerY - centerY * this.scaleY)
            };
        };
        this.needPaint = function (element) {
            if (1 == element.visible) {
                if (element instanceof jtopo.Link) {
                    return self.needPaint(element.nodeA)||self.needPaint(element.nodeZ);
                }else{
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
        this.paintOperations = function (context) {
            this.operations.forEach(function (option) {
                if (typeof option == 'function') {
                    option(context);
                }
            })
        };
        this.addOperation = function (a) {
            this.operations.push(a);
            return this;
        };
        this.clearOperations = function () {
            this.operations = [];
            return this;
        };
        this.findElements = function (fn) {
            return typeof fn == 'function' ?
                this.childs.filter(function (child) {
                    return 1 == fn(child);
                })
                : [];
        };
        this.getElementsByClass = function (clazz) {
            return this.findElements(function (element) {
                return element instanceof clazz
            })
        };
        this.getElementByXY = function (x, y) {
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
        this.add = function (element) {
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
        this.remove = function (element) {
            this.childs = jtopo.util.removeFromArray(this.childs, element);
            var elements = this.zIndexMap[element.zIndex];
            if (elements) {
                this.zIndexMap[element.zIndex] = jtopo.util.removeFromArray(elements, element);
            }
            element.removeHandler(this);
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
        this.addToSelected = function (element) {
            this.selectedElements.push(element);
        };
        this.cancleAllSelected = function (context) {
            this.selectedElements.forEach(function(element){
                element.unselectedHandler(context);
            });
            this.selectedElements = [];
        };
        this.notInSelectedNodes = function (element) {
            return !(this.selectedElements.indexOf(element)>-1);
        };
        this.removeFromSelected = function (element) {
            this.selectedElements.del(element);
        };
        this.toSceneEvent = function (event) {
            event = jtopo.util.clone(event);
            event.x /= this.scaleX;
            event.y /= this.scaleY;
            if (1 == this.translate) {
                var d = this.getOffsetTranslate();
                event.x -= d.translateX;
                event.y -= d.translateY;
            }
            if (null != event.dx) {
                event.dx /= this.scaleX;
                event.dy /= this.scaleY;
            }
            if (null != this.currentElement) {
                event.target = this.currentElement;
            }
            event.scene = this;
            return event
        };
        this.selectElement = function (event) {
            var element = this.getElementByXY(event.x, event.y);
            if (null != element) {
                event.target = element;
                element.mousedownHander(event);
                element.selectedHandler(event);
                if (this.notInSelectedNodes(element)) {
                    event.ctrlKey || this.cancleAllSelected();
                    this.addToSelected(element);
                } else {
                    if (1 == event.ctrlKey) {
                        element.unselectedHandler();
                        this.removeFromSelected(element);
                    }
                    this.selectedElements.forEach(function(el){
                        el.selectedHandler(event);
                    })
                }
            } else {
                event.ctrlKey || this.cancleAllSelected();
            }
            this.currentElement = element
        };
        function domouseDown(event) {
            event = self.toSceneEvent(event);
            self.mouseDown = !0;
            self.mouseDownX = event.x;
            self.mouseDownY = event.y;
            self.mouseDownEvent = event;
            switch (self.mode) {
                case jtopo.SceneMode.drag:
                    if (1 == self.translate) {
                        self.lastTranslateX = self.translateX;
                        self.lastTranslateY = self.translateY;
                    }
                    break;
                case jtopo.SceneMode.select:
                    self.selectElement(event);
                    break;
                default://jtopo.SceneMode.normal || jtopo.SceneMode.edit
                    self.selectElement(event);
                    if ((null == self.currentElement || self.currentElement instanceof jtopo.Link) && 1 == self.translate) {
                        self.lastTranslateX = self.translateX;
                        self.lastTranslateY = self.translateY;
                    }
            }
        }

        this.mousedownHandler = function (event) {
            domouseDown(event);
            this.dispatchEvent("mousedown", event);
        };
        this.touchstartHandler = function (event) {
            domouseDown(event);
            this.dispatchEvent("touchstart", event);
        };
        this.mouseupHandler = function (event) {
            self.clearOperations();
            event = this.toSceneEvent(event);
            if (null != this.currentElement) {
                event.target = self.currentElement;
                this.currentElement.mouseupHandler(event);
            }
            this.dispatchEvent("mouseup", event);
            this.mouseDown = !1;
        };
        this.dragElements = function (event) {
            if (null != this.currentElement && 1 == this.currentElement.draggable) {
                this.selectedElements.forEach(function(element){
                    if (0 != element.draggable) {
                        var elEvent = jtopo.util.clone(event);
                        elEvent.target = element;
                        element.mousedragHandler(elEvent);
                    }
                });
            }
        };
        this.mousedragHandler = function (event) {
            event = this.toSceneEvent(event);
            switch (this.mode) {
                case jtopo.SceneMode.drag:
                    if (1 == this.translate) {
                        this.translateX = this.lastTranslateX + event.dx;
                        this.translateY = this.lastTranslateY + event.dy;
                    }
                    break;
                case jtopo.SceneMode.select:
                    if (null != this.currentElement) {
                        1 == this.currentElement.draggable && this.dragElements(event);
                    } else {
                        1 == this.areaSelect && this.areaSelectHandle(event);
                    }
                    break;
                default://jtopo.SceneMode.normal || jtopo.SceneMode.edit
                    if (null == this.currentElement || this.currentElement instanceof jtopo.Link) {
                        if (1 == this.translate) {
                            this.translateX = this.lastTranslateX + event.dx;
                            this.translateY = this.lastTranslateY + event.dy;
                        }
                    } else {
                        this.dragElements(event);
                    }
            }
            this.dispatchEvent("mousedrag", event);
        };
        this.areaSelectHandle = function (event) {
            var dragX = event.offsetLeft;
            var dragY = event.offsetTop;
            var downX = this.mouseDownEvent.offsetLeft;
            var downY = this.mouseDownEvent.offsetTop;
            var beginX = dragX >= downX ? downX : dragX;
            var beginY = dragY >= downY ? downY : dragY;
            var width = Math.abs(event.dx) * this.scaleX;
            var height = Math.abs(event.dy) * this.scaleY;
            this.clearOperations()
                .addOperation(
                    (function (x, y, w, h) {
                        return function (context) {
                            context.beginPath();
                            context.strokeStyle = "rgba(0,0,236,0.5)";
                            context.fillStyle = "rgba(0,0,236,0.1)";
                            context.rect(x, y, w, h);
                            context.fill();
                            context.stroke();
                            context.closePath();
                        }
                    })(beginX, beginY, width, height)
                );
            dragX = event.x;
            dragY = event.y;
            downX = this.mouseDownEvent.x;
            downY = this.mouseDownEvent.y;
            beginX = dragX >= downX ? downX : dragX;
            beginY = dragY >= downY ? downY : dragY;
            width = Math.abs(event.dx);
            height = Math.abs(event.dy);
            var endX = beginX + width;
            var endY = beginY + height;
            this.childs.forEach(function(element){
                if (element.elementType !== 'link') {
                    if (element.x > beginX && element.x + element.width < endX && element.y > beginY && element.y + element.height < endY) {
                        if (self.notInSelectedNodes(element)) {
                            element.selectedHandler(event);
                            self.addToSelected(element);
                        }
                    }
                }
            });
        };
        this.mousemoveHandler = function (e) {
            var event = this.toSceneEvent(e);
            if (this.mode == jtopo.SceneMode.drag) {
                return;
            }
            var element = this.getElementByXY(event.x, event.y);
            if (null != element) {
                if (this.mouseOverelement && this.mouseOverelement !== element) {
                    this.mouseOverelement.mouseoutHandler(event);
                }
                this.mouseOverelement = element;
                event.target = element;
                if (0 == element.isMouseOver) {
                    element.mouseoverHandler(event);
                    this.dispatchEvent("mouseover", event);
                } else {
                    element.mousemoveHandler(event);
                    this.dispatchEvent("mousemove", event);
                }
            } else {
                if (this.mouseOverelement) {
                    event.target = this.mouseOverelement;
                    this.mouseOverelement.mouseoutHandler(event);
                    this.mouseOverelement = null;
                    this.dispatchEvent("mouseout", event);
                } else {
                    event.target = null;
                    this.dispatchEvent("mousemove", event)
                }
            }
        };
        this.mouseoverHandler = function (event) {
            this.dispatchEvent("mouseover", this.toSceneEvent(event))
        };
        this.mouseoutHandler = function (event) {
            this.dispatchEvent("mouseout", this.toSceneEvent(event))
        };
        this.clickHandler = function (event) {
            event = this.toSceneEvent(event);
            if (this.currentElement) {
                event.target = this.currentElement;
                this.currentElement.clickHandler(event);
            }
            this.dispatchEvent("click", event);
        };
        this.dbclickHandler = function (event) {
            event = this.toSceneEvent(event);
            if (this.currentElement) {
                event.target = this.currentElement;
                this.currentElement.dbclickHandler(event);
            } else {
                this.cancleAllSelected();
            }
            this.dispatchEvent("dbclick", event)
        };
        this.mousewheelHandler = function (event) {
            this.dispatchEvent("mousewheel", this.toSceneEvent(event));
        };
        this.touchmove = this.mousedragHandler;
        this.touchend = this.mousedownHander;
        this.keydownHandler = function (a) {
            this.dispatchEvent("keydown", a)
        };
        this.keyupHandler = function (a) {
            this.dispatchEvent("keyup", a)
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
            this.messageBus = new jtopo.util.MessageBus
        };
        this.dispatchEvent = function (a, b) {
            return this.messageBus.publish(a, b), this
        };
        this.zoom = function (x, y) {
            if (typeof x !== 'undefined') {
                this.scaleX = x > 0 ? x : 1;
            }
            if (typeof y !== 'undefined') {
                this.scaleY = y > 0 ? y : 1;
            }
        };
        this.zoomOut = function (scale) {
            if (typeof scale == 'undefined' || scale <= 0) {
                scale = 0.8;
            }
            this.scaleX /= scale;
            this.scaleY /= scale;
        };
        this.zoomIn = function (scale) {
            if (typeof scale == 'undefined' || scale <= 0) {
                scale = 0.8;
            }
            this.scaleX *= scale;
            this.scaleY *= scale;
        };
        this.getBound = function () {
            return {
                left: 0,
                top: 0,
                right: this.stage.canvas.width,
                bottom: this.stage.canvas.height,
                width: this.stage.canvas.width,
                height: this.stage.canvas.height
            }
        };
        this.getElementsBound = function () {
            return jtopo.util.getElementsBound(this.childs)
        };
        this.translateToCenter = function (stage) {
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
        this.setCenter = function (x, y) {
            this.translateX = (this.stage.canvas.width / 2) - x;
            this.translateY = (this.stage.canvas.height / 2) - y;
        };
        this.centerAndZoom = function (scaleX, scaleY, stage) {
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
        this.getCenterLocation = function () {
            return {
                x: this.stage.canvas.width / 2,
                y: this.stage.canvas.height / 2
            }
        };
        this.doLayout = function (fn) {
            if (fn) {
                fn(this, this.childs);
            }
        };
        return this
    }

    Scene.prototype = new jtopo.Element;
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
    jtopo.Scene = Scene
};
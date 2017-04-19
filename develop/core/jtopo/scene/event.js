module.exports=function(jtopo){
    function domouseDown(event) {
        event = this.toSceneEvent(event);
        this.mouseDown = !0;
        this.mouseDownX = event.x;
        this.mouseDownY = event.y;
        this.mouseDownEvent = event;
        switch (this.mode) {
            case jtopo.SceneMode.drag:
                if (1 == this.translate) {
                    this.lastTranslateX = this.translateX;
                    this.lastTranslateY = this.translateY;
                }
                break;
            case jtopo.SceneMode.select:
                this.selectElement(event);
                break;
            default://jtopo.SceneMode.normal || jtopo.SceneMode.edit
                this.selectElement(event);
                if ((null == this.currentElement || this.currentElement instanceof jtopo.Link) && 1 == this.translate) {
                    this.lastTranslateX = this.translateX;
                    this.lastTranslateY = this.translateY;
                }
        }
    }
    jtopo.Scene.prototype.addToSelected = function (element) {
        this.selectedElements.push(element);
    };
    jtopo.Scene.prototype.toSceneEvent = function (event) {
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
    jtopo.Scene.prototype.notInSelectedNodes = function (element) {
        return !(this.selectedElements.indexOf(element) > -1);
    };
    jtopo.Scene.prototype.removeFromSelected = function (element) {
        this.selectedElements.del(element);
    };
    jtopo.Scene.prototype.selectElement = function (event) {
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
                this.selectedElements.forEach(function (el) {
                    el.selectedHandler(event);
                })
            }
        } else {
            event.ctrlKey || this.cancleAllSelected();
        }
        this.currentElement = element
    };
    jtopo.Scene.prototype.cancleAllSelected = function (context) {
        this.selectedElements.forEach(function (element) {
            element.unselectedHandler(context);
        });
        this.selectedElements = [];
    };
    jtopo.Scene.prototype.dragElements = function (event) {
        if (null != this.currentElement && 1 == this.currentElement.draggable) {
            this.selectedElements.forEach(function (element) {
                if (0 != element.draggable) {
                    var elEvent = jtopo.util.clone(event);
                    elEvent.target = element;
                    element.mousedragHandler(elEvent);
                }
            });
        }
    };
    jtopo.Scene.prototype.mousedownHandler = function (event) {
        domouseDown.call(this, event);
        this.dispatchEvent("mousedown", event);
    };
    jtopo.Scene.prototype.touchstartHandler = function (event) {
        domouseDown.call(this, event);
        this.dispatchEvent("touchstart", event);
    };
    jtopo.Scene.prototype.mouseupHandler = function (event) {
        var self=this;
        self.clearOperations();
        event = this.toSceneEvent(event);
        if (null != this.currentElement) {
            event.target = self.currentElement;
            this.currentElement.mouseupHandler(event);
        }
        this.dispatchEvent("mouseup", event);
        this.mouseDown = !1;
    };
    jtopo.Scene.prototype.mousedragHandler = function (event) {
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
    jtopo.Scene.prototype.areaSelectHandle = function (event) {
        var self=this;
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
        this.childs.forEach(function (element) {
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
    jtopo.Scene.prototype.mousemoveHandler = function (e) {
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
    jtopo.Scene.prototype.mouseoverHandler = function (event) {
        this.dispatchEvent("mouseover", this.toSceneEvent(event))
    };
    jtopo.Scene.prototype.mouseoutHandler = function (event) {
        this.dispatchEvent("mouseout", this.toSceneEvent(event))
    };
    jtopo.Scene.prototype.clickHandler = function (event) {
        event = this.toSceneEvent(event);
        if (this.currentElement) {
            event.target = this.currentElement;
            this.currentElement.clickHandler(event);
        }
        this.dispatchEvent("click", event);
    };
    jtopo.Scene.prototype.dbclickHandler = function (event) {
        event = this.toSceneEvent(event);
        if (this.currentElement) {
            event.target = this.currentElement;
            this.currentElement.dbclickHandler(event);
        } else {
            this.cancleAllSelected();
        }
        this.dispatchEvent("dbclick", event)
    };
    jtopo.Scene.prototype.mousewheelHandler = function (event) {
        this.dispatchEvent("mousewheel", this.toSceneEvent(event));
    };
    jtopo.Scene.prototype.touchmove = this.mousedragHandler;
    jtopo.Scene.prototype.touchend = this.mousedownHander;
    jtopo.Scene.prototype.keydownHandler = function (a) {
        this.dispatchEvent("keydown", a)
    };
    jtopo.Scene.prototype.keyupHandler = function (a) {
        this.dispatchEvent("keyup", a)
    };
    jtopo.Scene.prototype.addEventListener = function (eventName, fn) {
        var self = this;
        var b = function (e) {
            fn.call(self, e);
        };
        this.messageBus.subscribe(eventName, fn);
        return this;
    };
    jtopo.Scene.prototype.removeEventListener = function (a, f) {
        this.messageBus.unsubscribe(a, f)
    };
    jtopo.Scene.prototype.removeAllEventListener = function () {
        this.messageBus = new jtopo.util.MessageBus
    };
    jtopo.Scene.prototype.dispatchEvent = function (a, b) {
        this.messageBus.publish(a, b);
        return  this;
    };
};
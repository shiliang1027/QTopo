/**
 * Created by qiyc on 2017/4/18.
 */
module.exports=function(self,canvas,jtopo){
    var innerTimeOutId = null;
    var flag = !0;
    document.oncontextmenu = function () {
        return flag
    };
    init(canvas);
    function init(canvas) {
        if (jtopo.util.isIE || !window.addEventListener) {
            canvas.onmouseout = mouseOut;
            canvas.onmouseover = mouseOver;
            canvas.onmousedown = mouseDown;
            canvas.onmouseup = mouseUp;
            canvas.onmousemove = mouseMove;
            canvas.onclick = click;
            canvas.ondblclick = dbclick;
            canvas.onmousewheel = mouseWheel;
            canvas.touchstart = touchStart;
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
        };
        this.mouseOver = !0;
        event = getEventObject(event);
        self.dispatchEventToScenes("mouseover", event);
        self.dispatchEvent("mouseover", event);
    }

    function mouseOut(a) {
        innerTimeOutId = setTimeout(function () {
            flag = true;
        }, 500);
        document.onselectstart = function () {
            return true;
        };
        var b = getEventObject(a);
        self.dispatchEventToScenes("mouseout", b);
        self.dispatchEvent("mouseout", b);
    }

    function mouseDown(event) {
        event = getEventObject(event);
        self.mouseDown = !0;
        self.mouseDownX = event.x;
        self.mouseDownY = event.y;
        self.dispatchEventToScenes("mousedown", event);
        self.dispatchEvent("mousedown", event);
    }
    function touchStart(event){
        event = getEventObject(event);
        self.mouseDown = !0;
        self.mouseDownX = event.x;
        self.mouseDownY = event.y;
        self.dispatchEventToScenes("touchstart", event);
        self.dispatchEvent("touchstart", event);
    }
    function mouseUp(a) {
        var b = getEventObject(a);
        self.mouseDown = !1;
        self.dispatchEventToScenes("mouseup", b);
        self.dispatchEvent("mouseup", b);
    }

    function mouseMove(event) {
        if (innerTimeOutId) {
            window.clearTimeout(innerTimeOutId);
            innerTimeOutId = null;
        }
        flag = !1;
        event = getEventObject(event);
        if (self.mouseDown) {
            if (0 == event.button) {
                event.dx = event.x - self.mouseDownX;
                event.dy = event.y - self.mouseDownY;
                self.dispatchEventToScenes("mousedrag", event);
                self.dispatchEvent("mousedrag", event);
                if (1 == self.eagleEye.visible) {
                    self.eagleEye.update();
                }
            }
        } else {
            self.dispatchEventToScenes("mousemove", event);
            self.dispatchEvent("mousemove", event);
        }
    }

    function click(event) {
        event = getEventObject(event);
        self.dispatchEventToScenes("click", event);
        self.dispatchEvent("click", event);
    }

    function dbclick(event) {
        event = getEventObject(event);
        self.dispatchEventToScenes("dbclick", event);
        self.dispatchEvent("dbclick", event);
    }

    function mouseWheel(e) {
        var event = getEventObject(e);
        self.dispatchEventToScenes("mousewheel", event);
        self.dispatchEvent("mousewheel", event);
        if(null != self.wheelZoom){
            if(e.preventDefault){
                e.preventDefault()
            }else{
                e = e || window.event;
                e.returnValue = !1;
            }
            if(1 == self.eagleEye.visible){
                self.eagleEye.update();
            }
        }
    }
};